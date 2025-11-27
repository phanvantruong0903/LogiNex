import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InventoryModule } from '../modules/inventory/inventory.module';
import { HealthController } from '../health/health.controller';
import { ConsuleModule } from '@loginex/common';

@Module({
  imports: [InventoryModule, ConsuleModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
