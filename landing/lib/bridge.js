const dns = require('dns').promises;
const net = require('net');

const DEFAULT_TIMEOUT_MS = 12000;
const MAX_RESPONSE_BYTES = 1024 * 1024;
const MCP_PROTOCOL_VERSION = '2025-11-25';

function jsonRpcId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ipv4ToInt(ip) {
  return ip.split('.').reduce((acc, part) => (acc << 8) + Number(part), 0) >>> 0;
}

function ipv4InCidr(ip, cidr, bits) {
  const value = ipv4ToInt(ip);
  const base = ipv4ToInt(cidr);
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (value & mask) === (base & mask);
}

function isBlockedIp(ip) {
  const family = net.isIP(ip);

  if (family === 4) {
    return [
      ['0.0.0.0', 8],
      ['10.0.0.0', 8],
      ['100.64.0.0', 10],
      ['127.0.0.0', 8],
      ['169.254.0.0', 16],
      ['172.16.0.0', 12],
      ['192.0.0.0', 24],
      ['192.0.2.0', 24],
      ['192.168.0.0', 16],
      ['198.18.0.0', 15],
      ['198.51.100.0', 24],
      ['203.0.113.0', 24],
      ['224.0.0.0', 4],
      ['240.0.0.0', 4]
    ].some(([range, bits]) => ipv4InCidr(ip, range, bits));
  }

  if (family === 6) {
    const normalized = ip.toLowerCase();
    return (
      normalized === '::' ||
      normalized === '::1' ||
      normalized.startsWith('fc') ||
      normalized.startsWith('fd') ||
      normalized.startsWith('fe80') ||
      normalized.startsWith('::ffff:10.') ||
      normalized.startsWith('::ffff:127.') ||
      normalized.startsWith('::ffff:169.254.') ||
      normalized.startsWith('::ffff:192.168.')
    );
  }

  return true;
}

async function assertPublicHttpsUrl(input) {
  if (typeof input !== 'string' || input.length > 2048) {
    throw new Error('URL must be a string shorter than 2048 characters');
  }

  const url = new URL(input);

  if (url.protocol !== 'https:') {
    throw new Error('Only https:// targets are allowed');
  }

  if (url.username || url.password) {
    throw new Error('URL credentials are not allowed');
  }

  const hostname = url.hostname.toLowerCase();
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local')) {
    throw new Error('Local hostnames are not allowed');
  }

  if (net.isIP(hostname)) {
    if (isBlockedIp(hostname)) {
      throw new Error('Private, local, documentation, multicast, and reserved IP targets are blocked');
    }
    return url;
  }

  const addresses = await dns.lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some((record) => isBlockedIp(record.address))) {
    throw new Error('Target hostname resolves to a blocked network address');
  }

  return url;
}

async function fetchJson(input, options = {}) {
  const url = await assertPublicHttpsUrl(input);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers || {})
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal
    });

    const contentLength = Number(response.headers.get('content-length') || 0);
    if (contentLength > MAX_RESPONSE_BYTES) {
      throw new Error(`Response too large: ${contentLength} bytes`);
    }

    const text = await response.text();
    if (Buffer.byteLength(text, 'utf8') > MAX_RESPONSE_BYTES) {
      throw new Error('Response exceeded size limit');
    }

    let json;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      throw new Error(`Target returned non-JSON response with HTTP ${response.status}`);
    }

    if (!response.ok) {
      const detail = json?.error?.message || json?.message || response.statusText;
      throw new Error(`Target HTTP ${response.status}: ${detail}`);
    }

    return json;
  } finally {
    clearTimeout(timeout);
  }
}

function getA2AEndpointFromCard(card) {
  const jsonRpcInterface = Array.isArray(card?.supportedInterfaces)
    ? card.supportedInterfaces.find((item) => String(item.protocolBinding || '').toUpperCase() === 'JSONRPC')
    : null;

  return jsonRpcInterface?.url || card?.url;
}

async function resolveA2AEndpoint({ agentCardUrl, endpointUrl }) {
  if (endpointUrl) {
    await assertPublicHttpsUrl(endpointUrl);
    return { endpointUrl, agentCard: null };
  }

  if (!agentCardUrl) {
    throw new Error('agentCardUrl or endpointUrl is required');
  }

  const agentCard = await fetchJson(agentCardUrl);
  const resolvedEndpoint = getA2AEndpointFromCard(agentCard);
  if (!resolvedEndpoint) {
    throw new Error('A2A Agent Card does not include a JSON-RPC endpoint URL');
  }

  await assertPublicHttpsUrl(resolvedEndpoint);
  return { endpointUrl: resolvedEndpoint, agentCard };
}

async function callA2AAgent(input) {
  const { endpointUrl, agentCard } = await resolveA2AEndpoint(input);
  const messageText = input.messageText || 'Bridge call from a2a-router.';
  const parts = [{ text: messageText }];

  if (input.messageData && typeof input.messageData === 'object') {
    parts.push({ data: input.messageData });
  }

  const request = {
    jsonrpc: '2.0',
    id: jsonRpcId('a2a'),
    method: input.method || 'SendMessage',
    params: {
      message: {
        role: 'ROLE_USER',
        messageId: jsonRpcId('msg'),
        parts
      }
    }
  };

  const result = await fetchJson(endpointUrl, {
    method: 'POST',
    body: request,
    headers: {
      'A2A-Version': input.protocolVersion || '0.3'
    },
    timeoutMs: input.timeoutMs
  });

  return {
    target: {
      protocol: 'a2a',
      endpointUrl,
      agentName: agentCard?.name || null
    },
    request,
    response: result
  };
}

async function mcpPost(endpointUrl, body, protocolVersion = MCP_PROTOCOL_VERSION, timeoutMs) {
  return fetchJson(endpointUrl, {
    method: 'POST',
    body,
    headers: {
      'MCP-Protocol-Version': protocolVersion
    },
    timeoutMs
  });
}

async function initializeMcp(endpointUrl, protocolVersion = MCP_PROTOCOL_VERSION, timeoutMs) {
  await assertPublicHttpsUrl(endpointUrl);
  const response = await mcpPost(
    endpointUrl,
    {
      jsonrpc: '2.0',
      id: jsonRpcId('mcp-init'),
      method: 'initialize',
      params: {
        protocolVersion,
        capabilities: {},
        clientInfo: {
          name: 'a2a-router-bridge',
          title: 'a2a-router Bridge',
          version: '0.1.0',
          websiteUrl: 'https://www.a2a-router.com'
        }
      }
    },
    protocolVersion,
    timeoutMs
  );

  if (response?.error) {
    throw new Error(`MCP initialize failed: ${response.error.message}`);
  }

  return response?.result || {};
}

async function listMcpTools(input) {
  const protocolVersion = input.protocolVersion || MCP_PROTOCOL_VERSION;
  const initialization = input.skipInitialize ? null : await initializeMcp(input.endpointUrl, protocolVersion, input.timeoutMs);
  const response = await mcpPost(
    input.endpointUrl,
    {
      jsonrpc: '2.0',
      id: jsonRpcId('mcp-list'),
      method: 'tools/list',
      params: {}
    },
    protocolVersion,
    input.timeoutMs
  );

  if (response?.error) {
    throw new Error(`MCP tools/list failed: ${response.error.message}`);
  }

  return {
    target: {
      protocol: 'mcp',
      endpointUrl: input.endpointUrl,
      protocolVersion
    },
    initialization,
    tools: response?.result?.tools || [],
    response
  };
}

async function callMcpTool(input) {
  const protocolVersion = input.protocolVersion || MCP_PROTOCOL_VERSION;
  const initialization = input.skipInitialize ? null : await initializeMcp(input.endpointUrl, protocolVersion, input.timeoutMs);
  const response = await mcpPost(
    input.endpointUrl,
    {
      jsonrpc: '2.0',
      id: jsonRpcId('mcp-call'),
      method: 'tools/call',
      params: {
        name: input.toolName,
        arguments: input.arguments || {}
      }
    },
    protocolVersion,
    input.timeoutMs
  );

  if (response?.error) {
    throw new Error(`MCP tools/call failed: ${response.error.message}`);
  }

  return {
    target: {
      protocol: 'mcp',
      endpointUrl: input.endpointUrl,
      protocolVersion,
      toolName: input.toolName
    },
    initialization,
    response
  };
}

module.exports = {
  MCP_PROTOCOL_VERSION,
  assertPublicHttpsUrl,
  callA2AAgent,
  callMcpTool,
  listMcpTools
};
