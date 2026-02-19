# codi-api-mcp

**[English](#english) | [Español](#español)**

---

<a name="english"></a>

# English

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that gives AI assistants structured, exact knowledge of the CoDi API — enabling them to generate correct integration code for developers.

No credentials needed. No running server. Works offline. Install once and get AI-assisted CoDi integration help in any project.

## Quick Install

Pick your AI tool:

**Claude Code**
```bash
claude mcp add --scope user codi-api-mcp -- npx codi-api-mcp
```

**OpenAI Codex CLI** — one-command install:
```bash
codex mcp add codi-api-mcp -- npx -y codi-api-mcp
```
Or add directly to `~/.codex/config.toml`:
```toml
[mcp_servers.codi-api-mcp]
command = "npx"
args = ["-y", "codi-api-mcp"]
```

**Gemini CLI** — add to `~/.gemini/settings.json` (global) or `.gemini/settings.json` in your project root:
```json
{
  "mcpServers": {
    "codi-api-mcp": {
      "command": "npx",
      "args": ["codi-api-mcp"]
    }
  }
}
```

**VS Code (GitHub Copilot)** — add to `.vscode/mcp.json` in your project:
```json
{
  "servers": {
    "codi-api-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["codi-api-mcp"]
    }
  }
}
```

**Cursor** — add to `.cursor/mcp.json` in your project, or `~/.cursor/mcp.json` globally:
```json
{
  "mcpServers": {
    "codi-api-mcp": {
      "command": "npx",
      "args": ["codi-api-mcp"]
    }
  }
}
```

**Windsurf** — add to `~/.codeium/windsurf/mcp_config.json`:
```json
{
  "mcpServers": {
    "codi-api-mcp": {
      "command": "npx",
      "args": ["codi-api-mcp"]
    }
  }
}
```

**Claude Desktop** — add to your config file and restart:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "codi-api-mcp": {
      "command": "npx",
      "args": ["codi-api-mcp"]
    }
  }
}
```

**Prerequisites:** Node.js 18 or higher.

---

## Claude Code — Scope Options

By default, `claude mcp add` registers the server only for the current project. To make it available across all your projects:

```bash
# Available in all projects (recommended for personal use)
claude mcp add --scope user codi-api-mcp -- npx codi-api-mcp

# Current project only (stored in .claude/ folder)
claude mcp add codi-api-mcp -- npx codi-api-mcp

# Shared with the team via git (stored in .mcp.json at project root)
claude mcp add --scope project codi-api-mcp -- npx codi-api-mcp
```

---

## What You Can Ask

After installing, ask your AI assistant questions about the CoDi API directly:

**Field rules:**
> What fields does the CoDi QR payment endpoint require?

The AI will list all four fields (`monto`, `referenciaNumerica`, `concepto`, `vigencia`) with exact types, ranges, and validation rules.

**Specific field formatting:**
> How should I format the vigencia field for a 1-hour expiry?

```
Set vigencia to the current time in milliseconds plus 3,600,000:

JavaScript:  Date.now() + 60 * 60 * 1000
Python:      int(time.time() * 1000) + 60 * 60 * 1000

Must be milliseconds, not seconds. The API rejects timestamps
below 10,000,000,000 with: "Vigencia must be a millisecond timestamp."
```

**Error codes:**
> What does edoPet -3 mean?

```
edoPet -3 = invalid input parameters. The request reached Banxico but
was rejected because a field value was out of range or in the wrong format.
Comes back inside a 200 OK response with edoPet: -3 in the body.
```

**Generate integration code:**
> Generate a fetch() call in JavaScript to create a CoDi QR payment for 500 pesos.

The AI produces a complete, correct function with the `x-api-key` header, all required fields with proper types, `vigencia` as a millisecond timestamp, and error handling for all `edoPet` codes.

**Full integration scaffolding (prompts):**
> Use the integrate_qr_payment prompt for Python with requests

Generates a complete Python module with field type annotations, the HTTP POST request, response parsing, `edoPet` error handling, and a usage example.

**Other useful questions:**
```
What is the difference between edoPet and edoMC?
What does resultado -8 mean in the webhook response?
How does pagination work in the consulta endpoint?
What characters are allowed in the concepto field?
Generate a Go webhook handler for CoDi resultadoOperaciones callbacks.
Generate a polling function in TypeScript that waits for a CoDi payment to be approved.
```

---

## Available Resources

Resources are documentation blobs the AI reads as context.

| Resource URI | Description |
|---|---|
| `codi://docs/authentication` | API key format (128-char hex), `x-api-key` header, environments |
| `codi://docs/qr` | QR endpoint: all fields, types, validation rules, request/response |
| `codi://docs/push` | Push endpoint: all fields including `celularCliente` |
| `codi://docs/consulta` | Query endpoint: `folioCodi`, pagination, date filters, response |
| `codi://docs/webhook` | Webhook payload fields, required `{ resultado: 0 }` response |
| `codi://docs/errors` | All error codes: `edoPet`, `edoMC`, `resultado`, HTTP status |

## Available Prompts

Prompts are pre-built conversation starters for code generation. Each takes a `language` and `framework` argument.

| Prompt | What it generates |
|---|---|
| `integrate_qr_payment` | Complete QR payment integration with field types, request, QR display, error handling |
| `integrate_push_payment` | Complete Push payment integration with field types, request, folioCodi handling |
| `handle_webhook` | Webhook handler with fast-response pattern, validation, async business logic |
| `check_payment_status` | Status polling with edoMC mapping, polling loop, pagination |

---

## License

Apache-2.0

---
---

<a name="español"></a>

# Español

Un servidor [MCP (Model Context Protocol)](https://modelcontextprotocol.io) que proporciona a los asistentes de IA conocimiento exacto y estructurado del API de CoDi, permitiéndoles generar código de integración correcto para desarrolladores.

No se necesitan credenciales. No requiere servidor corriendo. Funciona sin conexión. Instálalo una vez y obtén ayuda con la integración de CoDi en cualquier proyecto.

## Instalación Rápida

Elige tu herramienta de IA:

**Claude Code**
```bash
claude mcp add --scope user codi-api-mcp -- npx codi-api-mcp
```

**OpenAI Codex CLI** — instalación con un comando:
```bash
codex mcp add codi-api-mcp -- npx -y codi-api-mcp
```
O agrega directamente a `~/.codex/config.toml`:
```toml
[mcp_servers.codi-api-mcp]
command = "npx"
args = ["-y", "codi-api-mcp"]
```

**Gemini CLI** — agrega a `~/.gemini/settings.json` (global) o `.gemini/settings.json` en la raíz de tu proyecto:
```json
{
  "mcpServers": {
    "codi-api-mcp": {
      "command": "npx",
      "args": ["codi-api-mcp"]
    }
  }
}
```

**VS Code (GitHub Copilot)** — agrega a `.vscode/mcp.json` en tu proyecto:
```json
{
  "servers": {
    "codi-api-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["codi-api-mcp"]
    }
  }
}
```

**Cursor** — agrega a `.cursor/mcp.json` en tu proyecto, o `~/.cursor/mcp.json` globalmente:
```json
{
  "mcpServers": {
    "codi-api-mcp": {
      "command": "npx",
      "args": ["codi-api-mcp"]
    }
  }
}
```

**Windsurf** — agrega a `~/.codeium/windsurf/mcp_config.json`:
```json
{
  "mcpServers": {
    "codi-api-mcp": {
      "command": "npx",
      "args": ["codi-api-mcp"]
    }
  }
}
```

**Claude Desktop** — agrega a tu archivo de configuración y reinicia:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "codi-api-mcp": {
      "command": "npx",
      "args": ["codi-api-mcp"]
    }
  }
}
```

**Requisito previo:** Node.js 18 o superior.

---

## Claude Code — Opciones de Alcance

Por defecto, `claude mcp add` registra el servidor solo para el proyecto actual. Para tenerlo disponible en todos tus proyectos:

```bash
# Disponible en todos los proyectos (recomendado para uso personal)
claude mcp add --scope user codi-api-mcp -- npx codi-api-mcp

# Solo el proyecto actual (guardado en la carpeta .claude/)
claude mcp add codi-api-mcp -- npx codi-api-mcp

# Compartido con el equipo vía git (guardado en .mcp.json en la raíz del proyecto)
claude mcp add --scope project codi-api-mcp -- npx codi-api-mcp
```

---

## Qué Puedes Preguntar

Después de instalar, puedes hacerle preguntas sobre el API de CoDi directamente a tu asistente de IA:

**Reglas de campos:**
> ¿Qué campos requiere el endpoint de pago QR de CoDi?

El asistente listará los cuatro campos (`monto`, `referenciaNumerica`, `concepto`, `vigencia`) con sus tipos exactos, rangos y reglas de validación.

**Formato de campos específicos:**
> ¿Cómo debo formatear el campo vigencia para que expire en 1 hora?

```
Establece vigencia como la hora actual en milisegundos más 3,600,000:

JavaScript:  Date.now() + 60 * 60 * 1000
Python:      int(time.time() * 1000) + 60 * 60 * 1000

Debe ser milisegundos, no segundos. El API rechaza valores
menores a 10,000,000,000 con: "Vigencia must be a millisecond timestamp."
```

**Códigos de error:**
> ¿Qué significa edoPet -3?

```
edoPet -3 = parámetros de entrada inválidos. La solicitud llegó a Banxico
pero fue rechazada porque un campo estaba fuera de rango o en formato incorrecto.
Regresa dentro de una respuesta 200 OK con edoPet: -3 en el cuerpo.
```

**Generar código de integración:**
> Genera una llamada fetch() en JavaScript para crear un pago QR de CoDi por 500 pesos.

El asistente produce una función completa y correcta con el header `x-api-key`, todos los campos requeridos con sus tipos correctos, `vigencia` como timestamp en milisegundos, y manejo de errores para todos los códigos `edoPet`.

**Scaffolding completo de integración (prompts):**
> Usa el prompt integrate_qr_payment para Python con requests

Genera un módulo Python completo con anotaciones de tipos para cada campo, la solicitud HTTP POST, parseo de respuesta, manejo de errores `edoPet`, y un ejemplo de uso.

**Otras preguntas útiles:**
```
¿Cuál es la diferencia entre edoPet y edoMC?
¿Qué significa resultado -8 en la respuesta del webhook?
¿Cómo funciona la paginación en el endpoint de consulta?
¿Qué caracteres están permitidos en el campo concepto?
Genera un webhook handler en Go para los callbacks de resultadoOperaciones de CoDi.
Genera una función de polling en TypeScript que espere a que un pago CoDi sea aprobado.
```

---

## Recursos Disponibles

Los recursos son bloques de documentación que el asistente de IA lee como contexto.

| URI del Recurso | Descripción |
|---|---|
| `codi://docs/authentication` | Formato de API key (hex de 128 chars), header `x-api-key`, entornos |
| `codi://docs/qr` | Endpoint QR: todos los campos, tipos, reglas de validación, request/response |
| `codi://docs/push` | Endpoint Push: todos los campos incluyendo `celularCliente` |
| `codi://docs/consulta` | Endpoint de consulta: `folioCodi`, paginación, filtros de fecha, respuesta |
| `codi://docs/webhook` | Campos del payload del webhook, respuesta requerida `{ resultado: 0 }` |
| `codi://docs/errors` | Todos los códigos de error: `edoPet`, `edoMC`, `resultado`, HTTP |

## Prompts Disponibles

Los prompts son iniciadores de conversación prediseñados para generación de código. Cada uno acepta los argumentos `language` (lenguaje) y `framework`.

| Prompt | Qué genera |
|---|---|
| `integrate_qr_payment` | Integración completa de pago QR con tipos de campo, request, visualización del QR, manejo de errores |
| `integrate_push_payment` | Integración completa de pago Push con tipos de campo, request, manejo del folioCodi |
| `handle_webhook` | Handler de webhook con patrón de respuesta rápida, validación, lógica de negocio asíncrona |
| `check_payment_status` | Polling de estado con mapeo de edoMC, ciclo de polling, paginación |

---

## Licencia

Apache-2.0
