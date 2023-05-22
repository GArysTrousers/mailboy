import { readFile } from "fs/promises";

export async function renderTemplate(template, body) {
  let html = (await readFile(`${process.cwd()}/templates/${template}.html`)).toString();
  return html.replace('{{body}}', body);
}