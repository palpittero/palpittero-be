import nodemailer from 'nodemailer'
import md5 from 'md5'
import mailchimp from '@mailchimp/mailchimp_marketing'

mailchimp.setConfig({
  apiKey: process.env.ALATTUS_MAIL_CHIMP_API_KEY,
  server: process.env.ALATTUS_MAIL_CHIMP_INSTANCE
})

const getListMember = (email) => {
  mailchimp.setConfig({
    apiKey: process.env.ALATTUS_MAIL_CHIMP_API_KEY,
    server: process.env.ALATTUS_MAIL_CHIMP_INSTANCE
  })

  return mailchimp.lists.getListMember(
    process.env.ALATTUS_MAIL_CHIMP_LIST_ID,
    md5(email)
  )
}

const setListMember = ({ email, name, phone, tags }) =>
  mailchimp.lists.setListMember(
    process.env.ALATTUS_MAIL_CHIMP_LIST_ID,
    md5(email),
    {
      email_address: email,
      status_if_new: 'subscribed',
      merge_fields: {
        FNAME: name,
        PHONE: phone
      },
      tags
    }
  )

const updateListMemberTags = ({ email, tags }) =>
  mailchimp.lists.updateListMemberTags(
    process.env.ALATTUS_MAIL_CHIMP_LIST_ID,
    md5(email),
    { tags }
  )

const sendEmail = ({ from, subject, html, onSuccess, onError }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.ALATTUS_SMTP_SERVICE_HOST,
    port: Number(process.env.ALATTUS_SMTP_SERVICE_PORT),
    secure: Boolean(process.env.ALATTUS_SMTP_SERVICE_SECURE),
    auth: {
      user: process.env.ALATTUS_SMTP_USER_NAME,
      pass: process.env.ALATTUS_SMTP_USER_PASSWORD
    },
    tls: { rejectUnauthorized: false }
  })

  const mailOptions = {
    to: process.env.ALATTUS_EMAIL_TO,
    from,
    subject,
    html
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      onError
    }
    onSuccess(info)
  })
}

export { sendEmail, getListMember, setListMember, updateListMemberTags }
