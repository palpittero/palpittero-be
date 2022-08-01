import { sendEmail } from '../../services/email.service'
import { EMAILS_TYPES } from './email.constants'
import emailStrategy from './email.strategy'

const sendAccountCreationEmail = ({ name, email, token }) => {
  const { subject, html } = emailStrategy[EMAILS_TYPES.ACTIVATION]({
    name,
    email,
    token
  })

  return sendEmail({ email, subject, html })
}

export { sendAccountCreationEmail }
