import {Body,Controller,Delete,Get,Param,Put,Query,Post,UseGuards,UsePipes,ValidationPipe, Patch, ParseIntPipe, HttpStatus, HttpException, Req
} from '@nestjs/common';

import { AdminDto } from './AdminDtos/admin.dto';
import { LoginDto } from './AdminDtos/login.dto';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { User } from 'src/entity/user.entity';
import { Seller } from 'src/entity/Seller.entity';
import { Admin } from 'src/entity/admin.entity';
import { Profile } from 'src/entity/profile.entity';
import { ProfileDto } from './AdminDtos/profile.dto';

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
  try {
    const result = await this.adminService.login(loginDto);
    console.log("Login Success Response:", result);
    return result;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
}



  @Put('change-password/:id')
  async changePassword(
    @Param('id') id: string,
    @Body() body: { oldPassword: string; newPassword: string },
  ): Promise<{ message: string }> {
    const adminId = parseInt(id, 10);
    if (isNaN(adminId)) {
      throw new HttpException('Invalid admin ID', HttpStatus.BAD_REQUEST);
    }

    const { oldPassword, newPassword } = body;
    if (!oldPassword || !newPassword) {
      throw new HttpException(
        'Old password and new password are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.adminService.changePassword(adminId, oldPassword, newPassword);
  }



  @UseGuards(JwtAuthGuard)
  @Get('Admin/:email')
  async getAdmin(@Param('email') email: string): Promise<Admin> {
    return this.adminService.getAdmin(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  async getProfile(@Param('id') id: number): Promise<Profile> {
    return this.adminService.getProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  @UsePipes(new ValidationPipe({}))
  async update(
    @Param('id') id: number,
    @Body() updateprofileDto: ProfileDto,
  ): Promise<Profile> {
    return this.adminService.update(id, updateprofileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    return this.adminService.delete(+id);
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
 @UseGuards(JwtAuthGuard)
  @Patch("block/:id")
  async blockSeller(
    @Param("id", ParseIntPipe) id: number,
    @Req() req
  ) {
    const adminId = 6; 
    return this.adminService.blockSeller(id, adminId);
  }


     @UseGuards(JwtAuthGuard)
  @Patch("unblock/:id")
  async unblockSeller(
    @Param("id", ParseIntPipe) id: number,
    @Req() req
  ) {
    const adminId = 6; 
    return this.adminService.unblockSeller(id, adminId);
  }

@UseGuards(JwtAuthGuard)
@Delete('sellers/:id')
async DeleteSeller(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
  return this.adminService.DeleteSeller(id);
}
  


 @UseGuards(JwtAuthGuard)
@Get('sellers/:id')
async SellerById(@Param('id', ParseIntPipe) id: number): Promise<Seller | null> {
  return this.adminService.SellerById(id);
}
  

   @UseGuards(JwtAuthGuard)
  @Get('profiles/:id')
  async getOnlyProfile(@Param('id') id: number): Promise<LoginDto> {
    return this.adminService.getonlyProfile(id);
  }


  @UseGuards(JwtAuthGuard)
  @Get('dashboard-stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

}
