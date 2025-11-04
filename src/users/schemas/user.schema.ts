import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  emailId: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  username: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
    required: true,
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

