var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');

var mongo = require('mongodb');
var mongoose = require('mongoose');

//connection to mongodb
mongoose.connect('mongodb://localhost/userdatabase');

var app = express();

var api = require('./routes/api.js');
// var authenticate = require('./routes/authenticate'); 




//middleware for body parser
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));


//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//using public directory
app.use(express.static(path.join(__dirname,'public')));

app.use('/',api);
//app.use('/auth',authenticate);

//session middleware
app.use(session({
	secret : 'top secter'
}));
var server = require('http').createServer(app);
server.listen(3000);

var io = require('socket.io').listen(server);

var users = [];

io.on('connection',function(socket){
	

	socket.on('new uservalue',function(data,callback){
		console.log(data);
		if(users.indexOf(data)>=0)
			callback(false);
		else{
			callback(true);
			socket.username = data;

			users.push(socket.username);
			io.emit('users',users);
			io.emit('current_user',socket.username);
		}
	});

	//send message
	socket.on('send message',function(data){
		console.log(data + " " +socket.username);
		io.emit('new message',{message:data,user:socket.username});
	});

	socket.on('disconnect',function(){
		//for(x = 0; x < users.length;x++)
			//console.log("connected users= "+users[x]);
		users.splice(users.indexOf(socket.username));
		io.emit('users',users);
		//console.log("user dc");
	});
});




