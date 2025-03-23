### Info

* Node v20.17.0
* NPM v11.0.0
* Telegraf.js v4.16.3
* Firebase CLI v9.2.0
* Firebase project with Blaze plan.

### Project setup

Create a .env file in the functions folder with the following properties:

```
BOT_TOKEN=____TOKEN____
JWT_SECRET_KEY=____JWT_SECRET____
WEB_APP_URL=__weapp_hoting___
```

and deploy using:

```
firebase deploy --only functions
```


### Note

All code inside `function` folder

```
cd functions

npm install
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

deploy to GCP/Firebase:

```
firebase deploy --only functions
```

### Code style

Enable ESLint in WebStorm

1. Open Preferences (macOS: Cmd + , | Windows/Linux: Ctrl + Alt + S).
2. Navigate to Languages & Frameworks > JavaScript > Code Quality Tools > ESLint.
3. Configure the following:
    * Automatic ESLint configuration: Choose this option if you have an .eslintrc file in your project.
    * Manual ESLint configuration: If preferred, set the ESLint package path (local or global) and the path to your
      .eslintrc file.
4. Ensure Run eslint --fix on save is checked (optional but useful).

