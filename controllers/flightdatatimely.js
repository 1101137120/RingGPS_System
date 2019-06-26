
var FlightInstance= require('../models/flight_data');

// Handle /2.4/v1/tags for GET
exports.postflightDatas = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var flightInstance = new FlightInstance();	
	var analyzeUID= req.body.analyzeUID;
	if(typeof req.body.analyzeUID == "undefined")
	{
		errorMessages.push("Missing 'analyzeUID' field");
		res.json(errorMessages);
		throw (errorMessages);
	}
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
		console.log("Not in");

			var sql ="select * from flight_details where flight_id=(SELECT Max(id) FROM flight_data where tag_id='"+analyzeUID+"')";
		
		
		flightInstance.query(sql,function(err, rows, fields) {
			if(err) 
			{
				console.log(JSON.stringify(err));
				console.log("No");
				customErr.status = 503;
				customErr.message = "db query error";		
				next(customErr);			
			}
			else
			{
					var apiOutput={};
					console.log("OK---");
					apiOutput.status = "success";
					apiOutput.message = "flight found";
					apiOutput.response = rows;					
					res.json(apiOutput);
			}
		});



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