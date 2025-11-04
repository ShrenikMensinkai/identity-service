import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  toResponseDto(user: UserDocument): UserResponseDto {
    return {
      id: (user._id as any).toString(),
      emailId: user.emailId,
      username: user.username,
      role: user.role,
      createdAt: (user as any).createdAt,
      updatedAt: (user as any).updatedAt,
    };
  }

  async findByEmail(emailId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ emailId }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userModel.create({
      emailId: createUserDto.email,
      password: hashedPassword,
      username: createUserDto.username,
      role: UserRole.USER,
    });

    return this.toResponseDto(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.findById(id);

    const updateData: Partial<User> = {};

    if (updateUserDto.username) {
      updateData.username = updateUserDto.username;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return this.toResponseDto(updatedUser);
  }

  async updateRole(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<UserResponseDto> {
    const user = await this.findById(id);

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { role: updateRoleDto.role }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return this.toResponseDto(updatedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => this.toResponseDto(user));
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findById(userId);

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userModel
      .findByIdAndUpdate(userId, { password: hashedPassword })
      .exec();
  }

}

