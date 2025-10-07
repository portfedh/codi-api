# Política de Seguridad

## Resumen

La API CoDi maneja transacciones financieras sensibles y datos de pago. Tomamos la seguridad en serio y apreciamos los esfuerzos de la comunidad de seguridad para divulgar vulnerabilidades de manera responsable.

Este documento describe nuestra política de seguridad, cómo reportar vulnerabilidades y qué esperar de nuestro proceso de respuesta de seguridad.

## Versiones Soportadas

Proporcionamos actualizaciones de seguridad para las siguientes versiones:

| Versión | Soportada          | Estado |
| ------- | ------------------ | ------ |
| 2.x     | :white_check_mark: | Versión actual, mantenida activamente |
| 1.x     | :x:                | Ya no está soportada |

**Recomendación**: Siempre use la última versión estable para asegurarse de tener los parches de seguridad más recientes.

## Características de Seguridad

La API CoDi implementa múltiples capas de seguridad:

- **Verificación de Firma Digital**: Autenticación basada en certificados RSA con Banxico
- **Autenticación con API Key**: Claves hexadecimales de 128 caracteres almacenadas de forma segura en Supabase
- **Sanitización de Solicitudes**: Protección contra ataques de inyección SQL y XSS
- **Limitación de Tasa**: 200 solicitudes por 15 minutos por dirección IP
- **Protección CORS**: Validación estricta de origen
- **Cabeceras de Seguridad**: Implementación de Helmet.js (XSS, CSP, HSTS, etc.)
- **Validación de Certificados**: Comparación de certificados de desarrollador y Banxico
- **Registro de Auditoría**: Registro completo de solicitudes/respuestas en Supabase
- **Protección de Archivos Ocultos**: Bloquea acceso a archivos sensibles (.env, .git, etc.)

## Reportar una Vulnerabilidad

**Fomentamos encarecidamente la divulgación responsable de vulnerabilidades de seguridad.**

### Cómo Reportar

Si descubre una vulnerabilidad de seguridad, por favor siga estos pasos:

1. **NO** abra un issue público en GitHub
2. **NO** divulgue la vulnerabilidad públicamente hasta que haya sido abordada
3. **SÍ** contacte al mantenedor de forma privada:
   - GitHub: [@portfedh](https://github.com/portfedh) (use reporte privado de vulnerabilidades o contacte vía perfil)
   - O abra un **aviso de seguridad privado** en: https://github.com/portfedh/codi-api/security/advisories/new

### Qué Incluir en su Reporte

Por favor proporcione tanta información como sea posible para ayudarnos a entender y reproducir el problema:

```
Asunto: [SEGURIDAD] Breve descripción de la vulnerabilidad

**Tipo de Vulnerabilidad:**
(ej., Inyección SQL, XSS, Evasión de Autenticación, etc.)

**Componente Afectado:**
(ej., endpoint /v2/codi/qr, validación de API key, etc.)

**Evaluación de Gravedad:**
(ej., Crítica, Alta, Media, Baja)

**Descripción:**
Descripción detallada de la vulnerabilidad

**Pasos para Reproducir:**
1. Paso uno
2. Paso dos
3. etc.

**Prueba de Concepto:**
(Código, capturas de pantalla o explicación detallada)

**Impacto:**
¿Qué podría hacer un atacante con esta vulnerabilidad?

**Corrección Sugerida:**
(Opcional, pero apreciada)

**Su Información de Contacto:**
Nombre/Seudónimo:
Email:
Perfil de Investigador de Seguridad (opcional):
```

### Ejemplo de Reporte

```
Asunto: [SEGURIDAD] Evasión de API Key en Endpoint QR

**Tipo de Vulnerabilidad:** Evasión de Autenticación

**Componente Afectado:** endpoint /v2/codi/qr

**Evaluación de Gravedad:** Crítica

**Descripción:**
El endpoint de pago QR puede ser accedido sin validación adecuada de API key
cuando se usa una combinación específica de encabezados.

**Pasos para Reproducir:**
1. Enviar solicitud POST a /v2/codi/qr
2. Incluir encabezado: X-Forwarded-For: 127.0.0.1
3. Omitir encabezado x-api-key
4. La solicitud se procesa sin autenticación

**Impacto:**
Los atacantes podrían generar solicitudes de pago CoDi ilimitadas sin autorización,
causando potencialmente fraude financiero.

**Su Información de Contacto:**
Nombre: Juan Seguridad
Email: juan@investigacionseguridad.com
```

## Proceso de Respuesta

### Qué Esperar

1. **Reconocimiento**: Reconoceremos la recepción de su reporte dentro de **48 horas**
2. **Evaluación Inicial**: Proporcionaremos una evaluación inicial dentro de **5 días hábiles**
3. **Investigación**: Investigaremos y reproduciremos el problema
4. **Resolución**: Desarrollaremos y probaremos una corrección
5. **Divulgación**: Coordinaremos el tiempo de divulgación con usted
6. **Crédito**: Reconoceremos su contribución (a menos que prefiera permanecer anónimo)

### Expectativas de Tiempo

| Gravedad | Respuesta Inicial | Objetivo de Corrección | Divulgación |
|----------|------------------|------------------------|-------------|
| Crítica  | 24 horas         | 7 días                 | Después de implementar la corrección |
| Alta     | 48 horas         | 14 días                | Después de implementar la corrección |
| Media    | 5 días           | 30 días                | Después de implementar la corrección |
| Baja     | 7 días           | 60 días                | Después de implementar la corrección |

**Nota**: Los plazos son objetivos y pueden variar según la complejidad. Lo mantendremos informado durante todo el proceso.

## Guías de Gravedad de Vulnerabilidades

Usamos los siguientes criterios para evaluar la gravedad:

### Crítica
- Ejecución remota de código
- Evasión de autenticación que permite acceso de administrador
- Inyección SQL que conduce a exfiltración de datos
- Exposición de claves privadas o certificados
- Vulnerabilidades de fraude de pago

### Alta
- Cross-site scripting (XSS) en contextos sensibles
- Fuga de API key
- Acceso no autorizado a datos de clientes
- Evasión de validación de certificados

### Media
- Divulgación de información de datos no sensibles
- Vulnerabilidades de Denegación de Servicio (DoS)
- Mala configuración de CORS
- Evasión de limitación de tasa

### Baja
- Fuga menor de información
- Violaciones de mejores prácticas
- Casos extremos no explotables

## Mejores Prácticas de Seguridad para Usuarios

Para asegurar la seguridad de su implementación de la API CoDi:

### Entorno y Configuración
- [ ] Nunca haga commit de archivos `.env` en control de versiones
- [ ] Use variables de entorno en producción (no archivos `.env`)
- [ ] Almacene certificados de forma segura (use administradores de secretos en producción)
- [ ] Rote las API keys regularmente (cada 90 días mínimo)
- [ ] Use certificados separados para entornos Beta y Producción
- [ ] Mantenga Node.js y las dependencias actualizadas: `npm audit fix`

### Seguridad de Red
- [ ] Siempre use HTTPS en producción
- [ ] Configure CORS para permitir solo orígenes confiables
- [ ] Use un proxy reverso (nginx, Cloudflare, etc.)
- [ ] Implemente protección DDoS
- [ ] Habilite reglas de firewall para restringir acceso

### Monitoreo y Registro
- [ ] Monitoree violaciones de límite de tasa
- [ ] Revise los logs de acceso regularmente: `pm2 logs codi-api`
- [ ] Configure alertas para actividad sospechosa
- [ ] Monitoree Supabase para patrones de consulta inusuales
- [ ] Rastree intentos de autenticación fallidos

### Control de Acceso
- [ ] Use proyectos Supabase separados para desarrollo y producción
- [ ] Restrinja el uso de la clave de rol de servicio de Supabase
- [ ] Implemente lista blanca de IP cuando sea posible
- [ ] Use el principio de menor privilegio para acceso a base de datos

### Seguridad de Webhook
- [ ] Valide todas las firmas de webhook de Banxico
- [ ] Use endpoints HTTPS para webhooks
- [ ] Verifique el origen de la solicitud
- [ ] Implemente idempotencia para procesamiento de pagos

## Actualizaciones de Seguridad

Las actualizaciones de seguridad serán:
- Lanzadas como versiones de parche (ej., 2.0.1 → 2.0.2)
- Documentadas en notas de lanzamiento
- Anunciadas vía lanzamientos de GitHub
- Etiquetadas con etiqueta `security`

Suscríbase a los lanzamientos del repositorio para recibir notificaciones:
```
Watch → Custom → Releases
```

## Consideraciones de Seguridad Conocidas

### Certificados Digitales
- **Expiración**: Monitoree las fechas de expiración de certificados
- **Almacenamiento**: Nunca almacene certificados en código o control de versiones
- **Frase de contraseña**: Use frases de contraseña fuertes para claves privadas
- **Renovación**: Planifique la renovación de certificados 30 días antes de la expiración

### API Keys
- **Longitud**: 128 caracteres mínimo (hexadecimal)
- **Almacenamiento**: Almacene solo claves hasheadas en la base de datos (implementación actual almacena texto plano)
- **Transmisión**: Siempre use HTTPS
- **Rotación**: Implemente política de rotación de claves

### Seguridad de Supabase
- **Anon Key**: Segura de exponer (permisos limitados)
- **Service Role Key**: NUNCA exponga en código de cliente
- **Políticas RLS**: Implemente políticas de Row Level Security
- **Respaldos**: Habilite recuperación point-in-time

## Cumplimiento y Estándares

Este proyecto sigue:
- **OWASP Top 10**: Riesgos de seguridad de aplicaciones web
- **PCI DSS**: Estándares de seguridad de la industria de tarjetas de pago (donde aplique)
- **Ley Mexicana de Protección de Datos**: Ley Federal de Protección de Datos Personales

## Programa de Recompensas por Bugs

Actualmente, no ofrecemos un programa de recompensas por bugs pagado. Sin embargo:
- Apreciamos profundamente las contribuciones de investigación de seguridad
- Reconoceremos su trabajo en las notas de lanzamiento y README
- Podemos ofrecer reconocimiento en nuestra página de contribuyentes

## Fuera de Alcance

Lo siguiente se considera fuera de alcance:
- Ataques de Denegación de Servicio (DoS/DDoS)
- Ataques de ingeniería social
- Ataques de seguridad física
- Problemas en dependencias de terceros (repórtelos al proyecto respectivo)
- Problemas que requieren interacción de usuario altamente improbable
- Problemas de limitación de tasa que no conducen a otras vulnerabilidades

## Salón de la Fama de Seguridad

Reconocemos a los investigadores de seguridad que han divulgado vulnerabilidades de manera responsable:

*Aún no se han reportado vulnerabilidades.*

---

## ¿Preguntas?

Si tiene preguntas sobre esta política de seguridad, por favor:
- Abra una discusión general en GitHub (para preguntas no sensibles)
- Envíe un email al mantenedor para consultas sensibles
- Consulte nuestras [Guías de Contribución](CONTRIBUTING.es.md)

## Documentación Relacionada

- [Código de Conducta](CODE_OF_CONDUCT.es.md)
- [Guías de Contribución](CONTRIBUTING.es.md)
- [Licencia Apache 2.0](LICENSE.es.md)

---

**¡Gracias por ayudar a mantener segura la API CoDi y la comunidad fintech mexicana!**
