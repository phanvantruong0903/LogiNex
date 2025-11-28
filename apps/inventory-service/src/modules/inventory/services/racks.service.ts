import {
  BaseService,
  CreateRackDto,
  INVENTORY_MESSAGES,
  prismaInventory,
  Rack,
  UpdateRackDto,
} from '@loginex/common';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class RacksService extends BaseService<
  Rack,
  CreateRackDto,
  UpdateRackDto
> {
  constructor() {
    super(prismaInventory.rack);
  }

  override async remove(id: string): Promise<Rack> {
    const rack = await this.findOne(id);
    if (!rack) {
      throw new NotFoundException(INVENTORY_MESSAGES.RACK_NOT_FOUND);
    }
    return super.remove(id);
  }
}
