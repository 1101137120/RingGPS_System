
var FlightInstance= require('../models/gmapnetcache');
var fs= require('fs');
var getDirName  = require('path').dirname;
var mkdirp = require('mkdirp');
// Handle /2.4/v1/tags for GET
exports.postFlightMap = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var flightInstance = new FlightInstance();	
	console.log("getTags---");
	var apiOutput = {};
	var datailrows = Array();
	/*var flightId = req.body.flightId;
	if(typeof req.body.flightId == "undefined")
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
				var sql = "SELECT * FROM mapcache.gmapnetcache where Type=506225996 ";	
				flightInstance.query(sql,function(err, rows, fields) {
			if(err) 
				{
					console.log(JSON.stringify(err));
					console.log("No");
					customErr.status = 503;
					customErr.message = "db query error";		
					next(customErr);			
				}else
				{
				console.log("rows.length"+rows.length);
				for(var i=0;i<rows.length;i++)
				{
					console.log("i:"+i);
					//console.log("./Map/"+rows[i].Type+"/"+rows[i].Zoom+"/"+rows[i].Y+"/"+rows[i].X+".png"+rows[i].Tile);
					//var base64Img = rows[i].Tile.toString('base64'); 
					//console.log("base64Img"+base64Img);
					//var decodeImg = new Buffer(base64Img, 'base64'); 
					//console.log("decodeImg"+decodeImg);
					mkdirp("./Map/"+rows[i].Type+"/"+rows[i].Zoom+"/"+rows[i].Y);
						fs.writeFile("./Map/"+rows[i].Type+"/"+rows[i].Zoom+"/"+rows[i].Y+"/"+rows[i].X+".png", rows[i].Tile, function(err){
						if(err){
							console.log("down fail"+err);
						}
						console.log("down success");
						});
					/*	var path = "./Map/"+rows[i].Type+"/"+rows[i].Zoom+"/"+rows[i].Y+"/"+rows[i].X+".png";
					
						var content =  rows[i].Tile;
						  mkdirp(getDirName(path), function (err) {
    if (err) return cb(err);

    fs.writeFile(path,content);
  });*/
						
				}

						
					console.log("OK---");
					apiOutput.status = "success";
					apiOutput.message = "tag found";
					apiOutput.response = "DD";
					apiOutput.flightresponse = "dasd";					
					res.json(apiOutput);
				
				}
			
				});



	}
};


function mkdirp(filepath) {
    var dirname = path.dirname(filepath);
	console.log("dirname"+dirname);
    if (!fs.existsSync(dirname)) {
        mkdirp(dirname);
    }

    fs.mkdirSync(filepath);
}
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