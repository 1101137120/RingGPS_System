
var  fs = require("fs");
// Handle /2.4/v1/tags for GET
exports.postRingDataSend = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	//console.log("nmea insert---");
	var csvname = req.body.csvname;
	//var ringData = req.body.ringData;
	var ringData ="$GPGGA,102027.000,2500.4324,N,12129.1141,E,1,3,3.08,135.0,M,15.2,M,,*59$GPRMC,102027.000,A,2500.4324,N,12129.1141,E,0.30,15.75,260917,,,A*5C$GPGGA,102233.000,2500.4775,N,12129.0455,E,1,4,2.89,61.1,M,15.2,M,,*61$GPRMC,102233.000,A,2500.4775,N,12129.0455,E,2.52,291.40,260917,,,A*64$GPGGA,102917.000,2500.6826,N,12128.7655,E,1,5,2.38,34.9,M,15.2,M,,*60$GPRMC,102917.000,A,2500.6826,N,12128.7655,E,1.53,201.10,260917,,,A*68$GPGGA,103003.273,2500.6697,N,12128.7501,E,1,4,2.66,3.0,M,15.2,M,,*5A$GPRMC,103003.273,A,2500.6697,N,12128.7501,E,1.51,205.52,260917,,,A*65$GPGGA,103102.265,2500.6889,N,12128.7334,E,1,5,1.55,24.0,M,15.2,M,,*6B$GPRMC,103102.265,A,2500.6889,N,12128.7334,E,17.02,332.02,260917,,,A*52$GPGGA,103212.256,2500.9713,N,12128.3972,E,1,5,1.71,30.1,M,15.1,M,,*67$GPRMC,103212.256,A,2500.9713,N,12128.3972,E,19.48,337.60,260917,,,A*5E$GPGGA,103256.244,2501.1282,N,12128.2865,E,1,7,1.14,7.5,M,15.1,M,,*57$GPRMC,103256.244,A,2501.1282,N,12128.2865,E,0.49,227.64,260917,,,A*62"

	//var ringRealID = req.body.ringRealID;
	

		var GPRMCandA=ringData.toString().split("$GPRMC");
		var GPGGAandA=GPRMCandA.toString().split("$GPGGA");
		var GPS="";
		for(var i=1;i<GPGGAandA.length;i++)
		{
			if(i%2==1)
			{
				GPS = GPS+"$GPGGA"+GPGGAandA[i]+"\n";
			}
			else{
			
				GPS = GPS+"$GPRMC"+GPGGAandA[i]+"\n";
			}
		}
		
		  //引用 nodemailer
var nodemailer = require('nodemailer');

//宣告發信物件
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ihoinRing@gmail.com',
        pass: 'smartchip'
    }
});

var options = {
    //寄件者
    from: 'ihoinRing@gmail.com',
    //收件者
    to: 'mike255920002000@gmail.com', 
    //副本
    cc: 'mike255920002000@gmail.com',
    //密件副本
    bcc: 'mike255920002000@gmail.com',
    //主旨
    subject: 'Ring錯誤回報', // Subject line
    //純文字
    text: 'Hello world2', // plaintext body
    //嵌入 html 的內文
    html: '<h2>Why and How</h2> <p>The <a href="http://en.wikipedia.org/wiki/Lorem_ipsum" title="Lorem ipsum - Wikipedia, the free encyclopedia">Lorem ipsum</a> text is typically composed of pseudo-Latin words. It is commonly used as placeholder text to examine or demonstrate the visual effects of various graphic design. Since the text itself is meaningless, the viewers are therefore able to focus on the overall layout without being attracted to the text.</p>', 
    //附件檔案
    attachments: [ {
        filename: 'GPS.txt',
        content:GPS
    }, {
        filename: 'ring.log',
        path: './logs/rings.log'
    }]
};

//發送信件方法
transporter.sendMail(options, function(error, info){
    if(error){
        console.log(error);
    }else{
		res.send("OKOK");
        console.log('訊息發送: ' + info.response);
    }
});
}
function addZero(n){
 return n < 10 ? '0' + n : '' + n;
}	  
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