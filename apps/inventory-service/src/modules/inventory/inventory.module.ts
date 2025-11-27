// import { Module } from '@nestjs/common';
// import {
//   ConsuleModule,
//   ConsulService,
//   CONSULT_SERVICE_ID,
//   GRPC_PACKAGE,
//   JwtSharedModule,
// } from '@loginex/common';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { ConfigModule } from '@nestjs/config';
// import { join } from 'node:path';
// import { InventoryController } from './inventory.controller';
// import { InventoryService } from './inventory.service';

// @Module({
//   imports: [
//     ConsuleModule,
//     JwtSharedModule,
//     ConfigModule.forRoot({ isGlobal: true }),
//     ClientsModule.registerAsync([
//       {
//         name: GRPC_PACKAGE.INVENTORY,
//         imports: [ConsuleModule],
//         inject: [ConsulService],
//         useFactory: async (consulService: ConsulService) => {
//           const inventoryService = await consulService.discoverService(
//             CONSULT_SERVICE_ID.INVENTORY,
//           );
//           return {
//             transport: Transport.GRPC,
//             options: {
//               package: 'inventory',
//               protoPath: join(
//                 process.cwd(),
//                 'common/src/lib/proto/inventory.proto',
//               ),
//               url: `${inventoryService.address}:${inventoryService.port}`,
//             },
//           };
//         },
//       },
//     ]),
//   ],
//   controllers: [InventoryController],
//   providers: [InventoryService],
// })
// export class InventoryModule {}
