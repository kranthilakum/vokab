require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
var swaggerDoc = require('./swagger');
var { MongoClient, ServerApiVersion } = require('mongodb');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var wordsRouter = require('./routes/words');

var app = express();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/words', wordsRouter);

// Start server
//   const port = "3000"
//   app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
//   });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, {
  explorer: true
}));

module.exports = app;
