import { z, ZodError } from "zod";

const schema = {
  config: z.object({
    port: z.number(),
    smtp: z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
      host: z.string(),
      port: z.number(),
      secure: z.boolean(),
      rejectUnauthorized: z.boolean(),
    }),
    allowedHosts: z.array(z.string()),
    logFile: z.string().nullable(),
  })
}
export type Config = z.infer<typeof schema.config>

export const defaultConfig: Config = {
  "port": 3000,
  "logFile": "log.txt",
  "smtp": {
    "name": "Big John",
    "email": "mail@email.com",
    "password": "Shhhhh1!",
    "host": "smtp.office365.com",
    "port": 587,
    "secure": false,
    "rejectUnauthorized": true
  },
  "allowedHosts": [
    "localhost",
    "127.0.0.1"
  ],
}

export function getConfig() {
  try {
    return schema.config.parse(JSON.parse(Deno.readTextFileSync('config.json')));
  } catch (e) {
    if (e instanceof ZodError) {
      console.log("\nError: config.json contains the following errors:\n")
      console.log(e.issues)
      alert("\n")
    }
    else if (e.name === "NotFound") {
      if (confirm("\nI couldn't find a config.json, should I make one?")) {
        Deno.writeTextFileSync('config.json', JSON.stringify(defaultConfig, null, 2))
        alert("Fill in the config.json then start the app again.");
      }
    }
    Deno.exit()
  }
}

