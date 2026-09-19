import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service.js';
import { CloudinaryService } from './services/cloudinary.service.js';

@Module({
  providers: [EmailService,CloudinaryService],
  exports: [EmailService,CloudinaryService],
})
export class SharedModule {}