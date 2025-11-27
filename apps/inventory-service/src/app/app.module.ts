import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from '../health/health.controller';
import { ConsuleModule } from '@loginex/common';
import { ProductsModule } from '../modules/products/products.module';

@Module({
  imports: [ProductsModule, ConsuleModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
