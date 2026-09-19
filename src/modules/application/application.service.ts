import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Application,
  ApplicationDocument,
} from './schema/application.schema.js';
import { ApplicationStatus } from './enum/applicationStatus.enum.js';

import { Job, JobDocument } from '../job/schema/job.schema.js';
import { Company, CompanyDocument } from '../company/schema/company.schema.js';

import { CloudinaryService } from '../../shared/services/cloudinary.service.js';

// NOTE: Do NOT import `Express` from 'express' here.
// `Express.Multer.File` comes from the global namespace added by @types/multer.

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,

    @InjectModel(Job.name)
    private jobModel: Model<JobDocument>,

    @InjectModel(Company.name)
    private companyModel: Model<CompanyDocument>,

    private cloudinaryService: CloudinaryService,
  ) {}

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /**
   * A user is the HR of a job when they are the companyHR of the company
   * that owns the job.
   */
  private async assertCompanyHr(
    job: JobDocument,
    userId: string,
    action: string,
  ) {
    const isHr = await this.companyModel.exists({
      _id: job.companyId,
      companyHR: userId,
    });

    if (!isHr) {
      throw new ForbiddenException(`You are not allowed to ${action}`);
    }
  }

  // ---------------------------------------------------------------------------
  // User endpoints
  // ---------------------------------------------------------------------------

  async create(
    userId: string,
    jobId: string,
    userTechSkills: string[],
    userSoftSkills: string[],
    file: Express.Multer.File,
  ) {
    const job = await this.jobModel.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const existingApplication = await this.applicationModel.findOne({
      jobId,
      userId,
    });

    if (existingApplication) {
      throw new ConflictException('You have already applied to this job');
    }

    // Check that resume exists
    if (!file) {
      throw new BadRequestException('Resume is required');
    }

    // Check that resume is a PDF
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Resume must be a PDF');
    }

    // Upload resume to Cloudinary
    const resume = await this.cloudinaryService.uploadPdf(file.buffer);

    try {
      // status defaults to Pending in the schema
      return await this.applicationModel.create({
        jobId,
        userId,
        userTechSkills,
        userSoftSkills,
        resume,
      });
    } catch (error: any) {
      // Don't leave an orphaned resume in Cloudinary if saving fails
      await this.cloudinaryService.deleteFile(resume.publicId);

      // Unique index { jobId, userId }: two simultaneous requests can pass the
      // findOne check above, so the database is the final guard
      if (error?.code === 11000) {
        throw new ConflictException('You have already applied to this job');
      }

      throw error;
    }
  }

  async findMyApplications(userId: string) {
    return this.applicationModel.find({ userId }).populate({
      path: 'jobId',
      populate: {
        path: 'companyId',
      },
    });
  }

  /**
   * Viewable by the applicant, or by the companyHR of the company that owns the job.
   */
  async findOne(id: string, userId: string) {
    const application = await this.applicationModel.findById(id);

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const isApplicant = application.userId.toString() === userId;

    if (!isApplicant) {
      const job = await this.jobModel.findById(application.jobId);

      if (!job) {
        throw new NotFoundException('Job not found');
      }

      await this.assertCompanyHr(job, userId, 'view this application');
    }

    return application.populate({
      path: 'jobId',
      populate: {
        path: 'companyId',
      },
    });
  }

  async remove(id: string, userId: string) {
    const application = await this.applicationModel.findById(id);

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.userId.toString() !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this application',
      );
    }

    // Delete resume from Cloudinary
    await this.cloudinaryService.deleteFile(application.resume.publicId);

    return this.applicationModel.findByIdAndDelete(id);
  }

  // ---------------------------------------------------------------------------
  // HR endpoints
  // ---------------------------------------------------------------------------

  async findByJob(jobId: string, hrId: string) {
    const job = await this.jobModel.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    await this.assertCompanyHr(job, hrId, "view this job's applications");

    return this.applicationModel.find({ jobId }).sort({ createdAt: -1 });
  }

  async updateStatus(id: string, hrId: string, status: ApplicationStatus) {
    const application = await this.applicationModel.findById(id);

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const job = await this.jobModel.findById(application.jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    await this.assertCompanyHr(job, hrId, 'update this application');

    application.status = status;
    return application.save();
  }
}