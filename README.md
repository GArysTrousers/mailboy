# Mailboy 📨

A webserver that sends mail for you.

Just POST an email to him and he'll send it for you.

## How to use

### 🛠️ Install Deno 2.0

### ✏️ Configuration:
The first time you run mailboy it will ask you if you want to create a config.json, select yes and fill it out, then run it again and it will start.
### ⌨️ Open a terminal in the directory
Dev mode:
```
deno task dev
```
Compile:
```
deno task compile:win
deno task compile:linux
```
### 📨 Make a POST request to the server
```
POST body:
{
  to: comma separated like of email addresses
  subject: subject of the email
  text?: (optional) plain text body
  html?: (optional) html body
}
text and html are optional, you can use either, both or neither 

In Powershell:
Invoke-WebRequest -Uri http://your_server:port -Method POST -Body @{to="email@to.send.to,another@email";subject="Email Subject";html="Body of email"}
```
### ✔️ You'll receive a status of either:
- 200: Success
- 403: Not on allowed list
- 500: Failure