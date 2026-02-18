export const consultaResource = {
  name: "consulta",
  uri: "codi://docs/consulta",
  description: "CoDi payment status query endpoint: fields, pagination, date rules, and response format",
  text: `# CoDi Payment Status Query Endpoint

## Endpoint

  Method:  POST
  Path:    /v2/codi/consulta
  Auth:    x-api-key header required

## Description

Retrieves the status and details of one or more CoDi payment operations.
Banxico validates that the folioCodi was created by the requesting API key —
you cannot query operations belonging to other accounts.

## Request Body (JSON)

All five fields are required.

### folioCodi

- Type: string
- Description: The CoDi operation reference number to query
- Length: exactly 10 or 20 characters
- Obtained from: the folioCodi field in a push response, or embedded in the QR cadenaMC
- Examples: "1234567890", "321e210838321e210838"

### tpg

- Type: number or numeric string
- Description: Number of results per page (page size)
- Range: 1 to 100
- Use 10 or 20 for typical pagination
- Examples: 10, 20, 100

### npg

- Type: number or numeric string
- Description: Page number to retrieve (1-based)
- Range: 1 to 2147483647
- Start with 1, increment if ultPag is false in the response
- Examples: 1, 2, 3

### fechaInicial

- Type: string or number
- Description: Start date for the query period
- Special value: "0" — no start date restriction (query all dates)
- Format: YYYYMMDD (8 digits, no separators)
- Time: query starts from 00:00:00.000 on this date
- Must be a valid calendar date
- Examples: "20250101", "20240315", "0"

### fechaFinal

- Type: string or number
- Description: End date for the query period
- Special value: "0" — query entire history up to today
- Format: YYYYMMDD (8 digits, no separators)
- Time: query ends at 23:59:59.999 on this date
- Constraints:
    - Must be a valid calendar date
    - Must be >= fechaInicial (unless fechaInicial is "0")
    - Cannot be in the future
- Examples: "20250131", "20240315", "0"

## Request Example

\`\`\`json
{
  "folioCodi": "321e210838321e210838",
  "tpg": 10,
  "npg": 1,
  "fechaInicial": "20250101",
  "fechaFinal": "0"
}
\`\`\`

## Request Example (Query All History)

\`\`\`json
{
  "folioCodi": "321e210838321e210838",
  "tpg": 100,
  "npg": 1,
  "fechaInicial": "0",
  "fechaFinal": "0"
}
\`\`\`

## Response: 200 OK

\`\`\`json
{
  "success": true,
  "data": {
    "resultado": {
      "v": {
        "tipoCta": 40,
        "ctaBancaria": "997***********4710",
        "cveInstit": 40997,
        "nombre": "S*************** S* D* C*"
      },
      "lstDetalleMC": [
        {
          "folioCodi": "321e210838321e210838",
          "concepto": "Pago de servicio",
          "monto": "499.0",
          "refNum": 1000009,
          "tProc": 0,
          "tSolicitud": 1743120493234,
          "edoMC": -1,
          "c": {
            "tipoCta": 0,
            "cveInstit": 0
          }
        }
      ]
    },
    "ultPag": true,
    "crtBdeM": "00000100000100015974",
    "selloDigital": "qtSVpfEUgp2TuLUJ...",
    "epoch": 1743222437146,
    "edoPet": 0
  }
}
\`\`\`

### Response Fields

- success: true if the query completed successfully.
- data.resultado.v: Merchant account information (partially masked).
  - tipoCta: Account type code.
  - ctaBancaria: Masked bank account number.
  - cveInstit: Institution code.
  - nombre: Masked account holder name.
- data.resultado.lstDetalleMC: Array of transaction detail objects.
  - folioCodi: The operation folio identifier.
  - concepto: Payment description.
  - monto: Amount as string (e.g., "499.0").
  - refNum: Numeric reference from the original request.
  - tProc: Processing type (0 = QR, 1 = Push).
  - tSolicitud: Request timestamp in milliseconds.
  - edoMC: Transaction status (see edoMC values below).
  - c: Payer account details (may be zeroed if pending).
- data.ultPag: true if this is the last page of results; false if more pages exist.
- data.edoPet: Request status code (see Errors documentation).

### edoMC Values (Transaction Status)

 -1:  Pending — payer has not yet responded
  0:  Approved — payer accepted and payment processed
  1:  Rejected — payer declined or payment failed

### edoPet Values

  0:  Success
 -1:  Error — missing information
 -2:  Error — processing error
 -3:  Error — invalid input
 -4:  Error — invalid signature

## Pagination

If data.ultPag is false, there are more results. Increment npg and repeat the request.

\`\`\`
npg = 1 → get first page
if ultPag == false → npg = 2 → get second page
if ultPag == false → npg = 3 → ...and so on
\`\`\`

## Response: 400 Bad Request

\`\`\`json
{
  "message": "Validation Error: Invalid input data.",
  "errors": [
    {
      "field": "folioCodi",
      "message": "FolioCodi must be 10 or 20 characters long"
    }
  ]
}
\`\`\`
`,
};
