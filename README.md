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
  to: comma separated like of email addresses
  subject: subject of the email
  html?: (optional) html body
  plainText?: (optional) plain text body
  template?: (optional) name of the template to use 
}
html and plainText are optional, you can use either or both (or neither).
template is also optional, but if present, html should be included if the template contains {{body}}.

In Powershell:
Invoke-WebRequest -Uri http://your_server:port -Method POST -Body @{to="email@to.send.to,another@email";subject="Email Subject";html="Body of email"}
```
### ✔️ You'll receive a status of either:
- 200: Success
- 403: Not on allowed list
- 500: Failure
### ⚡ Templates
You can create templates for your emails by placing a file named (template-name).html in the templates folder, then in your POST request, specify the name of the template you'd like to use.

A template can contain {{body}}, which will be replaced by the html specified in the POST body.

An example template called 'basic' is included.