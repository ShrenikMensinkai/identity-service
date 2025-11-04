import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LoginRecordDocument = LoginRecord & Document;

@Schema({ timestamps: true })
export class LoginRecord {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ default: Date.now, index: true })
  loginAt: Date;
}

export const LoginRecordSchema = SchemaFactory.createForClass(LoginRecord);

