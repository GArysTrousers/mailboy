import dayjs from "npm:dayjs";

let logFile: string | undefined = undefined


export function setLogFile(filepath: string | undefined) {
  logFile = filepath
}

export async function log(message: string) {
  try {
    const text = `${dayjs().format('YYYY-MM-DD HH:mm')} :: ${message}\n`
    console.log(message)
    if (logFile !== undefined) await Deno.writeTextFile(logFile, text, {append: true})
  } catch (_) {
    //
  }
}