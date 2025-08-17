import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Sell } from '../entity/sell.entity';
import { Status } from '../entity/status.entity';
import { OrderDetails } from '../entity/order_details.entity';
import { Product } from '../entity/product.entity';
import { Voucher } from '../entity/voucher.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User,Product, OrderDetails, Status,Sell,Voucher])],
  controllers: [],
  providers: [],
})

export class UserModule {}
