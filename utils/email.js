const nodemailer = require('nodemailer');
// const htmlToText = require('html-to-text');
const pug = require('pug');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name;
    this.url = url;
    this.from = `sam69325@gmail.com`;
  }

  newtransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.GMAIL_MAIL,
          pass: process.env.GOOGLE_PASS
        }
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      logger: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  //send the actual email
  async send(templets, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${templets}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html
      // text: htmlToText.fromString(html)
    };

    await this.newtransport().sendMail(mailOptions);
  }

  async sendwelcom() {
    await this.send('welcom', 'welcom to our company');
  }

  async sendpasswordreset() {
    await this.send('resetpass', 'yopur passsword  is reset for 10 minuts');
  }
};

// const sendEmail = async options => {
//   // 1) Create a transporter
//   const transporter = nodemailer.createTransport({
//     // host: process.env.EMAIL_HOST,
//     // port: process.env.EMAIL_PORT,
//     // secure: false,
//     // logger: true,
//     // auth: {
//     //   user: process.env.EMAIL_USERNAME,
//     //   pass: process.env.EMAIL_PASSWORD
//     // }
//     service: 'Gmail',
//     auth: {
//       user: 'samy69325@gmail.com',
//       pass: process.env.GOOGLE_PASS
//     }
//   });

//   // 2) Define the email options
//   const mailOptions = {
//     from: 'maka el mokarama ',
//     to: options.email,
//     subject: options.subject,
//     message: options.message,
//     text: options.text
//     // html:
//   };

//   // 3) Actually send the email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
