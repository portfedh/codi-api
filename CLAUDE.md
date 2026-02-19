# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

**Development server:**
```bash
npm run dev    # Start with nodemon for development
npm start      # Start production server
```

**Testing:**
```bash
npm test       # Run Jest test suite with coverage
```

**License Compliance:**
```bash
npm run license-check       # Show summary of all dependency licenses
npm run license-report      # Generate detailed license reports
npm run license-compliance  # Validate licenses against approved list
```

**IMPORTANT:** Always run `npm run license-compliance` after installing new dependencies to ensure license compatibility with Apache-2.0.

**View logs:**
```bash
pm2 logs codi-api
```

## Project Architecture

This is a CoDi API for generating Mexican payment codes via QR and Push notifications, integrating with Banxico (Mexican Central Bank). 

**Core Architecture:**
- Express.js REST API with middleware for security, validation, and logging
- Digital signature-based authentication with Banxico using RSA certificates
- Supabase for data persistence and API key management
- Comprehensive validation and sanitization layer
- Fallback request handling with multiple endpoint support

**Key Integrations:**
- **Banxico API**: Primary integration for CoDi payment processing with certificate-based authentication
- **Supabase**: Database for API keys, request/response logging, and operational data
- **QR Code Generation**: Dynamic QR code creation for payment requests
- **Push Notifications**: Direct mobile payment requests via phone numbers

**Main Endpoints:**
- `/v2/codi/qr` - Generate QR payment requests
- `/v2/codi/push` - Send push payment notifications
- `/v2/codi/consulta` - Query payment status
- `/v2/resultadoOperaciones` - Webhook for payment results
- `/v2/health` - System health check

**Security Architecture:**
- API key validation (128-char hex keys stored in Supabase)
- Digital signature verification for all Banxico communications
- Certificate comparison and validation (developer + Banxico certs)
- Request sanitization and CORS protection
- Rate limiting and access controls

**Utility Layer (`controllers/utils/`):**
- Certificate handling and signature verification
- Banxico credential management and URL routing
- Request/response logging to Supabase
- Data validation and formatting utilities
- Fallback request mechanisms for reliability

**Database Schema (`/database`):**
- **schema.sql**: Complete Supabase database schema defining core tables:
  - `customers`: Client information and bank details
  - `api_keys`: API key management with Banxico integration
  - `folios_codi`: CoDi payment folio tracking
  - `requests/responses`: Request/response logging for auditing
- **database_schema.png**: Visual diagram of table relationships

**Environment Configuration:**
The `.env` file contains critical credentials including Supabase connection details, Banxico certificates, and API endpoints. The `config/institutions.js` file maps financial institution codes for payment routing.

**Testing:**
Jest test suite with coverage reporting covers all utility functions, validation rules, and core business logic. Tests are located in the `/tests` directory matching the source file structure.

## MCP Server (`mcp/`)

The `mcp/` subdirectory contains a standalone MCP (Model Context Protocol) server that gives AI assistants structured knowledge of this API for code generation assistance. It is published separately to npm as `codi-api-mcp`.

**Structure:**
```
mcp/
  package.json          # ESM package, own dependencies, bin entry for npx
  index.js              # Server entry point (stdio transport)
  resources/            # Static documentation blobs (no live API calls)
    authentication.js   # API key format, x-api-key header, environments
    qr.js               # QR endpoint: all fields, types, rules, request/response
    push.js             # Push endpoint: all fields including celularCliente
    consulta.js         # Query endpoint: fields, pagination, date rules
    webhook.js          # resultadoOperaciones: payload, resultado codes
    errors.js           # All error codes: edoPet, edoMC, resultado, HTTP
  prompts/              # Code generation conversation starters
    integrateQr.js      # "Generate QR payment integration for [lang/framework]"
    integratePush.js    # "Generate push payment integration for [lang/framework]"
    handleWebhook.js    # "Generate webhook handler for [lang/framework]"
    checkStatus.js      # "Generate payment status polling for [lang/framework]"
  README.md             # Setup instructions for Claude Desktop & Claude Code
```

**Key rules when modifying this API:**
- If you change a validation rule in `validators/`, update the corresponding `mcp/resources/` file to match.
- If you add or remove a field from any endpoint, update the relevant resource AND the prompt that references it.
- The MCP server uses ESM (`import`/`export`) — do not use `require()` inside `mcp/`.
- The MCP server has its own `package.json` and `node_modules` — run `npm install` from `mcp/` when adding dependencies there.
- The MCP server version in `mcp/package.json` is independent of the main API version.

**Local smoke test:**
```bash
cd mcp
echo '{"jsonrpc":"2.0","method":"resources/list","id":1}' | node index.js
echo '{"jsonrpc":"2.0","method":"prompts/list","id":1}' | node index.js
```

**npm package:** Published at `codi-api-mcp` (maintainer: portfedh). Check current version: `npm view codi-api-mcp version`.

**Sharing with others — two steps:**
1. Share this install command (Node.js 18+ required, no other setup needed):
   ```bash
   claude mcp add --scope user codi-api-mcp -- npx codi-api-mcp
   ```
2. For Claude Desktop, share the JSON snippet in `mcp/README.md`.

**Add to Claude Code (global scope, via npm):**
```bash
claude mcp add --scope user codi-api-mcp -- npx codi-api-mcp
```

**Publishing a new version to npm:**

1. Make and test your changes (run the smoke test above)
2. Bump the version in `mcp/package.json` following semver:
   - Bug fix / docs update → patch: `1.0.0` → `1.0.1`
   - New resource or prompt → minor: `1.0.0` → `1.1.0`
   - Breaking change (renamed/removed resource URI or prompt) → major: `1.0.0` → `2.0.0`
3. Publish from the `mcp/` directory:
   ```bash
   cd mcp
   npm publish --otp=<your-2fa-code>
   ```
4. Commit the version bump:
   ```bash
   git add mcp/package.json
   git commit -m "chore: bump codi-api-mcp to vX.Y.Z"
   ```

Users on `npx codi-api-mcp` pick up the new version automatically on their next run (npx always fetches latest). Users who pinned a version must update manually.

## Project Documentation & Governance

**License & Legal:**
- `LICENSE` - Apache License 2.0 (English)
- `LICENSE.es.md` - Apache License 2.0 (Spanish)
- `licenses/` - Third-party dependency license compliance
  - `.licensecheckrc.json` - License policy configuration
  - `THIRD-PARTY-LICENSES.md` - All production dependency licenses
  - `licenses.json` - Detailed license report (gitignored - contains local paths)

**Contributing & Community:**
- `CODE_OF_CONDUCT.md` / `CODE_OF_CONDUCT.es.md` - Community guidelines (English/Spanish)
- `CONTRIBUTING.md` / `CONTRIBUTING.es.md` - Contribution guidelines (English/Spanish)
- `SECURITY.md` / `SECURITY.es.md` - Security policy and vulnerability reporting (English/Spanish)

**Development Best Practices:**
- Always run `npm run license-compliance` after installing new dependencies
- Follow contribution guidelines in `CONTRIBUTING.md`
- Report security vulnerabilities per `SECURITY.md` policy
- All code must pass Jest tests and maintain license compliance