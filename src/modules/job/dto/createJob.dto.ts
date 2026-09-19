import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { JobLocation } from '../enum/jobLocation.enum.js';
import { WorkingTime } from '../enum/workingTime.enum.js';
import { SeniorityLevel } from '../enum/seniorityLevel.enum.js';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsEnum(JobLocation)
  @IsNotEmpty()
  jobLocation: JobLocation;

  @IsEnum(WorkingTime)
  @IsNotEmpty()
  workingTime: WorkingTime;

  @IsEnum(SeniorityLevel)
  @IsNotEmpty()
  seniorityLevel: SeniorityLevel;

  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  technicalSkills: string[];

  @IsArray()
  @IsString({ each: true })
  softSkills: string[];

  @IsString()
  @IsNotEmpty()
  companyId: string;
}