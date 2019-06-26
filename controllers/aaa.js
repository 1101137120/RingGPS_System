var TagInstance= require('../models/tag'); 
var apiOutputs = {};
// Handle /2.4/v1/tags for GET
exports.getTags = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var tagInstance = new TagInstance();		
	var tag_uid = req.body.tag_uid;
	console.log("getTags---");
	
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
		var sql = "select tag_uid,created_at from time_line_today where id=(SELECT  max(id) FROM `2.4_husbandry`.time_line_today where tag_uid='"+tag_uid+"')";
		tagInstance.query(sql,function(err, rows, fields) {
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
				if(!rows[0]){
				console.log("No");
					rows[0]={tag_uid:tag_uid,created_at:"暫無資料"};

				}else{
				var date =new Date(rows[0].created_at);
				var date2 = new Date();
				var day =getDays(date2,date);
				//var day = parseInt(addZero(date2.getDate()))-parseInt(addZero(date.getDate()));
				rows[0].created_at=day+"天";
				}
				
				apiOutput.status = "success";
				apiOutput.message = "tag found";
				apiOutput.response=rows;				
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

function addZero(n){
 return n < 10 ? '0' + n : '' + n;
}

function  getDays(sDate1,sDate2){   
       var  aDate,oDate1,oDate2,iDays;
	    console.log(sDate1);
		 console.log(sDate2);
       oDate1  = new Date(addZero(sDate1.getMonth()+1)+'-'+addZero(sDate1.getDate()+'-'+sDate1.getFullYear()));    
	   console.log("oDate1"+oDate1);  
	   oDate2  = new Date(addZero(sDate2.getMonth()+1)+'-'+addZero(sDate2.getDate()+'-'+sDate2.getFullYear()));    
	   console.log("oDate2"+oDate2);  
       iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24);    
       return  iDays;  
}
