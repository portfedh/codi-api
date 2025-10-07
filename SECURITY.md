# Security Policy

## Overview

The CoDi API handles sensitive financial transactions and payment data. We take security seriously and appreciate the security community's efforts to responsibly disclose vulnerabilities.

This document outlines our security policy, how to report vulnerabilities, and what to expect from our security response process.

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          | Status |
| ------- | ------------------ | ------ |
| 2.x     | :white_check_mark: | Current release, actively maintained |
| 1.x     | :x:                | No longer supported |

**Recommendation**: Always use the latest stable version to ensure you have the most recent security patches.

## Security Features

The CoDi API implements multiple layers of security:

- **Digital Signature Verification**: RSA certificate-based authentication with Banxico
- **API Key Authentication**: 128-character hexadecimal keys stored securely in Supabase
- **Request Sanitization**: Protection against SQL injection and XSS attacks
- **Rate Limiting**: 200 requests per 15 minutes per IP address
- **CORS Protection**: Strict origin validation
- **Security Headers**: Helmet.js implementation (XSS, CSP, HSTS, etc.)
- **Certificate Validation**: Comparison of developer and Banxico certificates
- **Audit Logging**: Complete request/response logging to Supabase
- **Hidden File Protection**: Blocks access to sensitive files (.env, .git, etc.)

## Reporting a Vulnerability

**We strongly encourage responsible disclosure of security vulnerabilities.**

### How to Report

If you discover a security vulnerability, please follow these steps:

1. **DO NOT** open a public GitHub issue
2. **DO NOT** disclose the vulnerability publicly until it has been addressed
3. **DO** contact the maintainer privately:
   - GitHub: [@portfedh](https://github.com/portfedh) (use private vulnerability reporting or contact via profile)
   - Or open a **private security advisory** at: https://github.com/portfedh/codi-api/security/advisories/new

### What to Include in Your Report

Please provide as much information as possible to help us understand and reproduce the issue:

```
Subject: [SECURITY] Brief description of the vulnerability

**Vulnerability Type:**
(e.g., SQL Injection, XSS, Authentication Bypass, etc.)

**Affected Component:**
(e.g., /v2/codi/qr endpoint, API key validation, etc.)

**Severity Assessment:**
(e.g., Critical, High, Medium, Low)

**Description:**
Detailed description of the vulnerability

**Steps to Reproduce:**
1. Step one
2. Step two
3. etc.

**Proof of Concept:**
(Code, screenshots, or detailed explanation)

**Impact:**
What could an attacker do with this vulnerability?

**Suggested Fix:**
(Optional, but appreciated)

**Your Contact Information:**
Name/Pseudonym:
Email:
Security Researcher Profile (optional):
```

### Example Report

```
Subject: [SECURITY] API Key Bypass in QR Endpoint

**Vulnerability Type:** Authentication Bypass

**Affected Component:** /v2/codi/qr endpoint

**Severity Assessment:** Critical

**Description:**
The QR payment endpoint can be accessed without proper API key validation
when a specific header combination is used.

**Steps to Reproduce:**
1. Send POST request to /v2/codi/qr
2. Include header: X-Forwarded-For: 127.0.0.1
3. Omit x-api-key header
4. Request is processed without authentication

**Impact:**
Attackers could generate unlimited CoDi payment requests without authorization,
potentially causing financial fraud.

**Your Contact Information:**
Name: John Security
Email: john@securityresearch.com
```

## Response Process

### What to Expect

1. **Acknowledgment**: We will acknowledge receipt of your report within **48 hours**
2. **Initial Assessment**: We will provide an initial assessment within **5 business days**
3. **Investigation**: We will investigate and reproduce the issue
4. **Resolution**: We will develop and test a fix
5. **Disclosure**: We will coordinate disclosure timing with you
6. **Credit**: We will acknowledge your contribution (unless you prefer to remain anonymous)

### Timeline Expectations

| Severity | Initial Response | Fix Target | Disclosure |
|----------|-----------------|------------|------------|
| Critical | 24 hours        | 7 days     | After fix is deployed |
| High     | 48 hours        | 14 days    | After fix is deployed |
| Medium   | 5 days          | 30 days    | After fix is deployed |
| Low      | 7 days          | 60 days    | After fix is deployed |

**Note**: Timelines are targets and may vary based on complexity. We will keep you informed throughout the process.

## Vulnerability Severity Guidelines

We use the following criteria to assess severity:

### Critical
- Remote code execution
- Authentication bypass allowing admin access
- SQL injection leading to data exfiltration
- Exposure of private keys or certificates
- Payment fraud vulnerabilities

### High
- Cross-site scripting (XSS) in sensitive contexts
- API key leakage
- Unauthorized access to customer data
- Certificate validation bypass

### Medium
- Information disclosure of non-sensitive data
- Denial of Service (DoS) vulnerabilities
- CORS misconfiguration
- Rate limiting bypass

### Low
- Minor information leakage
- Best practice violations
- Non-exploitable edge cases

## Security Best Practices for Users

To ensure the security of your CoDi API deployment:

### Environment & Configuration
- [ ] Never commit `.env` files to version control
- [ ] Use environment variables in production (not `.env` files)
- [ ] Store certificates securely (use secret managers in production)
- [ ] Rotate API keys regularly (every 90 days minimum)
- [ ] Use separate certificates for Beta and Production environments
- [ ] Keep Node.js and dependencies updated: `npm audit fix`

### Network Security
- [ ] Always use HTTPS in production
- [ ] Configure CORS to allow only trusted origins
- [ ] Use a reverse proxy (nginx, Cloudflare, etc.)
- [ ] Implement DDoS protection
- [ ] Enable firewall rules to restrict access

### Monitoring & Logging
- [ ] Monitor rate limit violations
- [ ] Review access logs regularly: `pm2 logs codi-api`
- [ ] Set up alerts for suspicious activity
- [ ] Monitor Supabase for unusual query patterns
- [ ] Track failed authentication attempts

### Access Control
- [ ] Use separate Supabase projects for development and production
- [ ] Restrict Supabase service role key usage
- [ ] Implement IP whitelisting where possible
- [ ] Use least-privilege principle for database access

### Webhook Security
- [ ] Validate all webhook signatures from Banxico
- [ ] Use HTTPS endpoints for webhooks
- [ ] Verify request origin
- [ ] Implement idempotency for payment processing

## Security Updates

Security updates will be:
- Released as patch versions (e.g., 2.0.1 → 2.0.2)
- Documented in release notes
- Announced via GitHub releases
- Tagged with `security` label

Subscribe to repository releases to receive notifications:
```
Watch → Custom → Releases
```

## Known Security Considerations

### Digital Certificates
- **Expiration**: Monitor certificate expiration dates
- **Storage**: Never store certificates in code or version control
- **Passphrase**: Use strong passphrases for private keys
- **Renewal**: Plan certificate renewal 30 days before expiration

### API Keys
- **Length**: 128 characters minimum (hexadecimal)
- **Storage**: Store only hashed keys in database (current implementation stores plaintext)
- **Transmission**: Always use HTTPS
- **Rotation**: Implement key rotation policy

### Supabase Security
- **Anon Key**: Safe to expose (limited permissions)
- **Service Role Key**: NEVER expose in client code
- **RLS Policies**: Implement Row Level Security policies
- **Backups**: Enable point-in-time recovery

## Compliance & Standards

This project follows:
- **OWASP Top 10**: Web application security risks
- **PCI DSS**: Payment card industry security standards (where applicable)
- **Mexican Data Protection Law**: Ley Federal de Protección de Datos Personales

## Bug Bounty Program

Currently, we do not offer a paid bug bounty program. However:
- We deeply appreciate security research contributions
- We will acknowledge your work in release notes and README
- We may offer recognition on our contributors page

## Out of Scope

The following are considered out of scope:
- Denial of Service (DoS/DDoS) attacks
- Social engineering attacks
- Physical security attacks
- Issues in third-party dependencies (report to the respective project)
- Issues requiring highly unlikely user interaction
- Rate limiting issues that don't lead to other vulnerabilities

## Security Hall of Fame

We acknowledge security researchers who have responsibly disclosed vulnerabilities:

*No vulnerabilities have been reported yet.*

---

## Questions?

If you have questions about this security policy, please:
- Open a general discussion on GitHub (for non-sensitive questions)
- Email the maintainer for sensitive inquiries
- Refer to our [Contributing Guidelines](CONTRIBUTING.md)

## Related Documentation

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Apache License 2.0](LICENSE)

---

**Thank you for helping keep CoDi API and the Mexican fintech community secure!**
