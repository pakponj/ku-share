//set up
// Get all the tools we need.
var express = require('express');
var app     = express()
var port    = process.env.PORT ||3000
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');

var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
//var mysql = require('mysql');

//var configDB = require('./config/database.js');

//configuration
/*mongoose.connect(configDB.url)*/
require('./config/passport')(passport)

// set up our express application
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser())

app.set('view engine','ejs')

// required for passport
app.use(session({
    secret: 'ilovePakponJettapai'
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//routes =================================
require('./app/routes.js')(app, passport)

app.listen( port , () => {
    console.log('Listening on port %d...',port);
})
