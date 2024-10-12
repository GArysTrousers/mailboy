import { z } from "zod";
const schema = {
  config: z.object({
    port: z.number(),
    sender: z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
      host: z.string(),
      port: z.number(),
    }),
    allowedHosts: z.array(z.string()),
    logFile: z.string().optional(),
  })
}
export type Config = z.infer<typeof schema.config>

export const defaultConfig = {
  "port": 3000,
  "logFile": "log.txt",
  "sender": {
    "name": "Big John",
    "email": "mail@email.com",
    "password": "Shhhhh1!",
    "host": "smtp.office365.com",
    "port": 587
  },
  "allowedHosts": [
    "localhost",
    "127.0.0.1"
  ]
}



export function getConfig() {
  try {
    return schema.config.parse(JSON.parse(Deno.readTextFileSync('config.json')));
  } catch (_) {
    if (confirm("\nI couldn't find a config.json, should I make one?")) {
      Deno.writeTextFileSync('config.json', JSON.stringify(defaultConfig, null, 2))
      alert("Fill in the config.json then start the app again.");
    }
    Deno.exit()
  }
}

