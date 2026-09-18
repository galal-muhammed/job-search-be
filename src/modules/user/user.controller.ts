import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { JwtAuthGuard } from '../../common/guards/jwtAuth.guard.js';
import { ResponseMessage } from '../../common/decorators/responseMessage.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('User data retrieved successfully')
  getOwnData(@CurrentUser('sub') userId: string) {
    return this.userService.findOne(userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Account updated successfully')
  updateOwnAccount(
    @CurrentUser('sub') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Account deleted successfully')
  deleteOwnAccount(@CurrentUser('sub') userId: string) {
    return this.userService.remove(userId);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Profile retrieved successfully')
  getProfile(@Query('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @Get('by-recovery-email')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Accounts retrieved successfully')
  getByRecoveryEmail(@Query('recoveryEmail') recoveryEmail: string) {
    return this.userService.findByRecoveryEmail(recoveryEmail);
  }
  
}
