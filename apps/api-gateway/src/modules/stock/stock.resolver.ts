import { Resolver } from '@nestjs/graphql';
import { StockService } from './stock.service';

@Resolver('Stock')
export class StockResolver {
  constructor(private readonly stockService: StockService) {}
}
