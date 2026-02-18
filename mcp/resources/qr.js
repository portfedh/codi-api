export const qrResource = {
  name: "qr",
  uri: "codi://docs/qr",
  description: "CoDi QR payment endpoint: all request fields, validation rules, and response format",
  text: `# CoDi QR Payment Endpoint

## Endpoint

  Method:  POST
  Path:    /v2/codi/qr
  Auth:    x-api-key header required

## Request Body (JSON)

All four fields are required.

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
    No expiry:      "0"
    30 min from now: Date.now() + 30 * 60 * 1000  (e.g., "1750000000000")

## Request Example

\`\`\`json
{
  "monto": 500,
  "referenciaNumerica": "1234567",
  "concepto": "Pago de servicio",
  "vigencia": "0"
}
\`\`\`

## Response: 200 OK

\`\`\`json
{
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "data": {
    "cadenaMC": "{\"TYP\":20,\"v\":{...},\"ic\":{...}}",
    "crtBdeM": "00000100000100015975",
    "selloDigital": "HWjD3bPwJ+rfDnDY...",
    "epoch": 1743120460060,
    "edoPet": 0
  }
}
\`\`\`

### Response Fields

- qrCode: Base64-encoded PNG image with data URI prefix. Use directly in an <img> src attribute.
- data.cadenaMC: Encrypted payment string from Banxico. Encoded in the QR image.
- data.crtBdeM: Banxico public certificate serial number.
- data.selloDigital: RSA digital signature from Banxico.
- data.epoch: Response timestamp in milliseconds since Unix epoch.
- data.edoPet: Request status code (see Errors documentation).

### edoPet Values

  0:  Success — QR generated, ready to present to payer
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
      "field": "monto",
      "message": "Monto must be a number between 0 and 999,999,999,999.99 with at most two decimal places"
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
{ "success": false, "error": "Error processing QR request" }
\`\`\`

## Integration Notes

1. The qrCode value is a complete data URI — set it directly as the src of an <img> element.
2. After displaying the QR, poll /v2/codi/consulta to check payment status.
3. Or configure a callback_url on your API key to receive webhook notifications.
4. edoPet 0 in the response only means the QR was created successfully. Payment may still be pending.
`,
};
