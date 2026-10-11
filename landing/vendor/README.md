# WebMCP polyfill

`webmcp-polyfill.js` is the unmodified standalone IIFE from
`@mcp-b/webmcp-polyfill@6.0.0`, fetched from the npm registry on 2026-10-11.
The package vendors the upstream `webmachinelearning/webmcp-polyfill`
implementation at commit `6bf6c57bbaf3d1173d7737cfb79572632d9b7871`.
Its included license is `LICENSE.webmcp-polyfill`.

Served locally to avoid a runtime CDN dependency. The polyfill preserves
native browser support; page code registers tools on `document.modelContext`.
No MCP bridge transport, third-party analytics or extension is bundled.
