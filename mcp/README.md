# codi-api-mcp

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that gives AI assistants structured, exact knowledge of the CoDi API — enabling them to generate correct integration code for developers.

The server exposes no live API calls. All content is static documentation baked into the package. This means no credentials are needed to use it, it works offline, and it ships as a standalone npm package alongside the main `codi-api` repo.

## Prerequisites

- Node.js 18 or higher
- An MCP-compatible AI client (Claude Code, Claude Desktop, etc.)

## Setup — Claude Code

Add the server to your Claude Code session with a single command:

```bash
claude mcp add codi-api-mcp -- npx codi-api-mcp
```

Or, if you have cloned the repository locally:

```bash
claude mcp add codi-api-mcp -- node /absolute/path/to/codi-api/mcp/index.js
```

## Setup — Claude Desktop

Add the following to your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "codi-api-mcp": {
      "command": "npx",
      "args": ["codi-api-mcp"]
    }
  }
}
```

Or using a local clone:

```json
{
  "mcpServers": {
    "codi-api-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/codi-api/mcp/index.js"]
    }
  }
}
```

Restart Claude Desktop after saving the configuration.

## Available Resources

Resources are documentation blobs Claude reads as context. Access them by asking Claude about a topic, or reference them explicitly.

| Resource URI | Description |
|---|---|
| `codi://docs/authentication` | API key format (128-char hex), `x-api-key` header, environments |
| `codi://docs/qr` | QR endpoint fields, validation rules, request/response format |
| `codi://docs/push` | Push endpoint fields including `celularCliente`, request/response format |
| `codi://docs/consulta` | Query endpoint: `folioCodi`, pagination, date filters, response format |
| `codi://docs/webhook` | Webhook payload fields, required `{ resultado: 0 }` response, resultado codes |
| `codi://docs/errors` | All error codes: `edoPet`, `edoMC`, `resultado`, HTTP status codes |

## Available Prompts

Prompts are pre-built conversation starters that inject the relevant documentation and ask Claude to generate integration code.

### `integrate_qr_payment`

Generate a complete QR payment integration.

**Arguments:**
- `language` — e.g., `JavaScript`, `Python`, `Go`, `PHP`
- `framework` — e.g., `fetch`, `axios`, `requests`, `net/http`

**Example usage in Claude Code:**
> Use the integrate_qr_payment prompt for JavaScript with fetch

**What it generates:**
- HTTP request to `POST /v2/codi/qr` with all required fields
- Correct `vigencia` as millisecond timestamp (with example for 30-minute expiry)
- QR code display from the returned base64 PNG
- Full error handling for all `edoPet` codes and HTTP errors

### `integrate_push_payment`

Generate a complete Push payment integration.

**Arguments:**
- `language` — e.g., `JavaScript`, `Python`, `Go`, `PHP`
- `framework` — e.g., `fetch`, `axios`, `requests`, `net/http`

**Example usage:**
> Use the integrate_push_payment prompt for Python with requests

**What it generates:**
- HTTP request to `POST /v2/codi/push` with all required fields
- Correct `celularCliente` format (10 digits, no country code)
- `folioCodi` extraction for subsequent status checks
- Full error handling

### `handle_webhook`

Generate a webhook handler for `resultadoOperaciones` Banxico callbacks.

**Arguments:**
- `language` — e.g., `JavaScript`, `TypeScript`, `Python`, `Go`
- `framework` — e.g., `Express`, `Fastify`, `FastAPI`, `Django`, `Gin`

**Example usage:**
> Use the handle_webhook prompt for TypeScript with Express

**What it generates:**
- POST endpoint that responds immediately with `{ "resultado": 0 }`
- Payload field validation with correct negative `resultado` codes
- Async business logic pattern (respond first, process after)
- Notes on HTTPS requirement and idempotency

### `check_payment_status`

Generate payment status polling code using the consulta endpoint.

**Arguments:**
- `language` — e.g., `JavaScript`, `Python`, `Go`, `PHP`
- `framework` — e.g., `fetch`, `axios`, `requests`, `net/http`

**Example usage:**
> Use the check_payment_status prompt for Go with net/http

**What it generates:**
- Single status check function
- `edoMC` → human-readable status mapping (`-1` pending, `0` approved, `1` rejected)
- Polling loop with configurable interval and timeout
- Pagination support for multi-page results

## Example Queries

After configuring the MCP server, try these in Claude Code or Claude Desktop:

```
What fields does the CoDi QR payment endpoint require?
```

```
Generate a fetch() call in JavaScript to create a CoDi QR payment for 500 pesos.
```

```
What does edoPet -3 mean in the CoDi API?
```

```
How should I format the vigencia field if I want the QR to expire in 1 hour?
```

```
What is the difference between edoPet and edoMC?
```

```
Generate an Express webhook handler for CoDi resultadoOperaciones callbacks.
```

## Local Development & Testing

Install dependencies:

```bash
cd mcp
npm install
```

Smoke test — verify the server starts and responds to protocol messages:

```bash
# List all registered resources
echo '{"jsonrpc":"2.0","method":"resources/list","id":1}' | node index.js

# List all registered prompts
echo '{"jsonrpc":"2.0","method":"prompts/list","id":1}' | node index.js

# Read a specific resource
echo '{"jsonrpc":"2.0","method":"resources/read","params":{"uri":"codi://docs/authentication"},"id":2}' | node index.js
```

Add the local server to Claude Code for testing:

```bash
claude mcp add codi-api-mcp-dev -- node /absolute/path/to/codi-api/mcp/index.js
```

## Publishing to npm (Maintainers)

From the `mcp/` directory:

```bash
# First time: log in to npm
npm login

# Publish
npm publish

# For updates: bump the version in mcp/package.json, then:
npm publish
```

The `version` in `mcp/package.json` is managed independently from the main `codi-api` package version.

After publishing, users can install without cloning the repo:

```bash
# Add to Claude Code directly
claude mcp add codi-api-mcp -- npx codi-api-mcp
```

## License

Apache-2.0 — same as the parent `codi-api` repository.
