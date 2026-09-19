import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './schema/company.schema.js';
import { CreateCompanyDto } from './dto/createCompany.dto.js';
import { UpdateCompanyDto } from './dto/updateCompany.dto.js';
import { Job, JobDocument } from '../job/schema/job.schema.js';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
  ) {}

  async create(userId: string, dto: CreateCompanyDto) {
    const nameTaken = await this.companyModel.findOne({
      companyName: dto.companyName,
    });
    if (nameTaken) {
      throw new ConflictException('Company name already exists');
    }

    const emailTaken = await this.companyModel.findOne({
      companyEmail: dto.companyEmail,
    });
    if (emailTaken) {
      throw new ConflictException('Company email already exists');
    }

    return this.companyModel.create({ ...dto, companyHR: userId });
  }

  async findOne(id: string) {
    const company = await this.companyModel.findById(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const jobs = await this.jobModel.find({ companyId: company._id.toString() });

    return {
      ...company.toObject(),
      jobs,
    };
  }

  async update(id: string, userId: string, dto: UpdateCompanyDto) {
    const company = await this.companyModel.findById(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.companyHR.toString() !== userId) {
      throw new ForbiddenException('You do not own this company');
    }

    if (dto.companyName) {
      const nameTaken = await this.companyModel.findOne({
        companyName: dto.companyName,
        _id: { $ne: id },
      });
      if (nameTaken) {
        throw new ConflictException('Company name already exists');
      }
    }

    if (dto.companyEmail) {
      const emailTaken = await this.companyModel.findOne({
        companyEmail: dto.companyEmail,
        _id: { $ne: id },
      });
      if (emailTaken) {
        throw new ConflictException('Company email already exists');
      }
    }

    const updated = await this.companyModel.findByIdAndUpdate(id, dto, {
      returnDocument: 'after',
    });

    return updated;
  }

  async remove(id: string, userId: string) {
    const company = await this.companyModel.findById(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.companyHR.toString() !== userId) {
      throw new ForbiddenException('You do not own this company');
    }

    return this.companyModel.findByIdAndDelete(id);
  }

  async searchByName(name: string) {
    return this.companyModel.find({
      companyName: { $regex: name, $options: 'i' },
    });
  }
  async findMyCompanies(userId: string) {
    return this.companyModel.find({ companyHR: userId });
  }
}
