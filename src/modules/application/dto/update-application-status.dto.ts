import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '../enum/applicationStatus.enum.js';

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}