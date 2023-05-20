# Mailboy 📨

A webserver that sends mail for you.

Just POST an email to him and he'll send it for you.

## How to use

### 🛠️ Install Nodejs

### ✏️ Make a .env file in the root directory like this one:
```
SERVER_PORT="3000"  #which port to host to listen on
SENDER_NAME=""      #name on the email (can be blank)
SENDER_ADDRESS=""   #email address to send from
PASSWORD=""         #password for the email account
EMAIL_HOST=""       #smtp provider address eg: smtp.office365.com
EMAIL_PORT=""       #smtp provider port eg: 587
ALLOWED_HOSTS=""    #which IPs to accept requests from, comma separated
```
### ⌨️ Open a terminal in the directory
```
npm i
node ./index.js
```
### 📨 Make a POST request to the server
```
POST body:
{
  to:
  subject:
  text:
}

In Powershell:
Invoke-WebRequest -Uri http://your_server:port -Method POST -Body @{to="email@to.send.to,another@email";subject="Email Subject";text="Body of email"}
```
### ✔️ You'll receive a status of either:
- 200: Success
- 500: Failure