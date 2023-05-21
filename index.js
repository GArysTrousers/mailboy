import { config } from "dotenv";
config()
import express from 'express'
import nodemailer from "nodemailer";
const app = express()
app.use(express.urlencoded({ extended: true }))

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.SENDER_ADDRESS,
    pass: process.env.PASSWORD
  },
})
const from =
  process.env.SENDER_NAME
    ? {
      name: process.env.SENDER_NAME,
      address: process.env.SENDER_ADDRESS
    }
    : process.env.SENDER_ADDRESS
const allowedHosts = [
  'localhost',
  '127.0.0.1',
  '::1',
  ...process.env.ALLOWED_HOSTS.split(',')
]

try {
  await transporter.verify()
  console.log("email service connected")
} catch (error) {
  console.log("failed to connect to email service, exiting...");
  process.abort();
}

app.get('/', (req, res) => {
  if (!allowedHosts.includes(req.ip)) {
    console.log("rejected hello from " + req.ip)
    return res.send("Hello, I don't know you");
  }
  console.log("accepted hello from " + req.ip)
  res.send("Hello, I know you");
})

app.post('/', async (req, res) => {
  try {
    if (!allowedHosts.includes(req.ip)) {
      console.log("rejected request from " + req.ip)
      return res.status(403).send()
    }
    console.log("accepted request from " + req.ip)
    let email = {
      from: from,
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text || '',
      html: req.body.html || ''
    }
    console.log(email);
    let info = await transporter.sendMail(email);
    if (info.accepted) {
      console.log("email sent");
      res.status(200).send()
    }
    else {
      console.log("email not sent");
      res.status(500).send()
    }
  } catch (error) {
    res.status(500).send()
  }
});

app.listen(process.env.SERVER_PORT);
console.log("server running on " + process.env.SERVER_PORT);
