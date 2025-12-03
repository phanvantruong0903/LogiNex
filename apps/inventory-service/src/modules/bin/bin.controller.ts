import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { BinService } from './bin.service';
import {
  GRPC_SERVICES,
  WAREHOUSE_MESSAGES,
  CreateBinDto,
  UpdateBinDto,
  grpcResponse,
  grpcPaginateResponse,
  WAREHOUSE_METHODS,
  BaseGrpcHandler,
  Bin,
  buildSearchFilter,
  prismaInventory,
} from '@loginex/common';

@Controller()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class BinController {
  private readonly baseHandler: BaseGrpcHandler<
    Bin,
    CreateBinDto,
    UpdateBinDto
  >;
  constructor(private readonly binService: BinService) {
    this.baseHandler = new BaseGrpcHandler(
      this.binService,
      CreateBinDto,
      UpdateBinDto,
    );
  }

  @GrpcMethod(GRPC_SERVICES.BIN, WAREHOUSE_METHODS.CREATE_BIN)
  async createBin(
    data: CreateBinDto,
  ): Promise<ReturnType<typeof grpcResponse<Bin>>> {
    try {
      const result = await this.baseHandler.createLogic(data);
      return grpcResponse(result, WAREHOUSE_MESSAGES.BIN_CREATED);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(
        err?.message || WAREHOUSE_MESSAGES.BIN_CREATED_FAILED,
      );
    }
  }

  @GrpcMethod(GRPC_SERVICES.BIN, WAREHOUSE_METHODS.UPDATE_BIN)
  async updateBin(
    data: UpdateBinDto & { id: string },
  ): Promise<ReturnType<typeof grpcResponse<Bin>>> {
    try {
      const { id, ...updateData } = data;
      const result = await this.baseHandler.updateLogic(id, updateData);
      return grpcResponse(result, WAREHOUSE_MESSAGES.BIN_UPDATED);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(
        err?.message || WAREHOUSE_MESSAGES.BIN_UPDATED_FAILED,
      );
    }
  }

  @GrpcMethod(GRPC_SERVICES.BIN, WAREHOUSE_METHODS.DELETE_BIN)
  async deleteBin(data: {
    id: string;
  }): Promise<ReturnType<typeof grpcResponse<null>>> {
    try {
      await this.baseHandler.deleteLogic(data.id);
      return grpcResponse(null, WAREHOUSE_MESSAGES.BIN_DELETED);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(
        err?.message || WAREHOUSE_MESSAGES.BIN_DELETED_FAILED,
      );
    }
  }

  @GrpcMethod(GRPC_SERVICES.BIN, WAREHOUSE_METHODS.LIST_BINS)
  async listBins(data: {
    rackId: string;
    page: number;
    limit: number;
    search?: string;
  }): Promise<ReturnType<typeof grpcPaginateResponse<Bin>>> {
    try {
      const searchFields = ['code'];
      const searchFilter = buildSearchFilter(data.search, searchFields);

      const { data: bins, ...meta } = await this.baseHandler.getAllLogic(
        data.page,
        data.limit,
        { rackId: data.rackId, ...searchFilter },
      );
      return grpcPaginateResponse(
        { data: bins, ...meta },
        WAREHOUSE_MESSAGES.BIN_LIST_SUCCESS,
      );
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(
        err?.message || WAREHOUSE_MESSAGES.BIN_LIST_FAILED,
      );
    }
  }

  @GrpcMethod(GRPC_SERVICES.BIN, WAREHOUSE_METHODS.GET_BIN_LAYOUT)
  async getBinLayout(data: {
    rackId: string;
  }): Promise<ReturnType<typeof grpcResponse>> {
    try {
      const result = await prismaInventory.bin.findMany({
        where: {
          rackId: data.rackId,
        },
        select: {
          id: true,
          rackId: true,
          code: true,
          xCoord: true,
          yCoord: true,
          currVolume: true,
          maxVolume: true,
          currWeight: true,
          maxWeight: true,
        },
      });

      return grpcResponse(result, WAREHOUSE_MESSAGES.BIN_GET_SUCCESS);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(err?.message || WAREHOUSE_MESSAGES.BIN_GET_FAILED);
    }
  }

  @GrpcMethod(GRPC_SERVICES.BIN, WAREHOUSE_METHODS.GET_BIN_PRODUCT)
  async getProductInBin(data: {
    binId: string;
  }): Promise<ReturnType<typeof grpcResponse>> {
    try {
      const result = await prismaInventory.bin.findUnique({
        where: {
          id: data.binId,
        },
        select: {
          id: true,
          code: true,
          currVolume: true,
          maxVolume: true,
          currWeight: true,
          maxWeight: true,
          items: {
            select: {
              quantity: true,
              product: {
                select: {
                  id: true,
                  sku: true,
                  name: true,
                  volume: true,
                  weight: true,
                  isFragile: true,
                  isHighValue: true,
                },
              },
            },
          },
        },
      });

      return grpcResponse(result, WAREHOUSE_MESSAGES.BIN_GET_SUCCESS);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(err?.message || WAREHOUSE_MESSAGES.BIN_GET_FAILED);
    }
  }
}
