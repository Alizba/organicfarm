import nodemailer from 'nodemailer'
import User from '@/models/userModel'
import bcryptjs from 'bcryptjs'

export const sendEmail = async ({ email, emailType, userId }) => {
    try {

        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(
                userId, 
                {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            },
        {
            new:true,
            runValidators: false}
        )
        }

        else if (emailType === "RESET") {
            await User.findByIdAndUpdate(
                userId, 
                {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000
            },
            {
                new:true,
                runValidators: false}
        )
        }



        var transport = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: Number(process.env.MAILTRAP_PORT),
            auth: {
                user: process.env.MAILTRAP_USER, // 
                pass: process.env.MAILTRAP_PASS
            }
        });

        const mailOptions = {
            from: 'maddison53@ethereal.email',
            to: email,
            subject: emailType === 'VERIFY' ? "Verify yout email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a>
            to ${emailType === "VERIFY" ? "Verify your email" : "Reset yot password"}
            or copy and paste the link below in the browser.<br>${
                process.env.DOMAIN
            }/verifyemail?token=${hashedToken}
            </p>`, 
        };

        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse

    }
    catch (e) {
        throw new Error(e.message)
    }
}