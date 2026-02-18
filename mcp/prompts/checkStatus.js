import { authResource } from "../resources/authentication.js";
import { consultaResource } from "../resources/consulta.js";
import { errorsResource } from "../resources/errors.js";

export const checkStatusPrompt = {
  name: "check_payment_status",
  description:
    "Generate payment status polling code using the CoDi consulta endpoint",
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
          text: `You are helping a developer implement payment status checking for CoDi payments in their ${language} application using ${framework}.

Use the following official API documentation to generate complete, production-ready code.

---

${authResource.text}

---

${consultaResource.text}

---

${errorsResource.text}

---

Generate the following, with clear comments explaining each part:

1. **Single Status Check Function**
   - POST to /v2/codi/consulta with the correct x-api-key header
   - Accept folioCodi as a parameter
   - Use tpg=10, npg=1, fechaInicial="0", fechaFinal="0" as sensible defaults
   - Return the payment status in a clean, structured way

2. **Result Interpretation**
   - Extract edoMC from lstDetalleMC[0] (the most recent entry)
   - Map edoMC to human-readable status:
       -1 → "pending" (payer has not responded yet)
        0 → "approved" (payment successful)
        1 → "rejected" (payer declined or timed out)
   - Also check edoPet to confirm the query itself succeeded

3. **Polling Loop**
   - A function that polls every N seconds until edoMC is no longer -1
   - Accept parameters: folioCodi, intervalSeconds (default 5), timeoutSeconds (default 300)
   - Stop polling when: edoMC = 0 (approved), edoMC = 1 (rejected), or timeout reached
   - Return the final status and the full transaction record

4. **Pagination Support**
   - Show how to check data.ultPag and fetch additional pages if needed
   - Useful when querying by date range rather than by folioCodi

5. **Error Handling**
   - Handle edoPet non-zero values
   - Handle HTTP 400, 401, 500
   - Handle empty lstDetalleMC (folio not found or not yet indexed)
   - Handle network errors

6. **Usage Example**
   - Show how to call the polling function after creating a QR or Push payment
   - Show how to handle the three terminal states: approved, rejected, timeout

Keep the code idiomatic for ${language} with ${framework}. Prefer async/await or the language's standard async patterns.`,
        },
      },
    ],
  }),
};
