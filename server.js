process.env.TZ = 'Asia/Taipei' 
// Get the packages we need
var express = require('express');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var readersController = require('./controllers/readers');


var session = require('express-session');
var passport = require('passport');
var path = require('path');
var mime = require('mime');
//file upload
var multer  = require('multer');
var done=false; 
// Create our Express application
var app = express();
app.set('http_port', 9004);
app.set('ip', "10.1.1.130");
//handle for jsonp
app.set("jsonp callback", true);
// http
var http = require('http');
var httpServer = http.createServer(app);
var fs = require('fs');
app.use("/registration/v1/img",express.static(__dirname + "/public/img"));


//handle for jsonp
app.set("jsonp callback", true);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(session({
    secret: 'session_cookie_secret',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.session());




var routerRegistration = express.Router();
app.use('/2.4/v1', routerRegistration);

routerRegistration.route('/readers')
	.get(readersController.getReaders);		
	
// Error Hanlding
app.use(function(err, req, res, next) {
	var apiOutput = {};
	apiOutput.status = "failure";
	apiOutput.error_message = err.message;
	
	if(typeof err.gcm_user_id !== "undefined")apiOutput.gcm_user_id = err.gcm_user_id;
	if(typeof err.status !== "undefined")res.statusCode = err.status;	

	res.send(JSON.stringify(apiOutput) || '** no relevant error handle **');  
	
	

	
	return next();
}); 
httpServer.listen(app.get('http_port'),app.get('ip'),function(){
	console.log("listen on port "+app.get('http_port')+", server is running");


});


