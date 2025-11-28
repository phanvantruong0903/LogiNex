import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  prismaInventory,
  AdjustStockDto,
  INVENTORY_MESSAGES,
} from '@loginex/common';

@Injectable()
export class InventoryService {
  private readonly prisma = prismaInventory;

  // Stock
  async getStockLevel(productId: string, warehouseId?: string) {
    const where: any = { productId };
    if (warehouseId) {
      where.bin = { Rack: { Zone: { wareHouseId: warehouseId } } };
    }

    const binItems = await this.prisma.binItem.findMany({
      where,
      include: { bin: true },
    });

    const totalQuantity = binItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const details = binItems.map((item) => ({
      binId: item.binId,
      binCode: item.bin.code,
      quantity: item.quantity,
    }));

    return { productId, totalQuantity, details };
  }

  async adjustStock(data: AdjustStockDto) {
    const { binId, productId, quantityChange } = data;

    return this.prisma.$transaction(async (tx) => {
      const bin = await tx.bin.findUnique({ where: { id: binId } });
      if (!bin) throw new NotFoundException(INVENTORY_MESSAGES.BIN_NOT_FOUND);

      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new NotFoundException('Product not found');

      // Check capacity if adding stock
      if (quantityChange > 0) {
        const weightChange = product.weight * quantityChange;
        const volumeChange = product.volume * quantityChange;

        if (
          bin.currWeight + weightChange > bin.maxWeight ||
          bin.currVolume + volumeChange > bin.maxVolume
        ) {
          throw new BadRequestException(
            INVENTORY_MESSAGES.BIN_CAPACITY_EXCEEDED,
          );
        }

        await tx.bin.update({
          where: { id: binId },
          data: {
            currWeight: { increment: weightChange },
            currVolume: { increment: volumeChange },
          },
        });
      } else {
        // Removing stock
        const weightChange = product.weight * Math.abs(quantityChange);
        const volumeChange = product.volume * Math.abs(quantityChange);

        await tx.bin.update({
          where: { id: binId },
          data: {
            currWeight: { decrement: weightChange },
            currVolume: { decrement: volumeChange },
          },
        });
      }

      // Update BinItem
      const binItem = await tx.binItem.findUnique({
        where: { binId_productId: { binId, productId } },
      });

      if (binItem) {
        const newQuantity = binItem.quantity + quantityChange;
        if (newQuantity < 0)
          throw new BadRequestException(INVENTORY_MESSAGES.INSUFFICIENT_STOCK);

        if (newQuantity === 0) {
          await tx.binItem.delete({ where: { id: binItem.id } });
        } else {
          await tx.binItem.update({
            where: { id: binItem.id },
            data: { quantity: newQuantity },
          });
        }
      } else {
        if (quantityChange < 0)
          throw new BadRequestException(INVENTORY_MESSAGES.INSUFFICIENT_STOCK);
        await tx.binItem.create({
          data: { binId, productId, quantity: quantityChange },
        });
      }

      return this.getStockLevel(productId);
    });
  }
}
