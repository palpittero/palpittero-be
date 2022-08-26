import { sendEmail } from '../../services/email.service'
import { EMAILS_TYPES } from './email.constants'
import emailStrategy from './email.strategy'

const sendAccountCreationEmail = ({ name, email, token }) => {
  const { subject, html } = emailStrategy[EMAILS_TYPES.ACTIVATION]({
    name,
    token
  })

  return sendEmail({ email, subject, html })
}

const sendEmailChangeEmail = ({ name, email }) => {
  const { subject, html } = emailStrategy[EMAILS_TYPES.EMAIL_CHANGE]({
    name
  })

  return sendEmail({ email, subject, html })
}

const sendEmailActivationEmail = ({ name, email, token }) => {
  const { subject, html } = emailStrategy[EMAILS_TYPES.EMAIL_ACTIVATION]({
    name,
    token
  })

  return sendEmail({ email, subject, html })
}

export {
  sendAccountCreationEmail,
  sendEmailChangeEmail,
  sendEmailActivationEmail
}
