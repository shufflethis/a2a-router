import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { generateKeyPairSync, createPrivateKey, sign } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const landing = join(root, 'landing');
const wellKnown = join(landing, '.well-known');
const secrets = join(root, 'secrets');
const privateKeyPath = join(secrets, 'a2a-router-trust-pledge-ed25519-private.pem');

const BASE_URL = 'https://www.a2a-router.com';
const DID = 'did:web:www.a2a-router.com';
const KEY_ID = `${DID}#trust-pledge-key-2026-05-17`;

function stable(value) {
  if (Array.isArray(value)) {
    return value.map(stable);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, entryValue]) => [key, stable(entryValue)])
    );
  }

  return value;
}

function canonicalize(value) {
  return JSON.stringify(stable(value));
}

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

mkdirSync(wellKnown, { recursive: true });
mkdirSync(secrets, { recursive: true });

if (!existsSync(privateKeyPath)) {
  const { privateKey } = generateKeyPairSync('ed25519');
  writeFileSync(privateKeyPath, privateKey.export({ type: 'pkcs8', format: 'pem' }));
}

const privateKey = createPrivateKey(readFileSync(privateKeyPath));
const exportedPublicJwk = generatePublicJwk(privateKey);

function generatePublicJwk(key) {
  return key
    .export({ format: 'jwk' })
    .d
    ? createPublicJwkFromPrivate(key.export({ format: 'jwk' }))
    : key.export({ format: 'jwk' });
}

function createPublicJwkFromPrivate(jwk) {
  return {
    kty: jwk.kty,
    crv: jwk.crv,
    x: jwk.x,
    kid: KEY_ID,
    alg: 'EdDSA',
    use: 'sig'
  };
}

function detachedJws(payload, typ = 'JOSE') {
  const protectedHeader = {
    alg: 'EdDSA',
    typ,
    kid: KEY_ID,
    jku: `${BASE_URL}/.well-known/jwks.json`
  };
  const protectedB64 = base64url(JSON.stringify(protectedHeader));
  const payloadB64 = base64url(canonicalize(payload));
  const signingInput = `${protectedB64}.${payloadB64}`;
  const signature = sign(null, Buffer.from(signingInput), privateKey);

  return {
    protected: protectedB64,
    signature: base64url(signature)
  };
}

const agentCardWithoutSignature = {
  protocolVersion: '0.3.0',
  name: 'a2a-router Bridge Agent',
  description:
    'Public A2A bridge agent for a2a-router. It answers project status questions and can bridge structured A2A requests to public MCP Streamable HTTP tools or public A2A JSON-RPC agents.',
  supportedInterfaces: [
    {
      url: `${BASE_URL}/api/a2a`,
      protocolBinding: 'JSONRPC',
      protocolVersion: '0.3'
    }
  ],
  provider: {
    organization: 'a2a-router',
    url: BASE_URL
  },
  version: '0.1.0',
  documentationUrl: 'https://github.com/shufflethis/a2a-router',
  capabilities: {
    streaming: false,
    pushNotifications: false,
    stateTransitionHistory: false,
    extendedAgentCard: false
  },
  securitySchemes: {},
  security: [],
  defaultInputModes: ['text/plain', 'application/json'],
  defaultOutputModes: ['text/plain', 'application/json'],
  skills: [
    {
      id: 'project-status',
      name: 'Project Status',
      description:
        'Returns the current live status of a2a-router, including what is deployed and what remains planned.',
      tags: ['a2a-router', 'status', 'roadmap', 'pre-alpha'],
      examples: ['What is live today?', 'Is the bridge runtime available yet?'],
      inputModes: ['text/plain', 'application/json'],
      outputModes: ['text/plain', 'application/json']
    },
    {
      id: 'trust-pledge-discovery',
      name: 'Trust-Pledge Discovery',
      description:
        'Returns public Trust-Pledge metadata, pledge URL, DID URL, and current self-attestation status.',
      tags: ['trust-pledge', 'did', 'ed25519', 'agent-trust'],
      examples: ['Where is the Trust-Pledge?', 'What commitments does a2a-router publish?'],
      inputModes: ['text/plain', 'application/json'],
      outputModes: ['text/plain', 'application/json']
    },
    {
      id: 'bridge-to-mcp-tool',
      name: 'Bridge to MCP Tool',
      description:
        'Accepts a structured bridge request and invokes a named tool on a public MCP Streamable HTTP endpoint.',
      tags: ['bridge', 'mcp', 'tools/call', 'streamable-http'],
      examples: [
        '{"targetProtocol":"mcp","endpointUrl":"https://www.a2a-router.com/api/mcp","toolName":"a2a_router.status","arguments":{}}'
      ],
      inputModes: ['application/json'],
      outputModes: ['application/json']
    },
    {
      id: 'bridge-to-a2a-agent',
      name: 'Bridge to A2A Agent',
      description:
        'Accepts a structured bridge request and invokes SendMessage on a public A2A JSON-RPC endpoint or Agent Card URL.',
      tags: ['bridge', 'a2a', 'json-rpc', 'SendMessage'],
      examples: [
        '{"targetProtocol":"a2a","agentCardUrl":"https://www.a2a-router.com/.well-known/agent-card.json","messageText":"What is live?"}'
      ],
      inputModes: ['application/json'],
      outputModes: ['application/json']
    }
  ],
  'x-trust-pledge': {
    pledgeUrl: `${BASE_URL}/.well-known/trust-pledge.json`,
    did: DID,
    auditTier: 'self_attested'
  },
  'x-runtime-status': {
    current: 'pre_alpha_rfc',
    callableStatusAgent: true,
    bridgeRuntimeAvailable: true,
    a2aToMcpBridgeAvailable: true,
    mcpToA2aBridgeAvailable: true,
    mcpStatusServerAvailable: true,
    mcpBridgeRuntimeAvailable: true,
    transactionRouterAvailable: false
  }
};

const agentCard = {
  ...agentCardWithoutSignature,
  signatures: [detachedJws(agentCardWithoutSignature)]
};

const trustPledgeWithoutSignature = {
  pledgeVersion: 'trust_pledge_v0.1',
  status: 'self_attested',
  issuedAt: '2026-05-17',
  subject: {
    type: 'project',
    did: DID,
    name: 'a2a-router',
    url: BASE_URL,
    repository: 'https://github.com/shufflethis/a2a-router'
  },
  scope: {
    coveredSystems: [
      'public website',
      'project documentation',
      'Trust-Pledge RFC',
      'A2A bridge agent',
      'A2A-to-MCP bridge router MVP',
      'MCP-to-A2A bridge router MVP',
      'MCP bridge server'
    ],
    notCoveredYet: [
      'authenticated agent registry',
      'persistent routing sessions',
      'streaming bridge transport',
      'transaction router',
      'Stripe Connect settlement',
      'USDC settlement'
    ]
  },
  commitments: {
    noHarm: {
      level: 'strict',
      text: 'a2a-router will not knowingly route, recommend, or monetize agents intended to cause physical, financial, psychological, or operational harm.'
    },
    transparency: {
      level: 'strict',
      text: 'a2a-router will publish machine-readable status, protocol, trust, and limitation metadata so agents can distinguish live capabilities from planned capabilities.'
    },
    consentChain: {
      level: 'strict',
      text: 'a2a-router will design routed actions around traceable caller authorization and consent propagation before enabling third-party execution.'
    },
    piiMinimization: {
      level: 'strict',
      text: 'a2a-router will minimize personal data collection and avoid retaining PII beyond operational requirements.'
    },
    fairValueExchange: {
      level: 'strict',
      text: 'a2a-router will clearly distinguish voluntary tips, platform fees, and skipped payments, and will not misrepresent paid placement as trust.'
    }
  },
  audit: {
    tier: 'self_attested',
    auditor: null,
    nextTargetTier: 'community_verified'
  },
  verification: {
    didDocument: `${BASE_URL}/.well-known/did.json`,
    jwks: `${BASE_URL}/.well-known/jwks.json`,
    algorithm: 'EdDSA',
    keyId: KEY_ID
  },
  references: {
    rfc: 'https://github.com/shufflethis/a2a-router/blob/main/docs/rfc/RFC-001-trust-pledge.md',
    architecture: 'https://github.com/shufflethis/a2a-router/blob/main/docs/architecture.md',
    agentCard: `${BASE_URL}/.well-known/agent-card.json`
  }
};

const trustPledge = {
  ...trustPledgeWithoutSignature,
  signature: {
    type: 'DetachedJWS',
    algorithm: 'EdDSA',
    keyId: KEY_ID,
    ...detachedJws(trustPledgeWithoutSignature, 'trust-pledge+jws')
  }
};

const didDocument = {
  '@context': ['https://www.w3.org/ns/did/v1', 'https://w3id.org/security/suites/jws-2020/v1'],
  id: DID,
  verificationMethod: [
    {
      id: KEY_ID,
      type: 'JsonWebKey2020',
      controller: DID,
      publicKeyJwk: exportedPublicJwk
    }
  ],
  assertionMethod: [KEY_ID],
  authentication: [KEY_ID],
  service: [
    {
      id: `${DID}#website`,
      type: 'LinkedDomains',
      serviceEndpoint: BASE_URL
    },
    {
      id: `${DID}#a2a-agent-card`,
      type: 'A2AAgentCard',
      serviceEndpoint: `${BASE_URL}/.well-known/agent-card.json`
    },
    {
      id: `${DID}#trust-pledge`,
      type: 'TrustPledge',
      serviceEndpoint: `${BASE_URL}/.well-known/trust-pledge.json`
    }
  ]
};

const discovery = {
  name: 'a2a-router',
  url: BASE_URL,
  status: 'pre_alpha_rfc',
  updatedAt: '2026-05-17',
  purpose:
    'Machine-readable discovery entrypoint for a2a-router, a post-discovery bridge and trust metadata layer for agent economies.',
  endpoints: {
    website: `${BASE_URL}/`,
    llms: `${BASE_URL}/llms.txt`,
    robots: `${BASE_URL}/robots.txt`,
    sitemap: `${BASE_URL}/sitemap.xml`,
    mcpServerJson: `${BASE_URL}/server.json`,
    mcpStreamableHttp: `${BASE_URL}/api/mcp`,
    did: `${BASE_URL}/.well-known/did.json`,
    jwks: `${BASE_URL}/.well-known/jwks.json`,
    trustPledge: `${BASE_URL}/.well-known/trust-pledge.json`,
    a2aAgentCard: `${BASE_URL}/.well-known/agent-card.json`,
    a2aJsonRpc: `${BASE_URL}/api/a2a`
  },
  protocols: {
    a2a: {
      discovery: `${BASE_URL}/.well-known/agent-card.json`,
      jsonRpcEndpoint: `${BASE_URL}/api/a2a`,
      runtimeStatus: 'status_agent_and_bridge_router',
      bridgeCapabilities: ['A2A SendMessage to MCP tools/call', 'A2A SendMessage to A2A SendMessage']
    },
    mcp: {
      discovery: `${BASE_URL}/server.json`,
      streamableHttpEndpoint: `${BASE_URL}/api/mcp`,
      runtimeStatus: 'status_server_and_bridge_router',
      bridgeCapabilities: ['MCP tools/call to A2A SendMessage', 'MCP tools/call to MCP tools/call'],
      note:
        'a2a-router exposes a public HTTPS-only bridge router. Local, private, reserved, multicast, and documentation IP targets are blocked. Registry and settlement are not live yet.'
    }
  },
  trust: {
    did: DID,
    pledge: `${BASE_URL}/.well-known/trust-pledge.json`,
    auditTier: 'self_attested',
    signatureAlgorithm: 'EdDSA'
  },
  repository: 'https://github.com/shufflethis/a2a-router',
  limitations: [
    'No authenticated agent registry yet',
    'No persistent routing sessions yet',
    'No streaming bridge transport yet',
    'No transaction settlement yet',
    'Only public https:// targets are accepted'
  ]
};

const jwks = {
  keys: [exportedPublicJwk]
};

writeJson(join(wellKnown, 'agent-card.json'), agentCard);
writeJson(join(wellKnown, 'trust-pledge.json'), trustPledge);
writeJson(join(wellKnown, 'did.json'), didDocument);
writeJson(join(wellKnown, 'jwks.json'), jwks);
writeJson(join(wellKnown, 'a2a-router.json'), discovery);

console.log(`Generated discovery artifacts in ${wellKnown}`);
console.log(`Private signing key: ${privateKeyPath}`);
