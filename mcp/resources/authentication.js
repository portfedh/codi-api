export const authResource = {
  name: "authentication",
  uri: "codi://docs/authentication",
  description: "CoDi API authentication: API key format, required header, and environments",
  text: `# CoDi API Authentication

## API Key Format

- Type: 128-character hexadecimal string
- Pattern: ^[0-9a-f]{128}$
- Example: a3f1b2c4d5e6... (128 hex characters)
- Keys are stored in Supabase and must have status = active to be accepted

## How to Send the API Key

Send the API key in the request header:

  Header name:  x-api-key
  Header value: <your-128-char-hex-api-key>

IMPORTANT: Do NOT use "Authorization: Bearer". The correct header is "x-api-key".

## Example Header

x-api-key: a3f1b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4

## Environments

### Production
- Connects to real Banxico CoDi infrastructure
- Transactions are live and move real money
- Requires production API key provisioned against production Banxico certificates

### Beta (Testing)
- Connects to Banxico's test/development environment
- Safe for integration testing
- Requires beta API key provisioned against beta Banxico certificates
- Uses different institution codes (see institutions documentation)

## Error Responses for Authentication

HTTP 401 responses:

  Missing key:  { "error": "API Key missing" }
  Invalid key:  { "error": "Invalid API Key" }

## Security Notes

- API keys are long-lived; treat them like passwords
- Never embed an API key in client-side (browser) code
- Rotate keys immediately if compromised
- Each API key is associated with a specific Banxico account and callback URL
`,
};
