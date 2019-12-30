const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
module.exports = class Email {
  constructor(user, url) {
    this.url = url;
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.from = `Shivam Mundhra <${process.env.Email_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    // 1)Render HTML from pug template
    //2)Define mailOptions
    // 3)Create A transport and send the email

    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome To the Natours Family');
  }

  async sendPasswordreset() {
    await this.send(
      'passwordReset',
      'Password Reset Token(valid for only 15 Min)'
    );
  }
};

// const sendEmail = async options => {
//   /*STEPS
//     1)Create A transporter
//     2)Define the Email Options
//     3)Send the email
//     */
//   // const transporter = nodemailer.createTransport({
//   //     service: ' Gmail',
//   //     auth :{
//   //         user:process.env.EMAIL_USERNAME,
//   //         pass:process.env.EMAIL_PASSWORD
//   //     }
//   //     //Activate in gmail " less secure app"
//   // })
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });
//   //   2)
//   const mailOptions = {
//     from: 'Shivam Mundhra <jaiveeru4478@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//     //   html:
//   };
//   // 3)
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
