import { Module } from '@nestjs/common';
import {
  ConsuleModule,
  ConsulService,
  CONSULT_SERVICE_ID,
  GRPC_PACKAGE,
  JwtSharedModule,
} from '@loginex/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';
import { WarehousesController } from './controllers/warehouses.controller';
import { ZonesController } from './controllers/zones.controller';
import { RacksController } from './controllers/racks.controller';
import { BinsController } from './controllers/bins.controller';
import { WarehousesService } from './services/warehouses.service';
import { ZonesService } from './services/zones.service';
import { RacksService } from './services/racks.service';
import { BinsService } from './services/bins.service';

@Module({
  imports: [
    ConsuleModule,
    JwtSharedModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: GRPC_PACKAGE.INVENTORY,
        imports: [ConsuleModule],
        inject: [ConsulService],
        useFactory: async (consulService: ConsulService) => {
          const inventoryService = await consulService.discoverService(
            CONSULT_SERVICE_ID.INVENTORY,
          );
          return {
            transport: Transport.GRPC,
            options: {
              package: 'inventory',
              protoPath: join(
                process.cwd(),
                'common/src/lib/proto/inventory.proto',
              ),
              url: `${inventoryService.address}:${inventoryService.port}`,
            },
          };
        },
      },
    ]),
  ],
  controllers: [
    WarehousesController,
    ZonesController,
    RacksController,
    BinsController,
  ],
  providers: [WarehousesService, ZonesService, RacksService, BinsService],
  exports: [WarehousesService, ZonesService, RacksService, BinsService],
})
export class WarehousesModule {}
