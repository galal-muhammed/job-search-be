import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    // @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async sendOtpEmail(to: string, otpCode: string) {
    try {
      const info =await this.mailerService.sendMail({
        to,
        subject: 'Password Reset - Job Search Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #2c3e50; text-align: center;">Reset Your Password</h2>

            <p>Hello,</p>

            <p>
              We received a request to reset the password for your
              <strong>Job Search</strong> account.
              Use the verification code below to continue:
            </p>

            <div style="font-size: 24px; font-weight: bold; color: #d35400; text-align: center; margin: 20px 0;">
              ${otpCode}
            </div>

            <p>
              If you didn't request a password reset, you can safely ignore
              this email.
            </p>

            <p style="margin-top: 20px;">
              Best regards,<br>
              <strong>Job Search Team</strong>
            </p>
          </div>
        `,
      });
      // await this.cacheManager.set(`pass-${to}`, otpCode);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
