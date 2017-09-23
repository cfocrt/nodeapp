const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const routes = require('./routes/index');
const users = require('./routes/users');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// express session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

//express validator
app.use(expressValidator({
	errorFormatter: (param,msg,value) => {
		let namespace = param.split('.'),
			root = namespace.shift(),
			formParam = root;
		while(namespace.length) {
			formParam += '[' + namespace.shift() + "]";
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

//connect flash
app.use(flash());

//global variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

app.use('/', routes);
app.use('/users', users);

//set a port
app.set('port', (process.env.PORT || 3000));

//start a server
app.listen(app.get('port'), () => {
	console.log('Server started on port '+app.get('port'));
});

