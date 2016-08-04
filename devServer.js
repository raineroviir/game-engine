'use strict';

var express = require('express');
var path = require('path');
var app = express();
var db = require('./db');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.dev');
var compiler = webpack(webpackConfig);

var oAuthConfig = require('./oAuthConfig.js');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

//set env vars
process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'this is a temp AUTH_SECRET';
process.env.PORT = process.env.PORT || 3000;

passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user.id)
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  findUser(id, function(err, user) {
    console.log('deserializeUser: ' + user);
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
  clientID: oAuthConfig.facebook.clientID,
  clientSecret: oAuthConfig.facebook.clientSecret,
  callbackURL:  "http://localhost:3000/auth/facebook/callback"
},
  function(accessToken, refreshToken, profile, done) {
    saveUser(profile._json, function(err, user) {
      if (err) { return done(err); }
      console.log(user);
      done(null, user);
    });
  }
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser(config.session.secret));
app.use(session({ secret: 'keyboard kitty' }));
app.use(passport.initialize());
app.use(passport.session());

// set up the DB;
var r = require('rethinkdb');
var dbConfig = {
  host: process.env.RDB_HOST || 'localhost',
  port: parseInt(process.env.RDB_PORT) || 28015
};

var connection = null;
r.connect( {host: dbConfig.host, port: dbConfig.port }, function(err, conn) {
  if (err) throw err;
  connection = conn;
  // r.db('test').tableCreate('users').run(connection, function(err, result) {
  //   if (err) throw err;
  //   console.log(JSON.stringify(result, null, 2));
  // });
});

function saveUser(profile, callback) {
  r.db('test').table('users').insert(profile).run(connection, function(err, result) {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      if (result.inserted === 1) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    }
  });
}

function findUser(id, callback) {
  r.db('test').table('users').get(id).run(connection, function(err, result) {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      if (result !== null) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    }
  });
}

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(path.join(__dirname)));

app.get('/account', ensureAuthenticated, function(req, res) {
  res.render('account', { user: req.user });
});

// set up routes

app.get('/auth/facebook', passport.authenticate('facebook'),
  function(req, res) {
  //this request gets re-directed to FB so this function will not be called.
});
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  }),
  function(req, res) {
    res.redirect('/1');
});
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/logout');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/')
}

var webpackServer = app.listen(process.env.PORT, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('server listening on port: %s', process.env.PORT);
});
