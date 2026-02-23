import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API para e-commerce escalable con NestJS')
    .setVersion('1.0')
    .addTag('products', 'Endpoints relacionados con productos')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Disponible en /api
  
  const port = process.env.PORT ?? 3007; // Cambiado a 3007 para evitar conflictos
  await app.listen(port);
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📚 Documentación Swagger disponible en http://localhost:${port}/api`);
}
bootstrap();
