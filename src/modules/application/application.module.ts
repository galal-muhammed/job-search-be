import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationController } from './application.controller.js';
import { ApplicationService } from './application.service.js';
import {
  Application,
  ApplicationSchema,
} from './schema/application.schema.js';
import { Job, JobSchema } from '../job/schema/job.schema.js';
import { Company, CompanySchema } from '../company/schema/company.schema.js';
import { SharedModule } from '../../shared/shared.module.js';
import { JwtModule } from '../jwt/jwt.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Application.name,
        schema: ApplicationSchema,
      },
      {
        name: Job.name,
        schema: JobSchema,
      },
      {
        name: Company.name,
        schema: CompanySchema,
      },
    ]),
    SharedModule,
    JwtModule
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}