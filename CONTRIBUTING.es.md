# Contribuir a CoDi API

Antes que nada, ¡gracias por considerar contribuir a CoDi API! Son personas como tú las que hacen de este proyecto una gran herramienta para la comunidad fintech mexicana.

## Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
- [Primeros Pasos](#primeros-pasos)
- [Flujo de Desarrollo](#flujo-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Guía de Mensajes de Commit](#guía-de-mensajes-de-commit)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Guía de Pruebas](#guía-de-pruebas)

## Código de Conducta

Este proyecto y todos los que participan en él se rigen por nuestro [Código de Conducta](CODE_OF_CONDUCT.md). Al participar, se espera que respetes este código.

## ¿Cómo Puedo Contribuir?

### Reportar Errores

Antes de crear reportes de errores, por favor revisa los issues existentes para evitar duplicados.

Cuando [crees un nuevo reporte de error](../../issues/new?template=bug_report.md), nuestra plantilla te guiará para proporcionar:

- **Título y descripción claros**
- **Pasos para reproducir** el comportamiento
- **Comportamiento esperado vs actual**
- **Detalles del entorno**: versión de Node.js, SO, etc.
- **Mensajes de error** o logs (sanitiza datos sensibles)

**Nota de Seguridad:** Para vulnerabilidades de seguridad, por favor sigue nuestra [Política de Seguridad](SECURITY.es.md) en lugar de crear un issue público.

### Sugerir Mejoras

Las sugerencias de mejoras se rastrean como issues de GitHub.

Cuando [crees una nueva solicitud de funcionalidad](../../issues/new?template=feature_request.md), nuestra plantilla te guiará para proporcionar:

- **Usa un título claro** que describa la mejora
- **Proporciona una descripción detallada** de la mejora sugerida
- **Explica por qué** esta mejora sería útil
- **Lista alternativas** que hayas considerado
- **Evaluación de impacto** en funcionalidad existente e integraciones

### Tu Primera Contribución de Código

Busca issues etiquetados con:

- `good first issue` - Issues simples perfectos para principiantes
- `help wanted` - Issues donde necesitamos ayuda de la comunidad
- `documentation` - Mejoras de documentación

### Áreas para Contribuir

- 🐛 Corrección de errores
- 📝 Mejoras de documentación
- ✨ Nuevas funcionalidades (discute primero en un issue)
- ✅ Mejoras de cobertura de pruebas
- 🔒 Mejoras de seguridad
- 🌐 Internacionalización (i18n)
- ⚡ Optimizaciones de rendimiento

## Primeros Pasos

### 1. Fork y Clonar

```bash
git clone https://github.com/TU_USUARIO/codi-api.git
cd codi-api
```

### 2. Agregar Remote Upstream

```bash
git remote add upstream https://github.com/portfedh/codi-api.git
```

### 3. Crear una Rama

```bash
git checkout -b feature/nombre-de-tu-funcionalidad
```

Convenciones de nombres de ramas:
- `feature/` - Nuevas funcionalidades
- `fix/` - Corrección de errores
- `docs/` - Actualizaciones de documentación
- `test/` - Mejoras de pruebas
- `refactor/` - Refactorización de código

### 4. Configurar Entorno de Desarrollo

```bash
npm install
cp .env.example .env
# Edita .env con tu configuración de prueba
```

## Flujo de Desarrollo

### Realizando Cambios

1. Mantén los commits enfocados - un cambio lógico por commit
2. Escribe pruebas para nuevas funcionalidades o correcciones
3. Ejecuta las pruebas antes de hacer commit
4. Sigue los estándares de código
5. Actualiza la documentación si es necesario

### Ejecutar Pruebas

```bash
npm test                    # Ejecutar todas las pruebas
npm test -- --watch         # Modo watch
npm test -- --coverage      # Con cobertura
```

### Desarrollo Local

```bash
npm run dev                 # Iniciar servidor de desarrollo
curl http://localhost:3131/v2/health  # Probar endpoint
```

## Estándares de Código

### Guía de Estilo JavaScript

- Usa **2 espacios** para indentación
- Usa **punto y coma** al final de las declaraciones
- Usa **comillas simples** para strings
- Usa **const** por defecto, `let` cuando se necesite reasignación
- Usa **async/await** en lugar de promesas directas

### Convenciones de Nombres

```javascript
// Variables y funciones: camelCase
const apiKey = "abc123";
function getUserData() {}

// Clases: PascalCase
class PaymentProcessor {}

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
```

### Documentación

Usa comentarios JSDoc para funciones:

```javascript
/**
 * Envía una solicitud de pago CoDi vía código QR.
 *
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @returns {Promise<void>}
 */
async function sendQrPayment(req, res) {
  // Implementación
}
```

### Manejo de Errores

```javascript
try {
  const result = await processPayment(data);
  return res.json({ success: true, result });
} catch (error) {
  console.error("Procesamiento de pago falló:", error);
  return res.status(500).json({
    success: false,
    message: "Procesamiento de pago falló"
  });
}
```

## Guía de Mensajes de Commit

Sigue [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<alcance>): <asunto>
```

### Tipos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de error
- `docs`: Cambios en documentación
- `style`: Cambios de estilo de código
- `refactor`: Refactorización de código
- `test`: Agregar o actualizar pruebas
- `chore`: Tareas de mantenimiento

### Ejemplos

```bash
feat(qr): agregar configuración de timeout para generación de QR
fix(webhook): prevenir procesamiento duplicado de pagos
docs(readme): actualizar instrucciones de instalación
```

## Proceso de Pull Request

### Antes de Enviar

- ✅ Las pruebas pasan: `npm test` exitoso
- ✅ El código está formateado según estándares
- ✅ Documentación actualizada
- ✅ Los commits tienen mensajes significativos
- ✅ La rama está actualizada con main

### Enviar tu PR

1. Push a tu fork:
   ```bash
   git push origin feature/nombre-de-tu-funcionalidad
   ```

2. Crear Pull Request en GitHub

3. Nuestra [plantilla de PR](.github/PULL_REQUEST_TEMPLATE.md) se autocompletará. Llénala con:
   - Descripción de los cambios
   - Tipo de cambio (corrección de error, funcionalidad, etc.)
   - Pruebas realizadas
   - Issues relacionados
   - Lista de verificación de cumplimiento de licencias
   - Consideraciones de seguridad

### Proceso de Revisión

- Los mantenedores revisarán tu PR
- Atender cualquier cambio solicitado
- Una vez aprobado, tu PR será fusionado
- Tu contribución será acreditada

## Guía de Pruebas

### Estructura de Pruebas

```javascript
describe("Nombre de Funcionalidad", () => {
  it("debería hacer X cuando Y sucede", () => {
    // Arrange (Preparar)
    const input = "test";

    // Act (Actuar)
    const result = processInput(input);

    // Assert (Afirmar)
    expect(result).toBe("expected");
  });
});
```

### Cobertura de Pruebas

- Apunta a **80%+ de cobertura** en código nuevo
- Prueba caminos felices y casos de error
- Prueba casos límite y condiciones de frontera
- Mockea dependencias externas

## ¿Preguntas?

- 💬 GitHub Discussions para preguntas generales
- 🐛 GitHub Issues para errores y solicitudes de funcionalidades
- 📧 Email para problemas de seguridad (ver SECURITY.md)

## Reconocimiento

Los contribuidores serán reconocidos en:
- Lista de contribuidores de GitHub
- Notas de lanzamiento para contribuciones significativas
- Agradecimientos en README para funcionalidades importantes

¡Gracias por contribuir a CoDi API! 🚀
