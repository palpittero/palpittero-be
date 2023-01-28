const getContactHTML = ({ name, email, subject, message, ip, userAgent }) => `
<h3>Mensagem Recebida</h3>
<p>
  <b>Origem:</b> Formulário de Contato (http://alattus.com.br)
</p>
<p>
  <b>Nome:</b> ${name}
</p>
<p>
  <b>E-mail:</b> ${email}
</p>
<p>
  <b>Assunto:</b> ${subject}
</p>
<br>
<p>
  <b>Mensagem</b>
</p>
<p>
  ${message}
</p>
<br><br>
<small>IP: ${ip} / UserAgent: ${userAgent}</small>
`

const getNewsletterHTML = ({ email, ip, userAgent }) => `
<h3>Mensagem Recebida</h3>
<p>
  <b>Origem:</b> Formulário de Newsletter (http://alattus.com.br)
</p>
<p>
  <b>E-mail:</b> ${email}
</p>
<br><br>
<small>IP: ${ip} / UserAgent: ${userAgent}</small>
`

export { getContactHTML, getNewsletterHTML }
