export const webhookResource = {
  name: "webhook",
  uri: "codi://docs/webhook",
  description: "CoDi resultadoOperaciones webhook: payload fields, validation, required response, and resultado codes",
  text: `# CoDi Webhook — resultadoOperaciones

## Overview

After a payer approves or rejects a payment, Banxico POSTs a signed notification
to the callback_url registered for your API key in the database.

You must respond within Banxico's timeout window with { "resultado": 0 }.
Any other response or timeout causes Banxico to retry.

## Endpoint You Must Implement

  Method:  POST
  Path:    Any URL you configure as callback_url (e.g., https://yourdomain.com/webhook/codi)
  Called by: Banxico (not by API consumers)

## Incoming Payload Fields

Banxico sends a JSON body with the following fields. All fields must be present.

### celularCliente
- Type: string
- Description: Payer's 10-digit mobile phone number
- Validation: exactly 10 numeric digits

### digitoVerificadorCliente
- Type: number
- Description: Payer verification digit
- Validation: 1–9 numeric digits

### nombreCliente
- Type: string
- Description: Payer's name (partially provided by their bank)
- Validation: alphanumeric characters, up to 40 characters

### cveInstitucion
- Type: string
- Description: 3-digit institution code of the payer's bank
- Validation: must be a valid institution code in the supported list
- Examples: "40002" (BANAMEX), "40012" (BBVA), "40072" (BANORTE)

### tipoCuentaCliente
- Type: number
- Description: Type of the payer's bank account
- Validation: must be a recognized account type code

### certComercioProveedor
- Type: string (PEM certificate)
- Description: Your (the merchant's) digital certificate
- Validation: compared against the developer certificate in the API configuration

### certBdeM
- Type: string (PEM certificate)
- Description: Banxico's digital certificate
- Validation: compared against the Banxico certificate in the API configuration

### resultadoMensajeCobro
- Type: number
- Description: Result of the payment message from the payer's bank
- Validation: must be a recognized result code

### idMensajeCobro
- Type: string
- Description: Unique message identifier for the collection message
- Validation: exactly 10 or 20 characters

### concepto
- Type: string
- Description: Payment description (echoed from the original request)
- Validation: at least 1 character

### Timestamps
- Multiple timestamp fields are included in the payload
- Banxico validates that all timestamps are valid and in chronological order

## Signature Verification

The payload includes a digital signature from Banxico.
The server verifies this signature using Banxico's public key.
If verification fails, respond with { "resultado": -8 }.

## Required Response

Always respond with HTTP 200 and a JSON body:

Success (all checks passed):
\`\`\`json
{ "resultado": 0 }
\`\`\`

Failure (a check failed — the server still returns HTTP 200 but with a negative resultado):
\`\`\`json
{ "resultado": -8 }
\`\`\`

## resultado Codes

  0:   All validations passed. Payment result acknowledged successfully.
  Negative values: validation failed (see below)

 -1:   Missing required parameters in the payload
 -2:   Invalid celularCliente (not 10 numeric digits)
 -3:   Invalid digitoVerificadorCliente
 -4:   Invalid nombreCliente
 -5:   Invalid cveInstitucion (not in valid institutions list)
 -6:   Invalid tipoCuentaCliente
 -7:   Certificate mismatch (certComercioProveedor or certBdeM does not match expected)
 -8:   Digital signature verification failed
 -9:   Invalid resultadoMensajeCobro
 -10:  Invalid idMensajeCobro (not 10 or 20 chars)
 -11:  Invalid concepto (empty)
 -12:  Invalid or out-of-order timestamps

## Webhook Processing Flow

1. Banxico POSTs to your callback_url
2. Your server verifies each field
3. Your server verifies the RSA digital signature
4. Your server responds immediately with { "resultado": 0 } or a negative code
5. Your server asynchronously processes the payment result (update DB, notify user, etc.)
6. The server also forwards the payload to any customer-configured callback URL

## Important: Respond Fast

Banxico has a strict timeout. Your webhook handler must:
- Parse the payload quickly
- Send the { "resultado": 0 } response before doing any heavy processing
- Do database updates and notifications asynchronously after responding

## Security Notes

- Verify certComercioProveedor matches your registered developer certificate
- Verify certBdeM matches the known Banxico certificate
- Verify the RSA digital signature on every request
- Do not trust the payload without signature verification
`,
};
