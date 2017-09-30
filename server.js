'use strict';

const express = require('express');
const app = express();

const { router: usersRouter } = require('./users');
const { router: musicRouter } = require('./music');
const { router: authRouter, basicStrategy, jwtStrategy } = require('./auth');
const { PORT, DATABASE_URL } = require('./config');

const cors = require('cors');
app.use(cors());

const morgan = require('morgan');
app.use(morgan('common', { skip: () => process.env.NODE_ENV === 'test' }));

const path = require('path');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passport = require('passport');
passport.use(basicStrategy);
passport.use(jwtStrategy);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/music/', musicRouter);
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(url = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(url, { useMongoClient: true }, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
