import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    ProductsModule, // Importamos nuestro módulo de productos
    // Aquí irán los demás módulos: AuthModule, UsersModule, OrdersModule, PaymentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
