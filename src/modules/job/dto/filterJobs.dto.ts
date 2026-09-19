import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JobLocation } from '../enum/jobLocation.enum.js';
import { WorkingTime } from '../enum/workingTime.enum.js';
import { SeniorityLevel } from '../enum/seniorityLevel.enum.js';

export class FilterJobsDto {
  @IsEnum(WorkingTime)
  @IsOptional()
  workingTime?: WorkingTime;

  @IsEnum(JobLocation)
  @IsOptional()
  jobLocation?: JobLocation;

  @IsEnum(SeniorityLevel)
  @IsOptional()
  seniorityLevel?: SeniorityLevel;

  @IsString()
  @IsOptional()
  jobTitle?: string;

  @IsString()
  @IsOptional()
  technicalSkills?: string; // comma-separated in query string, parsed in service
}