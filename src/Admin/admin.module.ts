import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Admin } from 'src/entity/admin.entity';
import { Profile } from 'src/entity/profile.entity';
import { JwtStrategy } from './auth/jwt.strategy';
import { User } from 'src/entity/user.entity';
import { Seller } from 'src/entity/Seller.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Profile, User, Seller]),
    PassportModule,
    JwtModule.register({
      secret: 'jwt_secret_key',   
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy],
  exports: [AdminService], 
})
export class AdminModule {}
