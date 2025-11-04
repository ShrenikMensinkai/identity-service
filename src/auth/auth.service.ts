import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { LoginRecord, LoginRecordDocument } from '../database/schemas/login-record.schema';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(LoginRecord.name)
    private loginRecordModel: Model<LoginRecordDocument>,
  ) {}

  async register(registerDto: RegisterDto) {
    return this.usersService.create(registerDto);
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: UserDocument, ipAddress: string): Promise<LoginResponseDto> {
    const payload = {
      sub: (user._id as any).toString(),
      email: user.emailId,
      role: user.role,
    };

    // Record the login
    await this.loginRecordModel.create({
      userId: user._id,
      ipAddress,
    });

    const expiresIn = 3600; // 1 hour in seconds

    return {
      access_token: this.jwtService.sign(payload, { expiresIn }),
      expires_in: expiresIn,
      token_type: 'Bearer',
    };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.usersService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }
}

