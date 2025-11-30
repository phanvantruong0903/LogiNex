import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockResolver } from './stock.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GRPC_PACKAGE } from '@loginex/common';
import { join } from 'node:path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: GRPC_PACKAGE.INVENTORY,
        transport: Transport.GRPC,
        options: {
          package: ['inventory', 'grpc.health.v1'],
          protoPath: [
            join(process.cwd(), 'common/src/lib/proto/inventory-shared.proto'),
            join(process.cwd(), 'common/src/lib/proto/warehouse.proto'),
            join(process.cwd(), 'common/src/lib/proto/zone.proto'),
            join(process.cwd(), 'common/src/lib/proto/rack.proto'),
            join(process.cwd(), 'common/src/lib/proto/bin.proto'),
            join(process.cwd(), 'common/src/lib/proto/stock.proto'),
            join(process.cwd(), 'common/src/lib/proto/product.proto'),
            join(process.cwd(), 'common/src/lib/proto/health.proto'),
          ],
          url: `0.0.0.0:${process.env.INVENTORY_SERVICE_PORT || 50053}`,
        },
      },
    ]),
  ],
  providers: [StockResolver, StockService],
})
export class StockModule {}
