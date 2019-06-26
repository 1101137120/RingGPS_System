var FlightDetailsInstance= require('../models/flight_details');
var FlightDataInstance= require('../models/flight_data');
var TagInstance= require('../models/tag');   
var Excel= require('exceljs');
 var fs = require('fs');

// Handle /2.4/v1/tags for GET
exports.getTags = function(req, res,next) {
	var customErr = new Error();
	var errorMessages = new Array();
	customErr.status = 400;
	var flightDetailsInstance = new FlightDetailsInstance();
	var flightDataInstance = new FlightDataInstance();
	var tagInstance = new TagInstance();	
	//console.log("nmea insert---");
	var csvname = req.body.csvname;
	if(!csvname){
		return res.json("資料夾為空");
	}
	var csvdataname = csvname.split(".");
	var csvdata = csvname.split("_");
	var i =1;
	var ar_speed=0;
	var ar_height=0;//
	var speedest=0;//
	var heightest=0;//
	var distance=0;//
	var start_time=0;//
	var end_time=0;//
	var total_time=0;//
	var rel_ar_speedest=0;
	
	
	var chspeed=false;
	var chspeed1=false;
	var chdate1="";
	var chdate2="";
	var flspeed=false;
	var flspeed1=false;
	var fldate1="";
	var fldate2="";
	var asdS="";
	var zxcS="";
	var asdE="";
	var zxcE="";
	var relflightlg=0; 
	var relspeedlg=0;
	var relspeedtotal=0;
	var relsleeplg=0;
	var relspeedbefore=0;
	var sleeptimetotal="00:00:00";
	var flighttimetotal="00:00:00";
	var tag_id=0;
	var k=0;
	var speedtotal=0;//
	var heighttotal=0;
	var tagmessage="";
	var flightmessage="";
	var flightdetailmessage="";
	var flightid =1;
	var lineDIStotal=0;
	var explosiveforce=0;
	var datestarttime=0;
	var allflighttimelg=0;
	var relallflighttimelg=0;
	var relallflighttime="";
	var hrelcount =0;
	var nmeadata= Array();
	var nmeadatareverse= Array();
	var relgpmcdata= Array();
	var nmeadis=0;
	var flightdetailsql="";
	var fk=false;
	//
					/*var y=worksheet2.rowCount-3;
					var d=worksheet2.rowCount-4;
					var istart=worksheet2.rowCount-2;
					DIStotal =msg.response[istart].DISTANCE;
					dateS =msg.response[istart].DATE+" "+msg.response[istart].TIME;
					dateE =msg.response[0].DATE+" "+msg.response[0].TIME;
					Timetotal = Timetol(dateS,dateE);*/

    	fs.readFile('./public/csv/'+csvname, function (err, data) {
    if (err) throw err;
 
		//console.log("data--------------"+data.toString());
		var GPRMCandA=data.toString().split("$GPRMC");
		for(var g=0;g<GPRMCandA.length;g++)
		{
			var GPRMCandAlg=GPRMCandA.length-1;
			//console.log("GPRMCandA"+GPRMCandA[g]);
			var GPRMCandAEX=GPRMCandA[g].split("$GPGGA");
			var GPRMCdata=GPRMCandAEX[0].split(",");
			
			relgpmcdata.push("");
			//console.log("GPRMCandAEX[0]"+GPRMCandAEX[0]);
			if(g<GPRMCandAlg){
				//console.log("GPRMCandAEX[1]"+GPRMCandAEX[1]);
				
				
				var GPGGAdata=GPRMCandAEX[1].split(",");
				LATITUDE:GPGGAdata[2].substring(0,2)+(GPGGAdata[2].substr(2,GPGGAdata[2].length)/60)
				if(GPRMCdata)
				nmeadata[g]={
					RCR:"T",
					//DATE:GPRMCdata[9].substring(0,2)+"/"+GPRMCdata[9].substring(2,4)+"/20"+GPRMCdata[9].substring(4,6),
					//TIME:GPRMCdata[1].substring(0,2)+":"+GPRMCdata[11].substring(2,4)+"/20"+GPRMCdata[11].substring(4,6),
					VALID:"3d",
					LATITUDE:parseInt(GPGGAdata[2].substring(0,2))+formatFloat((GPGGAdata[2].substr(2,GPGGAdata[2].length)/60),6),
					NS:GPGGAdata[3],
					LONGITUDE:parseInt(GPGGAdata[4].substring(0,3))+formatFloat((GPGGAdata[4].substr(3,GPGGAdata[4].length)/60),6),
					EW:GPGGAdata[5],
					HEIGHT:GPGGAdata[9],
					PDOP:"0",
					HDOP:GPGGAdata[8],
					VDOP:"0",
					NSATUSEDVIEW:GPGGAdata[7]
					//DISTANCE:nmeadis+getDistance(nmeadata[g].LATITUDE,nmeadata[g].LONGITUDE,nmeadata[afg].LATITUDE,nmeadata[afg].LONGITUDE)
					};
					
			}
				if(g>0){
					var relg=g-1;
						nmeadata[relg].DATE=GPRMCdata[9].substring(0,2)+"/"+GPRMCdata[9].substring(2,4)+"/20"+GPRMCdata[9].substring(4,6);
						nmeadata[relg].TIME=GPRMCdata[1].substring(0,2)+":"+GPRMCdata[1].substring(2,4)+":"+GPRMCdata[1].substring(4,6);

				};

		}
	//	console.log("GPGGAdata[1]"+GPGGAdata[1]);
		//console.log("GPRMCdata[1]"+GPRMCdata[1]);
//	}
		nmeadata.reverse();
		console.log("nmeadata"+nmeadata);
		if(nmeadata!=""){
				flightdetailsql = "INSERT INTO `google_map1`.`flight_details` (`RCR`,`DATE`,`VALID`,`LATITUDE`,`N/S`,`LONGITUDE`,`E/W`,`HEIGHT`,`PDOP`,`HDOP`,`VDOP`,`DISTANCE`,`csvid`,`flight_id`) VALUES ";
		for(var e=0;e<nmeadata.length;e++){
			var afg=e-1;
			if(e>0){
			nmeadis=nmeadis+getDistance(nmeadata[e].LATITUDE,nmeadata[e].LONGITUDE,nmeadata[afg].LATITUDE,nmeadata[afg].LONGITUDE)/1000;
			nmeadata[e].DISTANCE=nmeadis;
			//console.log("nmeadis"+nmeadis);
			}else{
				nmeadata[e].DISTANCE=0;
			}
			//console.log("RCR"+","+nmeadata[e].DISTANCE+","+nmeadata[e].DATE+","+nmeadata[e].TIME+","+nmeadata[e].RCR+","+nmeadata[e].VALID+","+nmeadata[e].LATITUDE+","+nmeadata[e].NS+","+nmeadata[e].LONGITUDE+","+nmeadata[e].EW+","+nmeadata[e].HEIGHT+","+nmeadata[e].PDOP+","+nmeadata[e].HDOP+","+nmeadata[e].VDOP+","+nmeadata[e].NSATUSEDVIEW);
		}
					/*nmeadata[g].RCR="T";
					nmeadata[g].DATE=GPRMCdata[9].substring(0,2)+"/"+GPRMCdata[9].substring(2,4)+"/20"+GPRMCdata[9].substring(4,6);
					nmeadata[g].TIME=GPRMCdata[1].substring(0,2)+":"+GPRMCdata[11].substring(2,4)+"/20"+GPRMCdata[11].substring(4,6);
					nmeadata[g].VALID="3d";
					nmeadata[g].LATITUDE=GPGGAdata[2].substring(0,2)+(GPGGAdata[2].substr(2,GPGGAdata[2].length)/60);
					nmeadata[g].NS=GPGGAdata[3];
					nmeadata[g].LONGITUDE=GPGGAdata[4].substring(0,3)+(GPGGAdata[4].substr(4,GPGGAdata[3].length)/60);
					nmeadata[g].EW=GPGGAdata[5];
					nmeadata[g].HEIGHT=GPGGAdata[8];
					nmeadata[g].PDOP="0";
					nmeadata[g].HDOP=GPGGAdata[9];
					nmeadata[g].VDOP="0";
					nmeadata[g].NSATUSEDVIEW=GPGGAdata[7];
					nmeadata[g].DISTANCE=nmeadis+getDistance(nmeadata[g].LATITUDE,nmeadata[g].LONGITUDE,nmeadata[afg].LATITUDE,nmeadata[afg].LONGITUDE);*/   
					
		//console.log("到這");
	var status= "success";
	var nmeadatalast=nmeadata.length-1;
	//console.log("nmeadatalast----------------------------------"+nmeadatalast);
	//console.log("status----------------------------------"+status);
	datestarttime=new Date(dateformat(nmeadata[nmeadatalast].DATE,nmeadata[nmeadatalast].TIME)).getTime();
	datestarttime=parseInt(datestarttime)+1800000;
	//console.log("OK");
	var sql="SELECT max(id) as maxid FROM flight_data"
	
	tagInstance.query(sql,function(err, rows, fields) {

			if(err) 
			{
				console.log(JSON.stringify(err));

				customErr.status = 503;
				customErr.message = "db query error";		
				next(customErr);			
			}else
			{
			// console.log("rows[0]------------------"+rows[0].maxid);
				if(rows[0].maxid){
				flightid=parseInt(rows[0].maxid)+1;
				}else{
				flightid=1;
				}
		for(var t=0;t<nmeadata.length;t++){
	
	//var worksheet2 = workbook.getWorksheet(1);
	//var lastrow = worksheet2.lastRow;
	
	//worksheet2.eachRow(function(row, rowNumber) {
	
		
		var datenow = dateformat(nmeadata[t].DATE,nmeadata[t].TIME);
		var disnow = nmeadata[t].DISTANCE;
		
		//worksheet2.getRow(rowNumber);
		//console.log("rowNumber"+rowNumber);
		var S=t+1;
		var D=t-1;
		if(nmeadatalast>S)
		{
			
			//var Srow=worksheet2.getRow(S);
			//var Drow=worksheet2.getRow(D);
			var Edate = dateformat(nmeadata[S].DATE,nmeadata[S].TIME);
			var Edis = nmeadata[S].DISTANCE;
			var allspeednow=speedcount(datenow,Edate,Edis,disnow);
			if(t==nmeadatalast){
					nmeadata[t].speed=0;
			}else{
					nmeadata[t].speed=allspeednow;
			}
			if(D>0){
				var Sdis = nmeadata[D].DISTANCE;
			var disa=getDistance(nmeadata[D].LATITUDE,nmeadata[D].LONGITUDE,nmeadata[S].LATITUDE,nmeadata[S].LONGITUDE);
			var disd =getDistance(nmeadata[t].LATITUDE,nmeadata[t].LONGITUDE,nmeadata[D].LATITUDE,nmeadata[D].LONGITUDE);
			}
			
			var diss =getDistance(nmeadata[t].LATITUDE,nmeadata[t].LONGITUDE,nmeadata[S].LATITUDE,nmeadata[S].LONGITUDE);
			
			var disc =diss-disd;
		}
			
		//console.log("row"+row);
		//if(rowNumber!=0){
		
		//
		if(diss>disd){
			if(disa/diss<0.5){
				fk=false;
					
				}
			}else{
				if(disa/disd<0.5){
						fk=false;
									
					}
				}
		
	/*	if(disa<300&&Math.abs(disc)<300&&diss>disa&&disd>disa){
									
									 fk=true;
									
							 }*/
		
		if(nmeadatalast>S&&fk==false)
		{
		lineDIStotal=lineDIStotal+getDistance(nmeadata[t].LATITUDE,nmeadata[t].LONGITUDE,nmeadata[S].LATITUDE,nmeadata[S].LONGITUDE);
		var speednow=speedcount(datenow,Edate,Edis,disnow);
			
			if(t<nmeadatalast){
			
			heighttotal=heighttotal+parseInt(nmeadata[t].HEIGHT);
			speedtotal=speedtotal+speednow;
			hrelcount=hrelcount+1;
			
			}
			
		
		
		//console.log("speednow"+speednow);
		//console.log("datenow"+datenow);
		//console.log("lineDIStotal"+lineDIStotal);
		}
		
		if(speedest<speednow){
						speedest = speednow;
		}
		/*if(worksheet2.rowCount>S){
			speedtotal=speedtotal+speednow;
		}*/
		if(heightest<parseInt(nmeadata[t].HEIGHT)){

				heightest = nmeadata[t].HEIGHT;
			}
		/*if(rowNumber!=worksheet2.rowCount){
			
		}	*/
			
		
		
		
		if(t==nmeadatalast){
			
			start_time = datenow;
			asdS = nmeadata[t].LATITUDE;
			zxcS = nmeadata[t].LONGITUDE;
		}
		
		
		
		if(t==0){
			
			end_time = datenow;
			asdE = nmeadata[t].LATITUDE;
			zxcE = nmeadata[t].LONGITUDE;
		}
		var datetimenow=new Date(datenow).getTime();
		//console.log("datetimenow"+datetimenow);
		if(datestarttime>datetimenow&&nmeadatalast>S){
		//console.log("datetimenow"+datetimenow);
		//console.log("ININ");
		explosiveforce=explosiveforce+getDistance(nmeadata[t].LATITUDE,nmeadata[t].LONGITUDE,nmeadata[S].LATITUDE,nmeadata[S].LONGITUDE)/1000;
		}
		var speed_dis=Edis-disnow;
		var speed_dis1=disnow-Sdis;
		/*if(speed_dis>0.1&&speed_dis1>0.1){
			var relspeednow=speedcount(datenow,Edate,Edis,disnow);
			console.log("relspeednow"+relspeednow);
		}*/
		
		if(chdate1&&chdate2&&chspeed1==true&&chspeed==true){
				//console.log("sleeptime");
				//console.log("chdate1"+chdate1);
				//console.log("chdate2"+chdate2);
				var sleeptime=Timetol(chdate2,chdate1);
				relsleeplg=relsleeplg+1;
				//console.log("chdate1"+chdate1);
				//console.log("chdate2"+chdate2);
				sleeptimetotal=sleeptimecount(sleeptimetotal,sleeptime);
				//console.log("sleeptimetotal"+sleeptimetotal);
				chspeed1=false;
				chspeed=false;
				chdate1="";
				chdate2="";
		}
		
		if(speednow<7&&chspeed==false){//relspeednow
			chspeed=true;
			chdate1=datenow;
			
			//console.log("chspeedQQQQQQq");
		}
		
		if(speednow<7){//relspeednow
			if(flspeed==true)
			{
				//console.log("checkspeed1");
				flspeed1=true;
				fldate2=datenow;
			}
		}
		
		if(fldate1&&fldate2&&flspeed1==true&&flspeed==true){
				//console.log("sleeptime");
				//console.log("chdate1"+chdate1);
				//console.log("chdate2"+chdate2);
				var sleeptime=Timetol(fldate2,fldate1);
				relflightlg=relflightlg+1; 
				
				flighttimetotal=sleeptimecount(flighttimetotal,sleeptime);
				//console.log("fldate1"+fldate1);
				//console.log("fldate2"+fldate2);
				//console.log("flighttimetotal"+flighttimetotal);
				//console.log("sleeptime"+sleeptime);
				flspeed1=false;
				flspeed=false;
				fldate1="";
				fldate2="";
		}
	
		if(speednow>7)//判斷速度多少算一棟 relspeednow
		{
			allflighttimelg=allflighttimelg+1;
			if(flspeed==false)
			{
				
				flspeed=true;
				fldate1=datenow;
				//console.log("fldate1"+fldate1);
			}
			if(flspeed==true){
					relallflighttimelg=relallflighttimelg+1;
					relallflighttime=datenow;
			}


			var relspeednow=speedcount(datenow,Edate,Edis,disnow);
			var rel_ar_speed_dis=Edis-disnow;// 爆發承認距離
			//console.log("relspeedbefore"+relspeedbefore);
			if(relspeednow>relspeedbefore&&rel_ar_speed_dis>0.1)
			{	
				
				rel_ar_speedest=relspeednow;
				
			}
			//console.log("t"+t);
			//console.log("nmeadatalast"+nmeadatalast);
			if(t<nmeadatalast-1){
				relspeedlg=relspeedlg+1;
				relspeedtotal=relspeedtotal+relspeednow;
				//console.log("relspeednow"+relspeednow);
			//	console.log("relspeedtotal"+relspeedtotal);
			}
			
			//console.log("relspeedtotal"+relspeedtotal);
			relspeedbefore=relspeednow;
			if(chspeed==true)
			{
				chspeed1=true;
				chdate2=datenow;
			}
		}
		if(t!=0){
			flightdetailsql=flightdetailsql+",";
		}
		flightdetailsql=flightdetailsql+"('"+nmeadata[t].RCR+"','"+datenow+"','"+nmeadata[t].VALID+"','"+nmeadata[t].LATITUDE+"','"+nmeadata[t].NS+"','"+nmeadata[t].LONGITUDE+"','"+nmeadata[t].EW+"','"+nmeadata[t].HEIGHT+"','"+nmeadata[t].PDOP+"','"+nmeadata[t].HDOP+"','"+nmeadata[t].VDOP+"','"+nmeadata[t].DISTANCE+"','"+csvname+"','"+flightid+"')";
		
		
		//console.log("flightid--------------------------------"+flightid);
		
		//flightDetailsInstance.set('RCR', nmeadata[t].RCR);//flightDetailsInstance.set('HEADING',row.getCell('L').value);
		//flightDetailsInstance.set('DATE', datenow);//flightDetailsInstance.set('DSTA',row.getCell('M').value);
		/*flightDetailsInstance.set('TIME', time);*///flightDetailsInstance.set('DAGE',row.getCell('N').value);
		//flightDetailsInstance.set('VALID', nmeadata[t].VALID);flightDetailsInstance.set('PDOP', nmeadata[t].PDOP);
		//flightDetailsInstance.set('LATITUDE', nmeadata[t].LATITUDE);flightDetailsInstance.set('HDOP', nmeadata[t].HDOP);
		//flightDetailsInstance.set('N/S', nmeadata[t].NS);flightDetailsInstance.set('VDOP',nmeadata[t].VDOP);
		//flightDetailsInstance.set('LONGITUDE', nmeadata[t].LONGITUDE);//magInstance.set('NSAT(USED/VIEW)', row.getCell('R').value);
		//flightDetailsInstance.set('E/W', nmeadata[t].EW);//magInstance.set('SAT INFO(SID-ELE-AZI-SNR)',0);
		//flightDetailsInstance.set('HEIGHT', nmeadata[t].HEIGHT);flightDetailsInstance.set('DISTANCE', nmeadata[t].DISTANCE);
		/*flightDetailsInstance.set('SPEED', row.getCell('K').value);*/flightDetailsInstance.set('csvid', csvname);
		//flightDetailsInstance.set('flight_id', flightid);
		/*flightDetailsInstance.save(function(err){
						if(err) 
						{
							//console.log(JSON.stringify(err));
							
							if(err.errno === 1062)
							{
								customErr.status = 409;
								customErr.message = "mag already exists";
								console.log("time_line record already exists");
								status= "fail";
							}
							else
							{
								customErr.status = 503;
								customErr.message = "db query error";	
								console.log("db query error");
								status= "fail";
							}
							next(customErr);						
						}else{
						flightdetailmessage="flightdetail insert";
						}	
					});	*/
					
					var num0 = nmeadata[t].DISTANCE;
					i=i+1;
					fk=false;
					}

			flightDetailsInstance.query(flightdetailsql,function(err, rows, fields) {
			if(err) 
			{
				console.log(JSON.stringify(err));

				customErr.status = 503;
				customErr.message = "db query error";		
				next(customErr);	
				console.log("rel here~~~~~~~~~~");
			}
			else
			{
				var apiOutput = {};
				apiOutput.status = "success";
				apiOutput.message = "flightdetail tag found";
				apiOutput.response = rows;	
console.log("rel OK~~~~~~~~~~");				
			}
		});				


	
			if(allflighttimelg=relallflighttimelg&&flighttimetotal=="00:00:00"){
					//console.log("fldate1"+fldate1);
					//console.log("relallflighttime"+relallflighttime);
					var sleeptime=Timetol(relallflighttime,fldate1);
					//console.log("sleeptime"+sleeptime);
					flighttimetotal=sleeptimecount(flighttimetotal,sleeptime);
				}
			ar_height = heighttotal/hrelcount;
			ar_speed = speedtotal/hrelcount;
			//rel_ar_speedest 實際飛行最快速度
			//sleeptimetotal 休息時數/relsleeplg
			rel_ar_sleeptime=relsleeptimecount(sleeptimetotal,relsleeplg);
			//console.log("rel_ar_sleeptime"+rel_ar_sleeptime);
			rel_ar_speed = relspeedtotal/relspeedlg;//真實飛行速度
			//console.log("rel_ar_speed"+rel_ar_speed);
			total_time=Timetol(start_time,end_time);
			distance = nmeadata[nmeadatalast].DISTANCE;
			var lineDIS=getDistance(asdS,zxcS,asdE,zxcE)/1000;
			if(lineDIS<1){
			lineDIS=lineDIStotal/1000;//續航距離
			}
			var rel_ar_flighttime=relsleeptimecount(flighttimetotal,relflightlg);
			flightDataInstance.set('ar_height', formatFloat(ar_height,6));
			flightDataInstance.set('ar_speed',formatFloat(ar_speed,6) );
			flightDataInstance.set('rel_ar_speed', formatFloat(rel_ar_speed,6));
			flightDataInstance.set('rel_ar_sleeptime',rel_ar_sleeptime);
			flightDataInstance.set('rel_ar_flighttime',rel_ar_flighttime);
			flightDataInstance.set('rel_ar_speedest', formatFloat(rel_ar_speedest,6));
			flightDataInstance.set('explosiveforce', formatFloat(explosiveforce,6));
			flightDataInstance.set('sleeptimetotal', sleeptimetotal);
			flightDataInstance.set('flighttimetotal', flighttimetotal);
			flightDataInstance.set('lineDIS', formatFloat(lineDIS,6));
			flightDataInstance.set('heightest', formatFloat(heightest,6));
			flightDataInstance.set('speedest', formatFloat(speedest,6));
			flightDataInstance.set('distance', formatFloat(distance,6));
			flightDataInstance.set('start_time', start_time);
			flightDataInstance.set('end_time', end_time);
			flightDataInstance.set('total_time', total_time);
			flightDataInstance.set('tag_id', csvdata[0]);
			flightDataInstance.save(function(err){
						if(err) 
						{
							console.log(JSON.stringify(err));
							console.log("flightid"+flightid);
							var sql="delete from flight_details where flight_id='"+flightid+"'"
								flightDetailsInstance.query(sql,function(err, rows, fields) {
						if(err) 
						{
							console.log("delete error");
							console.log(JSON.stringify(err));

							customErr.status = 503;
							customErr.message = "db query error";		
							next(customErr);			
						}
						else
						{						
								console.log("delete 2real");
						}
					});
							if(err.errno === 1062)
							{
								customErr.status = 409;
								customErr.message = "mag already exists";
								console.log("time_line record already exists");
								status= "fail";
							}
							else
							{
								customErr.status = 503;
								customErr.message = "db query error";	
								console.log("db query error");
								status= "fail";
							}
							next(customErr);			
						}else{
						flightmessage="flight insert";
						}	
					});
						fs.writeFile('./public/kml/'+csvdataname[0]+'.KML', KMLEXPORT(nmeadata), (err) => {
						if (err) throw err;
							console.log('It\'s saved!');
						});
						fs.rename('./public/csv/'+csvname, './public/nmea/'+csvname, function (err) {
						if (err) throw err;
							fs.stat('./public/nmea/'+csvname, function (err, stats) {
						if (err) throw err;
							});
						});
						var apiOutput = {};
							apiOutput.status = status;
							apiOutput.message = "Insert csv end";
							apiOutput.tagmessage = tagmessage;
							apiOutput.flightmessage = flightmessage;
							apiOutput.flightdetailmessage = flightdetailmessage;
							res.json(apiOutput);		
							console.log(JSON.stringify(apiOutput));
		
			}
	});				
					
					
	var sql="select id from tag where tag_uid='"+csvdata[0]+"'"
	tagInstance.query(sql,function(err, rows, fields) {
			if(err) 
			{
				console.log(JSON.stringify(err));

				customErr.status = 503;
				customErr.message = "db query error";		
				next(customErr);			
			}
			else
			{//console.log("rows"+rows);
				if(rows!=""){			
				tagmessage = "tag found";		
				}else{
				tagInstance.set('tag_uid',csvdata[0]);
					tagInstance.save(function(err){
						if(err) 
							{
								console.log(JSON.stringify(err));

								customErr.status = 503;
								customErr.message = "db query error";		
								next(customErr);			
							}else{
								
								tagmessage = "tag insert";		
							}
					});
				}
			}
		});	
		}else{
				fs.rename('./public/csv/'+csvname, './public/err/'+csvname, function (err) {
						if (err) throw err;
							fs.stat('./public/err/'+csvname, function (err, stats) {
						if (err) throw err;
							return res.json("此資料檔有誤，移至err目錄");
							});
						});
		
		}


		

});				
					
					
					
		
	
	
	/*var workbook = new Excel.Workbook();
	
	workbook.csv.readFile('./public/csv/'+csvname+'.csv')
	.then(function(worksheet2) {*/



   // });
	
	
};

function getDistance(lat1, lng1, lat2, lng2) { 
	
    var dis = 0;
    var radLat1 = toRadians(lat1);
	//console.log("radLat1"+radLat1);
    var radLat2 = toRadians(lat2);
	//console.log("radLat2"+radLat2);
    var deltaLat = radLat1 - radLat2;
	
    var deltaLng = toRadians(lng1) - toRadians(lng2);
	//console.log("deltaLng"+deltaLng);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    //console.log("dis"+dis);
	return dis * 6378137;

    function toRadians(d) {  return d * Math.PI / 180;}
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

function formatFloat(num, pos)
{
  var size = Math.pow(10, pos);
  return Math.round(num * size) / size;
}

function speedcount(Edate,Sdate,Edis,Sdis){
					var dis = Edis-Sdis;
					var datetimeE=new Date(Edate);
					var datetimeS=new Date(Sdate);
					var Date_C = datetimeE.getTime()-datetimeS.getTime();
					var leave1=Date_C%(24*3600*1000);
					var hours=Math.floor(leave1/(3600*1000));  
					var leave2=leave1%(3600*1000);        
					var minutes=Math.floor(leave2/(60*1000)) ; 
					var leave3=leave2%(60*1000);
					var seconds=Math.round(leave3/1000); 
					var datemath = parseInt(hours)+parseInt(minutes)/60+parseInt(seconds)/3600;
					//console.log("datemath"+datemath);
					var Speed = accDiv(dis,datemath);
					//console.log("Speed"+Speed);
					return Speed;
	  }


function accDiv(arg1,arg2){
			var t1=0,t2=0,r1,r2;
			try{t1=arg1.toString().split(".")[1].length}catch(e){}
			try{t2=arg2.toString().split(".")[1].length}catch(e){}
			with(Math){
			r1=Number(arg1.toString().replace(".",""))
			r2=Number(arg2.toString().replace(".",""))
		return (r1/r2)*pow(10,t2-t1);
					}
			}	  
	  
function dateformat(Sdate,Stime){
var datech=Sdate.split("/");
		var truedate=new Date(datech[2]+"/"+datech[1]+"/"+datech[0]+" "+Stime+" UTC");
		var month = parseInt(truedate.getMonth())+1;
		var date = truedate.getFullYear()+"-"+month+"-"+truedate.getDate();
		
		var time = truedate.getHours()+":"+truedate.getMinutes()+":"+truedate.getSeconds();
		return date+" "+time
}

function Timetol(Stime,Etime){
					var datetimeE=new Date(Etime);
					var datetimeS=new Date(Stime);
					var Date_C = datetimeE.getTime()-datetimeS.getTime();
					//console.log("Date_C"+Date_C);
					var leave1=Date_C%(24*3600*1000);
					var aa =Math.floor(Date_C/(24*3600*1000));
					var hours=Math.floor(leave1/(3600*1000))+aa*24;  
					var leave2=leave1%(3600*1000);        
					var minutes=Math.floor(leave2/(60*1000)) ; 
					var leave3=leave2%(60*1000);
					var seconds=Math.round(leave3/1000); 
					
					return hours+":"+minutes+":"+seconds;
	  }	  
	  
function sleeptimecount(Stime,Etime){
					//console.log("dis"+dis);
					var datetimeE=Etime.split(':');
					var datetimeS=Stime.split(':');
					var seconds=parseInt(datetimeE[2])+parseInt(datetimeS[2]);
					//console.log("seconds"+seconds);
					var minutes=parseInt(datetimeE[1])+parseInt(datetimeS[1]);
					//console.log("minutes"+minutes);
					var hours =parseInt(datetimeE[0])+parseInt(datetimeS[0]);
					//console.log("hours"+hours);
					var relseconds=seconds%60;
					var relmin=Math.floor(seconds/60)+minutes;
					var relminutes=relmin%60;
					var relhours=hours+Math.floor(relmin/60);

					
					return relhours+":"+relminutes+":"+relseconds;
	  }	


function relsleeptimecount(Stime,lg){
					if(lg==0){
					lg=1;
					}
					//console.log("dis"+dis);
					var time=Stime.split(':');
					var times = parseInt(time[0])*3600+parseInt(time[1])*60+parseInt(time[2]);
					//console.log("times"+times);
					//console.log("lg"+lg);
					var result = times/lg;
					//console.log("result"+result);
					/*var hours =parseInt(datetimeE[0])%lg;
					var minutes=Math.floor(parseInt(datetimeE[0])/lg)*60+parseInt(datetimeE[1]);
					var relmin=parseInt(minutes)%lg;
					var relseconds=Math.floor(relmin/lg)*60
					var datetimeS=Stime.split(':');*/
					var leave1=result%(24*3600);
					var hours=Math.floor(leave1/(3600));  
					var leave2=leave1%(3600);        
					var minutes=Math.floor(leave2/(60)) ; 
					var leave3=leave2%(60);
					var seconds=Math.round(leave3/1); 
					//console.log("seconds"+seconds);
					
					//console.log("minutes"+minutes);
					
					//console.log("hours"+hours);
					return hours+":"+minutes+":"+seconds;
	  }	 	   	  
	  
function KMLEXPORT(nmeadata){
var wptcount1=0;
var wptcount2=0;
var wptcount3=1;
var pointcount=0;
var row2="";
var row4="";
var row6="";
var speedmax=0;
var speedmin=0;
var heightmin=0;
var heightmax=0;
var distancetotal=0;

 var myDate  = new Date();
 var Day=myDate.getDay();
 switch (Day)
{
case 0:
  Day="週日";
  break;
case 1:
  Day="週一";
  break;
case 2:
  Day="週二";
  break;
case 3:
  Day="週三";
  break;
case 4:
  Day="週四";
  break;
case 5:
  Day="週五";
  break;
case 6:
  Day="週六";
  break;
}
 var Month=myDate.getMonth()+1;
  switch (Month)
{
case 1:
  Month="一月";
  break;
case 2:
  Month="二月";
  break;
case 3:
  Month="三月";
  break;
case 4:
  Month="四月";
  break;
case 5:
  Month="五月";
  break;
case 6:
  Month="六月";
  break;
case 7:
  Month="七月";
  break;
case 8:
  Month="八月";
  break;
case 9:
  Month="九月";
  break;
case 10:
  Month="十月";
  break;
case 11:
  Month="十一月";
  break;
case 12:
  Month="十二月";
  break; 
}
 var nmeadatalast=nmeadata.length-1;
 var back=nmeadatalast;
	var starttime=new Date(dateformat(nmeadata[nmeadatalast].DATE,nmeadata[nmeadatalast].TIME));
	var endtime=new Date(dateformat(nmeadata[0].DATE,nmeadata[0].TIME));
	var dismi=nmeadata[nmeadatalast].DISTANCE*0.62;
	
	var row1 ="<?xml version='1.0' encoding='UTF-8'?>\n"+
"<kml xmlns='http://www.opengis.net/kml/2.2' xmlns:gx='http://www.google.com/kml/ext/2.2'>\n"+
  "<Document>\n"+
    "<name>GPS device</name>\n"+
    "<snippet>Created "+Day+" "+Month+" "+myDate.getDate()+" "+myDate.getHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds()+" "+myDate.getFullYear()+"</snippet>\n"+
    "<LookAt>\n"+
      "<gx:TimeSpan>\n"+
        "<begin>"+starttime.toISOString()+"</begin>\n"+
        "<end>"+endtime.toISOString()+"</end>\n"+
      "</gx:TimeSpan>\n"+
      "<longitude>121.455688</longitude>\n"+
      "<latitude>25.001797</latitude>\n"+
      "<range>"+nmeadata[nmeadatalast].DISTANCE+"</range>\n"+
    "</LookAt>\n"+
    "<!-- Normal track style -->\n"+
    "<Style id='track_n'>\n"+
      "<IconStyle>\n"+
        "<scale>.5</scale>\n"+
        "<Icon>\n"+
          "<href>http://earth.google.com/images/kml-icons/track-directional/track-none.png</href>\n"+
        "</Icon>\n"+
      "</IconStyle>\n"+
      "<LabelStyle>\n"+
        "<scale>0</scale>\n"+
      "</LabelStyle>\n"+
    "</Style>\n"+
	    "<!-- Highlighted track style -->\n"+
    "<Style id='track_h'>\n"+
      "<IconStyle>\n"+
        "<scale>1.2</scale>\n"+
        "<Icon>\n"+
          "<href>http://earth.google.com/images/kml-icons/track-directional/track-none.png</href>\n"+
        "</Icon>\n"+
      "</IconStyle>\n"+
    "</Style>\n"+
	"<StyleMap id='track'>\n"+
      "<Pair>\n"+
        "<key>normal</key>\n"+
        "<styleUrl>#track_n</styleUrl>\n"+
      "</Pair>\n"+
      "<Pair>\n"+
        "<key>highlight</key>\n"+
        "<styleUrl>#track_h</styleUrl>\n"+
      "</Pair>\n"+
    "</StyleMap>\n"+
	"<!-- Normal waypoint style -->\n"+
    "<Style id='waypoint_n'>\n"+
      "<IconStyle>\n"+
        "<Icon>\n"+
          "<href>http://maps.google.com/mapfiles/kml/pal4/icon61.png</href>\n"+
        "</Icon>\n"+
      "</IconStyle>\n"+
    "</Style>\n"+
    "<!-- Highlighted waypoint style -->\n"+
    "<Style id='waypoint_h'>\n"+
      "<IconStyle>\n"+
        "<scale>1.2</scale>\n"+
        "<Icon>\n"+
          "<href>http://maps.google.com/mapfiles/kml/pal4/icon61.png</href>\n"+
        "</Icon>\n"+
      "</IconStyle>\n"+
    "</Style>\n"+
	"<StyleMap id='waypoint'>\n"+
      "<Pair>\n"+
        "<key>normal</key>\n"+
        "<styleUrl>#waypoint_n</styleUrl>\n"+
      "</Pair>\n"+
      "<Pair>\n"+
        "<key>highlight</key>\n"+
        "<styleUrl>#waypoint_h</styleUrl>\n"+
      "</Pair>\n"+
    "</StyleMap>\n"+
    "<Style id='lineStyle'>\n"+
      "<LineStyle>\n"+
        "<color>99ffac59</color>\n"+
        "<width>6</width>\n"+
      "</LineStyle>\n"+
    "</Style>\n"+
    "<Folder>\n"+
      "<name>Waypoints</name>\n";
	for(var i=0;i<nmeadata.length;i++){
	var datetimenow=new Date(dateformat(nmeadata[i].DATE,nmeadata[i].TIME)).toISOString();
	var datetimebacknow=new Date(dateformat(nmeadata[back].DATE,nmeadata[back].TIME)).toISOString();
	var heightft=nmeadata[i].HEIGHT*3.28;
	var speedmph=nmeadata[i].speed*0.62;
	if(speedmax<speedmph){
		speedmax=speedmph;
	}
	if(speedmin>speedmph){
		speedmin=speedmph;
	}
	if(heightmax<heightft){
		heightmax=heightft;
	}
	if(heightmin>heightft){
		heightmin=heightft;
	}
	if(wptcount3>9){
		wptcount2=wptcount2+1;
		wptcount3=0;
	}
	if(wptcount2>9){
		wptcount1=wptcount1+1;
		wptcount2=0;
	}
	row2=row2+"<Placemark>\n"+
        "<name>WPT"+wptcount1+""+wptcount2+""+wptcount3+"</name>\n"+          //sdds
        "<TimeStamp><when>"+datetimebacknow+"</when></TimeStamp>\n"+
        "<styleUrl>#waypoint</styleUrl>\n"+
        "<Point>\n"+
          "<coordinates>"+nmeadata[back].LONGITUDE+","+nmeadata[back].LATITUDE+","+nmeadata[back].HEIGHT+"</coordinates>\n"+
        "</Point>\n"+
      "</Placemark>\n";

	row4=row4+"<Placemark>\n"+
            "<name>20170926102027-"+pointcount+"</name>\n"+    //sdd
            "<snippet/>\n"+
	"<description><![CDATA[\n"+
		"<table>\n"+
		"<tr><td>Longitude: "+nmeadata[i].LONGITUDE+" </td></tr>\n"+
		"<tr><td>Latitude: "+nmeadata[i].LATITUDE+" </td></tr>\n"+
		"<tr><td>Altitude: "+heightft+" ft </td></tr>\n"+
		"<tr><td>Speed: "+speedmph+" mph </td></tr>\n"+
		"<tr><td>Heading: "+i+" </td></tr>\n"+
		"<tr><td>Time: "+datetimenow+" </td></tr>\n"+
		"</table>\n"+
		"]]></description>\n"+
            "<LookAt>\n"+
              "<longitude>"+nmeadata[i].LONGITUDE+"</longitude>\n"+
              "<latitude>"+nmeadata[i].LATITUDE+"</latitude>\n"+
              "<tilt>66</tilt>\n"+
            "</LookAt>\n"+
            "<TimeStamp><when>"+datetimenow+"</when></TimeStamp>\n"+
            "<styleUrl>#track</styleUrl>\n"+
            "<Point>\n"+
              "<coordinates>"+nmeadata[i].LONGITUDE+","+nmeadata[i].LATITUDE+","+nmeadata[i].HEIGHT+"</coordinates>\n"+
            "</Point>\n"+
          "</Placemark>\n"; 
		 row6=row6+nmeadata[i].LONGITUDE+","+nmeadata[i].LATITUDE+","+nmeadata[i].HEIGHT+
		 "\n";
	  wptcount3=wptcount3+1;
	  pointcount=pointcount+1;
	  back=back-1;
	  }
	  
	  
	  var row3=    "</Folder>\n"+
    "<Folder>\n"+
      "<name>Tracks</name>\n"+
      "<Folder>\n"+
        "<name>"+starttime.getFullYear()+addZero(starttime.getMonth()+1)+addZero(starttime.getDate())+addZero(starttime.getHours())+addZero(starttime.getMinutes())+addZero(starttime.getSeconds())+"</name>\n"+
        "<snippet/>\n"+
        "<description>\n"+
"<![CDATA[<table>\n"+
"<tr><td><b>Distance</b> "+dismi+" mi </td></tr>\n"+
"<tr><td><b>Min Alt</b> "+heightmin+" ft </td></tr>\n"+
"<tr><td><b>Max Alt</b> "+heightmax+" ft </td></tr>\n"+
"<tr><td><b>Max Speed</b> "+speedmax+" mph </td></tr>\n"+
"<tr><td><b>Avg Speed</b> "+speedmin+" mph </td></tr>\n"+
"<tr><td><b>Start Time</b>"+starttime+"</td></tr>\n"+
"<tr><td><b>End Time</b>"+endtime+"</td></tr>\n"+
"</table>]]>\n"+
"</description>\n"+
        "<TimeSpan>\n"+
          "<begin>"+starttime+"</begin>\n"+
          "<end>"+endtime+"</end>\n"+
        "</TimeSpan>\n"+
        "<Folder>\n"+
          "<name>Points</name>\n";
			var row5="</Folder>\n"+
        "<Placemark>\n"+
          "<name>Path</name>\n"+
          "<styleUrl>#lineStyle</styleUrl>\n"+
          "<LineString>\n"+
            "<tessellate>1</tessellate>\n"+
            "<coordinates>\n";
	 var row7="</coordinates>\n"+
	 "</LineString>\n"+
						"</Placemark>\n"+
					"</Folder>\n"+
				"</Folder>\n"+
			"</Document>\n"+
		"</kml>\n";
		
		return row1+row2+row3+row4+row5+row6+row7;
	
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