import { authResource } from "../resources/authentication.js";
import { qrResource } from "../resources/qr.js";
import { errorsResource } from "../resources/errors.js";

export const integrateQrPrompt = {
  name: "integrate_qr_payment",
  description:
    "Generate complete, production-ready QR payment integration code for a specific language and framework",
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
          text: `You are helping a developer integrate CoDi QR payments into their ${language} application using ${framework}.

Use the following official API documentation to generate complete, production-ready code.

---

${authResource.text}

---

${qrResource.text}

---

${errorsResource.text}

---

Generate the following, with clear comments explaining each field and decision:

1. **HTTP Request Function**
   - POST to /v2/codi/qr with the correct Content-Type and x-api-key header
   - Include all four required fields: monto, referenciaNumerica, concepto, vigencia
   - Show how to set vigencia as a 30-minute expiration (millisecond timestamp)
   - Show the alternative: vigencia = "0" for no expiration

2. **Response Handling**
   - Extract the qrCode (base64 PNG) from the response
   - Show how to display the QR image in an <img> tag (or equivalent for the framework)
   - Check edoPet and handle all non-zero codes with descriptive error messages

3. **Error Handling**
   - Handle HTTP 400 (validation errors — show how to extract the field errors array)
   - Handle HTTP 401 (invalid API key)
   - Handle HTTP 500 (server error)
   - Handle network errors / timeouts

4. **Usage Example**
   - A concrete call with a realistic payment amount (e.g., 500 pesos) and concepto
   - Comments showing what fields to replace with real values

Keep the code idiomatic for ${language} with ${framework}. Prefer async/await or the language's standard async patterns.`,
        },
      },
    ],
  }),
};
