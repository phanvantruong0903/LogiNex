import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { StockService } from './stock.service';
import { GRPC_SERVICES, grpcResponse } from '@loginex/common';

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @GrpcMethod(GRPC_SERVICES.STOCK, 'GetStockLevel')
  async getStockLevel(data: { productId: string; warehouseId?: string }) {
    try {
      const result = await this.stockService.getStockLevel(data);
      return grpcResponse(result);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(err?.message || 'Failed to get stock level');
    }
  }

  @GrpcMethod(GRPC_SERVICES.STOCK, 'AdjustStock')
  async adjustStock(data: {
    binId: string;
    productId: string;
    quantityChange: number;
    reason: string;
  }) {
    try {
      const result = await this.stockService.adjustStock(data);
      return grpcResponse(result);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(err?.message || 'Failed to adjust stock');
    }
  }
}
