import { authResource } from "../resources/authentication.js";
import { pushResource } from "../resources/push.js";
import { errorsResource } from "../resources/errors.js";

export const integratePushPrompt = {
  name: "integrate_push_payment",
  description:
    "Generate complete, production-ready Push payment integration code for a specific language and framework",
  args: {
    language:
      "Programming language (e.g., JavaScript, TypeScript, Python, Go, PHP, Ruby)",
    framework:
      "HTTP client or framework (e.g., fetch, axios, requests, net/http, curl)",
  },
  handler: ({ language, framework }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `You are helping a developer integrate CoDi Push payments into their ${language} application using ${framework}.

Use the following official API documentation to generate complete, production-ready code.

---

${authResource.text}

---

${pushResource.text}

---

${errorsResource.text}

---

Generate the following, with clear comments explaining each field and decision:

1. **Input Field Types and Constraints**
   Document each field with its exact type and rules as an inline comment or docstring:

   - celularCliente:
       Type:     string or number
       Pattern:  ^[0-9]{10}$  (exactly 10 digits)
       No country code prefix — do NOT include +52 or 52
       Example:  "5512345678"  or  5512345678

   - monto:
       Type:     number or numeric string
       Range:    0 to 999,999,999,999.99
       Decimals: at most 2
       Special:  0 = payer chooses the amount
       Example:  500  or  99.99  or  "95.63"

   - referenciaNumerica:
       Type:     string or number (digits only, no letters)
       Pattern:  ^[0-9]{1,7}$
       Length:   1 to 7 digits
       Special:  "" or omitted → send "0"
       Example:  "1234567"  or  "0"

   - concepto:
       Type:     string
       Length:   1 to 40 characters
       Charset:  letters (a-z A-Z á é í ó ú ñ Ñ), digits, space, and: ! " # $ % & ' ( ) * + , - . / : ; ? @ \\ _ ¿ ¡
       NOT allowed: < > [ ] ^ \` { | } ~
       Example:  "Pago mensual"

   - vigencia:
       Type:     string or number
       Special:  "0" = no expiration
       If not 0: Unix timestamp in MILLISECONDS (not seconds)
                 Must be in the future, max 1 year ahead, max 15 digits
                 WRONG: Math.floor(Date.now() / 1000)  ← seconds, rejected
                 RIGHT: Date.now() + 30 * 60 * 1000    ← milliseconds
       Example:  "0"  or  String(Date.now() + 1800000)

2. **HTTP Request Function**
   - POST to /v2/codi/push with the correct Content-Type and x-api-key header
   - Include all five required fields with types matching the rules above
   - Show how to format celularCliente correctly (10 digits, no country code)
   - Show how to set vigencia as a 30-minute expiration (millisecond timestamp)
   - Show the alternative: vigencia = "0" for no expiration

3. **Response Handling**
   - Extract and save data.folioCodi from the success response
   - Check edoPet and handle all non-zero codes with descriptive error messages
   - Explain that edoPet 0 = notification sent, NOT payment confirmed

4. **Error Handling**
   - Handle HTTP 400 (validation errors — show how to extract the field errors array)
   - Handle HTTP 401 (invalid API key)
   - Handle HTTP 500 (server error)
   - Handle network errors / timeouts

5. **Post-Send Flow Comment**
   - Add a comment explaining the next steps after a successful push:
     a) Save folioCodi to the database
     b) Poll /v2/codi/consulta to check edoMC status
     c) Or wait for the webhook callback when the payer responds

6. **Usage Example**
   - A concrete call with a realistic Mexican phone number, amount (e.g., 500 pesos), and concepto
   - Comments showing what fields to replace with real values

Keep the code idiomatic for ${language} with ${framework}. Prefer async/await or the language's standard async patterns.`,
        },
      },
    ],
  }),
};
