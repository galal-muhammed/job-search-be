import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { JobLocation } from '../enum/jobLocation.enum.js';
import { WorkingTime } from '../enum/workingTime.enum.js';
import { SeniorityLevel } from '../enum/seniorityLevel.enum.js';

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  jobTitle?: string;

  @IsEnum(JobLocation)
  @IsOptional()
  jobLocation?: JobLocation;

  @IsEnum(WorkingTime)
  @IsOptional()
  workingTime?: WorkingTime;

  @IsEnum(SeniorityLevel)
  @IsOptional()
  seniorityLevel?: SeniorityLevel;

  @IsString()
  @IsOptional()
  jobDescription?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsOptional()
  technicalSkills?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  softSkills?: string[];
}