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


export const sendmail = async (recipient, subject, body) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from: '"MINI-LEARNING" <admin@minilearning.com>',
            to: recipient,
            subject: subject,
            text: body,
        }, (error, info) => {
            if (error) {
                console.log('Error occurred:', error);
                return reject(error); // Reject the promise if there is an error
            }
            console.log('Email sent successfully:', info.response);
            resolve(info); // Resolve the promise with the info
        });
    });
}


// sendmail("fakiletemitope2@gmail.com", "testing", "How far boss")