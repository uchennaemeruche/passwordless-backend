import nodemailer from "nodemailer"

export const sendMail = (email:string, code:number) => {
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "8a4cde16cd4f89",
            pass: "fca2c4ea18b5a1"
        }
    })
    transport.verify((err, data) => {
        if (err) console.error(err)
        console.log("Data:", data)

    })
    const message = {
        from: "test@asktech.co",
        to: email,
        text: `Enter this code to authenticate: ${code}`,
        html: `<p>Enter this code to authenticate: <b>${code}</b></p>`
    }
    transport.sendMail(message, (err, data) => {
        if (err) console.error("An error occurred while sending mail:", err)
        else console.log("Sent...", data)
    })
}

