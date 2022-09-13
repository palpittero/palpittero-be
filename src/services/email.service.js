import nodemailer from 'nodemailer'

const sendEmail = ({ to, from = process.env.EMAIL_FROM, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVICE_HOST,
    port: Number(process.env.SMTP_SERVICE_PORT),
    secure: Boolean(process.env.SMTP_SERVICE_SECURE),
    auth: {
      user: process.env.SMTP_USER_NAME,
      pass: process.env.SMTP_USER_PASSWORD
    },
    tls: { rejectUnauthorized: false }
  })

  const mailOptions = {
    to,
    from,
    subject,
    html
  }

  return new Promise((resolve, reject) => {
    console.log('Trying to send account activation e-mail')

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending e-mail', error.toString())
        reject(error)
      }

      console.log('E-mail sucessfully sent', info)
      resolve(info)
    })
  })
}

export { sendEmail }
