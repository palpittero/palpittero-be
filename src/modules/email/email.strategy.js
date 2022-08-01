import { EMAILS_TYPES } from './email.constants'

const activation = ({ name, token }) => {
  const subject = 'Sua conta Palpittero foi criada'

  const html = `<p>Olá ${name},</p>
  
  <p>Obrigado por escolher o Palpittero.</p>

  <p>Clique no link abaixo para ativar a sua conta.</p>
  <br />

  <p>
    <a href="${process.env.EMAIL_ACCOUNT_ACTIVATION_LINK}?token=${token}" target="_blank">
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

export default {
  [EMAILS_TYPES.ACTIVATION]: activation
}
