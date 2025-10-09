# CoDi API

**[📖 Read this in Spanish / Leer en Español](README.es.md)**

> An open source Node.js/Express API for generating CoDi (Cobro Digital) payment requests via QR codes and Push notifications, integrating with Banxico (Bank of Mexico).

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Deploy](https://github.com/portfedh/codi-api/actions/workflows/deploy.yml/badge.svg)](https://github.com/portfedh/codi-api/actions/workflows/deploy.yml)
[![GitHub issues](https://img.shields.io/github/issues/portfedh/codi-api)](https://github.com/portfedh/codi-api/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/portfedh/codi-api)](https://github.com/portfedh/codi-api/commits/main)
[![Code size](https://img.shields.io/github/languages/code-size/portfedh/codi-api)](https://github.com/portfedh/codi-api)

## Overview

CoDi API is a production-ready REST API that enables Mexican businesses to generate digital payment requests through Mexico's Central Bank (Banxico) CoDi system. The API supports two payment methods:

- **QR Code Payments**: Generate dynamic QR codes for customers to scan and pay
- **Push Notifications**: Send payment requests directly to customers' mobile banking apps via phone number

### Key Features

- ✅ **Digital Signature Authentication**: RSA certificate-based authentication with Banxico
- ✅ **Dual Environment Support**: Separate Beta and Production configurations
- ✅ **Fallback Architecture**: Multiple endpoint support for high availability
- ✅ **API Key Management**: Secure API key generation and validation via Supabase
- ✅ **Request/Response Logging**: Complete audit trail of all transactions
- ✅ **Webhook Support**: Receive real-time payment status updates
- ✅ **Security Hardened**: Helmet, CORS, rate limiting, request sanitization
- ✅ **Interactive API Documentation**: Swagger/OpenAPI documentation
- ✅ **Comprehensive Testing**: Jest test suite with coverage reporting

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Digital Certificates](#digital-certificates)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following:

### Required

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Supabase Account**: For database and API key management ([supabase.com](https://supabase.com))
- **Banxico Developer Account**: Required for CoDi integration
  - Apply at: [Banxico CoDi Developer Portal](https://www.codi.org.mx/)
  - You will receive:
    - Digital certificates
    - API endpoints for Beta and Production environments
    - Banxico public certificates
    - For both testing and production environments

### Recommended

- **PM2**: For production process management
- **Git**: For version control
- **PostgreSQL client**: For database management (Supabase provides a PostgreSQL database)

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/portfedh/codi-api.git
cd codi-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Configuration](#configuration) section).

4. **Set up the database**

Follow the [Database Setup](#database-setup) instructions to create the required tables in Supabase.

5. **Generate your first API key** (optional for testing)

```bash
node controllers/utils/generateApiKey.js
```

This will generate a 128-character hexadecimal API key that you can add to the `api_keys` table in Supabase.

## Configuration

The `.env` file contains all configuration variables. See `.env.example` for a complete template.

### Critical Configuration Sections

#### 1. Server Configuration

```bash
PORT=3131
NODE_ENV=development  # or production
```

#### 2. CORS Configuration

Define allowed origins for your API:

```bash
CORS_ALLOWED_ORIGINS=https://yourdomain.com,http://localhost:3000
CORS_BANXICO_BETA=http://banxico-beta-ip
CORS_BANXICO_PROD=http://banxico-prod-ip
```

#### 3. Supabase Database

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### 4. Banxico Endpoints

You will receive these URLs from Banxico when you register as a developer:

```bash
# QR Payment Endpoints
SITIO_CODI_QR_DEV_1=https://banxico-dev-qr-endpoint-1.com
SITIO_CODI_QR_DEV_2=https://banxico-dev-qr-endpoint-2.com
SITIO_CODI_QR_PROD_1=https://banxico-prod-qr-endpoint-1.com
SITIO_CODI_QR_PROD_2=https://banxico-prod-qr-endpoint-2.com

# Push Payment Endpoints
SITIO_CODI_PUSH_DEV_1=https://banxico-dev-push-endpoint-1.com
SITIO_CODI_PUSH_DEV_2=https://banxico-dev-push-endpoint-2.com
# ... and so on
```

#### 5. Digital Certificates

See [Digital Certificates](#digital-certificates) section for detailed instructions.

## Database Setup

This API uses Supabase (PostgreSQL) for data persistence.

### 1. Create a Supabase Project

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys

### 2. Create Database Tables

The complete database schema is available in `/database/schema.sql`. Create the following tables:

**Core Tables:**

- `customers`: Customer information and bank details
- `api_keys`: API key management with Banxico integration
- `folios_codi`: CoDi payment folio tracking
- `requests`: Incoming request logging
- `responses`: Outgoing response logging

**Visual Schema:**
See `/database/database_schema.png` for a visual representation of table relationships.

### 3. Add Your First Customer and API Key

```sql
-- 1. Insert a customer
INSERT INTO customers (name, email, phone, environment, bank_name, bank_account)
VALUES ('Test Customer', 'test@example.com', '5551234567', 'development', 'Test Bank', '1234567890');

-- 2. Insert an API key for this customer
INSERT INTO api_keys (
  customer_id,
  api_key,
  banxico_api_key,
  environment,
  callback_url,
  active
)
VALUES (
  (SELECT id FROM customers WHERE email = 'test@example.com'),
  'your_generated_128_char_api_key_here',
  'your_banxico_api_key_here',
  'development',
  'https://your-webhook-url.com/callback',
  true
);
```

## API Endpoints

### Base URL

- **Development**: `http://localhost:3131`
- **Production**: `https://your-domain.com`

### Authentication

All endpoints (except `/health`) require an API key in the header:

```bash
x-api-key: your_128_character_api_key
```

### Available Endpoints

#### 1. Health Check

```http
GET /v2/health
```

Returns API health status. No authentication required.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-10-06T12:00:00.000Z"
}
```

#### 2. Generate QR Payment Request

```http
POST /v2/codi/qr
```

Creates a CoDi payment request and returns a QR code.

**Request Body:**

```json
{
  "monto": "100.50",
  "concepto": "Payment for services",
  "referencia": "INV-12345"
}
```

**Response:**

```json
{
  "success": true,
  "qrCode": "data:image/png;base64,...",
  "folioCoDi": "ABC123DEF456",
  "mensaje": "QR code generated successfully"
}
```

#### 3. Send Push Payment Request

```http
POST /v2/codi/push
```

Sends a payment request directly to a customer's mobile banking app.

**Request Body:**

```json
{
  "monto": "100.50",
  "concepto": "Payment for services",
  "referencia": "INV-12345",
  "telefonoCliente": "5551234567"
}
```

**Response:**

```json
{
  "success": true,
  "folioCoDi": "ABC123DEF456",
  "mensaje": "Push notification sent successfully"
}
```

#### 4. Query Payment Status

```http
POST /v2/codi/consulta
```

Check the status of a payment request.

**Request Body:**

```json
{
  "folioCoDi": "ABC123DEF456"
}
```

**Response:**

```json
{
  "success": true,
  "status": "paid",
  "monto": "100.50",
  "fechaPago": "2025-10-06T12:30:00.000Z"
}
```

#### 5. Payment Result Webhook

```http
POST /v2/resultadoOperaciones
```

Receives payment status updates from Banxico. This endpoint is called by Banxico when a payment is completed.

**Webhook Payload** (sent by Banxico):

```json
{
  "folioCoDi": "ABC123DEF456",
  "resultado": "exitoso",
  "monto": "100.50",
  "timestamp": "2025-10-06T12:30:00.000Z"
}
```

### API Documentation

Interactive API documentation is available via Swagger UI:

```
http://localhost:3131/api-docs
```

## Authentication

### API Key Authentication

The API uses two-layer authentication:

1. **Your API Key**: Generated by you, used by your clients
2. **Banxico API Key**: Provided by Banxico, stored in the database

### Digital Signature Verification

All requests to/from Banxico are signed with RSA digital certificates for security:

- Outgoing requests are signed with your private key
- Incoming webhooks are verified using Banxico's public certificate
- Certificate serial numbers are validated

## Digital Certificates

### Certificate Requirements

You need 4 sets of certificates from Banxico:

1. **Developer Beta Environment**

   - Private key (`.cve` file)
   - Public certificate (`.crt` file)
   - Login certificate serial number
   - Operation certificate serial number

2. **Developer Production Environment**

   - Same as above, but for production

3. **Banxico Beta Public Certificate**

   - For verifying Banxico signatures in Beta

4. **Banxico Production Public Certificate**
   - For verifying Banxico signatures in Production

### Certificate Format Preparation

Certificate files must be formatted correctly for use in `.env`:

**Convert certificate files to environment variable format:**

```bash
# For private keys (.cve files)
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' your_private_key.cve

# For public certificates (.crt files)
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' your_certificate.crt
```

This converts newlines to `\n` characters so the certificate can be stored as a single-line environment variable.

**Add to `.env`:**

```bash
# Example for Developer Beta Private Key
PRIVATE_KEY_DEV="-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIB...(your key here)...\n-----END RSA PRIVATE KEY-----\n"
PRIVATE_KEY_PASSPHRASE_DEV="your_passphrase"

# Example for Developer Beta Public Certificate
PUBLIC_KEY_DEV="-----BEGIN CERTIFICATE-----\nMIIDXTC...(your cert here)...\n-----END CERTIFICATE-----"

# Certificate Serial Numbers (provided by Banxico)
CRT_LOG_IN_DEV="1234567890"
CRT_OPER_DEV="0987654321"
```

### Certificate Security

- **Never commit certificates to Git**: The `.gitignore` file excludes `.env`
- Store production certificates securely (use environment variables in production)
- Rotate certificates before expiration
- Use separate certificates for Beta and Production

## Development

### Start Development Server

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server on file changes.

### Start Production Server

```bash
npm start
```

Or use PM2 for production process management:

```bash
pm2 start index.js --name codi-api
pm2 logs codi-api
```

### Project Structure

```
codi-api/
├── config/              # Configuration files
│   ├── cors.js         # CORS configuration
│   ├── institutions.js # Financial institution codes
│   ├── supabase.js     # Supabase client setup
│   └── swagger.js      # Swagger/OpenAPI config
├── controllers/         # Route controllers
│   ├── consulta.js     # Payment status queries
│   ├── health.js       # Health check endpoint
│   ├── resultadoOperaciones.js  # Webhook handler
│   ├── sendPushPayment.js       # Push payment logic
│   ├── sendQrPayment.js         # QR payment logic
│   └── utils/          # Utility functions (35+ helpers)
├── database/           # Database schema and diagrams
├── middleware/         # Express middleware
│   └── sanitizeRequest.js  # Request sanitization
├── routes/             # Route definitions
│   └── home.js        # Main router
├── tests/              # Jest test suite
├── validators/         # Request validation schemas
├── .env.example        # Environment variables template
├── index.js            # Application entry point
└── package.json        # Project dependencies
```

### Utility Functions (`controllers/utils/`)

The API includes 35+ utility functions for:

- Certificate handling and signature verification
- Banxico credential management
- Request/response logging to Supabase
- Data validation and formatting
- Fallback request mechanisms
- QR code generation
- API key management

## Testing

### Run Tests

```bash
npm test
```

This runs the Jest test suite with coverage reporting.

### Test Coverage

Tests cover:

- All utility functions
- Validation rules
- Certificate verification
- Digital signature generation
- Request formatting
- Error handling

Coverage reports are generated in `/coverage` directory.

### Manual Testing with curl

**Health Check:**

```bash
curl http://localhost:3131/v2/health
```

**QR Payment Request:**

```bash
curl -X POST http://localhost:3131/v2/codi/qr \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key_here" \
  -d '{
    "monto": "100.50",
    "concepto": "Test payment",
    "referencia": "TEST-001"
  }'
```

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Configure production Banxico endpoints
- [ ] Use production digital certificates
- [ ] Set up production Supabase database
- [ ] Configure CORS for production domains
- [ ] Enable HTTPS/SSL
- [ ] Set up process manager (PM2 recommended)
- [ ] Configure log rotation
- [ ] Set up monitoring and alerts
- [ ] Review rate limiting settings
- [ ] Test webhook endpoint accessibility

### PM2 Deployment

```bash
# Install PM2
npm install -g pm2

# Start the API
pm2 start index.js --name codi-api

# Save PM2 configuration
pm2 save

# Set up PM2 to start on system boot
pm2 startup
```

### Environment Variables in Production

For production, use your hosting provider's environment variable management instead of `.env` files:

- **Vercel**: Use Environment Variables in project settings
- **Heroku**: Use `heroku config:set`
- **AWS/GCP/Azure**: Use their respective secret management services
- **Docker**: Use Docker secrets or environment files

## Security

### Security Features

- **Helmet**: Security headers (XSS protection, content security policy, etc.)
- **CORS**: Strict origin validation
- **Rate Limiting**: 200 requests per 15 minutes per IP
- **Request Sanitization**: SQL injection and XSS prevention
- **API Key Validation**: 128-character hexadecimal keys
- **Digital Signatures**: RSA certificate-based authentication
- **Hidden File Blocking**: Prevents access to `.git`, `.env`, etc.
- **Request Logging**: Complete audit trail in Supabase

### Security Best Practices

1. **Never expose your `.env` file**
2. **Rotate API keys regularly**
3. **Monitor rate limit violations**
4. **Keep dependencies updated**: `npm audit fix`
5. **Use HTTPS in production**
6. **Validate webhook signatures from Banxico**
7. **Review access logs regularly**: `pm2 logs codi-api`
8. **Set up alerts for suspicious activity**

### Reporting Security Vulnerabilities

If you discover a security vulnerability, please email the maintainer directly rather than opening a public issue.

## Contributing

Contributions are welcome! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run tests**: `npm test`
6. **Commit your changes**: `git commit -m "Add: your feature description"`
7. **Push to your fork**: `git push origin feature/your-feature-name`
8. **Open a Pull Request**

### Code Style

- Use 2 spaces for indentation
- Follow existing code patterns
- Add JSDoc comments for functions
- Write descriptive commit messages
- Ensure all tests pass before submitting PR

### Areas for Contribution

- Enhanced error handling
- Performance optimizations
- Documentation improvements
- Additional test coverage
- Security enhancements
- Internationalization (i18n)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

### What this means:

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Patent grant included
- ✅ Private use allowed
- ⚠️ Must include copyright notice and license
- ⚠️ Must state significant changes
- ❌ No liability or warranty

## Support

### Documentation

- **API Documentation**: `/api-docs` endpoint (Swagger UI)
- **Database Schema**: `/database/schema.sql`
- **Schema Diagram**: `/database/database_schema.png`
- **Environment Setup**: `.env.example`

### Resources

- **Banxico CoDi Documentation**: [https://www.banxico.org.mx/codi/](https://www.banxico.org.mx/codi/)
- **Supabase Documentation**: [https://supabase.com/docs](https://supabase.com/docs)
- **Express.js Documentation**: [https://expressjs.com/](https://expressjs.com/)

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/portfedh/codi-api/issues)
- **Discussions**: [GitHub Discussions](https://github.com/portfedh/codi-api/discussions)

## Acknowledgments

- **Banxico** (Bank of Mexico) for the CoDi payment system
- **Supabase** for the database and authentication platform
- All contributors and users of this project

## Roadmap

Future enhancements under consideration:

- [ ] Webhook retry mechanism with exponential backoff
- [ ] Enhanced reporting and analytics
- [ ] SDK libraries (JavaScript, Python, PHP)

---

**Created by [Pablo Cruz Lemini](https://github.com/portfedh)**

For questions or feedback, please open an issue on GitHub.
