# ToDo

- poner d = {} ?
- Hacer una cédula de resultados
- Error code handling
- Request validation
- IP de Banxico para CORS
- Cambiar fetch vs Axios
- Tratar un URL de Banxico y si no otra
- Añadir test de vigencia minima una vez establecida [ventana_vigencia]


- HashiCorp Vault (Community Edition)
- CyberArk Conjur Open Source
- AWS Key Management Service (KMS)
- Google Cloud KMS

### Plan para API Keys

Threats:

- Flooding attacks with valid api keys (DOS)
- Access to other endpoints to get data

Solution:

- Rate limiting
- Logging / monitoring
- Store API key en KMS
- Create website api key for quick rotation
