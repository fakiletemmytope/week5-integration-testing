import nodemailer from "nodemailer"
import { configDotenv } from "dotenv"


configDotenv()

const USERNAME = process.env.GMAIL_USERNAME
const PASSWORD = process.env.GMAIL_APP_PASSWORD

const transporter = nodemailer.createTransport(
    {
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: USERNAME,
            pass: PASSWORD,
        },
    }
)


export const sendmail = (recipient, subject, body) => {
    transporter.sendMail({
        from: '"MINI-LEARNING" <admin@minilearning.com>',
        to: recipient,
        subject: subject,
        text: body,
    }, (error, info) => {
        if (error) {
            return console.log('Error occurred:', error);
        }
        console.log('Email sent successfully:', info.response);
    });
}


// sendmail("fakiletemitope2@gmail.com", "testing", "How far boss")