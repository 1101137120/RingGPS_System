var serialport = require('serialport');

// Handle /2.4/v1/tags for GET
exports.getTags = function (req, res, next) {
    var customErr = new Error();
    var errorMessages = new Array();
    customErr.status = 400;
   // var tagInstance = new TagInstance();
    //var tag_uid = req.body.tag_uid;
    console.log("getTags---");
    if (customErr.message !== "") {
        next(customErr);
    }
    else {
        var port = "";
        serialport.list(function (err, ports) {
            ports.forEach(function (port) {
                console.log(port.comName);
                console.log(port.pnpId);
                console.log(port.manufacturer);
               
                port = port.comName;
                console.log("port" + port);
                var myPort = new serialport(port, {
                    baudRate: 115200,
                    InSize:4096,
                    parser: new serialport.parsers.Readline('\r\n')

                },false, function (err) {
                    if (err) {
                        return console.log('Error: ', err.message);
                    }
                })
                
               //  var buf = Buffer.from([0, 4, 195, 0, 8, 207]);
                //var buf = Buffer.from([0x2A, 0x51, 0x03, 0x00, 0x49, 0xED, 0x26]);
               // var buf = Buffer.from([0x2A, 0x51, 0x03, 0x00, 0x49, 0x56, 0x43, 0x26]);
				   //   var buf = Buffer.from([0x2A,0x51,0x03,0x00,0x49,0x43,0x30,0x26]);
               // var buf = Buffer.from([0x2A, 0x51, 0x03, 0x00, 0x4F, 0x50, 0x43, 0x26]);
                //var data = new Buffer([0x2A, 0x51, 0x03, 0x00, 0x49, 0x56, 0x43, 0x26]);
               // var buf = Buffer.from(['2A', 51, 3, 0, 0x49, 56, 43, 26]);
                 // var buf = Buffer.from([42, 81, 3, 0, 73, 86, 67, 38]);
                //var buf = Buffer.from([4281, 30,7386,67,38]);
                //console.log("buf"+ buf.length);
                var i = 0;
                var test;
                myPort.write(Buffer.from([0x2A]), function (err, result) {
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
                });

            /*    myPort.write(buf, function (err, result) {
                    
                    if (err) {
                        return console.log('Error on write: ' , err.message);
                    }
                    
                    
                    
                    console.log('message writtensssss' + result);
                });*/
            /*    myPort.write(buf, function (err, result) {
                    
                    if (err) {
                        return console.log('Error on write: ' , err.message);
                    }
                    
                   
                    
                    console.log('message writtensssss'+ result);
                });*/
				// console.log('message written'+ myPort.read());
                
                myPort.on('data', onData);
                
/*
             var interval = setInterval(function () {
                    if (i < buf.length) {
                        myPort.write(buf[i].toString(), function (err) {
                            
                            if (err) {
                                return console.log('Error on write: ' , err.message);
                            }
                            
                            i = i + 1;
                            console.log('message written');
                        });
                 
                       
                    } else { 
                        myPort.on('data', onData);
                    }
                }, 100);*/

                var ringVersion = "";
              
                function onData(data) {
                    console.log("ddddddddddddddd"+ data.length);
                    console.log(data);
                            
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
                                    ringVersion = state;
                                }
                            }
                            if (ar[index + 11] == 38 && arr.length > index +11) { 
                            }
                            if (ar[index + 35] == 38 && arr.length > index +35) {

                                
                                }

                        }

                    }

                    
                   
                }

                console.log("port" + port);
                var apiOutput = {};
                apiOutput.status = "success";
                apiOutput.message = "tag found";
                apiOutput.port = port;
                apiOutput.ringVersion = ringVersion;
                res.json(apiOutput);

            });
        });
        
        

   /*     var myPort = new serialport('COM43', {
            baudRate: 9600,
            parser: new serialport.parsers.Readline('\r\n')

        }, function (err) {
            if (err) {
                return console.log('Error: ', err.message);
            }
        })
        console.log("ODDDDDDDDDDDDDDDDDDDDDDDDDDDD");
        myPort.on('open', onOpen);
        
        var buf = Buffer.from([0, 4, 195, 0, 8, 207]);
        //var buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
        
        console.log("buf" + buf);
        console.log("buf" + buf.toString('utf8'));
        console.log("buf" + buf.toString('ascii'));
        console.log("buf" + buf.toString('utf16le'));
        console.log("buf" + buf.toString('hex'));
        console.log("buf" + buf.toString('base64'));
        
        myPort.write(buf, function (err) {
            if (err) {
                return console.log('Error on write: ' , err.message);
            }
            console.log('message written');
        });
        console.log(' myPort.read(15);' + myPort.read(15));
        
        function onOpen() {
            console.log("OPEN COM43");
        
       
        
        }
        //console.log("myPort.read(100).Count" + myPort.read(100).Count);
        myPort.on('data', onData);
        function onData(data) {
            
            console.log(data);
            
            var arr = Array.prototype.slice.call(data, 0);
            console.log("arr" + arr.length);
            var tagid = "";
            
            arr.forEach(ShowResults);
            
            function ShowResults(value, index, ar) {
                if (index == 0) {
                    console.log("readID" + value);
                }
                if (index == 13) {
                    console.log("RSSI" + value);
                }
                
                if (index > 4 && index < 13) {
                    if (value < 16)
                        tagid = tagid + "0" + value.toString(16);
                    else
                        tagid = tagid + value.toString(16);
                }
            }
            
        console.log("tagid" + tagid.toUpperCase());
        }*/
        
      


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
    isEmailAddress: function (str) {
        var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(str);  // returns a boolean
    },
    isNotEmpty: function (str) {
        var pattern = /\S+/;
        return pattern.test(str);  // returns a boolean
    },
    isNumber: function (str) {
        var pattern = /^\d+$/;
        return pattern.test(str);  // returns a boolean
    },
    isSame: function (str1, str2) {
        return str1 === str2;
    }
};   