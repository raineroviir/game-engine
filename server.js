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
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
  clientID: oAuthConfig.facebook.clientID,
  clientSecret: oAuthConfig.facebook.clientSecret,
  callbackURL:  "http://localhost:3000/auth/facebook/callback"
},
  function(accessToken, refreshToken, profile, done) {
    // db.findUserByEmail(profile.emails[0].value, function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });

    // db.saveUser(profile.emails[0].value, function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // })
    console.log('FB Strategy used');
    process.nextTicK(function() {
      console.log(profile);
      return done(null, profile);
    })
  }
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser(config.session.secret));
app.use(session({ secret: 'keyboard kitty' }));
app.use(passport.initialize());
app.use(passport.session());
db.setup();
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

app.use('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/account', ensureAuthenticated, function(req, res) {
  res.render('account', { user: req.user });
});

// set up routes

app.get('auth/facebook', passport.authenticate('facebook'),
  function(req, res) {
  //this request gets re-directed to FB so this function will not be called.
});
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/home');
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
