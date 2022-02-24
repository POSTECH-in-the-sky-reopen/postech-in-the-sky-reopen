import nodemailer from "nodemailer"

export default async function sendMail(from: string, email: string, subject: string, content: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_USERNAME,
            pass: process.env.NODEMAILER_PASSWORD,
        }
    })

    const info = await transporter.sendMail({
        from: `"${from}" <${process.env.NODEMAILER_USERNAME}>`,
        to: email,
        subject: subject,
        html: content,
    })
}
