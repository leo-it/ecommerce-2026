import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Transforma los datos al tipo del DTO
      transformOptions: {
        enableImplicitConversion: true, // Convierte tipos automáticamente
      },
    }),
  );
  
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API para e-commerce escalable con NestJS')
    .setVersion('1.0')
    .addTag('products', 'Endpoints relacionados con productos')
    .build();
  
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [], // Aquí se pueden agregar modelos adicionales si es necesario
  });
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Mantiene la autorización entre recargas
    },
  }); // Disponible en /api
  
  const port = process.env.PORT ?? 3007; // Cambiado a 3007 para evitar conflictos
  await app.listen(port);
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📚 Documentación Swagger disponible en http://localhost:${port}/api`);
}
bootstrap();
