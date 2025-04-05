# ToDo

- Implementar en produccion
- Arreglar firma de resultado operaciones
- poner d = {} ?
- Hacer una cédula de resultados
- Tratar un URL de Banco de Mexico y si tarda, intentar en la utl secundaria
- Add unit tests to all code
- Update descriptions
- Update swagger
- Update unit tests

## Efficiency Measures

- Index database tables: Speed up queries

## Security Measures

- Usar HTTPS para comunicarse con todo el API
- Rate limiting
- Extensive Logging / monitoring
- Create website api key and url endpoint for quick rotation

## Future: Key management Options

Option: Store API key en KMS:

- HashiCorp Vault (Community Edition)
- CyberArk Conjur Open Source
- AWS Key Management Service (KMS)
- Google Cloud KMS
