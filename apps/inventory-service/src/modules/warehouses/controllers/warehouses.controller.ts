import { Controller, Logger } from '@nestjs/common';
import {
  GrpcMethod,
  RpcException,
  EventPattern,
  Payload,
} from '@nestjs/microservices';
import { WarehousesService } from '../services/warehouses.service';
import {
  GRPC_SERVICES,
  WAREHOUSE_MESSAGES,
  CreateWarehouseDto,
  UpdateWarehouseDto,
  grpcResponse,
  grpcPaginateResponse,
  WAREHOUSE_METHODS,
  WareHouse,
  BaseGrpcHandler,
  buildSearchFilter,
} from '@loginex/common';

@Controller()
export class WarehousesController {
  private readonly baseHandler: BaseGrpcHandler<
    WareHouse,
    CreateWarehouseDto,
    UpdateWarehouseDto
  >;

  constructor(private readonly warehousesService: WarehousesService) {
    this.baseHandler = new BaseGrpcHandler(
      this.warehousesService,
      CreateWarehouseDto,
      UpdateWarehouseDto,
    );
  }

  // Warehouse
  @GrpcMethod(GRPC_SERVICES.WAREHOUSE, WAREHOUSE_METHODS.CREATE_WAREHOUSE)
  async createWarehouse(
    data: CreateWarehouseDto,
  ): Promise<ReturnType<typeof grpcResponse<WareHouse>>> {
    try {
      const result = await this.baseHandler.createLogic(data);
      return grpcResponse(result, WAREHOUSE_MESSAGES.WAREHOUSE_CREATED);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(
        err?.message || WAREHOUSE_MESSAGES.WAREHOUSE_CREATED_FAILED,
      );
    }
  }

  @GrpcMethod(GRPC_SERVICES.WAREHOUSE, WAREHOUSE_METHODS.UPDATE_WAREHOUSE)
  async updateWarehouse(
    data: UpdateWarehouseDto & { id: string },
  ): Promise<ReturnType<typeof grpcResponse<WareHouse>>> {
    try {
      const { id, ...updateData } = data;
      const result = await this.baseHandler.updateLogic(id, updateData);
      return grpcResponse(result, WAREHOUSE_MESSAGES.WAREHOUSE_UPDATED);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(
        err?.message || WAREHOUSE_MESSAGES.WAREHOUSE_UPDATED_FAILED,
      );
    }
  }

  @GrpcMethod(GRPC_SERVICES.WAREHOUSE, WAREHOUSE_METHODS.GET_WAREHOUSE)
  async getWarehouse(data: {
    id: string;
  }): Promise<ReturnType<typeof grpcResponse<WareHouse>>> {
    try {
      const result = await this.baseHandler.getOneById(data.id);
      if (!result) {
        throw new RpcException(WAREHOUSE_MESSAGES.WAREHOUSE_NOT_FOUND);
      }
      return grpcResponse(result, WAREHOUSE_MESSAGES.WAREHOUSE_GET_SUCCESS);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(
        err?.message || WAREHOUSE_MESSAGES.WAREHOUSE_GET_FAILED,
      );
    }
  }

  @GrpcMethod(GRPC_SERVICES.WAREHOUSE, WAREHOUSE_METHODS.LIST_WAREHOUSES)
  async listWarehouses(data: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<ReturnType<typeof grpcPaginateResponse<WareHouse>>> {
    try {
      const searchFields = ['name'];
      const searchFilter = buildSearchFilter(data.search, searchFields);

      const { data: warehouses, ...meta } = await this.baseHandler.getAllLogic(
        data.page,
        data.limit,
        searchFilter,
      );
      return grpcPaginateResponse(
        { data: warehouses, ...meta },
        WAREHOUSE_MESSAGES.WAREHOUSE_LIST_SUCCESS,
      );
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(
        err?.message || WAREHOUSE_MESSAGES.WAREHOUSE_LIST_FAILED,
      );
    }
  }

  @GrpcMethod(GRPC_SERVICES.WAREHOUSE, WAREHOUSE_METHODS.INACTIVATE_WAREHOUSE)
  async inactiveWarehouse(data: {
    id: string;
  }): Promise<ReturnType<typeof grpcResponse<WareHouse>>> {
    try {
      const result = await this.warehousesService.inactivate(data.id);
      return grpcResponse(result, WAREHOUSE_MESSAGES.WAREHOUSE_INACTIVATE);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(
        err?.message || WAREHOUSE_MESSAGES.WAREHOUSE_INACTIVATE_FAILED,
      );
    }
  }

  @GrpcMethod(GRPC_SERVICES.WAREHOUSE, WAREHOUSE_METHODS.ACTIVATE_WAREHOUSE)
  async activateWarehouse(data: {
    id: string;
  }): Promise<ReturnType<typeof grpcResponse<WareHouse>>> {
    try {
      const result = await this.warehousesService.activate(data.id);
      return grpcResponse(result, WAREHOUSE_MESSAGES.WAREHOUSE_ACTIVATE);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(
        err?.message || WAREHOUSE_MESSAGES.WAREHOUSE_ACTIVATE_FAILED,
      );
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
