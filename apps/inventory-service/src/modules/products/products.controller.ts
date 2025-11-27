import {
  BaseGrpcHandler,
  Product,
  CreateProductDto,
  UpdateProductDto,
  GRPC_SERVICES,
  PRODUCT_METHODS,
  throwGrpcError,
  PRODUCT_MESSAGES,
  prismaInventory,
  grpcResponse,
  grpcPaginateResponse,
  SERVER_MESSAGE,
} from '@loginex/common';
import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller()
export class ProductsController {
  private readonly baseHandler: BaseGrpcHandler<
    Product,
    CreateProductDto,
    UpdateProductDto
  >;
  constructor(private readonly productsService: ProductsService) {
    this.baseHandler = new BaseGrpcHandler(
      this.productsService,
      CreateProductDto,
      UpdateProductDto,
    );
  }

  @GrpcMethod(GRPC_SERVICES.PRODUCT, PRODUCT_METHODS.CREATE)
  async createProduct(
    data: CreateProductDto,
  ): Promise<ReturnType<typeof grpcResponse<Product>>> {
    try {
      const dto = plainToInstance(CreateProductDto, data);
      const errors = await validate(dto);

      if (errors.length > 0) {
        const messages = errors.flatMap((error) =>
          Object.values(error.constraints || {}),
        );
        throwGrpcError(PRODUCT_MESSAGES.VALIDATION_FAILED, messages);
      }

      const volume = data.width * data.height * data.length;

      const payload = {
        ...data,
        volume,
      };

      const result = await this.baseHandler.createLogic(payload);

      return grpcResponse<Product>(result, PRODUCT_MESSAGES.CREATE_SCUCCESS);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(err?.message || PRODUCT_MESSAGES.CREATE_FAILED);
    }
  }

  @GrpcMethod(GRPC_SERVICES.PRODUCT, PRODUCT_METHODS.UPDATE)
  async updateProduct(
    data: UpdateProductDto & { id: string },
  ): Promise<ReturnType<typeof grpcResponse<Product>>> {
    try {
      const dto = plainToInstance(UpdateProductDto, data);
      const errors = await validate(dto);

      if (errors.length > 0) {
        const messages = errors.flatMap((error) =>
          Object.values(error.constraints || {}),
        );
        throwGrpcError(SERVER_MESSAGE.VALIDATION_FAILED, messages);
      }

      const { id, ...updateData } = data;

      const findProduct = await prismaInventory.product.findUnique({
        where: { id },
        select: {
          id: true,
        },
      });
      if (!findProduct) {
        throwGrpcError(PRODUCT_MESSAGES.NOT_FOUND, [
          PRODUCT_MESSAGES.NOT_FOUND,
        ]);
      }

      const result = await this.baseHandler.updateLogic(
        findProduct.id,
        updateData,
      );

      return grpcResponse<Product>(result, PRODUCT_MESSAGES.UPDATE_SUCCESS);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(err?.message || PRODUCT_MESSAGES.UPDATE_FAIL);
    }
  }

  @GrpcMethod(GRPC_SERVICES.PRODUCT, PRODUCT_METHODS.GET_ALL)
  async getAllProducts(data: {
    page: number;
    limit: number;
  }): Promise<ReturnType<typeof grpcPaginateResponse<Product>>> {
    try {
      const { page, limit } = data;
      const result = await this.baseHandler.getAllLogic(page, limit);

      return grpcPaginateResponse<Product>(
        result,
        PRODUCT_MESSAGES.GET_ALL_SUCCESS,
      );
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(err?.message || PRODUCT_MESSAGES.GET_ALL_FAIL);
    }
  }

  @GrpcMethod(GRPC_SERVICES.PRODUCT, PRODUCT_METHODS.GET_DETAIL)
  async getProductDetail({ id }: { id: string }) {
    try {
      const result = await this.baseHandler.getOneById(id);
      if (!result) {
        throwGrpcError(PRODUCT_MESSAGES.NOT_FOUND, [
          PRODUCT_MESSAGES.NOT_FOUND,
        ]);
      }

      return grpcResponse<Product>(result, PRODUCT_MESSAGES.GET_DETAIL_SUCCESS);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      const err = error as Error;
      throw new RpcException(err?.message || PRODUCT_MESSAGES.GET_DETAIL_FAIL);
    }
  }
}
