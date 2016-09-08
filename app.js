var storage = {};
// var sessionStore = {};

var express = require('express');
var app = express();
var session = require('express-session');
var credentials = require('./credentials.js');
var RDBStore = require('session-rethinkdb')(session);
var r = require('rethinkdbdash')({
    servers: [
        {host: 'localhost', port: 28015}
    ]
});

var store = new RDBStore(r,  {
    browserSessionsMaxAge: 5000, // optional, default is 60000 (60 seconds). Time between clearing expired sessions.
    table: 'session' // optional, default is 'session'. Table to store sessions in.
});

var handlebars = require('express-handlebars')
	.create({
		defaultLayout: 'main',
		extname: '.hbs'
	});
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.use(express.static('./js'));
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(session({
	httpOnly: false,
	resave: true,
	saveUninitialized: true,
	secret: credentials.cookieSecret,
	store: store
}));

// app.use(function(req, res, next) {
// 	var sess = req.session;
// 	sess.
// 	if()
// 	next();
// 	res.redirect(303, '/');
// });

//ROUTES

app.get('/', function(req, res) {
	console.log(req.session);
	var nickname = req.session.nickname;
	var person;
	if(nickname) {
		person = nickname;
	} else {
		person = 'Аноним';
	}
	res.render('home', {user: person});
});

app.get('/signup', jsonParser, function(req, res) {
	res.render('signup');
});

app.post('/signup', jsonParser, function(req, res) {
	console.log(req.body)
	var newUser = req.body;
	storage[newUser.nickname] = {password: newUser.password};
	res.redirect(303, '/');
});

app.get('/login', jsonParser, function(req, res) {
	res.render('login');
});

app.post('/login', jsonParser, function(req, res) {
	console.log(req.body);
	var user = req.body;
	var _id = Date.now();
	//sessionStore[_id] = {nickname: user.nickname, }
	if(storage[user.nickname] && storage[user.nickname].password === user.password) {
		req.session.nickname = req.body.nickname;
	}
	res.redirect(303, '/');
});

app.post('/logout', function(req, res) {
	delete req.session.nickname;
	return res.redirect(303, '/');
});

app.get('/buble', function(req, res) {
	res.render('buble');
});

app.set('port', process.argv[2] || 3000);

app.listen(app.get('port'), function() {
	console.log(`Server works on ${app.get('port')}.`);
});