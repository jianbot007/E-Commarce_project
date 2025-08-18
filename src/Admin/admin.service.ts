import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Admin } from 'src/entity/admin.entity';
import { Profile } from 'src/entity/profile.entity';
import { AdminDto } from './AdminDtos/admin.dto';
import { LoginDto } from './AdminDtos/login.dto';
import { UpdateAdminDto } from './AdminDtos/update-admin.dto';
import { User } from 'src/entity/user.entity';
import { Seller } from 'src/entity/Seller.entity';
import { MailService } from './mail.service';
import { ProfileDto } from './AdminDtos/profile.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly mailService : MailService,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Seller) private sellerRepo: Repository<Seller>,
    private jwtService: JwtService,
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

    const payload = { sub: admin.id, email: admin.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async getProfile(id: number): Promise<Admin> {
    const admin = await this.adminRepo.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!admin) throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    return admin;
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

async searchUserByName(user_name: string): Promise<User[]> {
  return this.userRepo.find({ where: { user_name } });
}

async searchSellerByName(name: string): Promise<Seller[]> {
  return this.sellerRepo.find({ where: { name } }); 
}

async blockSeller(id: number): Promise<Seller> {
    const seller = await this.sellerRepo.findOne({ where: { id } });
    if (!seller) throw new NotFoundException('Seller not found');

    seller.isBlocked = true; // set block to true
    return this.sellerRepo.save(seller);
  }

}
