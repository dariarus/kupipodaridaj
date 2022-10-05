import nodemailer = require('nodemailer');
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailSenderService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      pool: configService.get<string>('EMAIL_POOL'),
      host: configService.get<string>('EMAIL_HOST'),
      port: configService.get<string>('EMAIL_PORT'),
      secure: configService.get<string>('EMAIL_SECURE'),
      auth: {
        user: configService.get<string>('EMAIL_USER'),
        pass: configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendEmail(
    emails: string[],
    subject: string,
    message: string,
    html?: string,
  ): Promise<void> {
    return this.transporter
      .sendMail({
        from: '"Daria R 👻" <kirena001829@yandex.ru>', // sender address
        to: emails.join(), // list of receivers
        subject: subject, // Subject line
        text: message, // plain text body
        html: html,
      })
      .then((info) => console.log('Message sent: %s', info.messageId))
      .catch((err) => console.log(err, 'error sending email'));
  }
}
