import nodemailer from "nodemailer";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// nodemailer config
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GOOGLE_APP_PASS,
    },
});
  

class EmailService{
    async sendEmail(toEmail, subject, message){
        (async () => {
            const info = await transporter.sendMail({
                from: `"Coders Hub Verification Team" <${process.env.GMAIL_ID}>`,
                to: toEmail,
                subject: subject,
                html: message, // HTML body
            });

            console.log("Message sent:", info.messageId);
          })();
    }

    async  htmlTemplateUpdater(path_of_template, whatToChange, data) {
        const fullPath = path.join(__dirname, path_of_template);
        const htmlTemplate = await fs.promises.readFile(fullPath, 'utf-8');
        const regex = new RegExp(`{{${whatToChange}}}`, 'g');
        return htmlTemplate.replace(regex, data);
}
      
      
}

export default new EmailService()