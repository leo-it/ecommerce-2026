# Hoja de ruta de pendientes

Estado general del proyecto y tareas sugeridas en orden de impacto.

## 0) Estado actual (ya avanzado)
- [x] Login/Register con JWT
- [x] Refresh token con hash en BD
- [x] Logout invalidando refresh token
- [x] `JwtStrategy` y `JwtAuthGuard`
- [x] `RolesGuard`, `@Roles` y `Role` enum
- [x] Protección de endpoints de escritura en productos para admin

## 1) Seguridad y auth hardening (alta prioridad)
- [ ] Refactor de `refresh` para no confiar en `userId` del cliente (leer `sub` desde token verificado)
- [ ] Incluir `tokenType` en payload (`access` / `refresh`) y validarlo
- [ ] Estandarizar errores de auth (mensajes y códigos consistentes)
- [ ] Tipar rol con enum también en entidad `User` y servicios
- [ ] Agregar decorator `@CurrentUser()` para evitar casteos manuales de `req.user`
- [ ] Revisar expiraciones y rotación de tokens (evitar reuse de refresh)

## 2) Tests robustos y escalables (muy alta prioridad)
- [ ] Definir estructura de tests por capas: unit, integración, e2e
- [ ] Crear helpers compartidos en `test/helpers`:
  - [ ] `bootstrapTestApp`
  - [ ] `createAdminUser` / `createCustomerUser`
  - [ ] `loginAndGetTokens`
  - [ ] factories de productos
- [ ] Reemplazar e2e básico por suites de dominio:
  - [ ] `auth.e2e-spec.ts`
  - [ ] `products-authz.e2e-spec.ts`
  - [ ] `users.e2e-spec.ts`
- [ ] Casos negativos obligatorios:
  - [ ] access token inválido/expirado
  - [ ] refresh inválido/no coincidente/reutilizado
  - [ ] customer intentando `POST/PUT/DELETE /products` (esperar 403)
  - [ ] DTO inválidos (esperar 400)
- [ ] Agregar tests unitarios faltantes:
  - [ ] `RolesGuard`
  - [ ] `JwtStrategy`
  - [ ] `ProductsService`
  - [ ] escenarios negativos de `AuthService`
- [ ] Definir umbrales de cobertura progresivos:
  - [ ] Global inicial >= 70%
  - [ ] Auth >= 85%
  - [ ] Guards/Strategies >= 90%

## 3) Dockerización y entorno reproducible (alta prioridad)
- [ ] Crear `Dockerfile` multi-stage para la API (dev/prod)
- [ ] Crear `.dockerignore`
- [ ] Crear `docker-compose.yml` para desarrollo (`api + postgres`)
- [ ] Crear `docker-compose.test.yml` para e2e aislado
- [ ] Healthchecks para app y BD
- [ ] Ajustar scripts npm para levantar/bajar entornos con Docker
- [ ] Documentar comandos de uso en README

## 4) Base de datos y migraciones (alta prioridad)
- [ ] Pasar de `synchronize: true` a migraciones controladas
- [ ] Configurar TypeORM migrations por entorno
- [ ] Crear primera migración estable de esquema
- [ ] Definir estrategia de seeds de desarrollo/test
- [ ] Agregar convención de rollback segura

## 5) Calidad, DX y CI/CD (media-alta prioridad)
- [ ] Separar scripts de test:
  - [ ] `test:unit`
  - [ ] `test:e2e`
  - [ ] `test:cov`
  - [ ] `test:changed`
- [ ] Pipeline CI mínimo:
  - [ ] lint
  - [ ] test unit
  - [ ] test e2e
  - [ ] reporte de cobertura
- [ ] Cachear dependencias para acelerar CI
- [ ] Configurar policy de branch/PR (checks obligatorios)

## 6) Módulos de negocio (siguiente fase funcional)
- [ ] Carrito (cart + cart items)
- [ ] Órdenes (checkout, estados, historial)
- [ ] Pagos (integración inicial y webhooks)
- [ ] Inventario básico y validaciones de stock
- [ ] Búsqueda/filtros/paginación de productos

## 7) Observabilidad y operación (media)
- [ ] Logging estructurado (con contexto de request)
- [ ] Manejo global de errores unificado
- [ ] Métricas básicas (latencia, errores por endpoint)
- [ ] Rate limiting en endpoints sensibles
- [ ] Checklist de seguridad para producción

## Convención de trabajo sugerida por sprint
- Elegir 1 objetivo principal por sprint (seguridad, tests o infraestructura).
- No avanzar funcionalidad nueva sin:
  - tests mínimos del módulo,
  - documentación de uso,
  - checklist de seguridad del endpoint.
- Mantener PRs pequeñas y enfocadas (fáciles de revisar).

## Próxima iteración recomendada (orden exacto)
- [ ] 1. Cerrar hardening de refresh token
- [ ] 2. Montar base de tests e2e con Postgres contenedor
- [ ] 3. Implementar suites e2e de auth + autorización products
- [ ] 4. Dockerizar app completa y documentar flujo local
