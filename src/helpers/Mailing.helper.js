// Library
import { createTransport } from 'nodemailer';

class MailHelper {
  /**
   * Helper class for interacting with the file system.
   * @class
   * @param {Object} server - The server object.
   */
  constructor(server) {
    this.server = server;
  }


  /**
   * Sends an email to the specified email address.
   * @param {string} toEmail - The email address to send the email to.
   * @param {string} subject - The subject of the email.
   * @param {Object} content - The content of the email.
   * @param {string} content.text - The text content of the email.
   * @param {string} content.html - The HTML content of the email.
  */
  sendEmail(toEmail, subject, content) {
    if(!content.text && !content.html) return -1;
    
    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: this.server.env.MAIL_EMAIL,
        pass: this.server.env.MAIL_ETHEREAL_PASSWORD,
      },
    });
    
    transporter.sendMail({
      from: `"${ this.server.env.APP_NAME }" <${ this.server.env.MAIL_EMAIL }>`,
      to: toEmail,
      subject,
      ...( content.html ? {
        html: content.html
      } : {
        text: content.text
      })
    }, (error, info) => {
      if (error) {
        this.server.sendLogs('Error: ');
        console.log(error);
        return -1;
      }
      
      this.server.sendLogs(`Email sent: ${info.response}`);
    
    });
    
    return;
  }
}

export default MailHelper;