# Asuntojen/mökkien vuokraus sovellus

Opiframen opikoodia projekti, tekkinä React + Material UI, Node.js + Sqlite3.


# Server .env file

```
# The http vs https
PROTOCOL=http
# The domain name to use for the server. Defaults to localhost.
DOMAIN=localhost
# The port number to listen on. Defaults to 8080.
PORT=8080
# The account activation link, where to send the user with activation code.
# example: https://localhost:8080/api/accounts/activate/CODE_HERE
ACTIVATION_LINK=http://localhost:8080/api/account/activate

# The account information for sending mail through the gmail service.
GMAIL_USERNAME=email address
GMAIL_PASSWORD=gmail app password
```

# Run server

Requires .env file in server folder.

```
cd server
npm install 
npm start
```

# Run client
```
cd client
npm install
npm start
```
