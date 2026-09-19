import { Module } from '@nestjs/common';
import { JobService } from './job.service.js';
import { JobController } from './job.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schema/job.schema.js';
import { JwtModule } from '../jwt/jwt.module.js';
import { CompanyModule } from '../company/company.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    JwtModule,
    CompanyModule,
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [MongooseModule],
})
export class JobModule {}