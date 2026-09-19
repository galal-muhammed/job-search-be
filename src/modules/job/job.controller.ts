import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service.js';
import { CreateJobDto } from './dto/createJob.dto.js';
import { UpdateJobDto } from './dto/updateJob.dto.js';
import { FilterJobsDto } from './dto/filterJobs.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwtAuth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator.js';
import { Role } from '../user/enum/role.enum.js';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Company_HR])
  @ResponseMessage('Job created successfully')
  create(@CurrentUser('sub') userId: string, @Body() dto: CreateJobDto) {
    return this.jobService.create(userId, dto);
  }

  @Get('filter')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.User, Role.Company_HR])
  @ResponseMessage('Filtered jobs retrieved successfully')
  filter(@Query() filters: FilterJobsDto) {
    return this.jobService.filter(filters);
  }

  @Get('by-company')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.User, Role.Company_HR])
  @ResponseMessage('Company jobs retrieved successfully')
  findByCompany(@Query('companyName') companyName: string) {
    return this.jobService.findByCompanyName(companyName);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.User, Role.Company_HR])
  @ResponseMessage('Jobs retrieved successfully')
  findAll() {
    return this.jobService.findAllWithCompany();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Company_HR])
  @ResponseMessage('Job updated successfully')
  update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Company_HR])
  @ResponseMessage('Job deleted successfully')
  remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.jobService.remove(id, userId);
  }
}