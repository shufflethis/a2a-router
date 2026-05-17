const trustPledgeDocument = require('../.well-known/trust-pledge.json');
const didDocument = require('../.well-known/did.json');
const jwksDocument = require('../.well-known/jwks.json');
const agentCardDocument = require('../.well-known/agent-card.json');
const { callA2AAgent, callMcpTool, listMcpTools } = require('../lib/bridge');

const PROTOCOL_VERSION = '2025-11-25';
const SUPPORTED_PROTOCOL_VERSIONS = new Set(['2025-11-25', '2025-06-18', '2025-03-26']);
const BASE_URL = 'https://www.a2a-router.com';

const statusPayload = {
  project: 'a2a-router',
  status: 'pre_alpha_rfc',
  live: {
    website: `${BASE_URL}/`,
    mcpEndpoint: `${BASE_URL}/api/mcp`,
    mcpServerJson: `${BASE_URL}/server.json`,
    a2aAgentCard: `${BASE_URL}/.well-known/agent-card.json`,
    a2aJsonRpc: `${BASE_URL}/api/a2a`,
    trustPledge: `${BASE_URL}/.well-known/trust-pledge.json`,
    did: `${BASE_URL}/.well-known/did.json`,
    jwks: `${BASE_URL}/.well-known/jwks.json`,
    llms: `${BASE_URL}/llms.txt`
  },
  planned: {
    registry: 'Agent registration and discovery API',
    transactionRouter: 'Voluntary-tip settlement layer',
    settlement: 'Stripe Connect and optional USDC payout flow'
  },
  limitations: [
    'The bridge router only accepts public https:// targets.',
    'Local, private, reserved, multicast, and documentation IP ranges are blocked.',
    'The bridge does not persist credentials or sessions.',
    'Streaming and push notifications are not implemented in this MVP.',
    'It does not perform transaction settlement.'
  ]
};

const tools = [
  {
    name: 'a2a_router.status',
    title: 'a2a-router Status',
    description:
      'Return the current live status, public endpoints, planned runtime components, and known limitations for a2a-router.',
    inputSchema: {
      type: 'object',
      additionalProperties: false
    },
    outputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string' },
        status: { type: 'string' },
        live: { type: 'object' },
        planned: { type: 'object' },
        limitations: {
          type: 'array',
          items: { type: 'string' }
        }
      },
      required: ['project', 'status', 'live', 'planned', 'limitations']
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  {
    name: 'a2a_router.trust_pledge',
    title: 'a2a-router Trust-Pledge',
    description:
      'Return the machine-readable Trust-Pledge, DID, JWKS, and A2A Agent Card metadata published by a2a-router.',
    inputSchema: {
      type: 'object',
      properties: {
        includeDocuments: {
          type: 'boolean',
          description: 'When true, include the full public JSON documents. When false, return only URLs and summary metadata.',
          default: false
        }
      },
      additionalProperties: false
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  {
    name: 'a2a_router.call_a2a_agent',
    title: 'Call A2A Agent',
    description:
      'Bridge from MCP to a public A2A JSON-RPC agent. Provide either an Agent Card URL or a direct A2A endpoint URL.',
    inputSchema: {
      type: 'object',
      properties: {
        agentCardUrl: {
          type: 'string',
          description: 'Public https:// URL for the target /.well-known/agent-card.json.'
        },
        endpointUrl: {
          type: 'string',
          description: 'Direct public https:// A2A JSON-RPC endpoint. Used when agentCardUrl is not provided.'
        },
        messageText: {
          type: 'string',
          description: 'Text to send as a user message to the target A2A agent.'
        },
        messageData: {
          type: 'object',
          description: 'Optional structured data part to include in the A2A message.'
        }
      },
      required: ['messageText'],
      anyOf: [{ required: ['agentCardUrl'] }, { required: ['endpointUrl'] }],
      additionalProperties: false
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: true
    }
  },
  {
    name: 'a2a_router.list_mcp_tools',
    title: 'List MCP Tools',
    description: 'Bridge-discover tools from a public MCP Streamable HTTP endpoint.',
    inputSchema: {
      type: 'object',
      properties: {
        endpointUrl: {
          type: 'string',
          description: 'Public https:// MCP Streamable HTTP endpoint.'
        },
        protocolVersion: {
          type: 'string',
          description: 'MCP protocol version to negotiate.',
          default: PROTOCOL_VERSION
        },
        skipInitialize: {
          type: 'boolean',
          description: 'Skip initialize before tools/list for nonstandard endpoints.',
          default: false
        }
      },
      required: ['endpointUrl'],
      additionalProperties: false
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true
    }
  },
  {
    name: 'a2a_router.call_mcp_tool',
    title: 'Call MCP Tool',
    description: 'Bridge-call a named tool on a public MCP Streamable HTTP endpoint.',
    inputSchema: {
      type: 'object',
      properties: {
        endpointUrl: {
          type: 'string',
          description: 'Public https:// MCP Streamable HTTP endpoint.'
        },
        toolName: {
          type: 'string',
          description: 'Name of the MCP tool to call.'
        },
        arguments: {
          type: 'object',
          description: 'Arguments for the target MCP tool.',
          default: {}
        },
        protocolVersion: {
          type: 'string',
          description: 'MCP protocol version to negotiate.',
          default: PROTOCOL_VERSION
        },
        skipInitialize: {
          type: 'boolean',
          description: 'Skip initialize before tools/call for nonstandard endpoints.',
          default: false
        }
      },
      required: ['endpointUrl', 'toolName'],
      additionalProperties: false
    },
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: true
    }
  }
];

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id');
  res.setHeader('MCP-Protocol-Version', PROTOCOL_VERSION);
  res.end(payload === undefined ? '' : JSON.stringify(payload, null, 2));
}

function jsonRpcResult(id, result) {
  return {
    jsonrpc: '2.0',
    id,
    result
  };
}

function jsonRpcError(id, code, message, data) {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      ...(data === undefined ? {} : { data })
    }
  };
}

function textAndStructured(structuredContent, summary) {
  return {
    content: [
      {
        type: 'text',
        text: summary || JSON.stringify(structuredContent, null, 2)
      }
    ],
    structuredContent,
    isError: false
  };
}

function initializeResult(requestedVersion) {
  const protocolVersion = SUPPORTED_PROTOCOL_VERSIONS.has(requestedVersion) ? requestedVersion : PROTOCOL_VERSION;

  return {
    protocolVersion,
    capabilities: {
      tools: {
        listChanged: false
      }
    },
    serverInfo: {
      name: 'io.github.shufflethis/a2a-router',
      title: 'a2a-router MCP Bridge Server',
      version: '0.1.0',
      description:
        'MCP bridge server exposing a2a-router status, Trust-Pledge metadata, A2A invocation, and MCP tool invocation.',
      websiteUrl: BASE_URL
    },
    instructions:
      'Use this server to inspect a2a-router metadata and bridge between public A2A JSON-RPC agents and public MCP Streamable HTTP tools. Targets must be public https:// URLs. Local/private/reserved networks are blocked. User confirmation is recommended before bridge calls because target tools may have side effects.'
  };
}

function trustPledgeResult(includeDocuments) {
  const summary = {
    status: 'self_attested',
    trustPledge: `${BASE_URL}/.well-known/trust-pledge.json`,
    did: `${BASE_URL}/.well-known/did.json`,
    jwks: `${BASE_URL}/.well-known/jwks.json`,
    agentCard: `${BASE_URL}/.well-known/agent-card.json`,
    signatureAlgorithm: 'EdDSA',
    bridgeRuntimeAvailable: false,
    mcpBridgeRuntimeAvailable: false
  };

  if (!includeDocuments) {
    return summary;
  }

  return {
    ...summary,
    documents: {
      trustPledge: trustPledgeDocument,
      did: didDocument,
      jwks: jwksDocument,
      agentCard: agentCardDocument
    }
  };
}

async function handleRpc(message) {
  if (!message || message.jsonrpc !== '2.0' || typeof message.method !== 'string') {
    return jsonRpcError(message?.id ?? null, -32600, 'Invalid Request');
  }

  const id = message.id;
  const params = message.params || {};

  if (id === undefined) {
    return undefined;
  }

  try {
    switch (message.method) {
    case 'initialize':
      return jsonRpcResult(id, initializeResult(params.protocolVersion));

    case 'tools/list':
      return jsonRpcResult(id, { tools });

    case 'tools/call': {
      const toolName = params.name;
      const args = params.arguments || {};

      if (toolName === 'a2a_router.status') {
        return jsonRpcResult(
          id,
          textAndStructured(statusPayload, `a2a-router is ${statusPayload.status}. Live MCP endpoint: ${BASE_URL}/api/mcp`)
        );
      }

      if (toolName === 'a2a_router.trust_pledge') {
        const payload = trustPledgeResult(Boolean(args.includeDocuments));
        return jsonRpcResult(
          id,
          textAndStructured(payload, `Trust-Pledge status: ${payload.status}. Pledge URL: ${payload.trustPledge}`)
        );
      }

      if (toolName === 'a2a_router.call_a2a_agent') {
        const payload = await callA2AAgent(args);
        return jsonRpcResult(
          id,
          textAndStructured(payload, `A2A bridge call completed for ${payload.target.endpointUrl}`)
        );
      }

      if (toolName === 'a2a_router.list_mcp_tools') {
        const payload = await listMcpTools(args);
        return jsonRpcResult(
          id,
          textAndStructured(payload, `Discovered ${payload.tools.length} MCP tools from ${payload.target.endpointUrl}`)
        );
      }

      if (toolName === 'a2a_router.call_mcp_tool') {
        const payload = await callMcpTool(args);
        return jsonRpcResult(
          id,
          textAndStructured(payload, `MCP bridge call completed for ${payload.target.toolName}`)
        );
      }

      return jsonRpcError(id, -32602, `Unknown tool: ${toolName}`);
    }

    default:
      return jsonRpcError(id, -32601, `Method not found: ${message.method}`);
    }
  } catch (error) {
    return jsonRpcError(id, -32000, 'Bridge call failed', {
      message: error instanceof Error ? error.message : String(error)
    });
  }
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204);
    return;
  }

  if (req.method === 'GET') {
    sendJson(res, 200, {
      name: 'io.github.shufflethis/a2a-router',
      title: 'a2a-router MCP Bridge Server',
      transport: 'streamable-http',
      endpoint: `${BASE_URL}/api/mcp`,
      protocolVersion: PROTOCOL_VERSION,
      capabilities: {
        tools: {
          listChanged: false
        }
      },
      tools: tools.map((tool) => ({
        name: tool.name,
        title: tool.title,
        description: tool.description
      }))
    });
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, jsonRpcError(null, -32000, 'Method not allowed'));
    return;
  }

  const requestedProtocol = req.headers['mcp-protocol-version'];
  if (requestedProtocol && !SUPPORTED_PROTOCOL_VERSIONS.has(requestedProtocol)) {
    sendJson(res, 400, jsonRpcError(null, -32000, `Unsupported MCP-Protocol-Version: ${requestedProtocol}`));
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      sendJson(res, 400, jsonRpcError(null, -32700, 'Parse error'));
      return;
    }
  }

  if (Array.isArray(body)) {
    const responses = (await Promise.all(body.map(handleRpc))).filter(Boolean);
    sendJson(res, responses.length ? 200 : 202, responses.length ? responses : undefined);
    return;
  }

  const response = await handleRpc(body);
  sendJson(res, response ? 200 : 202, response);
};
