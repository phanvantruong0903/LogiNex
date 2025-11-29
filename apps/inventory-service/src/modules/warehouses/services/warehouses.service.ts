import {
  BaseService,
  CreateWarehouseDto,
  WAREHOUSE_MESSAGES,
  prismaInventory,
  UpdateWarehouseDto,
  WareHouse,
} from '@loginex/common';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class WarehousesService extends BaseService<
  WareHouse,
  CreateWarehouseDto,
  UpdateWarehouseDto
> {
  constructor() {
    super(prismaInventory.wareHouse);
  }

  override async remove(id: string): Promise<WareHouse> {
    const warehouse = await this.findOne(id);
    if (!warehouse) {
      throw new NotFoundException(WAREHOUSE_MESSAGES.WAREHOUSE_NOT_FOUND);
    }
    return super.remove(id);
  }
}
