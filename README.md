### Info

* Node v20.17.0
* NPM v11.0.0
* Telegraf.js v4.16.3
* Firebase CLI v9.2.0
* Firebase project with Blaze plan.

### Project setup

create .env file with properties:

```
BOT_TOKEN=____TOKEN____
JWT_SECRET_KEY=____JWT_SECRET____
```

### Additional dependencies

jsonwebtoken is a Node.js library used to sign, verify, and decode JSON Web Tokens (JWTs).
A JSON Web Token is a compact, URL-safe token that securely transmits information between two parties,
typically a server and a client.

```
npm install jsonwebtoken
```

telegraf

```
npm install telegraf
```

### Deploy

run locally function:

```
firebase serve
```

firebase function:

```
firebase deploy --only functions
```