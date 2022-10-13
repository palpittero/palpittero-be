import { sendEmail } from '../../services/email.service'
import { EMAILS_TYPES } from './email.constants'
import emailStrategy from './email.strategy'

const sendAccountCreationEmail = ({ name, email, token }) => {
  const { subject, html } = emailStrategy[EMAILS_TYPES.ACTIVATION]({
    name,
    token
  })

  return sendEmail({ to: email, subject, html })
}

const sendEmailChangeEmail = ({ name, email, to }) => {
  const { subject, html } = emailStrategy[EMAILS_TYPES.EMAIL_CHANGE]({
    name,
    email
  })

  return sendEmail({ to, subject, html })
}

const sendEmailActivationEmail = ({ name, email, token }) => {
  const { subject, html } = emailStrategy[EMAILS_TYPES.EMAIL_ACTIVATION]({
    name,
    token
  })

  return sendEmail({ to: email, subject, html })
}

const sendPasswordResetEmail = ({ name, email, token }) => {
  const { subject, html } = emailStrategy[EMAILS_TYPES.PASSWORD_RESET]({
    name,
    token
  })

  return sendEmail({ to: email, subject, html })
}

const sendLeagueInvitationEmail = ({
  name,
  email,
  league,
  owner,
  visibility,
  token
}) => {
  const { subject, html } = emailStrategy[
    EMAILS_TYPES.PRIVATE_LEAGUE_USER_INVITATION
  ]({
    name,
    league,
    owner,
    visibility,
    token
  })

  return sendEmail({ to: email, subject, html })
}

const sendAnonymousLeagueInvitationEmail = ({
  email,
  league,
  owner,
  visibility,
  token
}) => {
  const { subject, html } = emailStrategy[
    EMAILS_TYPES.PRIVATE_LEAGUE_ANONYMOUS_INVITATION
  ]({
    league,
    owner,
    visibility,
    token
  })

  return sendEmail({ to: email, subject, html })
}

export {
  sendAccountCreationEmail,
  sendEmailChangeEmail,
  sendEmailActivationEmail,
  sendPasswordResetEmail,
  sendLeagueInvitationEmail,
  sendAnonymousLeagueInvitationEmail
}
