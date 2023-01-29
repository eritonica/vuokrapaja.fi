# Asuntojen/mökkien vuokraus sovellus

Kiinteistöjen vuokraussovellus, tekkinä React + Material UI, Node.js + MongoDB.


# Server .env file

```
# The http vs https
PROTOCOL=http
# The domain name to use for the server. Defaults to localhost.
DOMAIN=localhost
# The port number to listen on. Defaults to 8080.
PORT=8080
# Cors origin domain array
CORS_ORIGIN=["http://localhost:3000", "http://localhost:8080"]
# The account activation link, where to send the user with activation code.
ACTIVATION_LINK=http://localhost:3000/register/activation?code=
# The password recovery link, where to send the user with reset code.
RECOVERY_LINK=http://localhost:3000/recovery/password?code=

# Certificate and key for https
HTTPS_CERT=
HTTPS_KEY=
HTTPS_CA=

# The database connection string
ATLAS_URI=

# The account information for sending mail through the gmail service.
GMAIL_USERNAME=
GMAIL_PASSWORD=

SESSION_TTL=3600000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

STRIPE_PRIVATE=
STRIPE_ONETIMEPAYMENT=
STRIPE_SUCCESS=http://localhost:3000/stripe-payment-success
STRIPE_CANCEL=http://localhost:3000/stripe-payment-failure

ADMIN_PASSWORD=
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
