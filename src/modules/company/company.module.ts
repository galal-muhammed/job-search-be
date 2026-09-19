import { Module } from '@nestjs/common';
import { CompanyService } from './company.service.js';
import { CompanyController } from './company.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schema/company.schema.js';
import { JwtModule } from '../jwt/jwt.module.js';
import { Job, JobSchema } from '../job/schema/job.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema },{ name: Job.name, schema: JobSchema },]),
    JwtModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [MongooseModule],
})
export class CompanyModule {}