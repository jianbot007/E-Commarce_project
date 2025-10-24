import { Injectable, HttpException, HttpStatus, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Admin } from 'src/entity/admin.entity';
import { Profile } from 'src/entity/profile.entity';
import { AdminDto } from './AdminDtos/admin.dto';
import { LoginDto } from './AdminDtos/login.dto';
import { User } from 'src/entity/user.entity';
import { Seller } from 'src/entity/Seller.entity';
import { MailService } from './mail.service';
import { ProfileDto } from './AdminDtos/profile.dto';
import Pusher from 'pusher';

@Injectable()
export class AdminService {

  constructor(
    private readonly mailService : MailService,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Seller) private sellerRepo: Repository<Seller>,
    private jwtService: JwtService,
     @Inject('PUSHER_CLIENT') private readonly pusher: Pusher, 
  ) {}

  async register(dto: AdminDto): Promise<Admin> {
    const existing = await this.adminRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const admin = this.adminRepo.create({ ...dto, password: hashed });

    await this.mailService.sendRegistrationMail(dto.email,dto.name);
    return this.adminRepo.save(admin);
  }

async login(dto: LoginDto): Promise<{ access_token: string }> {
  const admin = await this.adminRepo.findOne({ where: { email: dto.email } });
  if (!admin) {
    throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
  }

  const valid = await bcrypt.compare(dto.password, admin.password);
  if (!valid) {
    throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
  }

  const payload = { id: admin.id, email: admin.email, name: admin.name };
  const access_token = this.jwtService.sign(payload);

  return { access_token };
}



  async getProfile(id: number): Promise<Profile> {
    const admin = await this.adminRepo.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!admin) throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    return admin.profile;
  }

  async update(id: number, dto: ProfileDto): Promise<Profile> {
    const adminprofile = await this.profileRepo.findOne({ where: { id } });
    if (!adminprofile) throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    Object.assign(adminprofile, dto);
    return this.profileRepo.save(adminprofile);
  }

  async delete(id: number): Promise<{ message: string }> {
    const result = await this.adminRepo.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Admin deleted successfully' };
  }

  async findAll(): Promise<Profile[]> {
    return this.profileRepo.find();
  }

  async findAllUser(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findAllSeller(): Promise<Seller[]> {
    return this.sellerRepo.find();
  }

    async DeleteSeller(id: number): Promise<{ message: string }> {
    const result = await this.sellerRepo.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Seller not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Seller deleted successfully' };
  }

async searchUserByName(user_name: string): Promise<User[]> {
  return this.userRepo.find({ where: { user_name: ILike(`%${user_name}%`),  } });
}

async searchSellerByName(name: string): Promise<Seller[]> {
  return this.sellerRepo.find({ where: { name: ILike(`%${name}%`),  } }); 
}

async SellerById(id: number): Promise<Seller | null> {
  return this.sellerRepo.findOne({ where: { id } });
}

async blockSeller(id: number, adminId: number) {
    const seller = await this.sellerRepo.findOneBy({ id });
    if (!seller) throw new NotFoundException('Seller not found');

    seller.isBlocked = true;
    await this.sellerRepo.save(seller);

    
    const admin = await this.adminRepo.findOneBy({ id: adminId });


    await this.pusher.trigger("admin-channel", "seller-blocked", {
      adminId: admin?.id,
      adminName: admin?.name,
      sellerId: seller.id,
      sellerName: seller.name,
      time: new Date().toISOString(),
    });

    return seller;
  }

  async unblockSeller(id: number, adminId: number) {
    const seller = await this.sellerRepo.findOneBy({ id });
    if (!seller) throw new NotFoundException('Seller not found');

    seller.isBlocked = false;
    await this.sellerRepo.save(seller);

    const admin = await this.adminRepo.findOneBy({ id: adminId });
     
      await this.pusher.trigger("admin-channel", "seller-unblocked", {
      adminId: admin?.id,
      adminName: admin?.name,
      sellerId: seller.id,
      sellerName: seller.name,
      time: new Date().toISOString(),
    });

    console.log(admin?.name);

    return seller;
  }



    async getonlyProfile(id: number): Promise<LoginDto> {
    const admin = await this.profileRepo.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!admin) throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    return admin.admin;
  }

   async getAdmin(email: string): Promise<Admin> {
  const admin = await this.adminRepo.findOne({
    where: { email: email }, 
     relations: ["profile"]
  });

  if (!admin) {
    throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
  }

  return admin;
}

async changePassword(
    adminId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const admin = await this.adminRepo.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      throw new HttpException('Old password is incorrect', HttpStatus.BAD_REQUEST);
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await this.adminRepo.save(admin);

    return { message: 'Password changed successfully' };
  }

  async getDashboardStats() {

  const totalAdmins = await this.adminRepo.count();

  const totalSellers = await this.sellerRepo.count();

  const totalCustomers = await this.userRepo.count();

  const totalBlockedSellers = await this.sellerRepo.count({
    where: { isBlocked: true },
  });

  return {
    totalAdmins,
    totalSellers,
    totalCustomers,
    totalBlockedSellers,
  };
}

}
