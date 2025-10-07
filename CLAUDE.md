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