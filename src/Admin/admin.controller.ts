import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AdminDto } from './AdminDtos/admin.dto';
import { LoginDto } from './AdminDtos/login.dto';
import { UpdateAdminDto } from './AdminDtos/update-admin.dto';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { User } from 'src/entity/user.entity';
import { Seller } from 'src/entity/Seller.entity';
import { Admin } from 'src/entity/admin.entity';
import { Profile } from 'src/entity/profile.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({}))
  async register(@Body() createAdminDto: AdminDto): Promise<Admin> {
    return this.adminService.register(createAdminDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({}))
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.adminService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  async getProfile(@Param('id') id: number): Promise<Admin> {
    return this.adminService.getProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  @UsePipes(new ValidationPipe({}))
  async update(
    @Param('id') id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<Admin> {
    return this.adminService.update(id, updateAdminDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    return this.adminService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Profile[]> {
    return this.adminService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async findAllUser(): Promise<User[]> {
    return this.adminService.findAllUser();
  }

  @UseGuards(JwtAuthGuard)
  @Get('sellers')
  async findAllSeller(): Promise<Seller[]> {
    return this.adminService.findAllSeller();
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/search')
  async searchUser(@Query('name') user_name: string): Promise<User[]> {
    return this.adminService.searchUserByName(user_name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sellers/search')
  async searchSeller(@Query('name') name: string): Promise<Seller[]> {
    return this.adminService.searchSellerByName(name);
  }
}
