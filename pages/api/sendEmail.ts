import nodemailer from 'nodemailer';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {

  const { to, subject, message } = JSON.parse(req.body);
 
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: process.env.EMAILUSER,
      pass: process.env.EMAILPW,
    },
  });

  const mailOptions = {
    from: process.env.EMAILUSER,
    to,
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    console.log('Error sending email:', error);
    res.status(500).json({ error: 'Email not sent' });
  }
};