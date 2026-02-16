# API Validation Rules Reference

This document summarizes every field, accepted data type, and validation rule enforced by the CoDi API.

> **Last updated:** 2026-02-08

---

## Authentication (All Endpoints)

All endpoints except `/v2/health` and `/v2/resultadoOperaciones` require an API key.

| Detail | Value |
|---|---|
| **Header name** | `x-api-key` |
| **Type** | String |
| **Format** | 128-character hexadecimal (`[0-9a-f]{128}`) |
| **Required** | Yes |
| **Error if missing** | `401 — "API Key missing"` |
| **Error if invalid** | `401 — "Invalid API Key"` |

---

## Endpoint: POST `/v2/codi/qr`

Generates a CoDi QR payment code.

### Request Body Fields

| Field | Type | Required | Rules | Default | Example |
|---|---|---|---|---|---|
| `monto` | Number or String | Yes | See details below | — | `99.03` |
| `referenciaNumerica` | Number or String | Yes | See details below | `"0"` if empty | `"1234567"` |
| `concepto` | String | Yes | See details below | — | `"Pago de servicio"` |
| `vigencia` | Number or String | Yes | See details below | — | `"0"` |

#### `monto`

| Rule | Detail |
|---|---|
| Cannot be empty | Required field |
| Must be numeric | Accepts number (`99.03`) or numeric string (`"99.03"`) |
| Decimal places | Maximum 2 decimal places |
| Minimum value | `0` (zero means the payer defines the amount) |
| Maximum value | `999,999,999,999.99` |
| Pattern | `/^\d+(\.\d{1,2})?$/` |

#### `referenciaNumerica`

| Rule | Detail |
|---|---|
| Can be empty | Empty string is converted to `"0"` automatically |
| Digits only | Only characters `0-9` are allowed. **No letters.** |
| Maximum length | 7 digits |
| Accepts Number type | `1234567` (number) is valid |
| Pattern | `/^[0-9]{1,7}$/` |

#### `concepto`

| Rule | Detail |
|---|---|
| Must be a string | Number type is rejected |
| Cannot be empty | Minimum length: 1 character |
| Maximum length | 40 characters |
| Allowed characters | Only characters from Banxico Anexo G (see table below) |

#### `vigencia`

| Rule | Detail |
|---|---|
| Cannot be empty | Required field |
| Zero is valid | `"0"` or `0` means no expiration |
| Must be numeric | Only digits, no letters or special characters |
| Maximum length | 15 digits |
| **Must be milliseconds** | Unix timestamp in **milliseconds** (not seconds). Values below `10,000,000,000` are rejected with a helpful error message. |
| Must be in the future | Past timestamps are rejected |
| Maximum | Cannot exceed 1 year from the current time |
| Accepts Number type | `1738356308372` (number) is valid |

---

## Endpoint: POST `/v2/codi/push`

Sends a CoDi push payment notification to a mobile phone.

### Request Body Fields

| Field | Type | Required | Rules | Default | Example |
|---|---|---|---|---|---|
| `celularCliente` | Number or String | Yes | See details below | — | `"5512345678"` |
| `monto` | Number or String | Yes | Same as QR endpoint | — | `99.03` |
| `referenciaNumerica` | Number or String | Yes | Same as QR endpoint | `"0"` if empty | `"1234567"` |
| `concepto` | String | Yes | Same as QR endpoint | — | `"Pago de servicio"` |
| `vigencia` | Number or String | Yes | Same as QR endpoint | — | `"0"` |

#### `celularCliente`

| Rule | Detail |
|---|---|
| Cannot be empty | Required field |
| Exactly 10 digits | Must contain exactly 10 numeric digits |
| Digits only | No letters, spaces, dashes, or country codes |
| Accepts Number type | `5512345678` (number) is valid |
| Pattern | `/^\d{10}$/` |

---

## Endpoint: POST `/v2/codi/consulta`

Queries the status of a previously created CoDi payment.

### Request Body Fields

| Field | Type | Required | Rules | Default | Example |
|---|---|---|---|---|---|
| `folioCodi` | String | Yes | See details below | — | `"321e210838"` |
| `tpg` | Number or String | Yes | See details below | — | `10` |
| `npg` | Number or String | Yes | See details below | — | `1` |
| `fechaInicial` | Number or String | Yes | See details below | — | `"20250101"` |
| `fechaFinal` | Number or String | Yes | See details below | — | `"0"` |

#### `folioCodi`

| Rule | Detail |
|---|---|
| Must be a string | Number type is rejected |
| Cannot be empty | Required field |
| Length | Must be exactly 10 characters (QR) or exactly 20 characters (Push) |

#### `tpg` (page size)

| Rule | Detail |
|---|---|
| Cannot be empty | Required field |
| Minimum value | `1` |
| Maximum value | `100` |
| Accepts Number or String | `10` or `"10"` are both valid |

#### `npg` (page number)

| Rule | Detail |
|---|---|
| Cannot be empty | Required field |
| Minimum value | `1` |
| Maximum value | `2,147,483,647` |
| Accepts Number or String | `1` or `"1"` are both valid |

#### `fechaInicial`

| Rule | Detail |
|---|---|
| Cannot be empty | Required field |
| Zero is valid | `"0"` or `0` means no start date restriction (query all history) |
| Format | `YYYYMMDD` (8 digits) |
| Must be a valid date | Invalid dates like `20231301` (month 13) are rejected |
| Accepts Number type | `20250101` (number) is valid |

#### `fechaFinal`

| Rule | Detail |
|---|---|
| Cannot be empty | Required field |
| Zero is valid | `"0"` or `0` means no end date restriction (query all history) |
| Format | `YYYYMMDD` (8 digits) |
| Must be a valid date | Invalid dates are rejected |
| Must be >= `fechaInicial` | Cannot be earlier than the start date |
| Must not be in the future | Cannot be later than today |
| Accepts Number type | `20250201` (number) is valid |

---

## Endpoint: POST `/v2/resultadoOperaciones`

Webhook for receiving payment result callbacks from Banxico. No API key required.

This endpoint does not validate incoming request bodies with express-validator rules. The controller validates the Banxico response internally using signature verification and field checks.

---

## Endpoint: GET `/v2/health`

System health check. No authentication or request body required.

---

## Valid Characters for `concepto` (Banxico Anexo G)

The `concepto` field only accepts the following characters:

### Standard ASCII

| Characters | Description |
|---|---|
| `A-Z` | Uppercase letters (A through Z) |
| `a-z` | Lowercase letters (a through z) |
| `0-9` | Digits (0 through 9) |
| ` ` (space) | Space character |
| `!` `"` `#` `$` `%` `&` `'` | Punctuation |
| `(` `)` `*` `+` `,` `-` `.` `/` | Punctuation |
| `:` `;` `?` `@` | Punctuation |
| `\` `_` | Backslash and underscore |

### Spanish Characters

| Character | Description |
|---|---|
| `a` | a with acute accent |
| `e` | e with acute accent |
| `i` | i with acute accent |
| `o` | o with acute accent |
| `u` | u with acute accent |
| `n` | n with tilde |
| `N` | N with tilde (uppercase) |
| `?` | Inverted question mark |
| `!` | Inverted exclamation mark |

---

## Error Response Format

When validation fails, the API returns HTTP `400` with the following structure:

```json
{
  "message": "Validation Error: Invalid input data.",
  "errors": [
    {
      "field": "monto",
      "message": "Monto must be a number between 0 and 999,999,999,999.99 with at most two decimal places"
    }
  ]
}
```

### Validation Error Messages Reference

#### QR and Push Endpoints

| Field | Error Message |
|---|---|
| `monto` (empty) | `"Monto cannot be empty"` |
| `monto` (not numeric) | `"Monto must be a numeric value"` |
| `monto` (out of range) | `"Monto must be a number between 0 and 999,999,999,999.99 with at most two decimal places"` |
| `referenciaNumerica` | `"ReferenciaNumerica must contain only digits (0-9) with a maximum length of 7"` |
| `concepto` (length) | `"Concepto must be a string with a minimum length of 1 and maximum length of 40 allowed ascii characters"` |
| `concepto` (chars) | `"Concepto contains invalid characters"` |
| `vigencia` (empty) | `"Vigencia cannot be empty"` |
| `vigencia` (non-numeric) | `"Vigencia must be '0' or a numeric value without any letters or special characters"` |
| `vigencia` (too long) | `"Vigencia numeric value cannot exceed 15 digits"` |
| `vigencia` (seconds) | `"Vigencia must be a millisecond timestamp (not seconds). Multiply by 1000 if needed"` |
| `vigencia` (past) | `"Vigencia timestamp must be in the future"` |
| `vigencia` (too far) | `"Vigencia timestamp cannot exceed one year from now"` |

#### Push Endpoint Only

| Field | Error Message |
|---|---|
| `celularCliente` (empty) | `"celularCliente cannot be empty"` |
| `celularCliente` (format) | `"CelularCliente must contain exactly 10 numeric digits"` |

#### Consulta Endpoint

| Field | Error Message |
|---|---|
| `folioCodi` (empty) | `"FolioCodi is required"` |
| `folioCodi` (length) | `"FolioCodi must be 10 or 20 characters long"` |
| `tpg` (empty) | `"tpg is required"` |
| `tpg` (range) | `"tpg must be a number between 1 and 100"` |
| `npg` (empty) | `"npg is required"` |
| `npg` (range) | `"npg must be a number between 1 and 2147483647"` |
| `fechaInicial` (empty) | `"fechaInicial is required"` |
| `fechaInicial` (format) | `"fechaInicial must be '0' or a valid date in YYYYMMDD format"` |
| `fechaFinal` (empty) | `"fechaFinal is required"` |
| `fechaFinal` (format) | `"fechaFinal must be '0' or a valid date in YYYYMMDD format"` |
| `fechaFinal` (logic) | `"fechaFinal must be after fechaInicial and not in the future"` |

---

## Quick Reference: Valid Request Examples

### QR Request

```json
{
  "monto": 499.50,
  "referenciaNumerica": "1234567",
  "concepto": "Pago mensual de servicio",
  "vigencia": "0"
}
```

### Push Request

```json
{
  "celularCliente": "5512345678",
  "monto": 499.50,
  "referenciaNumerica": "1234567",
  "concepto": "Pago mensual de servicio",
  "vigencia": "0"
}
```

### Consulta Request

```json
{
  "folioCodi": "321e210838321e210838",
  "tpg": 10,
  "npg": 1,
  "fechaInicial": "20250101",
  "fechaFinal": "0"
}
```
