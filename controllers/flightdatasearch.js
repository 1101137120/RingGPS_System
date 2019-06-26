
var FlightInstance= require('../models/flight_data');

// Handle /2.4/v1/tags for GET
exports.postFlightData = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var flightInstance = new FlightInstance();	
	console.log("getTags---");
	console.log(req.body.flightUID);
	console.log(req.body.flightdate);
	
	var datailrows = Array();
	var flightUID = req.body.flightUID;
	var flightdate = req.body.flightdate;
	/*if(typeof req.body.flightId == "undefined")
	{
		errorMessages.push("Missing 'csvname' field");
		res.json(errorMessages);
		throw (errorMessages);
	}*/
	
	if(customErr.message !== "")
	{ 
		next(customErr);	
	}
	else
	{
		console.log("Not in");
		if(flightdate&&flightUID)
		{
			var sql = "select flight_data.id as id,name,gender,age,tag_uid,ar_speed,ar_height,heightest,speedest,start_time,end_time,total_time,dataType,gpsDataCount  from flight_data left join  tag on  tag.tag_uid=flight_data.tag_id WHERE valid=0 and tag_id LIKE '%"+flightUID+"%' and  start_time>='"+flightdate+"'";
		console.log("No0");
		}
		else if(flightdate)
		{
			var sql = "select flight_data.id as id,name,gender,age,tag_uid,ar_speed,ar_height,heightest,speedest,start_time,end_time,total_time,dataType,gpsDataCount  from flight_data left join  tag on  tag.tag_uid=flight_data.tag_id WHERE valid=0 and start_time>='"+flightdate+"'";
		console.log("No1");
		}
		else if(flightUID)
		{
			var sql = "select flight_data.id as id,name,gender,age,tag_uid,ar_speed,ar_height,heightest,speedest,start_time,end_time,total_time,dataType,gpsDataCount  from flight_data left join  tag on  tag.tag_uid=flight_data.tag_id WHERE valid=0 and tag_id LIKE '%"+flightUID+"%'";
		console.log("No2");
		}
		else{
			var sql = "select flight_data.id as id,name,gender,age,tag_uid,ar_speed,ar_height,heightest,speedest,start_time,end_time,total_time,dataType,gpsDataCount  from flight_data left join  tag on  tag.tag_uid=flight_data.tag_id where valid=0";
			console.log("No3");
		}
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
				var apiOutput = {};
					console.log("OK---");
					console.log("rows"+rows.length);
					apiOutput.status = "success";
					apiOutput.message = "tag found";
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