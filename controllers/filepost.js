var LevelInstance= require('../models/tag'); 
var multer= require('multer'); 
var upload = multer();
// Handle /2.4/v1/tags for GET
exports.postfileDatas = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var levelInstance = new LevelInstance();		
	console.log("getTags---");
	
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
		var s= JSON.stringify(req.body).split('\r\n');
	console.log("body"+JSON.stringify(req.body));
	console.log("s"+s.length);
	var aaa =upload.any();
	aaa(req, res, function(err) {
		//console.log("req.headers['content-type']"+req.headers['content-type']);
		//console.log("reqfile"+req.body.length);
		//console.log("req.headers"+req.headers);
		console.log("reqfilessssss"+JSON.stringify(req.files));
		//console.log("reqfile"+JSON.stringify(req.file));
		//console.log("body"+req.body);
		
	})
	

		return res.json(req.body);



	}
};

function getClientIp(req) {
  var ipAddress;
  // The request may be forwarded from local web server.
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    // 'x-forwarded-for' header may return multiple IP addresses in
    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
    // the first one
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    // If request was not forwarded
    ipAddress = req.connection.remoteAddress;
  }
  return ipAddress;
}; 
var validation = {
	isEmailAddress:function(str) {
	   var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	   return pattern.test(str);  // returns a boolean
	},
	isNotEmpty:function (str) {
	   var pattern =/\S+/;
	   return pattern.test(str);  // returns a boolean
	},
	isNumber:function(str) {
	   var pattern = /^\d+$/;
	   return pattern.test(str);  // returns a boolean
	},
	isSame:function(str1,str2){
	  return str1 === str2;
}};   