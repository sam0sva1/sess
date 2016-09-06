var storage = {};
var sessionStore = {};

var express = require('express');
var app = express();
var credentials = require('./credentials.js');

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
app.use(require('express-session')({
	resave: false,
	saveUninitialized: false,
	secret: credentials.cookieSecret
}));

app.get('/', function(req, res) {
	console.log(req.session);
	if(!req.session.nickname) {
		res.render('home', {user: 'Аноним'});
	} else {
		var nickname = req.session.nickname;
		res.render('homeSingedUp', {user: nickname});
		req.session.nickname = nickname;
	}
});

app.get('/signup', jsonParser, function(req, res) {
	res.render('signup');
});

app.post('/signup', jsonParser, function(req, res) {
	console.log(req.body)
	var newUser = req.body;
	storage[newUser.nickname] = {password: newUser.password};
	return res.redirect(303, '/');
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
	return res.redirect(303, '/');
});

app.get('/logout', function(req, res) {
	delete req.session.nickname;
	return res.redirect(303, '/');
});

app.set('port', process.argv[2] || 3000);

app.listen(app.get('port'), function() {
	console.log(`Server works on ${app.get('port')}.`);
});