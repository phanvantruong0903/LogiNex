import {
  BaseService,
  CreateZoneDto,
  INVENTORY_MESSAGES,
  prismaInventory,
  UpdateZoneDto,
  Zone,
} from '@loginex/common';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ZonesService extends BaseService<
  Zone,
  CreateZoneDto,
  UpdateZoneDto
> {
  constructor() {
    super(prismaInventory.zone);
  }

  override async remove(id: string): Promise<Zone> {
    const zone = await this.findOne(id);
    if (!zone) {
      throw new NotFoundException(INVENTORY_MESSAGES.ZONE_NOT_FOUND);
    }
    return super.remove(id);
  }
}
