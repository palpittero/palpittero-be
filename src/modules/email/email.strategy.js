import { getAppRoute } from '../../utils/misc'
import { EMAILS_TYPES } from './email.constants'

const activation = ({ name, token }) => {
  const subject = 'Sua conta Palpittero foi criada'

  const html = `<p>Olá ${name},</p>
  
  <p>Obrigado por escolher o Palpittero.</p>

  <p>Clique no link abaixo para ativar a sua conta.</p>

  <p>
    <a href="${getAppRoute(process.env.EMAIL_ACCOUNT_ACTIVATION_ROUTE, {
      token
    })}" target="_blank">
      Ativar Conta
    <a>
  </p>
  <br />

  Palpittero`

  return {
    subject,
    html
  }
}

const emailChange = ({ name, email }) => {
  const subject = 'Novo e-mail cadastrado na sua conta Palpittero'

  const html = `<p>Olá ${name},</p>
  
  <p>Um novo e-mail de acesso foi cadastrado na sua conta Palpittero.</p>

  <p><b>${email}</b></p>
  <br />

  <p>Caso você não tenha solicitado alteração de e-mail, por favor, entre em contato conosco.</p>
  <br />

  Palpittero`

  return {
    subject,
    html
  }
}

const emailActivation = ({ name }) => {
  const subject = 'Seu novo e-mail de acesso à conta Palpittero'

  const html = `<p>Olá ${name},</p>
  
  <p>Este e-mail foi cadastrado como principal na sua conta Palpittero.</p>

  <p>A partir de agora você pode utilizá-lo para acessar a plataforma.</p>
  <br />

  Palpittero`

  return {
    subject,
    html
  }
}

const emailPasswordReset = ({ name, token }) => {
  const subject =
    'Uma redefinição de senha foi solicitada na sua conta Palpittero'

  const html = `<p>Olá ${name},</p>
  
  <p>Utilize o link abaixo para definir uma nova senha para a sua conta.</p>

  <p>
    <a href="${getAppRoute(process.env.EMAIL_PASSWORD_RESET_ROUTE, {
      token
    })}" target="_blank">
      Definir nova senha
    <a>
  </p>

  <p>Caso você não tenha solicitado redefinição de senha, por favor, entre em contato conosco.</p>
  <br />

  Palpittero`

  return {
    subject,
    html
  }
}

export default {
  [EMAILS_TYPES.ACTIVATION]: activation,
  [EMAILS_TYPES.EMAIL_CHANGE]: emailChange,
  [EMAILS_TYPES.EMAIL_ACTIVATION]: emailActivation,
  [EMAILS_TYPES.PASSWORD_RESET]: emailPasswordReset
}
