// deno-lint-ignore-file require-await
import { getConfig } from "./lib/config.ts";
// @deno-types="npm:nodemailer"
import nodemailer from "npm:nodemailer";

import { HttpError, Router } from "./lib/router.ts";
import { log, setLogFile } from "./lib/log.ts";

const config = getConfig()
setLogFile(config.logFile)

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  auth: {
    user: config.smtp.email,
    pass: config.smtp.password
  },
  secure: config.smtp.secure,
  tls: {
    rejectUnauthorized: config.smtp.rejectUnauthorized,
  },
})

console.log("Connecting to email server...");

try {
  await transporter.verify()
  log("Connected successfully!")
} catch (e) {
  if (e instanceof Error)
    log("Failed to connect: " + e.message);
  Deno.exit()
}

function bouncer(hostname: string) {
  if (!config.allowedHosts.includes(hostname)) {
    throw new HttpError(403, "You're not allowed here")
  }
}

function isAllowed(hostname: string) {
  return config.allowedHosts.includes(hostname)
}


const router = new Router()
  .get('/', async ({ responce, info }) => {
    responce.body = `Hello!\nYour IP: ${info.hostname}`
    if (isAllowed(info.hostname)) {
      responce.body += `\nYou're allowed to send emails`
    } else {
      responce.body += `\nYou're not allowed to use this service`
    }
    return responce;
  })
  .post('/send', async ({ request, responce, info }) => {
    bouncer(info.hostname)
    const body = await request.json()
    try {
      const email = {
        from: `${config.smtp.name} <${config.smtp.email}>`,
        to: body.to,
        subject: body.subject,
        text: body.text || '',
        html: body.html || ''
      }
      try {
        await transporter.sendMail(email);
        log(`SUCCESS: from(${info.hostname}) to(${email.to}) sub(${email.subject})`);
      } catch (e) {
        if (e instanceof Error)
          log(`ERROR: from(${info.hostname}) to(${email.to}) sub(${email.subject})\n${e.name}: ${e.message}`);
        responce.init.status = 500
      }
    } catch (e) {
      if (e instanceof Error)
        console.log(`Internal Error: ${e.name}: ${e.message}`)
      responce.init.status = 500
    }
    return responce
  })

Deno.serve({ port: config.port },
  (req, info) => {
    return router.resolve(req, info.remoteAddr)
  }
)