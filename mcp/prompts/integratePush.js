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

1. **HTTP Request Function**
   - POST to /v2/codi/push with the correct Content-Type and x-api-key header
   - Include all five required fields: celularCliente, monto, referenciaNumerica, concepto, vigencia
   - Show how to format celularCliente correctly (10 digits, no country code)
   - Show how to set vigencia as a 30-minute expiration (millisecond timestamp)
   - Show the alternative: vigencia = "0" for no expiration

2. **Response Handling**
   - Extract and save data.folioCodi from the success response
   - Check edoPet and handle all non-zero codes with descriptive error messages
   - Explain that edoPet 0 = notification sent, NOT payment confirmed

3. **Error Handling**
   - Handle HTTP 400 (validation errors — show how to extract the field errors array)
   - Handle HTTP 401 (invalid API key)
   - Handle HTTP 500 (server error)
   - Handle network errors / timeouts

4. **Post-Send Flow Comment**
   - Add a comment explaining the next steps after a successful push:
     a) Save folioCodi to the database
     b) Poll /v2/codi/consulta to check edoMC status
     c) Or wait for the webhook callback when the payer responds

5. **Usage Example**
   - A concrete call with a realistic Mexican phone number, amount (e.g., 500 pesos), and concepto
   - Comments showing what fields to replace with real values

Keep the code idiomatic for ${language} with ${framework}. Prefer async/await or the language's standard async patterns.`,
        },
      },
    ],
  }),
};
