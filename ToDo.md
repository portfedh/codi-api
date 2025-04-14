# ToDo

- Seguir documentación para checks de envío: string o int
- Postman test para resultadoOperaciones
- Add unit tests to all code
- Update descriptions
- Update swagger
- Update unit tests
- Hacer una cédula de resultados
- Health check endpoints
- Blue green deployment

## Efficiency Measures

- Index database tables: Speed up queries

## Security Measures

- Usar HTTPS para comunicarse con todo el API
- Rate limiting
- IP banning
- Encryption at rest
- Extensive Logging / monitoring
- Use .htaccess or equivalent server rules to block access to hidden files (e.g., .env, .git).
- Use a Web Application Firewall (WAF) to block malicious requests.
- Block IPs or ranges that are repeatedly attempting unauthorized access.
- Set up alerts for repeated 403/404 errors or suspicious patterns in logs.
- Regularly update your dependencies to patch known vulnerabilities.
- Use tools like fail2ban to automatically block IPs with repeated failed attempts.
- Perform a penetration test or vulnerability scan using tools like OWASP ZAP or Nessus.
- Backup and Disaster Recovery
  Regularly back up your application and database.
  Test your disaster recovery plan to ensure you can restore services quickly.
  - Use a Content Delivery Network (CDN) like Cloudflare to filter malicious traffic before it reaches your server.

## Future: Key management Options

Option: Store API key en KMS:

- HashiCorp Vault (Community Edition)
- CyberArk Conjur Open Source
- AWS Key Management Service (KMS)
- Google Cloud KMS

## Notes

Checar que hacen los folders de logs y de coverage
