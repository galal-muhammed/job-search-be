import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CompanySize } from '../enum/companySize.enum.js';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
export class Company {
  @Prop({
    required: true,
    type: String,
    unique: true,
    trim: true,
  })
  companyName: string;

  @Prop({ required: true, type: String, trim: true })
  description: string;

  @Prop({ required: true, type: String, trim: true })
  industry: string;

  @Prop({ required: true, type: String, trim: true })
  address: string;

  @Prop({ required: true, type: String, enum: CompanySize })
  numberOfEmployees: CompanySize;

  @Prop({
    required: true,
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  })
  companyEmail: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  companyHR: Types.ObjectId;
}

export const CompanySchema = SchemaFactory.createForClass(Company);