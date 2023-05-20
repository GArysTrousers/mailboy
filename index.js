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

let connected = await transporter.verify()
if (!connected) {
  console.log("Failed to connect to email service, exiting...");
  process.abort();
}
console.log("Email Service Connected")

app.get('/', (req, res) => {
  res.send("hello");
})

app.post('/', async (req, res) => {
  try {
    console.log("got a request");
    if (!allowedHosts.includes(req.ip))
      res.status(403).send()
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
      res.send()
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
// 