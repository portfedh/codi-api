export const errorsResource = {
  name: "errors",
  uri: "codi://docs/errors",
  description: "CoDi API error codes: edoPet, edoMC, resultado webhook codes, and HTTP status codes",
  text: `# CoDi API Error Codes Reference

## edoPet — Request Status

Returned in the "data.edoPet" field of QR, Push, and Consulta responses.

  0:   Success — request processed correctly
 -1:   Error — missing required information in the request
 -2:   Error — processing error at Banxico's systems
 -3:   Error — invalid input parameters (field values out of range or wrong format)
 -4:   Error — invalid digital signature on the request

When edoPet is 0, the operation completed at the API level.
For QR: the QR code was created. For Push: the notification was dispatched.
A successful edoPet does NOT mean the payer has paid — payment status is tracked via edoMC.

## edoMC — Transaction / Message Status

Returned in the "edoMC" field inside "lstDetalleMC" items in Consulta responses.
Reflects whether the payer has approved or rejected the payment.

 -1:   Pending — waiting for payer action (payer has not yet approved or rejected)
  0:   Approved — payer accepted the payment request; funds were transferred
  1:   Rejected — payer declined, or transaction timed out, or insufficient funds

Poll /v2/codi/consulta periodically (or use the webhook) to detect when edoMC changes from -1.

## resultado — Webhook Response Codes

Sent in the JSON body your server returns to Banxico when receiving a webhook call.
Also present in the webhook payload's resultadoMensajeCobro field.

  0:   Success — webhook payload accepted and validated
  Negative values indicate validation failures:

 -1:   Missing required parameters in the payload
 -2:   Invalid celularCliente
 -3:   Invalid digitoVerificadorCliente
 -4:   Invalid nombreCliente
 -5:   Invalid cveInstitucion (institution code not recognized)
 -6:   Invalid tipoCuentaCliente (account type not recognized)
 -7:   Certificate mismatch (developer or Banxico certificate does not match)
 -8:   Digital signature verification failed (most critical — reject the payload)
 -9:   Invalid resultadoMensajeCobro
 -10:  Invalid idMensajeCobro (not 10 or 20 characters)
 -11:  Invalid concepto (empty string)
 -12:  Invalid or out-of-order timestamps

## HTTP Status Codes

  200:  OK — request processed (check edoPet for Banxico-level result)
  400:  Bad Request — validation error before reaching Banxico
        Body: { "message": "Validation Error: ...", "errors": [{ "field": "...", "message": "..." }] }
  401:  Unauthorized — API key missing, invalid, or inactive
        Body: { "error": "API Key missing" } or { "error": "Invalid API Key" }
  500:  Internal Server Error — unexpected server error
        Body: { "success": false, "error": "Error processing ... request" }

## Common Mistakes and Their Errors

### Wrong vigencia format
Problem: Sending Unix timestamp in SECONDS instead of MILLISECONDS
Error: 400 with "Vigencia must be a millisecond timestamp (not seconds). Multiply by 1000 if needed"
Fix: Use Date.now() in JavaScript, or int(time.time() * 1000) in Python

### vigencia in the past
Problem: Sending an expiration timestamp that has already passed
Error: 400 with "Vigencia timestamp must be in the future"
Fix: Calculate the timestamp at request time, not from a stored/cached value

### vigencia too far in future
Problem: Sending a timestamp more than 1 year from now
Error: 400 with "Vigencia timestamp cannot exceed one year from now"
Fix: Cap at Date.now() + 365 * 24 * 60 * 60 * 1000

### Wrong concepto characters
Problem: Using characters outside the Banxico Annex G allowed set
Error: 400 with "Concepto contains invalid characters"
Fix: Stick to basic ASCII letters, digits, and the allowed symbols. Avoid < > [ ] { } | ~ ^

### Wrong referenciaNumerica format
Problem: Including letters or special characters
Error: 400 with "ReferenciaNumerica must contain only digits (0-9) with a maximum length of 7"
Fix: Use only digits 0-9, max 7 chars. Send "" or "0" if you have no reference.

### Wrong celularCliente length
Problem: Including country code (+52) or spaces
Error: 400 with "CelularCliente must contain exactly 10 numeric digits"
Fix: Send exactly 10 digits, no prefix: "5512345678" not "+525512345678"

### Wrong folioCodi length (consulta)
Problem: Sending a folio that is not exactly 10 or 20 characters
Error: 400 with "FolioCodi must be 10 or 20 characters long"
Fix: Use the exact folioCodi from the push response or QR cadenaMC

### fechaFinal in future (consulta)
Problem: Sending tomorrow's date as fechaFinal
Error: 400 with "fechaFinal must be after fechaInicial and not in the future"
Fix: Use today's date or "0"
`,
};
