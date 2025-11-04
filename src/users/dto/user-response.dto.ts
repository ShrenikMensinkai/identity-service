import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  emailId: string;

  @ApiProperty({ description: 'User username', example: 'John Doe' })
  username: string;

  @ApiProperty({
    description: 'User role',
    enum: ['ADMIN', 'USER'],
    example: 'USER',
  })
  role: string;

  @ApiProperty({
    description: 'Account creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

