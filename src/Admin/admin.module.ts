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
import { MailModule } from './mailer.module';
import { PusherModule } from './Pusher/pusher.module';
import { PusherProvider } from './Pusher/pusher.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Profile, User, Seller]),
    PassportModule,
    JwtModule.register({
      secret: 'jwt_secret_key',   
      signOptions: { expiresIn: '1h' },
    }),
    MailModule,
    PusherModule
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy,PusherProvider],
  exports: [AdminService], 
})
export class AdminModule {}
