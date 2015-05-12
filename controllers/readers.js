var ReaderInstance= require('../models/reader'); 

// Handle /api/keyService/v1/readers for POST
exports.getReaders = function(req, res,next) {
	var customErr = new Error();
	var readerInstance = new ReaderInstance();		
	var sql = "select * from reader";
	readerInstance.query(sql,function(err, rows, fields) {
		if(err) 
		{
			console.log(JSON.stringify(err));

			// customErr.status = 503;
			// customErr.message = "db query error";		
			// next(customErr);			
		}
		else
		{
			var apiOutput = {};
			apiOutput.status = "success";
			apiOutput.message = "readers found";
			apiOutput.response = rows;			
			res.json(apiOutput);	
		}
	});	
/* 	var errorMessages = new Array();
	customErr.status = 400;
	
	// email,imei,mac,package_name
	if(typeof req.body.email === "undefined")errorMessages.push("Missing 'email' field");
	if(typeof req.body.mac === "undefined")errorMessages.push("Missing 'mac' field");
	if(typeof req.body.imei === "undefined")errorMessages.push("Missing 'imei' field");
	if(typeof req.body.package_name === "undefined")errorMessages.push("Missing 'package_name' field");
	
	var concatenate = errorMessages.join(", ");
	customErr.message = concatenate;

	if(customErr.message !== "")
	{
		next(customErr);	
	}
	else
	{
	

		var email = keyServiceKeys.escape(req.body.email);
		var mac = keyServiceKeys.escape(req.body.mac);
		var imei = keyServiceKeys.escape(req.body.imei);
		var package_name = keyServiceKeys.escape(req.body.package_name);
		var created_at = new Date();
		var ip = getClientIp(req);
		//先找到account_id

		var sql = "select id from account where email = '"+email+"'";

		keyServiceAccounts.query(sql,function(err, rows, fields) {
			if(err) 
			{
				console.log(JSON.stringify(err));

				customErr.status = 503;
				customErr.message = "db query error";		
				next(customErr);					
			}
			else
			{
				if(rows.length>0)
				{
					//再用account_id,imei,mac,package_name找key紀錄
					sql = "select * from key_record where account_id = '"+rows[0].id+"' and imei = '"+imei+"' and mac = '"+mac+"' and package_name = '"+package_name+"'";		
					keyServiceKeys.query(sql,function(err, rows, fields) {
						if(err) 
						{
							console.log(JSON.stringify(err));

							customErr.status = 503;
							customErr.message = "db query error";		
							next(customErr);					
						}
						else
						{
							if(rows.length > 0)
							{
								var apiOutput = {};
								apiOutput.status = "success";
								apiOutput.message = "UID found";
								apiOutput.response = rows;
								
								
								
								res.json(apiOutput);			
							}
							else
							{				
								customErr.status = 404;
								customErr.message = "ResourceNotFound";		
								next(customErr);					

							}
						}
					});					
				
				}
				else
				{
					customErr.status = 404;
					customErr.message = "ResourceNotFound";		
					next(customErr);					
				
				}
			}
		});				
	} */		

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