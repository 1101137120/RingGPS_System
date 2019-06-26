var express   = require('express')
  , graph     = require('fbgraph');
var  url = require("url");
var  fs = require("fs");
var opn = require('opn');
var querystring = require('querystring'); 
var request = require('request');
//var Buffer = require('Buffer');
var async = require('async');
var app = express(); 
var multer  = require('multer');
var upload = multer();
var server = require("http").createServer(app);
const requests = require("./models/mysql");
var maptestController = require('./controllers/maptest');
var csvinsertController = require('./controllers/csvinsert');
var flighttagController = require('./controllers/flighttag');
var leveldataController = require('./controllers/leveldata');
var flightmapController = require('./controllers/flightmap');
var flightdatasearchController =require('./controllers/flightdatasearch'); 
var chartspageController = require('./controllers/chartspage');
var levelpageController = require('./controllers/levelpage');
var tagDataUpdateController = require('./controllers/tagDataUpdate');
var levelDataUpdateController = require('./controllers/levelDataUpdate');
var levelInsertController = require('./controllers/levelInsert');
var levelDataUpdateController = require('./controllers/levelDataUpdate');
var tagdataController = require('./controllers/tagdata');
var analyzeflightController = require('./controllers/analyzeflight');
var analyzeflightsearchController = require('./controllers/analyzeflightsearch');
var analyzesearchByIdController = require('./controllers/analyzesearchById');
var analyzeflightdelController = require('./controllers/analyzeflightdel');
var analyzeByIdController = require('./controllers/analyzeById');
var bestanalyzeflightsearchController = require('./controllers/bestanalyzeflightsearch');
var filepostController= require('./controllers/filepost');

let handle = requests.get;


var http = require('http');
var httpServer = http.createServer(app);
var aaa =0;
var ss=require("socket.io");
app.set('http_port', 3000);
//app.set('ip', "10.1.1.77");
var io = ss.listen(httpServer);
// this should really be in a config file!
var conf = {
    client_id:      '1700561416915068'
  , client_secret:  '489fd3f8ac29090628d73b7a85b8b915'
  , scope:          'publish_actions,user_about_me,user_birthday,user_education_history,user_friends,user_likes,user_location,user_photos,user_posts,email'
  // You have to set http://localhost:3000/ as your website
  // using Settings -> Add platform -> Website
  , redirect_uri:   'http://localhost:3000/auth'
};

graph.setVersion("2.9");
// Configuration
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
//var path = require('path');
//var FB = require('fb');
var messagePost = new Array();
var show_socket={};
app.set('views', __dirname + '/views');
app.engine('.html',require('ejs').__express);
// Jade was renamed to pug
app.set('view engine', 'html');
//app.use("/map/v1",express.static("public", __dirname + "/public"));


app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(methodOverride());


app.use(express.static("public", __dirname + "/public"));


var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
   app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}


// Routes
function nmeainsert(){
	async.waterfall([
	function(next){
		fs.readdir("./public/csv", function(err,list) {
			
			 next(err, list);
			 
		})    
}], function(err,list,next){
    if(err) throw err;  // 匯集 err1 err2 err3
	nmeadatainsert(list);
    console.log("list"+list);   // 收到的 rst = 上面的 result4
	console.log("inininin"+new Date());
});

}
setTimeout(nmeainsert,3000);

function nmeadatainsert(list){
var qwe=0;
if(list!=""){

		request.post({url:"http://localhost:3000/map/v1/csvinsert",
					form:{ csvname:list[0]}}, function(err,httpResponse,body){

			if(err){
			console.log("OKOK");
			}else{
					setTimeout(nmeainsert,100);
					console.log("body"+body);
				}
			}
			);
}else{
		setTimeout(nmeainsert,3000);
}
}
		
app.all('/sockethtml', function(req, res){
	
	res.render('tag');
});

app.all('/map', function(req, res){
	
	res.render('map');
});

app.all('/test', function(req, res){
	console.log("OKOK");
	return res.json("test is successful");
});


app.post('/123', function(req, res) {
	
	var aaa =upload.array();
	aaa(req, res, function(err) {
	var ss=req.body.toString().split("\r\n");
		console.log("ss"+ss.length);
		console.log("reqfile"+req.body.toString());
		console.log("reqfile"+req.file);
		console.log("reqfile"+req.files);
		return res.json(req.body);
		
	})
	console.log("reqfile"+req.body);
})



app.all('/flight', function(req, res){
	
	res.render('flight');
});

app.all('/ring', function(req, res){
	
	res.render('ring');
});

app.all('/mapoff', function(req, res){
	res.render('mapoff');
});

app.all('/maplink', function(req, res){
	opn('http://localhost:3000/mapoff?csvname='+req.body.csvname);
	res.json("link:"+req.body.csvname);
	
});


var ringData = {};

var myPort = "";


app.post("/2.4/v1/setRingInfo", function (req, res) {
    var customErr = new Error();
    var errorMessages = new Array();
    customErr.status = 400;
    //var tagInstance = new TagInstance();		
    console.log("postRingInfospostRingInfos---------------------------");
    var ringUUID = req.body.ringUUID;
    var ringPassword = req.body.ringPassword;
    var ringChangePassWord = req.body.ringChangePassWord;
    var ringDateNow = req.body.ringDateNow;
    var ringTimeNow = req.body.ringTimeNow;
    var ringReservseDate = req.body.ringReservseDate;
    var ringReservseTime = req.body.ringReservseTime;
    var ringDateNowArr = ringDateNow.split('/');
    var ringTimeNowArr = ringTimeNow.split(':');
    var ringReservseDateArr = ringReservseDate.split('/');
    var ringReservseTimeArr = ringReservseTime.split(':');
    var ringUUIDisNull = "";
    var ringStatus = req.body.ringStatus;
    console.log("ringUUID" + ringUUID);
    console.log("ringDateNow" + ringDateNow);
    console.log("ringTimeNow" + ringTimeNow);
    console.log("ringReservseDate" + ringReservseDate);
    console.log("ringReservseTime" + ringReservseTime);
    if (myPort == "")
        customErr.message = "裝置未連線";
    

    if (customErr.message !== "") {
        next(customErr);
    }
    else {
        
        if (ringPassword.length < 9 && ringPassword.length != 8) {
            var zero = "";
            for (var s = 0; s < 8 - ringPassword.length; s++) {
                zero = zero + "0";
            }
            ringPassword = zero + ringPassword;

        }
        if (ringChangePassWord != "" && ringUUID == "") {
            var PassBUF = ringPassChange(ringPassword, ringChangePassWord);
            
                var dd = 0x2A + 0x51 + 0x1C + 0x00 + 0x57 + 0x48 + parseInt("0x" + ringPassword.substr(6, 2)) + parseInt("0x" + ringPassword.substr(4, 2)) + parseInt("0x" + ringPassword.substr(2, 2)) + parseInt("0x" + ringPassword.substr(0, 2)) + 0x00 + 0x00 + 0x01 + 0x01 + parseInt("0x" + ringDateNowArr[2]) + parseInt("0x" + ringDateNowArr[1]) + parseInt("0x" + (ringDateNowArr[0] - 2000)) + 0x00 + parseInt("0x" + ringTimeNowArr[2]) + parseInt("0x" + ringTimeNowArr[1]) + parseInt("0x" + ringTimeNowArr[0]) + 0x00 + parseInt("0x" + ringReservseDateArr[2]) + parseInt("0x" + ringReservseDateArr[1]) + parseInt("0x" + (ringReservseDateArr[0] - 2000)) + 0x00 + parseInt("0x" + ringReservseTimeArr[2]) + parseInt("0x" + ringReservseTimeArr[1]) + parseInt("0x" + ringReservseTimeArr[0]) + 0x00 + parseInt(ringStatus) + 0x26;
                var checksum = "0x" + dd.toString(16).substr(dd.toString(16).length - 2, 2);
                var datetimebuf = Buffer.from([0x2A, 0x51, 0x1C, 0x00, 0x57, 0x48, "0x" + ringPassword.substr(6, 2), "0x" + ringPassword.substr(4, 2), "0x" + ringPassword.substr(2, 2), "0x" + ringPassword.substr(0, 2), 0x00, 0x00, 0x01, 0x01, "0x" + ringDateNowArr[2], "0x" + ringDateNowArr[1], "0x" + (ringDateNowArr[0] - 2000), 0x00, "0x" + ringTimeNowArr[2], "0x" + ringTimeNowArr[1], "0x" + ringTimeNowArr[0], 0x00, "0x" + ringReservseDateArr[2], "0x" + ringReservseDateArr[1], "0x" + (ringReservseDateArr[0] - 2000), 0x00, "0x" + ringReservseTimeArr[2], "0x" + ringReservseTimeArr[1], "0x" + ringReservseTimeArr[0], 0x00, ringStatus, checksum, 0x26]);
                var apiOutput = {};
            myPort.write(datetimebuf, function (err, result) {
                if (err) {
                    apiOutput.status = "error";
                    apiOutput.message = "datetimebuf"+err;
                    res.json(apiOutput);
                }
                myPort.write(PassBUF, function (err, result) {
                    if (err) {
                        apiOutput.status = "error";
                        apiOutput.message = "PassBUF"+err;
                        res.json(apiOutput);
                    }
                    var buf = Buffer.from([0x2A, 0x51, 0x03, 0x00, 0x4F, 0x50, 0x43, 0x26]);
                    myPort.write(buf, function (err, result) {
                        
                        if (err) {
                            apiOutput.status = "error";
                            apiOutput.message = "reflush"+err;
                            res.json(apiOutput);
                        }
                        
                        
                        apiOutput.status = "success";
                        apiOutput.message = "datetimebuf,PassBUF,buf is success";
                        res.json(apiOutput);
                    });
                });
            });
        }
        else if (ringChangePassWord == "" && ringUUID != "") {
            var UUIDBUF = ringUUIDChange(ringPassword, ringUUID);
            var apiOutput = {};
            myPort.write(UUIDBUF, function (err, result) {
                
                if (err) {
                    apiOutput.status = "error";
                    apiOutput.message = "UUIDBUF" + err;
                    res.json(apiOutput);
                }
                var dd = 0x2A + 0x51 + 0x1C + 0x00 + 0x57 + 0x48 + parseInt("0x" + ringPassword.substr(6, 2)) + parseInt("0x" + ringPassword.substr(4, 2)) + parseInt("0x" + ringPassword.substr(2, 2)) + parseInt("0x" + ringPassword.substr(0, 2)) + 0x01 + 0x00 + 0x01 + 0x01 + parseInt("0x" + ringDateNowArr[2]) + parseInt("0x" + ringDateNowArr[1]) + parseInt("0x" + (ringDateNowArr[0] - 2000)) + 0x00 + parseInt("0x" + ringTimeNowArr[2]) + parseInt("0x" + ringTimeNowArr[1]) + parseInt("0x" + ringTimeNowArr[0]) + 0x00 + parseInt("0x" + ringReservseDateArr[2]) + parseInt("0x" + ringReservseDateArr[1]) + parseInt("0x" + (ringReservseDateArr[0] - 2000)) + 0x00 + parseInt("0x" + ringReservseTimeArr[2]) + parseInt("0x" + ringReservseTimeArr[1]) + parseInt("0x" + ringReservseTimeArr[0]) + 0x00 + parseInt(ringStatus) + 0x26;
                var checksum = "0x" + dd.toString(16).substr(dd.toString(16).length - 2, 2);
                var datetimebuf = Buffer.from([0x2A, 0x51, 0x1C, 0x00, 0x57, 0x48, "0x" + ringPassword.substr(6, 2), "0x" + ringPassword.substr(4, 2), "0x" + ringPassword.substr(2, 2), "0x" + ringPassword.substr(0, 2), 0x01, 0x00, 0x01, 0x01, "0x" + ringDateNowArr[2], "0x" + ringDateNowArr[1], "0x" + (ringDateNowArr[0] - 2000), 0x00, "0x" + ringTimeNowArr[2], "0x" + ringTimeNowArr[1], "0x" + ringTimeNowArr[0], 0x00, "0x" + ringReservseDateArr[2], "0x" + ringReservseDateArr[1], "0x" + (ringReservseDateArr[0] - 2000), 0x00, "0x" + ringReservseTimeArr[2], "0x" + ringReservseTimeArr[1], "0x" + ringReservseTimeArr[0], 0x00, ringStatus, checksum, 0x26]);
                myPort.write(datetimebuf, function (err, result) {
                    /*var buf = Buffer.from([0x2A, 0x51, 0x03, 0x00, 0x4F, 0x50, 0x43, 0x26]);
                    myPort.write(buf, function (err, result) {
                        
                        if (err) {
                            return console.log('Error on write buf: ' , err.message);
                        }
                    });*/
                    if (err) {
                        apiOutput.status = "error";
                        apiOutput.message = "datetimebuf" + err;
                        res.json(apiOutput);
                    }
                
                    apiOutput.status = "success";
                    apiOutput.message = "datetimebuf,UUIDBUF is success";
                    res.json(apiOutput);
                });

            });
        }
        else if (ringChangePassWord != "" && ringUUID != "") {
            var UUIDBUF = ringUUIDChange(ringPassword, ringUUID);
            var PassBUF = ringPassChange(ringPassword, ringChangePassWord);
            var dd = 0x2A + 0x51 + 0x1C + 0x00 + 0x57 + 0x48 + parseInt("0x" + ringPassword.substr(6, 2)) + parseInt("0x" + ringPassword.substr(4, 2)) + parseInt("0x" + ringPassword.substr(2, 2)) + parseInt("0x" + ringPassword.substr(0, 2)) + 0x01 + 0x00 + 0x01 + 0x01 + parseInt("0x" + ringDateNowArr[2]) + parseInt("0x" + ringDateNowArr[1]) + parseInt("0x" + (ringDateNowArr[0] - 2000)) + 0x00 + parseInt("0x" + ringTimeNowArr[2]) + parseInt("0x" + ringTimeNowArr[1]) + parseInt("0x" + ringTimeNowArr[0]) + 0x00 + parseInt("0x" + ringReservseDateArr[2]) + parseInt("0x" + ringReservseDateArr[1]) + parseInt("0x" + (ringReservseDateArr[0] - 2000)) + 0x00 + parseInt("0x" + ringReservseTimeArr[2]) + parseInt("0x" + ringReservseTimeArr[1]) + parseInt("0x" + ringReservseTimeArr[0]) + 0x00 + parseInt(ringStatus) + 0x26;
            var checksum = "0x" + dd.toString(16).substr(dd.toString(16).length - 2, 2);
            var datetimebuf = Buffer.from([0x2A, 0x51, 0x1C, 0x00, 0x57, 0x48, "0x" + ringPassword.substr(6, 2), "0x" + ringPassword.substr(4, 2), "0x" + ringPassword.substr(2, 2), "0x" + ringPassword.substr(0, 2), 0x01, 0x00, 0x01, 0x01, "0x" + ringDateNowArr[2], "0x" + ringDateNowArr[1], "0x" + (ringDateNowArr[0] - 2000), 0x00, "0x" + ringTimeNowArr[2], "0x" + ringTimeNowArr[1], "0x" + ringTimeNowArr[0], 0x00, "0x" + ringReservseDateArr[2], "0x" + ringReservseDateArr[1], "0x" + (ringReservseDateArr[0] - 2000), 0x00, "0x" + ringReservseTimeArr[2], "0x" + ringReservseTimeArr[1], "0x" + ringReservseTimeArr[0], 0x00, ringStatus, checksum, 0x26]);
            var apiOutput = {};
            myPort.write(datetimebuf, function (err, result) {
                if (err) {
                    apiOutput.status = "error";
                    apiOutput.message = "datetimebuf" + err;
                    res.json(apiOutput);
                }
                myPort.write(UUIDBUF, function (err, result) {
                    if (err) {
                        apiOutput.status = "error";
                        apiOutput.message = "UUIDBUF" + err;
                        res.json(apiOutput);
                    }
                    myPort.write(PassBUF, function (err, result) {
                        if (err) {
                            apiOutput.status = "error";
                            apiOutput.message = "PassBUF" + err;
                            res.json(apiOutput);
                        }
                        var buf = Buffer.from([0x2A, 0x51, 0x03, 0x00, 0x4F, 0x50, 0x43, 0x26]);
                        myPort.write(buf, function (err, result) {
                    
                            if (err) {
                                apiOutput.status = "error";
                                apiOutput.message = "reflush" + err;
                                res.json(apiOutput);
                            }
                            
                            
                            apiOutput.status = "success";
                            apiOutput.message = "datetimebuf,PassBUF,buf,UUIDBUF is success";
                            res.json(apiOutput);
                        });
                    });
                });
            });

        }
        else { 
            console.log('elselselselselse: ');
            var dd = 0x2A + 0x51 + 0x1C + 0x00 + 0x57 + 0x48 + parseInt("0x" + ringPassword.substr(6, 2)) + parseInt("0x" + ringPassword.substr(4, 2)) + parseInt("0x" + ringPassword.substr(2, 2)) + parseInt("0x" + ringPassword.substr(0, 2)) + 0x00 + 0x00 + 0x01 + 0x01 + parseInt("0x" + ringDateNowArr[2]) + parseInt("0x" + ringDateNowArr[1]) + parseInt("0x" + (ringDateNowArr[0] - 2000)) + 0x00 + parseInt("0x" + ringTimeNowArr[2]) + parseInt("0x" + ringTimeNowArr[1]) + parseInt("0x" + ringTimeNowArr[0]) + 0x00 + parseInt("0x" + ringReservseDateArr[2]) + parseInt("0x" + ringReservseDateArr[1]) + parseInt("0x" + (ringReservseDateArr[0] - 2000)) + 0x00 + parseInt("0x" + ringReservseTimeArr[2]) + parseInt("0x" + ringReservseTimeArr[1]) + parseInt("0x" + ringReservseTimeArr[0]) + 0x00 + parseInt(ringStatus) + 0x26;
            var checksum = "0x" + dd.toString(16).substr(dd.toString(16).length - 2, 2);
            var datetimebuf = Buffer.from([0x2A, 0x51, 0x1C, 0x00, 0x57, 0x48, "0x" + ringPassword.substr(6, 2), "0x" + ringPassword.substr(4, 2), "0x" + ringPassword.substr(2, 2), "0x" + ringPassword.substr(0, 2), 0x00, 0x00, 0x01, 0x01, "0x" + ringDateNowArr[2], "0x" + ringDateNowArr[1], "0x" + (ringDateNowArr[0] - 2000), 0x00, "0x" + ringTimeNowArr[2], "0x" + ringTimeNowArr[1], "0x" + ringTimeNowArr[0], 0x00, "0x" + ringReservseDateArr[2], "0x" + ringReservseDateArr[1], "0x" + (ringReservseDateArr[0] - 2000), 0x00, "0x" + ringReservseTimeArr[2], "0x" + ringReservseTimeArr[1], "0x" + ringReservseTimeArr[0], 0x00, ringStatus, checksum, 0x26]);
            var apiOutput = {};
            myPort.write(datetimebuf, function (err, result) {
                if (err) {
                    apiOutput.status = "error";
                    apiOutput.message = "datetimebuf" + err;
                    res.json(apiOutput);
                }
                
                apiOutput.status = "success";
                apiOutput.message = "datetimebuf is success";
                res.json(apiOutput);
            });
        }
    /*    if (ringChangePassWord != "") {
            if (ringChangePassWord.length < 9 && ringChangePassWord.length != 8) {
                var zero = "";
                for (var s = 0; s < 8 - ringChangePassWord.length; s++) {
                    zero = zero + "0";
                }
                ringChangePassWord = zero + ringChangePassWord;

            }
            var pp = 0x2A + 0x51 + 0x0B + 0x00 + 0x49 + 0x4C + parseInt("0x" + ringPassword.substr(6, 2)) + parseInt("0x" + ringPassword.substr(4, 2)) + parseInt("0x" + ringPassword.substr(2, 2)) + parseInt("0x" + ringPassword.substr(0, 2)) + parseInt("0x" + ringChangePassWord.substr(6, 2)) + parseInt("0x" + ringChangePassWord.substr(4, 2)) + parseInt("0x" + ringChangePassWord.substr(2, 2)) + parseInt("0x" + ringChangePassWord.substr(0, 2)) + 0x26;
            var Passchecksum = "0x" + pp.toString(16).substr(pp.toString(16).length - 2, 2);
            var Passbuf = Buffer.from([0x2A, 0x51, 0x0B, 0x00, 0x49, 0x4C, "0x" + ringPassword.substr(6, 2), "0x" + ringPassword.substr(4, 2), "0x" + ringPassword.substr(2, 2), "0x" + ringPassword.substr(0, 2), "0x" + ringChangePassWord.substr(6, 2), "0x" + ringChangePassWord.substr(4, 2), "0x" + ringChangePassWord.substr(2, 2), "0x" + ringChangePassWord.substr(0, 2), Passchecksum, 0x26]);
            myPort.write(Passbuf, function (err, result) {
                
                if (err) {
                    return console.log('Error on write UUIDbuf: ' , err.message);
                }
                
                console.log('message writtensssss UUIDbuf' + result);
            });
        }
        
        

        if (ringUUID != "") {
            ringUUIDisNull = 0x01;
            if (ringUUID.length < 17 && ringUUID.length != 16) {
                var zero = "";
                for (var s = 0; s < 16 - ringUUID.length; s++) {
                    zero = zero + "0";
                }
                ringUUID = zero + ringUUID;

            }

            var uu = 0x2A + 0x51 + 0x0F + 0x00 + 0x49 + 0x77 + parseInt("0x" + ringPassword.substr(6, 2)) + parseInt("0x" + ringPassword.substr(4, 2)) + parseInt("0x" + ringPassword.substr(2, 2)) + parseInt("0x" + ringPassword.substr(0, 2)) + parseInt("0x" + ringUUID.substr(0, 2)) + parseInt("0x" + ringUUID.substr(2, 2)) + parseInt("0x" + ringUUID.substr(4, 2)) + parseInt("0x" + ringUUID.substr(6, 2)) + parseInt("0x" + ringUUID.substr(8, 2)) + parseInt("0x" + ringUUID.substr(10, 2)) + parseInt("0x" + ringUUID.substr(12, 2)) + parseInt("0x" + ringUUID.substr(14, 2)) + 0x26;
            
            var UUIDchecksum = "0x" + uu.toString(16).substr(uu.toString(16).length - 2, 2);
            var UUIDbuf = Buffer.from([0x2A, 0x51, 0x0F, 0x00, 0x49, 0x77, "0x" + ringPassword.substr(6, 2), "0x" + ringPassword.substr(4, 2), "0x" + ringPassword.substr(2, 2), "0x" + ringPassword.substr(0, 2), "0x" + ringUUID.substr(0, 2), "0x" + ringUUID.substr(2, 2), "0x" + ringUUID.substr(4, 2), "0x" + ringUUID.substr(6, 2), "0x" + ringUUID.substr(8, 2), "0x" + ringUUID.substr(10, 2), "0x" + ringUUID.substr(12, 2), "0x" + ringUUID.substr(14, 2), UUIDchecksum, 0x26]);
            myPort.write(UUIDbuf, function (err, result) {
                
                if (err) {
                    return console.log('Error on write UUIDbuf: ' , err.message);
                }
                
                console.log('message writtensssss UUIDbuf' + result);
            });


        }
        else { 
            ringUUIDisNull = 0x00;
        }
           // console.log("ringUUID" + ringUUID);
           
            
            
            
            
            var dd = 0x2A + 0x51 + 0x1C + 0x00 + 0x57 + 0x48 + parseInt("0x" + ringPassword.substr(6, 2)) + parseInt("0x" + ringPassword.substr(4, 2)) + parseInt("0x" + ringPassword.substr(2, 2)) + parseInt("0x" + ringPassword.substr(0, 2)) + ringUUIDisNull + 0x00 + 0x01 + 0x01 + parseInt("0x" + ringDateNowArr[2]) + parseInt("0x" + ringDateNowArr[1]) + parseInt("0x" + (ringDateNowArr[0] - 2000)) + 0x00 + parseInt("0x" + ringTimeNowArr[2]) + parseInt("0x" + ringTimeNowArr[1]) + parseInt("0x" + ringTimeNowArr[0]) + 0x00 + parseInt("0x" + ringReservseDateArr[2]) + parseInt("0x" + ringReservseDateArr[1]) + parseInt("0x" + (ringReservseDateArr[0] - 2000)) + 0x00 + parseInt("0x" + ringReservseTimeArr[2]) + parseInt("0x" + ringReservseTimeArr[1]) + parseInt("0x" + ringReservseTimeArr[0]) + 0x00 + 0x49 + 0x26;
            var checksum = "0x" + dd.toString(16).substr(dd.toString(16).length - 2, 2);
            var datetimebuf = Buffer.from([0x2A, 0x51, 0x1C, 0x00, 0x57, 0x48, "0x" + ringPassword.substr(6, 2), "0x" + ringPassword.substr(4, 2), "0x" + ringPassword.substr(2, 2), "0x" + ringPassword.substr(0, 2), ringUUIDisNull, 0x00, 0x01, 0x01, "0x" + ringDateNowArr[2], "0x" + ringDateNowArr[1], "0x" + (ringDateNowArr[0] - 2000), 0x00, "0x" + ringTimeNowArr[2], "0x" + ringTimeNowArr[1], "0x" + ringTimeNowArr[0], 0x00, "0x" + ringReservseDateArr[2], "0x" + ringReservseDateArr[1], "0x" + (ringReservseDateArr[0] - 2000), 0x00, "0x" + ringReservseTimeArr[2], "0x" + ringReservseTimeArr[1], "0x" + ringReservseTimeArr[0], 0x00, 0x49, checksum, 0x26]);

            
        console.log('datetimebuf.length' + datetimebuf.length);
            myPort.write(datetimebuf, function (err, result) {
                
                if (err) {
                    return console.log('Error on write datetimebuf: ' , err.message);
                }
            var buf = Buffer.from([0x2A, 0x51, 0x03, 0x00, 0x4F, 0x50, 0x43, 0x26]);
            myPort.write(buf, function (err, result) {
                
                if (err) {
                    return console.log('Error on write buf: ' , err.message);
                }
                
                console.log('message writtensssss buf' + result);
            });
                console.log('message writtensssss datetimebuf' + result);
            });
        
        
        */

        

          
      
        


    }

});




app.all("/2.4/v1/readTrackData", function (req, res) {
    
    
    var customErr = new Error();
    var errorMessages = new Array();
    customErr.status = 400;
    var ringPassword = req.body.ringPassword;
    if (myPort == "")
        customErr.message = "裝置未連線";
    
    
    if (customErr.message !== "") {
        next(customErr);
    }
    else {
        if (ringPassword.length < 9 && ringPassword.length != 8) {
            var zero = "";
            for (var s = 0; s < 8 - ringPassword.length; s++) {
                zero = zero + "0";
            }
            ringPassword = zero + ringPassword;

        }
        console.log("ringPasswordringPassword"+ ringPassword);

        var ol = 0x2A + 0x51 + 0x08 + 0x49 + 0x55 + parseInt("0x" + ringPassword.substr(6, 2)) + parseInt("0x" + ringPassword.substr(4, 2)) + parseInt("0x" + ringPassword.substr(2, 2)) + parseInt("0x" + ringPassword.substr(0, 2)) + 0x67 + 0x26;
        var olchecksum = "0x" + ol.toString(16).substr(ol.toString(16).length - 2, 2);
        var openlockbuf = Buffer.from([0x2A, 0x51, 0x08, 0x49, 0x55, "0x" + ringPassword.substr(6, 2), "0x" + ringPassword.substr(4, 2), "0x" + ringPassword.substr(2, 2), "0x" + ringPassword.substr(0, 2), 0x67, olchecksum , 0x26]);
        var apiOutput = {};
        
        var ag = 0x2A + 0x51 + 0x03 + 0x00 + 0x52 + 0x41 + 0x26;
        var agchecksum = "0x" + ag.toString(16).substr(ag.toString(16).length - 2, 2);
        var allGPSbuf = Buffer.from([0x2A, 0x51, 0x03, 0x00, 0x52, 0x41, agchecksum , 0x26]);
        myPort.write(openlockbuf, function (err, result) {
            if (err) {
                apiOutput.status = "error";
                apiOutput.message = "openlockbuf" + err;
                res.json(apiOutput);
            }
            
            myPort.write(allGPSbuf, function (err, result) {
                if (err) {
                    apiOutput.status = "error";
                    apiOutput.message = "allGPSbuf" + err;
                    res.json(apiOutput);
                }
                console.log("openlockbuf,allGPSbuf is success");
                apiOutput.status = "success";
                apiOutput.message = "openlockbuf,allGPSbuf is success";
                res.json(apiOutput);
            });
        });
    }
});


app.all("/2.4/v1/closePort", function (req, res) {
    myPort.close(function (err) {
        if (err) {
            var apiOutput = {};
            apiOutput.status = "fail";
            apiOutput.message = err;
            res.json(apiOutput);
        } else {
            var apiOutput = {};
            apiOutput.status = "success";
            apiOutput.message = "port close";
            res.json(apiOutput);
        }
    });
});

app.all("/2.4/v1/channel", function (request, response) {
    var port = "";
    var apiOutput = {};
    serialport.list(function (err, ports) {
        ports.forEach(function (port) {
            console.log(port.comName);
            console.log(port.pnpId);
            console.log(port.manufacturer);
            
            port = port.comName;
            console.log("port" + port);
            if (myPort == "") {
                myPort = new serialport(port, {
                    baudRate: 115200,
                    parser: new serialport.parsers.Readline('\r\n')

                }, function (err) {
                    if (err) {
                        apiOutput.status = "error";
                        apiOutput.message = "ComPort Connect" + err;
                       
                        response.json(apiOutput);
                    }
                })
            }
            else { 
                myPort.open();
            }
            //  var buf = Buffer.from([0, 4, 195, 0, 8, 207]);
            //var buf = Buffer.from([0x2A, 0x51, 0x03, 0x00, 0x49, 0xED, 0x26]);
            // var buf = Buffer.from([0x2A, 0x51, 0x03, 0x00, 0x49, 0x56, 0x43, 0x26]);
            //   var buf = Buffer.from([0x2A,0x51,0x03,0x00,0x49,0x43,0x30,0x26]);
             var buf = Buffer.from([0x2A, 0x51, 0x03, 0x00, 0x4F, 0x50, 0x43, 0x26]);
            //var data = new Buffer([0x2A, 0x51, 0x03, 0x00, 0x49, 0x56, 0x43, 0x26]);
            // var buf = Buffer.from(['2A', 51, 3, 0, 0x49, 56, 43, 26]);
            // var buf = Buffer.from([42, 81, 3, 0, 73, 86, 67, 38]);
            //var buf = Buffer.from([4281, 30,7386,67,38]);
            //console.log("buf"+ buf.length);
            var i = 0;
            var test;
          /*  myPort.write(Buffer.from([0x2A]), function (err, result) {
                myPort.write(Buffer.from([0x51]), function (err, result) {
                    myPort.write(Buffer.from([0x03]), function (err, result) {
                        myPort.write(Buffer.from([0x00]), function (err, result) {
                            myPort.write(Buffer.from([0x4F]), function (err, result) {
                                myPort.write(Buffer.from([0x50]), function (err, result) {
                                    myPort.write(Buffer.from([0x43]), function (err, result) {
                                        myPort.write(Buffer.from([0x26]), function (err, result) {

                                              //  myPort.on('data', onData);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });*/
            
                myPort.write(buf, function (err, result) {
                    
                    if (err) {
                    apiOutput.status = "error";
                    apiOutput.message = "write buf" + err;
                    response.json(apiOutput);
                    }
                    
                myPort.on('data', onData);
                apiOutput.status = "success";
                apiOutput.message = "buf write is success";
                apiOutput.port = port;
                response.json(apiOutput);
                });
            /*    myPort.write(buf, function (err, result) {
                    
                    if (err) {
                        return console.log('Error on write: ' , err.message);
                    }
                    
                   
                    
                    console.log('message writtensssss'+ result);
                });*/
				// console.log('message written'+ myPort.read());
                
           
            

                
            
            function onData(data) {
            //    console.log("ddddddddddddddd" + data.length);
              //  console.log(data);
                var ringVersion = "";
                var arr = Array.prototype.slice.call(data, 0);
                // console.log("arr" + arr.length);
                var tagid = "";
                
                
                arr.forEach(ShowResults);
                
                function ShowResults(value, index, ar) {
                    if (value == 42) {
                        
                        if (ar[index + 22] == 38 && arr.length > index + 22) {
                            var state = "";
                            for (var a = index + 6; a < index + 21; a++) {
                                var hexdata = arr[a].toString(16);
                                if (hexdata == '2f')
                                    state = state + "/";
                                else if (hexdata == '20')
                                    state = state + " ";
                                else if (hexdata == '56')
                                    state = state + "V";
                                else if (hexdata == '2e')
                                    state = state + ".";
                                else {
                                    if (hexdata != 00)
                                        state = state + (arr[a].toString(16) - 30);
                                }
                            }
                            
                            if (ringVersion != state) {
                                console.log("state" + state);
                                ringData.ringVersion = state;
                                ringVersion = state;
                            }
                        }
                        if (ar[index + 11] == 38 && arr.length > index + 11) {
                            var state = ""; 
                            for (var a = index + 6; a < index + 10; a++) {
                                var hexdata = arr[a].toString(16);
                                 state = state + hexdata;
                            }
                            if(ringData.ringVersionID!=state)
                            ringData.ringVersionID = state;
                        }
                        if (ar[index + 15] == 38 && arr.length > index + 15) {
                            var UUID = "";
                            for (var a = index + 6; a < index + 14; a++) {
                                var hexdata = arr[a].toString(16);
                                UUID = UUID + hexdata;
                            }
                            if (ringData.ringUUID != UUID)
                                ringData.ringUUID = UUID;
                        }

                        if (ar[index + 35] == 38 && arr.length > index + 35) {
                            var ringDateNow = "20";
                            var ringTimeNow = "";
                            var ringReserveDate = "20";
                            var ringReserveTime = "";
                            var ringVhex = 0;
                            var ringV = 0;
                            
                            for (var a = index +6; a < index + 8; a++) {
                                var GPSCount = parseInt(ar[index + 6].toString(16).substr(0, 1)) * 16 ^ 4 + parseInt(ar[index + 6].toString(16).substr(1, 1)) * 16 ^ 3 + parseInt(ar[index + 7].toString(16).substr(1, 1)) * 16 ^ 2 + parseInt(ar[index + 7].toString(16).substr(1, 1)) * 16;
                                ringData.GPSCount = GPSCount;
                            }

                            for (var a = index + 22; a > index + 15; a--) {
                                var hexdata = arr[a].toString(16);
                                if (hexdata == 0)
                                    hexdata = "00";
                                if (a < index + 23 && a > index + 19) {

                                    if (ringTimeNow != "")
                                        ringTimeNow = ringTimeNow + ":";
                                    ringTimeNow = ringTimeNow + hexdata;

                                }
                                
                                if (a < index + 19 && a > index + 15) {
       

                                    if (ringDateNow != "20")
                                        ringDateNow = ringDateNow + "/";
                                    ringDateNow = ringDateNow + hexdata;
                                }
                            }
                            for (var a = index + 30; a > index + 23; a--) {
                            
                                var hexdata = arr[a].toString(16);
                                if (hexdata == 0)
                                    hexdata = "00";
                                if (a < index + 31 && a > index + 27) {
                                  
                                    if (ringReserveTime != "")
                                        ringReserveTime = ringReserveTime + ":";
                                    ringReserveTime = ringReserveTime + hexdata;

                                }
                                
                                if (a < index + 27 && a > index + 23) {
                                 
                                    
                                    if (ringReserveDate != "20")
                                        ringReserveDate = ringReserveDate + "/";
                                    ringReserveDate = ringReserveDate + hexdata;
                                }
                            }
                            
                            for (var a = index + 33; a > index + 31; a--) {
                                var hexdata = arr[a].toString(16);
                                if (a == index + 33)
                                    ringV = ringV + arr[a] * 256;
                                else
                                    ringV = ringV + arr[a];   
                            }
                            ringData.ringV = ringV*0.00121;
                            ringData.ringTimeNow = ringDateNow+" "+ringTimeNow;
                            ringData.ringDateNow = ringReserveDate+" "+ ringReserveTime;
                        }

                    }

                }
                io.sockets.emit("channel1", ringData);
                    
                   
            }
            
           

        });
    });
        
      

});


app.all('/', function(req, res){
console.log("kk");
return res.json("req is successful");
  //res.render("index", { title: "click link to connect" });
});

/*setInterval(function(){
console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  var aa ="AAAAAAAAAA";
  console.log(aa);

  show_socket.aa = aa;

  io.sockets.emit("sockettest",show_soFVcket);

},1000*5); */
var ssss ={};
io.sockets.on('connection', function (socket) {
console.log("connect OK");
socket.on("sockettest", function (readerObj) {
 io.sockets.emit("socketshow",readerObj);
console.log(readerObj);
});
	});	



app.get('/tokencg', function(req, res){
  res.render("index", { title: "click link to connect" });
});

app.all('/mapdata*', function(req, res){
  let pathname=url.parse(req.url).pathname;
  if (pathname != '/favicon.ico') {
			let reqArry = pathname.split('/');
			handle(reqArry, res, req);
        }
});

app.get('/email', function(req, res){
  //引用 nodemailer
var nodemailer = require('nodemailer');

//宣告發信物件
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'mike255920002000@gmail.com',
        pass: 'mike1101137120'
    }
});

var options = {
    //寄件者
    from: 'mike255920002000@gmail.com',
    //收件者
    to: 'mike255920002000@gmail.com', 
    //副本
    cc: 'mike255920002000@gmail.com',
    //密件副本
    bcc: 'mike255920002000@gmail.com',
    //主旨
    subject: '這是 node.js 發送的測試信件', // Subject line
    //純文字
    text: 'Hello world2', // plaintext body
    //嵌入 html 的內文
    html: '<h2>Why and How</h2> <p>The <a href="http://en.wikipedia.org/wiki/Lorem_ipsum" title="Lorem ipsum - Wikipedia, the free encyclopedia">Lorem ipsum</a> text is typically composed of pseudo-Latin words. It is commonly used as placeholder text to examine or demonstrate the visual effects of various graphic design. Since the text itself is meaningless, the viewers are therefore able to focus on the overall layout without being attracted to the text.</p>', 
    //附件檔案
    attachments: [ {
        filename: 'text01.txt',
        content: '聯候家上去工的調她者壓工，我笑它外有現，血有到同，民由快的重觀在保導然安作但。護見中城備長結現給都看面家銷先然非會生東一無中；內他的下來最書的從人聲觀說的用去生我，生節他活古視心放十壓心急我我們朋吃，毒素一要溫市歷很爾的房用聽調就層樹院少了紀苦客查標地主務所轉，職計急印形。團著先參那害沒造下至算活現興質美是為使！色社影；得良灣......克卻人過朋天點招？不族落過空出著樣家男，去細大如心發有出離問歡馬找事'
    }, {
        filename: 'unnamed.jpg',
        path: '/Users/Weiju/Pictures/unnamed.jpg'
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
});


app.get('/auth', function(req, res) {

  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    console.log("Performing oauth for some user right now.");
  
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id
		, "client_secret":  conf.client_secret
      , "redirect_uri":  conf.redirect_uri
      , "scope":         conf.scope
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
  }
  // If this branch executes user is already being redirected back with 
  // code (whatever that is)
  else {
    console.log("Oauth successful, the code (whatever it is) is: ", req.query.code);
    // code is set
    // we'll send that and get the access token
    graph.authorize({
        "client_id":      conf.client_id
      , "redirect_uri":   conf.redirect_uri
      , "client_secret":  conf.client_secret
      , "code":           req.query.code
    }, function (err, facebookRes) {
		graph.extendAccessToken({
        "access_token":    facebookRes.access_token
      , "client_id":      conf.client_id
      , "client_secret":  conf.client_secret
    }, function (err, facebookRes) {
	   	 console.log("access token", facebookRes.access_token);
	 graph.setAccessToken(facebookRes.access_token);
	     graph.get("me?fields=birthday,age_range,email,gender,context", function(err, data) {
      console.log(data);
  });
  
  var wallPost = {
  message: "test"
};
			graph.post("/me/feed", wallPost, function(err, data) {
      console.log(data);
  });
  res.redirect('/UserHasLoggedIn');
	   
    });

	 
/*graph.batch([
  {
    method: "GET",
    relative_url: "me" // Get the current user's profile information
  },
  {
    method: "GET",
    relative_url: "me/friends?limit=3" // Get the first 50 friends of the current user
  }
], function(err, res) {
  console.log(res);
});*/
    // code is set
      //res.redirect('/UserHasLoggedIn');
    });
  }
/*FB.api('oauth/access_token', {
    client_id: '1700561416915068',
    client_secret: '489fd3f8ac29090628d73b7a85b8b915',
    redirect_uri: 'http://localhost:3000/auth',
    code: 'code'
}, function (res) {
    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }

    var accessToken = res.access_token;
    var expires = res.expires ? res.expires : 0;
});*/
  
});


// user gets sent here after being authorized
app.get('/UserHasLoggedIn', function(req, res) {
  res.render("index.html", { 
      title: "Logged In" 
  });
});


// Error Hanlding
app.use(function(err, req, res, next) {
	var apiOutput = {};
	apiOutput.status = "failure";
	apiOutput.error_message = err.message;
	
	if(typeof err.gcm_user_id !== "undefined")apiOutput.gcm_user_id = err.gcm_user_id;
	if(typeof err.status !== "undefined")res.statusCode = err.status;	

	res.send(JSON.stringify(apiOutput) || '** no relevant error handle **');  
	
	
	
	return next();
}); 

var routerRegistration = express.Router();
app.use('/map/v1', routerRegistration);

routerRegistration.route('/maptest')
	.post(maptestController.getTags);
	
routerRegistration.route('/filepost')
	.all(filepostController.postfileDatas);	
	
routerRegistration.route('/csvinsert')
	.post(csvinsertController.getTags);
	
routerRegistration.route('/flighttag')
	.get(flighttagController.getFlightTags);	

routerRegistration.route('/chartspage')
	.get(chartspageController.getChartsData);	
	
routerRegistration.route('/flightdatasearch')
	.post(flightdatasearchController.postFlightData);	

routerRegistration.route('/leveldata')
	.get(leveldataController.getLevelData);

routerRegistration.route('/flightmap')
	.post(flightmapController.postFlightMap);		
	
routerRegistration.route('/levelpage')
	.post(levelpageController.getLevelDatas);
 
routerRegistration.route('/tagDataUpdate')
	.post(tagDataUpdateController.postTagDatas);
	
routerRegistration.route('/tagdata')
	.get(tagdataController.getTagDatas);
	
routerRegistration.route('/analyzeflight')
	.get(analyzeflightController.getflightDatas);	
	
routerRegistration.route('/analyzeflightsearch')
	.post(analyzeflightsearchController.postflightDatas);
	
routerRegistration.route('/analyzesearchById')
	.post(analyzesearchByIdController.postflightDatas);		

routerRegistration.route('/analyzeflightdel')
	.post(analyzeflightdelController.postflightDatasdel);	

routerRegistration.route('/analyzeById')
	.post(analyzeByIdController.postflightDatas);

routerRegistration.route('/bestanalyzeflightsearch')
	.post(bestanalyzeflightsearchController.postflightDatas);
	
routerRegistration.route('/levelInsert')
	.post(levelInsertController.postLevelDatas);

routerRegistration.route('/levelDataUpdate')
	.post(levelDataUpdateController.postLevelDatas);	
	
	
httpServer.listen(app.get('http_port'),app.get('ip'),function(){
	console.log("listen on port "+app.get('http_port')+", server is running");


});

function ringPassChange(ringPassword,ringChangePassWord) {
    if (ringChangePassWord.length < 9 && ringChangePassWord.length != 8) {
        var zero = "";
        for (var s = 0; s < 8 - ringChangePassWord.length; s++) {
            zero = zero + "0";
        }
        ringChangePassWord = zero + ringChangePassWord;

    }
    var pp = 0x2A + 0x51 + 0x0B + 0x00 + 0x49 + 0x4C + parseInt("0x" + ringPassword.substr(6, 2)) + parseInt("0x" + ringPassword.substr(4, 2)) + parseInt("0x" + ringPassword.substr(2, 2)) + parseInt("0x" + ringPassword.substr(0, 2)) + parseInt("0x" + ringChangePassWord.substr(6, 2)) + parseInt("0x" + ringChangePassWord.substr(4, 2)) + parseInt("0x" + ringChangePassWord.substr(2, 2)) + parseInt("0x" + ringChangePassWord.substr(0, 2)) + 0x26;
    var Passchecksum = "0x" + pp.toString(16).substr(pp.toString(16).length - 2, 2);
    var Passbuf = Buffer.from([0x2A, 0x51, 0x0B, 0x00, 0x49, 0x4C, "0x" + ringPassword.substr(6, 2), "0x" + ringPassword.substr(4, 2), "0x" + ringPassword.substr(2, 2), "0x" + ringPassword.substr(0, 2), "0x" + ringChangePassWord.substr(6, 2), "0x" + ringChangePassWord.substr(4, 2), "0x" + ringChangePassWord.substr(2, 2), "0x" + ringChangePassWord.substr(0, 2), Passchecksum, 0x26]);
    return Passbuf;
}


function ringUUIDChange(ringPassword,ringUUID) {
    if (ringUUID.length < 17 && ringUUID.length != 16) {
        var zero = "";
        for (var s = 0; s < 16 - ringUUID.length; s++) {
            zero = zero + "0";
        }
        ringUUID = zero + ringUUID;

    }
    
    var uu = 0x2A + 0x51 + 0x0F + 0x00 + 0x49 + 0x77 + parseInt("0x" + ringPassword.substr(6, 2)) + parseInt("0x" + ringPassword.substr(4, 2)) + parseInt("0x" + ringPassword.substr(2, 2)) + parseInt("0x" + ringPassword.substr(0, 2)) + parseInt("0x" + ringUUID.substr(0, 2)) + parseInt("0x" + ringUUID.substr(2, 2)) + parseInt("0x" + ringUUID.substr(4, 2)) + parseInt("0x" + ringUUID.substr(6, 2)) + parseInt("0x" + ringUUID.substr(8, 2)) + parseInt("0x" + ringUUID.substr(10, 2)) + parseInt("0x" + ringUUID.substr(12, 2)) + parseInt("0x" + ringUUID.substr(14, 2)) + 0x26;
    
    var UUIDchecksum = "0x" + uu.toString(16).substr(uu.toString(16).length - 2, 2);
    var UUIDbuf = Buffer.from([0x2A, 0x51, 0x0F, 0x00, 0x49, 0x77, "0x" + ringPassword.substr(6, 2), "0x" + ringPassword.substr(4, 2), "0x" + ringPassword.substr(2, 2), "0x" + ringPassword.substr(0, 2), "0x" + ringUUID.substr(0, 2), "0x" + ringUUID.substr(2, 2), "0x" + ringUUID.substr(4, 2), "0x" + ringUUID.substr(6, 2), "0x" + ringUUID.substr(8, 2), "0x" + ringUUID.substr(10, 2), "0x" + ringUUID.substr(12, 2), "0x" + ringUUID.substr(14, 2), UUIDchecksum, 0x26]);
    return UUIDbuf;
}