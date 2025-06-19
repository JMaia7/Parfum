const express = require('express')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const path = require('path')
require('dotenv').config()

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'index.html'))
})

app.use(bodyParser.urlencoded({ extended: true }))

app.post('/send', (req, res) => {
   console.log('Recebido do formulário:', req.body)
   const { name, email, subject, message } = req.body

   console.log('Debugando variáveis de ambiente para Mailtrap:')
   console.log('MAILTRAP_USER:', process.env.MAILTRAP_USER)
   console.log(
      'MAILTRAP_PASS:',
      process.env.MAILTRAP_PASS ? '****** (presente)' : 'AUSENTE'
   )
   console.log('RECEIVER_EMAIL:', process.env.RECEIVER_EMAIL)

   var transport = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
         user: process.env.MAILTRAP_USER,
      },
   })

   console.log('Configuração do Nodemailer transport:')
   console.log('  Host:', transport.options.host)
   console.log('  Port:', transport.options.port)
   console.log('  Auth User:', transport.options.auth.user)
   console.log(
      '  Auth Pass:',
      transport.options.auth.pass ? '****** (presente)' : 'AUSENTE'
   )

   const mailOptions = {
      from: email,
      to: process.env.RECEIVER_EMAIL,
      subject: subject || 'Mensagem do formulário',
      text: `Nome: ${name}\nEmail: ${email}\nMensagem:\n${message}`,
   }

   transport.sendMail(mailOptions, (error, info) => {
      if (error) {
         console.error('Erro ao enviar e-mail:', error)
         res.status(500).send(
            'Erro ao enviar e-mail. Por favor, tente novamente mais tarde.'
         )
      } else {
         console.log('Email enviado:', info.response)
         res.status(200).send('Mensagem enviada com sucesso!')
      }
   })
})

app.listen(port, () => {
   console.log(`Servidor rodando em http://localhost:${port}`)
})
