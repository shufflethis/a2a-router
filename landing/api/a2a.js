const { callA2AAgent, callMcpTool, listMcpTools } = require('../lib/bridge');

const STATUS_TEXT =
  'a2a-router is live as a public website, documentation hub, Trust-Pledge draft, A2A status/bridge agent, and MCP bridge server. The registry runtime and transaction router are still planned.';

const statusPayload = {
  project: 'a2a-router',
  status: 'pre_alpha_rfc',
  live: {
    website: 'https://www.a2a-router.com/',
    agentCard: 'https://www.a2a-router.com/.well-known/agent-card.json',
    a2aJsonRpc: 'https://www.a2a-router.com/api/a2a',
    mcpEndpoint: 'https://www.a2a-router.com/api/mcp',
    mcpServerJson: 'https://www.a2a-router.com/server.json',
    trustPledge: 'https://www.a2a-router.com/.well-known/trust-pledge.json',
    did: 'https://www.a2a-router.com/.well-known/did.json',
    llms: 'https://www.a2a-router.com/llms.txt'
  },
  planned: {
    transactionRouter: 'Voluntary-tip settlement layer',
    registry: 'Agent registration and discovery API'
  },
  bridge: {
    mcpToA2A: 'MCP tool a2a_router.call_a2a_agent can invoke public A2A JSON-RPC agents.',
    a2aToMcp: 'A2A SendMessage can invoke public MCP Streamable HTTP tools via structured bridge requests.',
    guardrails: 'Only public https:// targets are accepted; local/private/reserved networks are blocked.'
  }
};

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, A2A-Version, A2A-Extensions');
  res.end(JSON.stringify(payload, null, 2));
}

function getTextFromMessage(message) {
  const parts = Array.isArray(message?.parts) ? message.parts : [];
  return parts
    .map((part) => part.text || part.data?.text || '')
    .filter(Boolean)
    .join('\n');
}

function getBridgeRequest(params) {
  if (params?.bridge && typeof params.bridge === 'object') {
    return params.bridge;
  }

  const parts = Array.isArray(params?.message?.parts) ? params.message.parts : [];
  for (const part of parts) {
    const data = part?.data;
    if (data?.bridge && typeof data.bridge === 'object') {
      return data.bridge;
    }
    if (data?.targetProtocol || data?.endpointUrl || data?.agentCardUrl) {
      return data;
    }
  }

  const text = getTextFromMessage(params?.message);
  if (text.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(text);
      if (parsed?.bridge && typeof parsed.bridge === 'object') {
        return parsed.bridge;
      }
      if (parsed?.targetProtocol || parsed?.endpointUrl || parsed?.agentCardUrl) {
        return parsed;
      }
    } catch {
      return null;
    }
  }

  return null;
}

async function runBridge(bridge) {
  const targetProtocol = String(bridge.targetProtocol || bridge.protocol || '').toLowerCase();

  if (targetProtocol === 'mcp') {
    if (bridge.operation === 'tools/list' || bridge.listTools === true) {
      return {
        direction: 'a2a_to_mcp',
        operation: 'tools/list',
        result: await listMcpTools(bridge)
      };
    }

    return {
      direction: 'a2a_to_mcp',
      operation: 'tools/call',
      result: await callMcpTool({
        endpointUrl: bridge.endpointUrl,
        toolName: bridge.toolName,
        arguments: bridge.arguments || {},
        protocolVersion: bridge.protocolVersion,
        skipInitialize: bridge.skipInitialize,
        timeoutMs: bridge.timeoutMs
      })
    };
  }

  if (targetProtocol === 'a2a') {
    return {
      direction: 'a2a_to_a2a',
      operation: 'SendMessage',
      result: await callA2AAgent({
        agentCardUrl: bridge.agentCardUrl,
        endpointUrl: bridge.endpointUrl,
        messageText: bridge.messageText || 'Bridge call from a2a-router A2A endpoint.',
        messageData: bridge.messageData,
        protocolVersion: bridge.protocolVersion,
        timeoutMs: bridge.timeoutMs
      })
    };
  }

  throw new Error('bridge.targetProtocol must be "mcp" or "a2a"');
}

async function makeTask(params) {
  const now = new Date().toISOString();
  const message = params?.message || {};
  const requestText = getTextFromMessage(message);
  const taskId = message.taskId || `status-${Date.now()}`;
  const contextId = message.contextId || `ctx-${Date.now()}`;
  const bridge = getBridgeRequest(params);

  if (bridge) {
    try {
      const bridgeResult = await runBridge(bridge);
      return {
        task: {
          id: taskId,
          contextId,
          status: {
            state: 'TASK_STATE_COMPLETED',
            timestamp: now,
            message: {
              role: 'ROLE_AGENT',
              messageId: `msg-${Date.now()}`,
              parts: [
                {
                  text: `Bridge call completed: ${bridgeResult.direction} ${bridgeResult.operation}`
                }
              ]
            }
          },
          artifacts: [
            {
              artifactId: 'a2a-router-bridge-result',
              name: 'a2a-router bridge result',
              parts: [
                {
                  data: bridgeResult
                }
              ]
            }
          ],
          history: []
        }
      };
    } catch (error) {
      return {
        task: {
          id: taskId,
          contextId,
          status: {
            state: 'TASK_STATE_FAILED',
            timestamp: now,
            message: {
              role: 'ROLE_AGENT',
              messageId: `msg-${Date.now()}`,
              parts: [
                {
                  text: `Bridge call failed: ${error instanceof Error ? error.message : String(error)}`
                }
              ]
            }
          },
          artifacts: [
            {
              artifactId: 'a2a-router-bridge-error',
              name: 'a2a-router bridge error',
              parts: [
                {
                  data: {
                    error: error instanceof Error ? error.message : String(error),
                    bridge
                  }
                }
              ]
            }
          ],
          history: []
        }
      };
    }
  }

  return {
    task: {
      id: taskId,
      contextId,
      status: {
        state: 'TASK_STATE_COMPLETED',
        timestamp: now,
        message: {
          role: 'ROLE_AGENT',
          messageId: `msg-${Date.now()}`,
          parts: [
            {
              text: requestText ? `${STATUS_TEXT}\n\nYou asked: ${requestText}` : STATUS_TEXT
            }
          ]
        }
      },
      artifacts: [
        {
          artifactId: 'a2a-router-status',
          name: 'a2a-router public status',
          parts: [
            {
              data: statusPayload
            }
          ]
        }
      ],
      history: []
    }
  };
}

function rpcError(id, code, message, reason) {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      data: reason
        ? [
            {
              '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
              reason,
              domain: 'a2a-router.com'
            }
          ]
        : undefined
    }
  };
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === 'GET') {
    sendJson(res, 200, {
      name: 'a2a-router Status Agent',
      protocol: 'A2A JSON-RPC',
      version: '0.3.0',
      status: statusPayload
    });
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      sendJson(res, 400, rpcError(null, -32700, 'Invalid JSON payload', 'JSON_PARSE_ERROR'));
      return;
    }
  }

  const id = body?.id ?? null;

  if (!body || body.jsonrpc !== '2.0' || typeof body.method !== 'string') {
    sendJson(res, 400, rpcError(id, -32600, 'Request payload validation error', 'INVALID_REQUEST'));
    return;
  }

  if (body.method === 'SendMessage') {
    sendJson(res, 200, {
      jsonrpc: '2.0',
      id,
      result: await makeTask(body.params || {})
    });
    return;
  }

  if (body.method === 'ListTasks') {
    sendJson(res, 200, {
      jsonrpc: '2.0',
      id,
      result: {
        tasks: [],
        nextPageToken: null
      }
    });
    return;
  }

  if (body.method === 'GetTask') {
    sendJson(res, 404, rpcError(id, -32001, 'Task not found', 'TASK_NOT_FOUND'));
    return;
  }

  sendJson(res, 404, rpcError(id, -32601, 'Method not found', 'METHOD_NOT_FOUND'));
};
