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
# Cors origin domain array
CORS_ORIGIN=[http://localhost:3000]
# The account activation link, where to send the user with activation code.
ACTIVATION_LINK=/api/accounts/activate

# Certificate and key for https
HTTPS_CERT=/etc/letsencrypt/live/localhost/cert.pem
HTTPS_KEY=/etc/letsencrypt/live/localhost/privkey.pem
HTTPS_CA=/etc/letsencrypt/live/localhost/chain.pem

# The database connection string
ATLAS_URI = mongodb+srv://<username>:<password>@cluster0.mzhbh.mongodb.net/<collection>?retryWrites=true&w=majority

# The account information for sending mail through the gmail service.
GMAIL_USERNAME=gmail address
GMAIL_PASSWORD=Your app password

SESSION_TTL=3600000

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
