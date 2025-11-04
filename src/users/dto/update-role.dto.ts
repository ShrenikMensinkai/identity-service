import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole, { message: 'Role must be either ADMIN or USER' })
  role: UserRole;
}

