import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job, JobDocument } from './schema/job.schema.js';
import { Company, CompanyDocument } from '../company/schema/company.schema.js';
import { CreateJobDto } from './dto/createJob.dto.js';
import { UpdateJobDto } from './dto/updateJob.dto.js';
import { FilterJobsDto } from './dto/filterJobs.dto.js';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async create(userId: string, dto: CreateJobDto) {
    const company = await this.companyModel.findById(dto.companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.companyHR.toString() !== userId) {
      throw new ForbiddenException('You do not own this company');
    }

    return this.jobModel.create({ ...dto, addedBy: userId });
  }

  async update(id: string, userId: string, dto: UpdateJobDto) {
    const job = await this.jobModel.findById(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    if (job.addedBy.toString() !== userId) {
      throw new ForbiddenException('You do not own this job');
    }

    return this.jobModel.findByIdAndUpdate(id, dto, {
      returnDocument: 'after',
    });
  }

  async remove(id: string, userId: string) {
    const job = await this.jobModel.findById(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    if (job.addedBy.toString() !== userId) {
      throw new ForbiddenException('You do not own this job');
    }

    return this.jobModel.findByIdAndDelete(id);
  }

  async findAllWithCompany() {
    return this.jobModel.find().populate('companyId');
  }

  async findByCompanyName(companyName: string) {
    const company = await this.companyModel.findOne({
      companyName: { $regex: companyName, $options: 'i' },
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    

    const jobs = await this.jobModel.find({ companyId: company._id.toString() });

    return jobs;
  }

  async filter(filters: FilterJobsDto) {
    const query: Record<string, any> = {};

    if (filters.workingTime) query.workingTime = filters.workingTime;
    if (filters.jobLocation) query.jobLocation = filters.jobLocation;
    if (filters.seniorityLevel) query.seniorityLevel = filters.seniorityLevel;
    if (filters.jobTitle) {
      query.jobTitle = { $regex: filters.jobTitle, $options: 'i' };
    }
    if (filters.technicalSkills) {
      const skillsArray = filters.technicalSkills
        .split(',')
        .map((s) => s.trim());
      query.technicalSkills = { $in: skillsArray };
    }

    return this.jobModel.find(query).populate('companyId');
  }
}
