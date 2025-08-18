import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRegistrationMail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Registration Successful',
      text: `Hello ${name}, your registration was successful!`, 
      html: `<h3>Hello ${name},</h3>
             <p>Your registration was <b>successful</b>. Welcome to E-Commarce admin Panel!</p>`, 
    });
  }
}

