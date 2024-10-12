// deno-lint-ignore-file require-await
import { getConfig } from "./lib/config.ts";
// @deno-types="npm:nodemailer"
import nodemailer from "nodemailer";

import { HttpError, Router } from "./lib/router.ts";
import { log, setLogFile } from "./lib/log.ts";

const config = getConfig()
setLogFile(config.logFile)

const transporter = nodemailer.createTransport({
  host: config.sender.host,
  port: config.sender.port,
  auth: {
    user: config.sender.email,
    pass: config.sender.password
  },
})


try {
  await transporter.verify()
  log("email service connected")
} catch (_e) {
  log("failed to connect to email service, exiting...");
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
    }
    return responce;
  })
  .get('/test', async ({ request, responce, info }) => {
    bouncer(info.hostname)
    responce.body = `Hello Dorld! ${request}`
    return responce;
  })
  .post('/send', async ({ request, responce, info }) => {
    bouncer(info.hostname)
    const body = await request.json()
    try {
      const email = {
        from: `${config.sender.name} <${config.sender.email}>`,
        to: body.to,
        subject: body.subject,
        text: body.text || '',
        html: body.html || ''
      }
      // console.log(email);
      try {
        await transporter.sendMail(email);
        log(`SUCCESS: from(${info.hostname}) to(${email.to}) sub(${email.subject})`);
      } catch (e) {
        log(`ERROR: from(${info.hostname}) to(${email.to}) sub(${email.subject})`);
        responce.init.status = 500
      }
    } catch (e) {
      responce.init.status = 500
    }
    return responce
  })

Deno.serve({ port: config.port },
  (req, info) => {
    return router.resolve(req, info.remoteAddr)
  }
)