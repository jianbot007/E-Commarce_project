import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, ValidateNested } from 'class-validator';
import { ProfileDto } from './profile.dto';
import { Profile } from 'src/entity/profile.entity';

export class AdminDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @MinLength(6)
  password: string;

  @ValidateNested()
  @Type(() => ProfileDto)   
  profile: Profile;
}
