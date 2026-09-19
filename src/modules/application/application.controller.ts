import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { ApplicationService } from './application.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto.js';

import { JwtAuthGuard } from '../../common/guards/jwtAuth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator.js';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe.js';

import { Role } from '../user/enum/role.enum.js';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}


  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.User])
  @UseInterceptors(
    FileInterceptor('resume', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ResponseMessage('Application submitted successfully')
  create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateApplicationDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.applicationService.create(
      userId,
      dto.jobId,
      dto.userTechSkills,
      dto.userSoftSkills,
      file,
    );
  }

  @Get('my-applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.User])
  @ResponseMessage('Applications retrieved successfully')
  findMyApplications(@CurrentUser('sub') userId: string) {
    return this.applicationService.findMyApplications(userId);
  }

  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Company_HR])
  @ResponseMessage('Job applications retrieved successfully')
  findByJob(
    @Param('jobId', ParseObjectIdPipe) jobId: string,
    @CurrentUser('sub') hrId: string,
  ) {
    return this.applicationService.findByJob(jobId, hrId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.User, Role.Company_HR])
  @ResponseMessage('Application retrieved successfully')
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.applicationService.findOne(id, userId);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Company_HR])
  @ResponseMessage('Application status updated successfully')
  updateStatus(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser('sub') hrId: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationService.updateStatus(id, hrId, dto.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.User])
  @ResponseMessage('Application withdrawn successfully')
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.applicationService.remove(id, userId);
  }
}