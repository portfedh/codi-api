# CoDi API

> Una API de código abierto en Node.js/Express para generar solicitudes de pago CoDi (Cobro Digital) a través de códigos QR y Notificaciones Push, integrándose con Banxico (Banco de México).

[![Licencia](https://img.shields.io/badge/Licencia-Apache%202.0-blue.svg)](LICENSE)
[![Versión Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Patrocinador GitHub](https://img.shields.io/badge/patrocinar-portfedh-ea4aaa?logo=github-sponsors)](https://github.com/sponsors/portfedh)

## Descripción General

CoDi API es una API REST lista para producción que permite a empresas mexicanas generar solicitudes de pago digital a través del sistema CoDi del Banco Central de México (Banxico). La API soporta dos métodos de pago:

- **Pagos con Código QR**: Genera códigos QR dinámicos para que los clientes escaneen y paguen
- **Notificaciones Push**: Envía solicitudes de pago directamente a las aplicaciones bancarias móviles de los clientes mediante número telefónico

### Características Principales

- ✅ **Autenticación con Firma Digital**: Autenticación basada en certificados RSA con Banxico
- ✅ **Soporte para Ambientes Duales**: Configuraciones separadas para Beta y Producción
- ✅ **Arquitectura de Respaldo**: Soporte para múltiples endpoints para alta disponibilidad
- ✅ **Gestión de API Keys**: Generación y validación segura de claves API mediante Supabase
- ✅ **Registro de Peticiones/Respuestas**: Auditoría completa de todas las transacciones
- ✅ **Soporte para Webhooks**: Recibe actualizaciones de estado de pago en tiempo real
- ✅ **Seguridad Reforzada**: Helmet, CORS, limitación de tasa, sanitización de peticiones
- ✅ **Documentación Interactiva de la API**: Documentación Swagger/OpenAPI
- ✅ **Pruebas Exhaustivas**: Suite de pruebas Jest con reportes de cobertura

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Configuración de Base de Datos](#configuración-de-base-de-datos)
- [Endpoints de la API](#endpoints-de-la-api)
- [Autenticación](#autenticación)
- [Certificados Digitales](#certificados-digitales)
- [Desarrollo](#desarrollo)
- [Pruebas](#pruebas)
- [Despliegue](#despliegue)
- [Seguridad](#seguridad)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Requisitos Previos

Antes de comenzar, asegúrate de tener lo siguiente:

### Requerido

- **Node.js** 18.x o superior
- **npm** 9.x o superior
- **Cuenta de Supabase**: Para gestión de base de datos y claves API ([supabase.com](https://supabase.com))
- **Cuenta de Desarrollador de Banxico**: Requerida para integración con CoDi
  - Aplica en: [Portal de Desarrolladores CoDi de Banxico](https://www.codi.org.mx/)
  - Recibirás:
    - Certificados digitales
    - Endpoints de API para ambientes Beta y Producción
    - Certificados públicos de Banxico
    - Para ambientes de prueba y producción

### Recomendado

- **PM2**: Para gestión de procesos en producción
- **Git**: Para control de versiones
- **Cliente PostgreSQL**: Para gestión de base de datos (Supabase provee una base de datos PostgreSQL)

## Instalación

1. **Clona el repositorio**

```bash
git clone https://github.com/portfedh/codi-api.git
cd codi-api
```

2. **Instala las dependencias**

```bash
npm install
```

3. **Configura las variables de entorno**

```bash
cp .env.example .env
```

Edita `.env` con tu configuración (ver sección [Configuración](#configuración)).

4. **Configura la base de datos**

Sigue las instrucciones de [Configuración de Base de Datos](#configuración-de-base-de-datos) para crear las tablas requeridas en Supabase.

5. **Genera tu primera API key** (opcional para pruebas)

```bash
node controllers/utils/generateApiKey.js
```

Esto generará una clave API hexadecimal de 128 caracteres que puedes agregar a la tabla `api_keys` en Supabase.

## Configuración

El archivo `.env` contiene todas las variables de configuración. Consulta `.env.example` para una plantilla completa.

### Secciones de Configuración Críticas

#### 1. Configuración del Servidor

```bash
PORT=3131
NODE_ENV=development  # o production
```

#### 2. Configuración de CORS

Define los orígenes permitidos para tu API:

```bash
CORS_ALLOWED_ORIGINS=https://tudominio.com,http://localhost:3000
CORS_BANXICO_BETA=http://banxico-beta-ip
CORS_BANXICO_PROD=http://banxico-prod-ip
```

#### 3. Base de Datos Supabase

```bash
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

#### 4. Endpoints de Banxico

Recibirás estas URLs de Banxico cuando te registres como desarrollador:

```bash
# Endpoints de Pago QR
SITIO_CODI_QR_DEV_1=https://banxico-dev-qr-endpoint-1.com
SITIO_CODI_QR_DEV_2=https://banxico-dev-qr-endpoint-2.com
SITIO_CODI_QR_PROD_1=https://banxico-prod-qr-endpoint-1.com
SITIO_CODI_QR_PROD_2=https://banxico-prod-qr-endpoint-2.com

# Endpoints de Pago Push
SITIO_CODI_PUSH_DEV_1=https://banxico-dev-push-endpoint-1.com
SITIO_CODI_PUSH_DEV_2=https://banxico-dev-push-endpoint-2.com
# ... y así sucesivamente
```

#### 5. Certificados Digitales

Consulta la sección [Certificados Digitales](#certificados-digitales) para instrucciones detalladas.

## Configuración de Base de Datos

Esta API utiliza Supabase (PostgreSQL) para persistencia de datos.

### 1. Crear un Proyecto en Supabase

1. Regístrate en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Anota la URL de tu proyecto y las claves API

### 2. Crear las Tablas de la Base de Datos

El esquema completo de la base de datos está disponible en `/database/schema.sql`. Crea las siguientes tablas:

**Tablas Principales:**

- `customers`: Información de clientes y detalles bancarios
- `api_keys`: Gestión de claves API con integración Banxico
- `folios_codi`: Seguimiento de folios de pago CoDi
- `requests`: Registro de peticiones entrantes
- `responses`: Registro de respuestas salientes

**Esquema Visual:**
Consulta `/database/database_schema.png` para una representación visual de las relaciones entre tablas.

### 3. Agrega tu Primer Cliente y Clave API

```sql
-- 1. Insertar un cliente
INSERT INTO customers (name, email, phone, environment, bank_name, bank_account)
VALUES ('Cliente Prueba', 'prueba@ejemplo.com', '5551234567', 'development', 'Banco Prueba', '1234567890');

-- 2. Insertar una clave API para este cliente
INSERT INTO api_keys (
  customer_id,
  api_key,
  banxico_api_key,
  environment,
  callback_url,
  active
)
VALUES (
  (SELECT id FROM customers WHERE email = 'prueba@ejemplo.com'),
  'tu_clave_api_generada_de_128_caracteres_aqui',
  'tu_clave_api_banxico_aqui',
  'development',
  'https://tu-webhook-url.com/callback',
  true
);
```

## Endpoints de la API

### URL Base

- **Desarrollo**: `http://localhost:3131`
- **Producción**: `https://tu-dominio.com`

### Autenticación

Todos los endpoints (excepto `/health`) requieren una clave API en el encabezado:

```bash
x-api-key: tu_clave_api_de_128_caracteres
```

### Endpoints Disponibles

#### 1. Verificación de Salud

```http
GET /v2/health
```

Devuelve el estado de salud de la API. No requiere autenticación.

**Respuesta:**

```json
{
  "status": "healthy",
  "timestamp": "2025-10-06T12:00:00.000Z"
}
```

#### 2. Generar Solicitud de Pago QR

```http
POST /v2/codi/qr
```

Crea una solicitud de pago CoDi y devuelve un código QR.

**Cuerpo de la Petición:**

```json
{
  "monto": "100.50",
  "concepto": "Pago por servicios",
  "referencia": "INV-12345"
}
```

**Respuesta:**

```json
{
  "success": true,
  "qrCode": "data:image/png;base64,...",
  "folioCoDi": "ABC123DEF456",
  "mensaje": "Código QR generado exitosamente"
}
```

#### 3. Enviar Solicitud de Pago Push

```http
POST /v2/codi/push
```

Envía una solicitud de pago directamente a la aplicación bancaria móvil de un cliente.

**Cuerpo de la Petición:**

```json
{
  "monto": "100.50",
  "concepto": "Pago por servicios",
  "referencia": "INV-12345",
  "telefonoCliente": "5551234567"
}
```

**Respuesta:**

```json
{
  "success": true,
  "folioCoDi": "ABC123DEF456",
  "mensaje": "Notificación push enviada exitosamente"
}
```

#### 4. Consultar Estado de Pago

```http
POST /v2/codi/consulta
```

Verifica el estado de una solicitud de pago.

**Cuerpo de la Petición:**

```json
{
  "folioCoDi": "ABC123DEF456"
}
```

**Respuesta:**

```json
{
  "success": true,
  "status": "paid",
  "monto": "100.50",
  "fechaPago": "2025-10-06T12:30:00.000Z"
}
```

#### 5. Webhook de Resultado de Pago

```http
POST /v2/resultadoOperaciones
```

Recibe actualizaciones de estado de pago de Banxico. Este endpoint es llamado por Banxico cuando se completa un pago.

**Payload del Webhook** (enviado por Banxico):

```json
{
  "folioCoDi": "ABC123DEF456",
  "resultado": "exitoso",
  "monto": "100.50",
  "timestamp": "2025-10-06T12:30:00.000Z"
}
```

### Documentación de la API

La documentación interactiva de la API está disponible mediante Swagger UI:

```
http://localhost:3131/api-docs
```

## Autenticación

### Autenticación con Clave API

La API utiliza autenticación de dos capas:

1. **Tu Clave API**: Generada por ti, utilizada por tus clientes
2. **Clave API de Banxico**: Proporcionada por Banxico, almacenada en la base de datos

### Verificación de Firma Digital

Todas las peticiones hacia/desde Banxico están firmadas con certificados digitales RSA para seguridad:

- Las peticiones salientes se firman con tu clave privada
- Los webhooks entrantes se verifican usando el certificado público de Banxico
- Los números de serie de los certificados son validados

## Certificados Digitales

### Requisitos de Certificados

Necesitas 4 conjuntos de certificados de Banxico:

1. **Ambiente Beta del Desarrollador**

   - Clave privada (archivo `.cve`)
   - Certificado público (archivo `.crt`)
   - Número de serie del certificado de login
   - Número de serie del certificado de operación

2. **Ambiente de Producción del Desarrollador**

   - Igual que el anterior, pero para producción

3. **Certificado Público de Banxico Beta**

   - Para verificar firmas de Banxico en Beta

4. **Certificado Público de Banxico Producción**
   - Para verificar firmas de Banxico en Producción

### Preparación del Formato de Certificados

Los archivos de certificados deben formatearse correctamente para usarse en `.env`:

**Convertir archivos de certificados al formato de variable de entorno:**

```bash
# Para claves privadas (archivos .cve)
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' tu_clave_privada.cve

# Para certificados públicos (archivos .crt)
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' tu_certificado.crt
```

Esto convierte los saltos de línea a caracteres `\n` para que el certificado pueda almacenarse como una variable de entorno de una sola línea.

**Agregar a `.env`:**

```bash
# Ejemplo para Clave Privada Beta del Desarrollador
PRIVATE_KEY_DEV="-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIB...(tu clave aquí)...\n-----END RSA PRIVATE KEY-----\n"
PRIVATE_KEY_PASSPHRASE_DEV="tu_frase_de_paso"

# Ejemplo para Certificado Público Beta del Desarrollador
PUBLIC_KEY_DEV="-----BEGIN CERTIFICATE-----\nMIIDXTC...(tu cert aquí)...\n-----END CERTIFICATE-----"

# Números de Serie de Certificados (proporcionados por Banxico)
CRT_LOG_IN_DEV="1234567890"
CRT_OPER_DEV="0987654321"
```

### Seguridad de Certificados

- **Nunca hagas commit de certificados en Git**: El archivo `.gitignore` excluye `.env`
- Almacena los certificados de producción de forma segura (usa variables de entorno en producción)
- Rota los certificados antes de su vencimiento
- Usa certificados separados para Beta y Producción

## Desarrollo

### Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Esto usa `nodemon` para reiniciar automáticamente el servidor cuando hay cambios en archivos.

### Iniciar Servidor de Producción

```bash
npm start
```

O usa PM2 para gestión de procesos en producción:

```bash
pm2 start index.js --name codi-api
pm2 logs codi-api
```

### Estructura del Proyecto

```
codi-api/
├── config/              # Archivos de configuración
│   ├── cors.js         # Configuración de CORS
│   ├── institutions.js # Códigos de instituciones financieras
│   ├── supabase.js     # Configuración del cliente Supabase
│   └── swagger.js      # Configuración Swagger/OpenAPI
├── controllers/         # Controladores de rutas
│   ├── consulta.js     # Consultas de estado de pago
│   ├── health.js       # Endpoint de verificación de salud
│   ├── resultadoOperaciones.js  # Manejador de webhook
│   ├── sendPushPayment.js       # Lógica de pago push
│   ├── sendQrPayment.js         # Lógica de pago QR
│   └── utils/          # Funciones de utilidad (35+ helpers)
├── database/           # Esquema y diagramas de base de datos
├── middleware/         # Middleware de Express
│   └── sanitizeRequest.js  # Sanitización de peticiones
├── routes/             # Definiciones de rutas
│   └── home.js        # Router principal
├── tests/              # Suite de pruebas Jest
├── validators/         # Esquemas de validación de peticiones
├── .env.example        # Plantilla de variables de entorno
├── index.js            # Punto de entrada de la aplicación
└── package.json        # Dependencias del proyecto
```

### Funciones de Utilidad (`controllers/utils/`)

La API incluye más de 35 funciones de utilidad para:

- Manejo de certificados y verificación de firmas
- Gestión de credenciales de Banxico
- Registro de peticiones/respuestas en Supabase
- Validación y formato de datos
- Mecanismos de peticiones de respaldo
- Generación de códigos QR
- Gestión de claves API

## Pruebas

### Ejecutar Pruebas

```bash
npm test
```

Esto ejecuta la suite de pruebas Jest con reportes de cobertura.

### Cobertura de Pruebas

Las pruebas cubren:

- Todas las funciones de utilidad
- Reglas de validación
- Verificación de certificados
- Generación de firma digital
- Formato de peticiones
- Manejo de errores

Los reportes de cobertura se generan en el directorio `/coverage`.

### Pruebas Manuales con curl

**Verificación de Salud:**

```bash
curl http://localhost:3131/v2/health
```

**Solicitud de Pago QR:**

```bash
curl -X POST http://localhost:3131/v2/codi/qr \
  -H "Content-Type: application/json" \
  -H "x-api-key: tu_clave_api_aqui" \
  -d '{
    "monto": "100.50",
    "concepto": "Pago de prueba",
    "referencia": "TEST-001"
  }'
```

## Despliegue

### Lista de Verificación para Producción

- [ ] Establecer `NODE_ENV=production` en `.env`
- [ ] Configurar endpoints de producción de Banxico
- [ ] Usar certificados digitales de producción
- [ ] Configurar base de datos de producción en Supabase
- [ ] Configurar CORS para dominios de producción
- [ ] Habilitar HTTPS/SSL
- [ ] Configurar gestor de procesos (PM2 recomendado)
- [ ] Configurar rotación de logs
- [ ] Configurar monitoreo y alertas
- [ ] Revisar configuración de limitación de tasa
- [ ] Probar accesibilidad del endpoint webhook

### Despliegue con PM2

```bash
# Instalar PM2
npm install -g pm2

# Iniciar la API
pm2 start index.js --name codi-api

# Guardar configuración de PM2
pm2 save

# Configurar PM2 para iniciar al arranque del sistema
pm2 startup
```

### Variables de Entorno en Producción

Para producción, usa la gestión de variables de entorno de tu proveedor de hosting en lugar de archivos `.env`:

- **Vercel**: Usa Variables de Entorno en la configuración del proyecto
- **Heroku**: Usa `heroku config:set`
- **AWS/GCP/Azure**: Usa sus respectivos servicios de gestión de secretos
- **Docker**: Usa secretos de Docker o archivos de entorno

## Seguridad

### Características de Seguridad

- **Helmet**: Encabezados de seguridad (protección XSS, política de seguridad de contenido, etc.)
- **CORS**: Validación estricta de orígenes
- **Limitación de Tasa**: 200 peticiones por 15 minutos por IP
- **Sanitización de Peticiones**: Prevención de inyección SQL y XSS
- **Validación de Clave API**: Claves hexadecimales de 128 caracteres
- **Firmas Digitales**: Autenticación basada en certificados RSA
- **Bloqueo de Archivos Ocultos**: Previene acceso a `.git`, `.env`, etc.
- **Registro de Peticiones**: Auditoría completa en Supabase

### Mejores Prácticas de Seguridad

1. **Nunca expongas tu archivo `.env`**
2. **Rota las claves API regularmente**
3. **Monitorea violaciones de límite de tasa**
4. **Mantén las dependencias actualizadas**: `npm audit fix`
5. **Usa HTTPS en producción**
6. **Valida las firmas de los webhooks de Banxico**
7. **Revisa los logs de acceso regularmente**: `pm2 logs codi-api`
8. **Configura alertas para actividad sospechosa**

### Reporte de Vulnerabilidades de Seguridad

Si descubres una vulnerabilidad de seguridad, por favor envía un correo electrónico al mantenedor directamente en lugar de abrir un issue público.

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor sigue estas pautas:

### Cómo Contribuir

1. **Haz fork del repositorio**
2. **Crea una rama de característica**: `git checkout -b feature/nombre-de-tu-caracteristica`
3. **Realiza tus cambios**
4. **Agrega pruebas** para nueva funcionalidad
5. **Ejecuta las pruebas**: `npm test`
6. **Haz commit de tus cambios**: `git commit -m "Agrega: descripción de tu característica"`
7. **Haz push a tu fork**: `git push origin feature/nombre-de-tu-caracteristica`
8. **Abre un Pull Request**

### Estilo de Código

- Usa 2 espacios para indentación
- Sigue los patrones de código existentes
- Agrega comentarios JSDoc para funciones
- Escribe mensajes de commit descriptivos
- Asegúrate de que todas las pruebas pasen antes de enviar PR

### Áreas para Contribución

- Manejo mejorado de errores
- Optimizaciones de rendimiento
- Mejoras en la documentación
- Cobertura adicional de pruebas
- Mejoras de seguridad
- Internacionalización (i18n)

## Licencia

Este proyecto está licenciado bajo la Licencia Apache 2.0 - consulta el archivo [LICENSE](LICENSE) para más detalles.

### Qué significa esto:

- ✅ Uso comercial permitido
- ✅ Modificación permitida
- ✅ Distribución permitida
- ✅ Concesión de patente incluida
- ✅ Uso privado permitido
- ⚠️ Debe incluir aviso de copyright y licencia
- ⚠️ Debe declarar cambios significativos
- ❌ Sin responsabilidad ni garantía

## Soporte

### Documentación

- **Documentación de la API**: Endpoint `/api-docs` (Swagger UI)
- **Esquema de Base de Datos**: `/database/schema.sql`
- **Diagrama de Esquema**: `/database/database_schema.png`
- **Configuración de Entorno**: `.env.example`

### Recursos

- **Documentación CoDi de Banxico**: [https://www.codi.org.mx/](https://www.codi.org.mx/)
- **Documentación de Supabase**: [https://supabase.com/docs](https://supabase.com/docs)
- **Documentación de Express.js**: [https://expressjs.com/](https://expressjs.com/)

### Obtener Ayuda

- **Issues**: [GitHub Issues](https://github.com/portfedh/codi-api/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/portfedh/codi-api/discussions)

### Patrocina Este Proyecto

Si encuentras valiosa CoDi API para tu negocio o proyectos, por favor considera [patrocinar su desarrollo](https://github.com/sponsors/portfedh). Tu apoyo ayuda a:

- 🚀 Mantener y mejorar el código base
- 📚 Crear mejor documentación y tutoriales
- 🔒 Mejorar las características de seguridad
- ✨ Agregar nuevas funcionalidades e integraciones
- 🐛 Corregir errores y responder a issues más rápido

¡Cada contribución, sin importar el tamaño, hace la diferencia! 💖

## Agradecimientos

- **Banxico** (Banco de México) por el sistema de pago CoDi
- **Supabase** por la plataforma de base de datos y autenticación
- Todos los contribuidores y usuarios de este proyecto

## Hoja de Ruta

Mejoras futuras bajo consideración:

- [ ] Mecanismo de reintento de webhook con backoff exponencial
- [ ] Reportes y análisis mejorados
- [ ] Bibliotecas SDK (JavaScript, Python, PHP)

---

**Creado por [Pablo Cruz Lemini](https://github.com/portfedh)**

Para preguntas o comentarios, por favor abre un issue en GitHub.
