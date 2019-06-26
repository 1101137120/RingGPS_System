const mysql = require('mysql');
const fs = require('fs');
function get(reqArry, response, request) {
    var type = reqArry[2];
    var zoom = reqArry[3];
    var x = reqArry[4];
    var y = reqArry[5];
/*	var xName=parseInt(x).toString(16);
	var yName=parseInt(y).toString(16);
	//console.log("y"+y);
//	console.log("y.toString(16)"+parseInt(y).toString(16));
	for(var i=0;i<8-y.toString(16).length;i++){
//	console.log("yName"+yName);
		yName="0"+yName;
		
	}
	for(var i=0;i<8-x.toString(16).length;i++){
		xName="0"+xName;
	}

	console.log("./Map/"+type+"/L"+zoom+"/"+"R"+yName+"/"+"C"+xName+".png");*/
	console.log("./Map/"+type+"/L"+zoom+"/"+y+"/"+x+".png");
fs.readFile("./Map/"+type+"/"+zoom+"/"+y+"/"+x+".png",'binary', function (err, data) {

		//console.log("data:"+data);
	if (err)

	//throw err;
        response.statusCode = 200;
        response.setHeader('Content-Type', 'image/png');
		if(data!=null)
        response.write(data.toString(), "binary");
        response.end();
		//console.log(data.toString());
});


}

exports.get = get;