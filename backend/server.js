//set up
// Get all the tools we need.
var express = require('express');
var app     = express();
var port    = process.env.PORT ||3000
var passport = require('passport');
var flash = require('connect-flash');

var multer = require('multer');
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');

//configuration
require('./config/passport')(passport);

// set up our express application
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// required for passport
app.use(session({
    secret: 'ilovePakponJettapai'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static(path.join(__dirname, 'views')));
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb, err) {
        var oriname = file.originalname;
        var extension = oriname.substr(oriname.indexOf('.'));
        var filename = req.body.filename + extension;
        cb(null, filename);
    }
});

var uploader = multer({
    storage:storage
}).single('upl');

//routes =================================
require('./app/routes.js')(app, passport, uploader);

app.listen( port , () => {
    console.log('Listening on port %d...',port);
})
