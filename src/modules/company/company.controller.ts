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
import { CompanyService } from './company.service.js';
import { JwtAuthGuard } from '../../common/guards/jwtAuth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator.js';
import { Role } from '../user/enum/role.enum.js';
import { CreateCompanyDto } from './dto/createCompany.dto.js';
import { UpdateCompanyDto } from './dto/updateCompany.dto.js';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Company_HR])
  @ResponseMessage('Company created successfully')
  create(@CurrentUser('sub') userId: string, @Body() dto: CreateCompanyDto) {
    return this.companyService.create(userId, dto);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Company_HR, Role.User])
  @ResponseMessage('Search results retrieved successfully')
  search(@Query('name') name: string) {
    return this.companyService.searchByName(name);
  }
  @Get('my-companies')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Company_HR])
  @ResponseMessage('Your companies retrieved successfully')
  findMyCompanies(@CurrentUser('sub') userId: string) {
    return this.companyService.findMyCompanies(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Company_HR])
  @ResponseMessage('Company data retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Company_HR])
  @ResponseMessage('Company updated successfully')
  update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companyService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Company_HR])
  @ResponseMessage('Company deleted successfully')
  remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.companyService.remove(id, userId);
  }
}
