import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from '../../users/schemas/user.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async seedAdmin(): Promise<void> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME');

    if (!adminEmail || !adminPassword) {
      throw new Error(
        'ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables',
      );
    }

    const existingAdmin = await this.userModel.findOne({ emailId: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await this.userModel.create({
      emailId: adminEmail,
      password: hashedPassword,
      username: adminUsername || 'Admin User',
      role: UserRole.ADMIN,
    });

    console.log('Admin user created successfully');
  }
}

