import { webhookResource } from "../resources/webhook.js";
import { errorsResource } from "../resources/errors.js";

export const handleWebhookPrompt = {
  name: "handle_webhook",
  description:
    "Generate a complete webhook handler for CoDi resultadoOperaciones callbacks from Banxico",
  args: {
    language:
      "Programming language (e.g., JavaScript, TypeScript, Python, Go, PHP, Ruby)",
    framework:
      "Web framework (e.g., Express, Fastify, FastAPI, Django, Gin, Laravel)",
  },
  handler: ({ language, framework }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `You are helping a developer implement a webhook handler for CoDi payment notifications in their ${language} application using ${framework}.

Banxico calls this endpoint after a payer approves or rejects a CoDi payment. Use the following documentation to generate correct, production-ready code.

---

${webhookResource.text}

---

${errorsResource.text}

---

Generate the following, with clear comments explaining the logic:

1. **Webhook Route Handler**
   - POST endpoint (the developer will register the URL as callback_url)
   - Parse the incoming JSON payload
   - Respond IMMEDIATELY with { "resultado": 0 } before doing any heavy work
   - Do NOT await database writes or external calls before responding
   - The response must be fast to avoid Banxico timeout

2. **Payload Validation (basic)**
   - Check that required fields are present: celularCliente, digitoVerificadorCliente,
     nombreCliente, cveInstitucion, tipoCuentaCliente, certComercioProveedor, certBdeM,
     resultadoMensajeCobro, idMensajeCobro, concepto, and timestamps
   - If fields are missing, respond with { "resultado": -1 }
   - Note: Full certificate and signature verification requires server-side crypto setup
     (handled by the CoDi API server, not needed in a forwarded webhook)

3. **Payment Result Extraction**
   - Extract the key fields: celularCliente, concepto, resultadoMensajeCobro, idMensajeCobro
   - Log or print the received payload for debugging

4. **Async Business Logic (after responding)**
   - Comment showing where to add: database update to mark payment as complete/rejected
   - Comment showing where to: notify your application (emit event, push to queue, etc.)
   - Comment showing where to: update the order status in your system

5. **resultado Code Handling**
   - Show how to respond with different negative resultado values for field validation failures
   - Specifically handle the -8 (bad signature) case as the most critical rejection

6. **Usage Notes**
   - Comment explaining how to register this endpoint as the callback_url
   - Comment about HTTPS requirement (Banxico only calls HTTPS URLs)
   - Comment about idempotency (Banxico may retry if it doesn't get { resultado: 0 })

Keep the code idiomatic for ${language} with ${framework}.`,
        },
      },
    ],
  }),
};
