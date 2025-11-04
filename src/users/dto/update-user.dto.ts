import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User username',
    example: 'John Doe Updated',
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Username must be at least 1 character long' })
  @MaxLength(50, { message: 'Username must not exceed 50 characters' })
  username?: string;
}

