process.env.TZ = 'Asia/Taipei' 
// Get the packages we need
var express = require('express');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var readersController = require('./controllers/readers');
var time_linesController = require('./controllers/time_lines');


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

var io = require("socket.io").listen(httpServer);
io.set('transports', ['polling', 'websocket']);
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

app.set("views", __dirname + "/views");
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');





app.use("/2.4/v1",express.static("public", __dirname + "/public"));
app.all("/2.4/v1/index", function(request, response) {
	response.render('index');


});
app.all("/2.4/v1/channel", function(request, response) {
	var reader_name = request.body.reader_name;
	var position = request.body.position;
	var tag_name = request.body.tag_name;
	var tag_uid = request.body.tag_uid;
	var strength = request.body.strength;
	var created_at = new Date();

	console.log("reader_name:"+reader_name);
	// console.log("position:"+position);
	// console.log("tag_name:"+tag_name);
	// console.log("tag_uid:"+tag_uid);
	// console.log("strength:"+strength);
	var time_line_record = {};
	
	time_line_record.reader_name = reader_name;
	time_line_record.position = position;
	time_line_record.tag_name = tag_name;
	// time_line_record.uid = tag_uid;
	time_line_record.strength = strength;
	// time_line_record.created_at = created_at;
	
	
	console.log("what's going on:"+JSON.stringify(time_line_record));
	io.sockets.emit("channel1", time_line_record);
	console.log("reader:"+time_line_record.reader_name+" message emit")
	response.send("message send");

	
});
var routerRegistration = express.Router();
app.use('/2.4/v1', routerRegistration);

routerRegistration.route('/readers')
	.get(readersController.getReaders)
	.post(readersController.postReaders);
	
routerRegistration.route('/time_lines')	
	.post(time_linesController.posttime_lines);
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


