import dayjs from "npm:dayjs";

let logFile: string | null = null


export function setLogFile(filepath: string | null) {
  logFile = filepath
}

export async function log(message: string) {
  try {
    const text = `${dayjs().format('YYYY-MM-DD HH:mm')} :: ${message}\n`
    console.log(message)
    if (logFile !== null) await Deno.writeTextFile(logFile, text, {append: true})
  } catch (_) {
    //
  }
}