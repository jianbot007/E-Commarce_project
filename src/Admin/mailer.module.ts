import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { PusherProvider } from './Pusher/pusher.provider';
import { PusherService } from './Pusher/pusher.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',        
        secure: false,                 
        auth: {
          user: 'kmrahman744@gmail.com',
          pass: 'mbzv ikwx sfmd uoqk',   
        },
      },
      defaults: {
        from: '"No Reply" <noreply@yourapp.com>',
      },
      template: {
        dir: join(__dirname, 'templates'), 
        adapter: new HandlebarsAdapter(),   
        options: {
          strict: true,
        },
      },
    }),
  ],
   providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
