import { IsOptional, Matches } from 'class-validator';
import { Unique } from 'typeorm';

export class ProfileDto {
  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  @Matches(/^(?:\+8801[3-9]\d{8}|01[3-9]\d{8})$/, {
    message: 'Phone number must be a valid Bangladeshi number',
  })
  phone?: string;

  @IsOptional()
  address?: string;
}
