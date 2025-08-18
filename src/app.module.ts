import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetails } from './entity/order_details.entity';
import { Product } from './entity/product.entity';
import { User } from './entity/user.entity';
import { Sell } from './entity/sell.entity';
import { Status } from './entity/status.entity';
import { Voucher } from './entity/voucher.entity';
import { Profile } from './entity/profile.entity';
import { Admin } from './entity/admin.entity';
import { AdminModule } from './Admin/admin.module';
import { Seller } from './entity/Seller.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'newpassword',
      database: 'ecommarce2',
      entities: [OrderDetails, Product, User, Sell, Status, Voucher , Profile , Admin , Seller ],
      synchronize: true,
    }),
    UserModule,AdminModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
