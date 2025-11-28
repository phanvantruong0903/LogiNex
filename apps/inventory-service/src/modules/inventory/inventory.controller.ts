import { Controller, Logger } from '@nestjs/common';
import {
  GrpcMethod,
  RpcException,
  EventPattern,
  Payload,
} from '@nestjs/microservices';
import { InventoryService } from './inventory.service';
import { WarehousesService } from './services/warehouses.service';
import { ZonesService } from './services/zones.service';
import { RacksService } from './services/racks.service';
import { BinsService } from './services/bins.service';
import {
  GRPC_SERVICES,
  INVENTORY_METHODS,
  INVENTORY_MESSAGES,
  CreateWarehouseDto,
  UpdateWarehouseDto,
  CreateZoneDto,
  UpdateZoneDto,
  CreateRackDto,
  UpdateRackDto,
  CreateBinDto,
  UpdateBinDto,
  AdjustStockDto,
  grpcResponse,
  grpcPaginateResponse,
} from '@loginex/common';

@Controller()
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly warehousesService: WarehousesService,
    private readonly zonesService: ZonesService,
    private readonly racksService: RacksService,
    private readonly binsService: BinsService,
  ) {}

  // Warehouse
  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.CREATE_WAREHOUSE)
  async createWarehouse(data: CreateWarehouseDto) {
    try {
      const result = await this.warehousesService.create(data);
      return grpcResponse(result, INVENTORY_MESSAGES.WAREHOUSE_CREATED);
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.UPDATE_WAREHOUSE)
  async updateWarehouse(data: UpdateWarehouseDto & { id: string }) {
    try {
      const { id, ...updateData } = data;
      const result = await this.warehousesService.update(id, updateData);
      return grpcResponse(result, INVENTORY_MESSAGES.WAREHOUSE_UPDATED);
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.GET_WAREHOUSE)
  async getWarehouse(data: { id: string }) {
    try {
      const result = await this.warehousesService.findOne(data.id);
      if (!result) {
        throw new RpcException(INVENTORY_MESSAGES.WAREHOUSE_NOT_FOUND);
      }
      return grpcResponse(result, INVENTORY_MESSAGES.WAREHOUSE_GET_SUCCESS);
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.LIST_WAREHOUSES)
  async listWarehouses(data: { page: number; limit: number; search?: string }) {
    try {
      const filter = data.search
        ? { name: { contains: data.search, mode: 'insensitive' as const } }
        : {};
      const { data: warehouses, ...meta } =
        await this.warehousesService.findAll(data.page, data.limit, filter);
      return grpcPaginateResponse(
        { data: warehouses, ...meta },
        INVENTORY_MESSAGES.WAREHOUSE_LIST_SUCCESS,
      );
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.DELETE_WAREHOUSE)
  async deleteWarehouse(data: { id: string }) {
    try {
      await this.warehousesService.remove(data.id);
      return { success: true, message: INVENTORY_MESSAGES.WAREHOUSE_DELETED };
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  // Zone
  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.CREATE_ZONE)
  async createZone(data: CreateZoneDto) {
    try {
      const result = await this.zonesService.create(data);
      return grpcResponse(result, INVENTORY_MESSAGES.ZONE_CREATED);
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.UPDATE_ZONE)
  async updateZone(data: UpdateZoneDto & { id: string }) {
    try {
      const { id, ...updateData } = data;
      const result = await this.zonesService.update(id, updateData);
      return grpcResponse(result, INVENTORY_MESSAGES.ZONE_UPDATED);
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.DELETE_ZONE)
  async deleteZone(data: { id: string }) {
    try {
      await this.zonesService.remove(data.id);
      return { success: true, message: INVENTORY_MESSAGES.ZONE_DELETED };
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.LIST_ZONES)
  async listZones(data: { wareHouseId: string; page: number; limit: number }) {
    try {
      const { data: zones, ...meta } = await this.zonesService.findAll(
        data.page,
        data.limit,
        { wareHouseId: data.wareHouseId },
      );
      return grpcPaginateResponse(
        { data: zones, ...meta },
        INVENTORY_MESSAGES.ZONE_LIST_SUCCESS,
      );
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  // Rack
  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.CREATE_RACK)
  async createRack(data: CreateRackDto) {
    try {
      const result = await this.racksService.create(data);
      return grpcResponse(result, INVENTORY_MESSAGES.RACK_CREATED);
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.UPDATE_RACK)
  async updateRack(data: UpdateRackDto & { id: string }) {
    try {
      const { id, ...updateData } = data;
      const result = await this.racksService.update(id, updateData);
      return grpcResponse(result, INVENTORY_MESSAGES.RACK_UPDATED);
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.DELETE_RACK)
  async deleteRack(data: { id: string }) {
    try {
      await this.racksService.remove(data.id);
      return { success: true, message: INVENTORY_MESSAGES.RACK_DELETED };
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.LIST_RACKS)
  async listRacks(data: { zoneId: string; page: number; limit: number }) {
    try {
      const { data: racks, ...meta } = await this.racksService.findAll(
        data.page,
        data.limit,
        { zoneId: data.zoneId },
      );
      return grpcPaginateResponse(
        { data: racks, ...meta },
        INVENTORY_MESSAGES.RACK_LIST_SUCCESS,
      );
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  // Bin
  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.CREATE_BIN)
  async createBin(data: CreateBinDto) {
    try {
      const result = await this.binsService.create(data);
      return grpcResponse(result, INVENTORY_MESSAGES.BIN_CREATED);
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.UPDATE_BIN)
  async updateBin(data: UpdateBinDto & { id: string }) {
    try {
      const { id, ...updateData } = data;
      const result = await this.binsService.update(id, updateData);
      return grpcResponse(result, INVENTORY_MESSAGES.BIN_UPDATED);
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.DELETE_BIN)
  async deleteBin(data: { id: string }) {
    try {
      await this.binsService.remove(data.id);
      return { success: true, message: INVENTORY_MESSAGES.BIN_DELETED };
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.LIST_BINS)
  async listBins(data: { rackId: string; page: number; limit: number }) {
    try {
      const { data: bins, ...meta } = await this.binsService.findAll(
        data.page,
        data.limit,
        { rackId: data.rackId },
      );
      return grpcPaginateResponse(
        { data: bins, ...meta },
        INVENTORY_MESSAGES.BIN_LIST_SUCCESS,
      );
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  // Stock
  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.GET_STOCK_LEVEL)
  async getStockLevel(data: { productId: string; warehouseId?: string }) {
    try {
      const result = await this.inventoryService.getStockLevel(
        data.productId,
        data.warehouseId,
      );
      return grpcResponse(result, INVENTORY_MESSAGES.STOCK_LEVEL_SUCCESS);
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  @GrpcMethod(GRPC_SERVICES.INVENTORY, INVENTORY_METHODS.ADJUST_STOCK)
  async adjustStock(data: AdjustStockDto) {
    try {
      const result = await this.inventoryService.adjustStock(data);
      return grpcResponse(result, INVENTORY_MESSAGES.STOCK_ADJUSTED);
    } catch (error) {
      throw new RpcException(error as any);
    }
  }

  @EventPattern('inbound.completed')
  async handleInboundCompleted(@Payload() data: any) {
    Logger.log('Inbound completed event received', 'InventoryController');
    // TODO: Implement logic to increase stock based on inbound data
    // This likely involves mapping the inbound items to AdjustStockDto and calling adjustStock
    // For now, we just log it as the payload structure is not fully defined
    console.log(data);
  }

  @EventPattern('outbound.completed')
  async handleOutboundCompleted(@Payload() data: any) {
    Logger.log('Outbound completed event received', 'InventoryController');
    // TODO: Implement logic to decrease stock based on outbound data
    console.log(data);
  }
}
