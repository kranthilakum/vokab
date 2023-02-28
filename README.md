## Vokab

```bash
npx express-generator vokab --no-view

create : vokab/
create : vokab/public/
create : vokab/public/javascripts/
create : vokab/public/images/
create : vokab/public/stylesheets/
create : vokab/public/stylesheets/style.css
create : vokab/routes/
create : vokab/routes/index.js
create : vokab/routes/users.js
create : vokab/public/index.html
create : vokab/app.js
create : vokab/package.json
create : vokab/bin/
create : vokab/bin/www

changed the directory:
    $ cd vokab

installed dependencies:
    $ npm install

ran the app:
    $ DEBUG=vokab:* npm start
```

Connect to remote MongoDB instance from terminal

```bash
$ mongosh "mongodb+srv://<cluster-ip-port>/<database>" --apiVersion 1 --username <username>
Enter password: *******
Current Mongosh Log ID:	63f9d5ebcf20befc38b1b452
Connecting to:		mongodb+srv://<credentials>@<cluster-ip-port>/<database>?appName=mongosh+1.7.1
Using MongoDB:		5.0.14 (API Version 1)
Using Mongosh:		1.7.1

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

Atlas atlas-m35sal-shard-0 [primary] vokab> db.words.findOne()
```

__Insert many words__

```bash
curl -X POST -H "Content-Type: application/json" -d '[
  {
    "name": "abacus",
    "meaning": "a manual computing device",
    "origin": "Greek",
    "pronunciation": "AB-uh-kuhs",
    "synonyms": ["calculator", "computer"],
    "antonyms": [],
    "usageExamples": ["She used an abacus to add up the figures."]
  },
  {
    "name": "cacophony",
    "meaning": "a harsh, discordant mixture of sounds",
    "origin": "Greek",
    "pronunciation": "kuh-KAH-fuh-nee",
    "synonyms": ["dissonance", "discord"],
    "antonyms": ["harmony", "melody"],
    "usageExamples": ["The street was filled with the cacophony of car horns and shouting."]
  }
]' http://localhost:3000/vocab/words
```

__Get a list of words by pagination__

```bash
curl "http://localhost:3000/vokab/words/list?pageNumber=1&pageSize=5"
```

Swagger UI: http://localhost:3000/api-docs

### Links
- [Express & Node.js tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs), MDN
- [How to document an Express API with swagger-ui-express and swagger-jsdoc](https://dev.to/kabartolo/how-to-document-an-express-api-with-swagger-ui-and-jsdoc-50do)