var express = require('express');
var app = express();
 
var passport   = require('passport');
var session    = require('express-session');
var bodyParser = require('body-parser');
require('dotenv').config()
var exphbs = require('express-handlebars');
 
//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


var flash = require('connect-flash');
app.use(flash());
app.get('/', function(req, res) {
    res.send('Welcome to Passport with Sequelize');
});
 
//For Handlebars
app.set('views', './views');
app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

 //Models
var models = require("./models");

 //Routes
var authRoute = require('./routes/auth.js')(app, passport);

//load passport strategies
require('./config/passport/passport.js')(passport, models.user);

//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
 
});

app.listen(5000, function(err) {
    if (!err)
        console.log("Site is live");
    else console.log(err)
 
});