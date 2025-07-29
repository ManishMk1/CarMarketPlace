import nodemailer from 'nodemailer';

export const sendErrorEmail = async (subject, message, html = '') => {
  
  try {
    const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_SENDER,          
    pass: process.env.GOOGLE_APP_PASSWORD,   
  },
});
    const info = await transporter.sendMail({
      from: `"Logger Notifier" <${process.env.MAIL_SENDER}>`,
      to: process.env.MAIL_RECEIVERS, 
      subject,
      text: message,
      html: html || `<pre>${message}</pre>`,
    });

    console.log('Error email sent:', info.messageId);
  } catch (err) {
    console.log('Failed to send error email:', err.message);
  }
};
