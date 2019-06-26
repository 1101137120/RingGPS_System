var Time_lineInstance= require('../models/time_lines'); 

// Handle /2.4/v1/collecteddata for POST
exports.getCollectedData = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var time_lineInstance = new Time_lineInstance();		

	
	if(typeof req.body.tag_id === "undefined")errorMessages.push("Missing 'tag_id' field");

	
	var concatenate = errorMessages.join(", ");
	customErr.message = concatenate;	
	
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
		var tag_id = req.body.tag_id;
		

		if(!validation.isNumber(tag_id))
		{
			customErr.status = 400;
			customErr.message = "tag_id must be a number";		
			console.log("tag_id must be a number");
			next(customErr);	
		
		}
		else
		{
		
			var sql = 
			" select tag.id,created_at as date,strength"+
			" from time_line_today,tag "+
			" where tag.id = '"+tag_id+"' and "+
			" time_line_today.tag_uid = tag.tag_uid";
			
		
			time_lineInstance.query(sql,function(err,rows,fields){
				if(err) 
				{
					customErr.status = 503;
					customErr.message = "db query error";	
					console.log("db query error:"+err);
					next(customErr);			
						
				}
				else
				{
	

					if(rows.length >= 1)
					{
						var apiOutput = {};
						apiOutput.status = "success";
						apiOutput.message = "get strength data success";
						
						
       						
						for(var i=0;i<rows.length;i++)
						{
						
							var date = new Date(rows[i].date);
							var formatDate = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+" "
							+addZero(date.getHours()) + ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds());   						
							rows[i].date = formatDate;
						
						}
						
						apiOutput.response = rows;
						apiOutput.tag_id = tag_id;
						res.json(apiOutput);		
						console.log(JSON.stringify(apiOutput));							
					
					}
					else
					{
								customErr.status = 404;
								customErr.message = "readerID:"+reader_name+" 沒有統計資料";	
								next(customErr);
					
					}
				
				}
			
			});
	
		
		
		}

	}
};

                      
function addZero(n){
 return n < 10 ? '0' + n : '' + n;
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