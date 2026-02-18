export const pushResource = {
  name: "push",
  uri: "codi://docs/push",
  description: "CoDi Push payment endpoint: all request fields including celularCliente, and response format",
  text: `# CoDi Push Payment Endpoint

## Endpoint

  Method:  POST
  Path:    /v2/codi/push
  Auth:    x-api-key header required

## Description

Sends a payment request notification directly to a payer's mobile banking app via their phone number.
The payer receives a push notification and must approve the payment in their banking application.
Use this when you know the payer's mobile number. For anonymous payers, use the QR endpoint instead.

## Request Body (JSON)

All five fields are required.

### celularCliente

- Type: string or number
- Description: Payer's Mexican mobile phone number
- Pattern: ^[0-9]{10}$  (exactly 10 digits, no spaces, no dashes, no country code)
- Do NOT include +52 or 52 prefix — just the 10-digit number
- Examples: "5512345678", "3312345678", 5512345678

### monto

- Type: number or numeric string
- Description: Payment amount in Mexican pesos
- Range: 0 to 999,999,999,999.99
- Decimals: at most 2 decimal places
- Special: 0 means the payer decides the amount when they approve
- Practical bank limits: minimum 0.01, maximum ~12,000 per transaction
- Examples: 500, 99.99, "95.63", 0

### referenciaNumerica

- Type: string or number (digits only)
- Description: Transaction reference assigned by the merchant
- Pattern: ^[0-9]{1,7}$  (digits only, no letters, no special chars)
- Length: 1 to 7 digits
- Special: empty string "" is automatically converted to "0"
- Use "0" if you have no reference number
- Examples: "1234567", "42", 7, "0"

### concepto

- Type: string
- Description: Payment description shown to the payer
- Length: 1 to 40 characters
- Allowed characters (Banxico Annex G):
    Letters:    a-z  A-Z  á é í ó ú  ñ Ñ
    Digits:     0-9
    Symbols:    space ! " # $ % & ' ( ) * + , - . / : ; ? @ \\ _
    Spanish:    ¿ ¡
- NOT allowed: < > [ ] ^ \` { | } ~
- Examples: "Pago mensual", "Boleto evento", "Factura 2024-001"

### vigencia

- Type: string or number
- Description: Expiration time for the payment request
- Special value: "0" means no expiration (payer can pay at any time)
- If not "0": Unix timestamp in MILLISECONDS (not seconds)
  - Must be in the future
  - Cannot exceed 1 year from now
  - Maximum 15 digits
  - CRITICAL: Must be milliseconds. If you have seconds, multiply by 1000.
  - Timestamps under 10,000,000,000 are rejected as "looks like seconds"
- Examples:
    No expiry:       "0"
    30 min from now: Date.now() + 30 * 60 * 1000  (e.g., "1750000000000")

## Request Example

\`\`\`json
{
  "celularCliente": "5512345678",
  "monto": 500,
  "referenciaNumerica": "1234567",
  "concepto": "Pago de servicio",
  "vigencia": "0"
}
\`\`\`

## Response: 200 OK

\`\`\`json
{
  "success": true,
  "data": {
    "folioCodi": "321e210838321e210838",
    "crtBdeM": "00000100000999915974",
    "selloDigital": "l+GUL9tAK3U9NSRuyiqPEHm...",
    "epoch": 1743120496612,
    "edoPet": 0
  }
}
\`\`\`

### Response Fields

- success: true if the push notification was sent successfully.
- data.folioCodi: Unique 20-character CoDi operation identifier. Save this to check payment status later.
- data.crtBdeM: Banxico public certificate serial number.
- data.selloDigital: RSA digital signature from Banxico.
- data.epoch: Response timestamp in milliseconds since Unix epoch.
- data.edoPet: Request status code (see Errors documentation).

### edoPet Values

  0:  Success — push notification sent, payer needs to approve
 -1:  Error — missing required information
 -2:  Error — processing error at Banxico
 -3:  Error — invalid input parameters
 -4:  Error — invalid digital signature

## Response: 400 Bad Request

\`\`\`json
{
  "message": "Validation Error: Invalid input data.",
  "errors": [
    {
      "field": "celularCliente",
      "message": "CelularCliente must contain exactly 10 numeric digits"
    }
  ]
}
\`\`\`

## Response: 401 Unauthorized

\`\`\`json
{ "error": "Invalid API Key" }
\`\`\`

## Response: 500 Internal Server Error

\`\`\`json
{ "success": false, "error": "Error processing Push request" }
\`\`\`

## Integration Notes

1. edoPet 0 only means the notification was dispatched. Payment is still pending payer approval.
2. Save data.folioCodi to check payment status via /v2/codi/consulta.
3. Configure a callback_url to receive webhook notifications when the payer approves or rejects.
4. The payer's phone must have a CoDi-enabled banking app installed and registered.
5. If the payer's bank is not in the supported institutions list, the request will fail at Banxico.
`,
};
