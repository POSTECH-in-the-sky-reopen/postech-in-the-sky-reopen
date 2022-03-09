import nodemailer from "nodemailer"

export default async function sendMail(from: string, email: string, subject: string, content: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: process.env.GMAIL_ADDRESS,
            serviceClient: process.env.GMAIL_CLIENT_ID,
            privateKey: process.env.GMAIL_PRIVATE_KEY ?
                process.env.GMAIL_PRIVATE_KEY.replace(/\\n/g, "\n") :
                undefined,
        },
    })

    const mailOptions = {
        from: process.env.GMAIL_ADDRESS,
        to: email,
        subject: subject,
        html: content,
    };

    try {
        transporter.verify();
        transporter.sendMail(mailOptions);
    } catch (err) {
        throw new Error("메일 발송 실패")
    }
}
