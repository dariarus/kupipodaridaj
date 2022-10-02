import nodemailer = require('nodemailer');

export class EmailSenderService {
  constructor(private transporter) {
    this.transporter = nodemailer.createTransport({
      pool: true,
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true, // use TLS
      auth: {
        user: 'kirena001829',
        pass: 'fthftbatowxpuyyw',
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
