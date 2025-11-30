import { Module } from '@nestjs/common';
import { AuthModule } from '../modules/auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
import { UserModule } from '../modules/user/user.module';
import '../modules/user/graphql/enum';
import { ProductModule } from '../modules/product/product.module';
import { WarehouseModule } from '../modules/warehouse/warehouse.module';
import { StockModule } from '../modules/stock/stock.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      introspection: true,
      csrfPrevention: false,
      plugins: [
        process.env.NODE_ENV === 'production'
          ? (ApolloServerPluginLandingPageDisabled() as any)
          : ApolloServerPluginLandingPageLocalDefault({
              embed: true,
              includeCookies: true,
            }),
      ],
    }),
    AuthModule,
    UserModule,
    ProductModule,
    ProductModule,
    WarehouseModule,
    StockModule,
  ],
})
export class AppModule {}
