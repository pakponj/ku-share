// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
//var User            = require('../app/models/user');
var bcrypt = require('bcrypt-nodejs');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '1234',
    database: 'authen_test'
})

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query('select * from user as u where u.id = ?',[id], (err, result) => {
            done(err, result[0])
        })
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            var sql = 'select * from user where email = ?'
            connection.query(sql, [email] ,(err, result) => {
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!result[0])
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!bcrypt.compareSync(password, result[0].password)){
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }
                // all is well, return user
                else
                    return done(null, result[0]);
            })
        });

    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            // if the user is not already logged in:
            if(!req.user) {
                connection.query('SELECT * FROM user WHERE email = ?',email ,function (err, result) {
                    if(err)
                        return done(err)
                    if(result[0]) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
                    } else {
                        connection.query('insert into user (email, password) values (?,?)',[email,bcrypt.hashSync(password, bcrypt.genSaltSync(12), null)],(err, result) => {
                            if(err)
                                return done(err)

                            connection.query('select * from user where email = ?', email , (err, result) => {
                                return done(null, result[0])
                            })

                        })
                    }
                })
            } else if(!req.user.email) {
                var sql = 'select * from user where email = ?'
                connection.query( sql, [email], (err, result) => {
                    if(err)
                        return done(err)
                    if(user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken'))
                    } else {
                        connection.query('insert into user (email, password) values (?,?)',[email,bcrypt.hashSync(password, bcrypt.genSaltSync(12), null)],(err, result) => {
                            if(err)
                                return done(err)

                            return done(null, result[0])
                        })
                    }
                })
            } else {
                return done(null, req.user)
            }
        });

    }));
};