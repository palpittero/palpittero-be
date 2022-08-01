import nodemailer from 'nodemailer'

const send = ({ from, subject, html }) => {
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
    to: process.env.EMAIL_TO,
    from,
    subject,
    html
  }

  return Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
      }
      resolve(info)
    })
  })
}

export { send }
