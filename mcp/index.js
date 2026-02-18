#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Resources
import { authResource } from "./resources/authentication.js";
import { qrResource } from "./resources/qr.js";
import { pushResource } from "./resources/push.js";
import { consultaResource } from "./resources/consulta.js";
import { webhookResource } from "./resources/webhook.js";
import { errorsResource } from "./resources/errors.js";

// Prompts
import { integrateQrPrompt } from "./prompts/integrateQr.js";
import { integratePushPrompt } from "./prompts/integratePush.js";
import { handleWebhookPrompt } from "./prompts/handleWebhook.js";
import { checkStatusPrompt } from "./prompts/checkStatus.js";

const server = new McpServer({
  name: "codi-api-mcp",
  version: "1.0.0",
});

// Register resources
const resources = [
  authResource,
  qrResource,
  pushResource,
  consultaResource,
  webhookResource,
  errorsResource,
];

for (const resource of resources) {
  server.resource(
    resource.name,
    resource.uri,
    { description: resource.description },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/plain",
          text: resource.text,
        },
      ],
    })
  );
}

// Register prompts
const prompts = [
  integrateQrPrompt,
  integratePushPrompt,
  handleWebhookPrompt,
  checkStatusPrompt,
];

for (const prompt of prompts) {
  const argSchema = {};
  for (const [key, description] of Object.entries(prompt.args)) {
    argSchema[key] = z.string().describe(description);
  }
  server.prompt(prompt.name, argSchema, prompt.handler);
}

// Connect via stdio transport
// Note: console.error is used for logging — stdout is reserved for the MCP protocol
const transport = new StdioServerTransport();
await server.connect(transport);
