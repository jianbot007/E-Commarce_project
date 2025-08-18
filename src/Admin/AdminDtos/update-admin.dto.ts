import { IsOptional, IsString, MinLength } from 'class-validator';
import { ProfileDto } from './profile.dto';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
  
  @IsOptional()
  profile?: ProfileDto;
}
