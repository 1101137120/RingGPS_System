var Time_lineInstance= require('../models/time_lines'); 

// Handle /2.4/v1/time_lines for POST
exports.posttime_lines = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var time_lineInstance = new Time_lineInstance();		

	
	if(typeof req.body.group_code === "undefined")errorMessages.push("Missing 'group_code' field");
	if(typeof req.body.run_code === "undefined")errorMessages.push("Missing 'run_code' field");
	if(typeof req.body.reader_name === "undefined")errorMessages.push("Missing 'reader_name' field");
	if(typeof req.body.is_read === "undefined")errorMessages.push("Missing 'is_read' field");

	
	var concatenate = errorMessages.join(", ");
	customErr.message = concatenate;	
	
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
	

		var group_code = time_lineInstance.escape(req.body.group_code);
		var run_code = time_lineInstance.escape(req.body.run_code);
		var reader_name = time_lineInstance.escape(req.body.reader_name);
		var is_read = time_lineInstance.escape(req.body.is_read);
		var created_at = new Date();
		console.log("group_code:"+group_code);
		console.log("run_code:"+run_code);
		console.log("reader_name:"+reader_name);
		console.log("is_read:"+is_read);
		
		console.log("is reader_name numeric:"+validation.isNumber(reader_name));
		if(!validation.isNumber(reader_name))
		{
			customErr.status = 400;
			customErr.message = "reader_name must be a number";		
			console.log("reader_name must be a number");
			next(customErr);	
		
		}
		else
		{
			time_lineInstance.set('group_code', group_code);
			time_lineInstance.set('run_code', run_code);
			time_lineInstance.set('reader_name', reader_name);
			time_lineInstance.set('is_read', is_read);
			time_lineInstance.set('created_at', created_at);
			time_lineInstance.save(function(err){
				if(err) 
				{
					console.log(JSON.stringify(err));
					
					if(err.errno === 1062)
					{
						customErr.status = 409;
						customErr.message = "time_line record already exists";
						console.log("time_line record already exists");
					}
					else
					{
						customErr.status = 503;
						customErr.message = "db query error";	
						console.log("db query error");
					}
					next(customErr);			
				}
				else
				{	
						
					var apiOutput = {};
					apiOutput.status = "success";
					apiOutput.message = "new time_line established";
					res.json(apiOutput);		
					console.log(JSON.stringify(apiOutput));
				}
			});		
		
		
		}

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