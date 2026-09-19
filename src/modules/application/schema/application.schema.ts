import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApplicationStatus } from '../enum/applicationStatus.enum.js';

export type ApplicationDocument = HydratedDocument<Application>;

@Schema({ timestamps: true })
export class Application {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Job',
  })
  jobId: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    type: [String],
  })
  userTechSkills: string[];

  @Prop({
    required: true,
    type: [String],
  })
  userSoftSkills: string[];

  @Prop({
    required: true,
    type: String,
    enum: ApplicationStatus,
    default: ApplicationStatus.Pending,
  })
  status: ApplicationStatus;
  @Prop({
    required: true,
    type: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
  })
  resume: {
    url: string;
    publicId: string;
  };
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

ApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });
