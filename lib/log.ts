import dayjs from "npm:dayjs";

let logFile: string | null = null


export function setLogFile(filepath: string | null) {
  logFile = filepath
}

export function log(message: string) {
  try {
    const text = `${dayjs().format('YYYY-MM-DD HH:mm')} :: ${message}\n`
    console.log(message);
    if (logFile !== null) {
      Deno.writeTextFileSync(logFile, text, { append: true })
      const {size} = Deno.statSync(logFile)
      if (size > 1000000) {
        rotateLogs();
      }
    }
  } catch (_) {
    //
  }
}

export function rotateLogs() {
  if (logFile === null) return;
  const logs = Deno.readTextFileSync(logFile).split('\n');
  const newLogs = logs.slice(Math.floor(logs.length / 3), logs.length);
  Deno.writeTextFileSync(logFile, newLogs.join('\n'));
}