var TagInstance= require('../models/tag_animal'); 

// Handle /2.4/v1/tag_position for GET
exports.postFindTagState = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	var tagInstance = new TagInstance();
	var tag_id = null;
	customErr.status = 400;
	console.log("getTagPosition---");
	
	if(typeof req.body.tag_id === "undefined"&&typeof req.body.tag_uid === "undefined")errorMessages.push("Missing 'tag_id' or 'tag_uid' field");
	
	if(req.body.tag_uid){
	if(typeof req.body.tag_state === "undefined")errorMessages.push("Missing 'tag_state' field");
		var sql = "SELECT id FROM tag_animal WHERE tag_uid='"+req.body.tag_uid+"'";
		console.log(req.body.tag_uid);
		tagInstance.query(sql,function(err, rows, fields) {
			if(err) 
			{
				console.log(JSON.stringify(err));

				customErr.status = 503;
				customErr.message = "db query error";		
				next(customErr);			
			}
			else
			{
			var tag_state = req.body.tag_state;
				  tag_id= rows['0'].id;
				  console.log('aaaa'+ tag_id);
				  console.log('SSSSSSS'+ tag_state);
				  var sql = "UPDATE  tag_animal SET state='"+tag_state+"' WHERE id='"+tag_id+"'";

		tagInstance.query(sql,function(err, rows, fields) {
			if(err) 
			{
				console.log(JSON.stringify(err));

				customErr.status = 503;
				customErr.message = "db query error";		
				next(customErr);			
			}
			else
			{
				var apiOutput = {};
				apiOutput.status = "success";
				apiOutput.message = "update tag newest state ";			
				res.json(apiOutput);	
			}
		});
			}
		});
			
	
	}else{
	
			
		var tag_id= req.body.tag_id;
		var sql = "SELECT state FROM tag_animal WHERE id='"+tag_id+"'";
	console.log(tag_id);
		tagInstance.query(sql,function(err, rows, fields) {
		
			if(rows['0'].state===0){
	
	var tag_state=1;
					console.log(tag_state);	
	}else{
	
		var tag_state=0;
		console.log(tag_state);
					};	
		var sql = "UPDATE  tag_animal SET state='"+tag_state+"' WHERE id='"+tag_id+"'";

		tagInstance.query(sql,function(err, rows, fields) {
			if(err) 
			{
				console.log(JSON.stringify(err));

				customErr.status = 503;
				customErr.message = "db query error";		
				next(customErr);			
			}
			else
			{
				var apiOutput = {};
				apiOutput.status = "success";
				apiOutput.message = "update tag newest state ";
				apiOutput.response = rows;			
				res.json(apiOutput);	
			}
		});
		
		
		});
	
		
		
	}
	
	var concatenate = errorMessages.join(", ");
	customErr.message = concatenate;	


	
	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{	
	
	
		}
	
	/*tagInstance.set('id',req.body.tag_id);
	tagInstance.set('state',tag_state);
	tagInstance.save(function(err,res,aaa){
		if(err) 
			{
				console.log('BBBBBBBB');
				console.log(JSON.stringify(err));

				customErr.status = 503;
				customErr.message = "db query error";		
				next(customErr);			
			}
			else
			{
				console.log(res);
				console.log(aaa);
				var apiOutput = {};
				apiOutput.status = "success";
				apiOutput.message = "tag newest position found";
				apiOutput.response = rows;			
				res.json(apiOutput);	
			}
		
	})*/
		/*var tag_id = tagInstance.escape(req.body.tag_id);
		var interval = 5;
		// var sql = "SELECT * FROM `reader` WHERE reader_name =  (select reader_name from time_line where tag_name = (select tag_name from tag where id = "+tag_id+") and created_at BETWEEN timestamp(DATE_SUB(NOW(), INTERVAL "+interval+" MINUTE)) AND timestamp(NOW()) order by created_at desc limit 1)";

		var sql = 
		
		// "SELECT * FROM `reader` WHERE reader_name ="+
		// "(select reader_name from time_line where tag_name = (select tag_name from tag where id = "+tag_id+")"+
		// "order by created_at desc limit 1)";		
		"SELECT *,(select created_at from time_line_today where tag_name = (select tag_name from tag where id = "+tag_id+")"+
		"order by created_at desc limit 1)as created_at FROM `reader` WHERE reader_name ="+
		"(select reader_name from time_line_today where tag_name = (select tag_name from tag where id = "+tag_id+")"+
		"order by created_at desc limit 1)"	;
		
		
		console.log("sql:"+sql);
		tagInstance.query(sql,function(err, rows, fields) {
			if(err) 
			{
				console.log(JSON.stringify(err));

				customErr.status = 503;
				customErr.message = "db query error";		
				next(customErr);			
			}
			else
			{
				var apiOutput = {};
				apiOutput.status = "success";
				apiOutput.message = "tag newest position found";
				apiOutput.response = rows;			
				res.json(apiOutput);	
			}
		});*/



	//}
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