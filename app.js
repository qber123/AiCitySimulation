var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose')
var cookieParser = require('cookie-parser');
require('dotenv').config();

var startTick = require('./tick');
var ensureCityExists = require('./services/ensureCityExist');

var authRouter = require('./routes/auth');
var lawsRouter = require('./routes/laws');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

mongoose.connect(
  process.env.MONGO_URI
)
.then(() => {
  console.log('MongoDB connected');
  ensureCityExists();
  startTick();
})
.catch(err => console.error(err));


app.use('/auth', authRouter);
app.use('/laws', lawsRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;