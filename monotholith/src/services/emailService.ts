import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: email,
        subject: 'Verify Your Email',
        text: `Please click on the following link to verify your email: http://localhost:3000/verify/${verificationToken}`
    };
    console.log(mailOptions)

    await transporter.sendMail(mailOptions);
};
