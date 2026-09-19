import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { JobLocation } from '../enum/jobLocation.enum.js';
import { WorkingTime } from '../enum/workingTime.enum.js';
import { SeniorityLevel } from '../enum/seniorityLevel.enum.js';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true, type: String, trim: true })
  jobTitle: string;

  @Prop({ required: true, type: String, enum: JobLocation })
  jobLocation: JobLocation;

  @Prop({ required: true, type: String, enum: WorkingTime })
  workingTime: WorkingTime;

  @Prop({ required: true, type: String, enum: SeniorityLevel })
  seniorityLevel: SeniorityLevel;

  @Prop({ required: true, type: String, trim: true })
  jobDescription: string;

  @Prop({
    required: true,
    type: [String],
    validate: {
      validator: (arr: string[]) => arr.length > 0,
      message: 'At least one technical skill is required',
    },
  })
  technicalSkills: string[];

  @Prop({ required: true, type: [String] })
  softSkills: string[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  addedBy: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Company' })
  companyId: Types.ObjectId;
}

export const JobSchema = SchemaFactory.createForClass(Job);
