# ecommerce-2026

E-commerce escalable construido con NestJS siguiendo Clean Architecture.

## Arquitectura

- **Auth Module**: Registro, login, manejo de tokens (JWT + Refresh)
- **Users Module**: Perfiles, direcciones de envío, roles (Admin vs Cliente)
- **Products Module**: Catálogo, categorías, stock (inventario)
- **Orders Module**: Gestión de pedidos y estados (Pendiente, Pagado, Enviado)
- **Payments Module**: Integración con pasarelas (Stripe o PayPal)
- **Common/Shared**: Filtros de excepciones, interceptores y decoradores

## Stack Tecnológico

- **Framework**: NestJS
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM / Prisma
- **Autenticación**: JWT + Refresh Tokens
- **Validación**: class-validator
- **Pagos**: Stripe / PayPal

## Instalación

```bash
$ npm install
```

## Ejecutar la aplicación

```bash
# desarrollo
$ npm run start:dev

# producción
$ npm run start:prod
```

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
