var serverBaseUrl = document.domain + ":3000";

var protocol = location.protocol;
var hostname = location.hostname;
var today = new Date();
var todayMax = new Date();
var todayTime = new Date();
	var secondsCount=0;

function init() {

}
var autoLocalTimeInterval = null; 
$(document).ready(function () {

ShowTime();

socketCounnect();
  setTimeout(function () {
  
					 $.ajax({
						 type: "POST",
						 url: location.protocol+"//"+location.hostname+":3000/2.4/v1/logfile",
						 data:{analyzeUID:$("#ringUUID").text()}
					}).success(function(msg) {

							
					}); 
  },2000);

todayMax.setDate(today.getDate() + 3);
        $('#datepicker').datetimepicker({
			format:"YYYY/MM/DD",
			minDate:today,
			maxDate:todayMax,
			defaultDate: today
		});
		
		$('#timepicker').datetimepicker({
			format:"HH:mm:ss",
			defaultDate: today
		});
    var intervalObj = null;
    var autoConnect = false;
   
   
    $('#autoConnect').on("click", function () {

        console.log("INCONNECT");
        if (autoConnect) {
            autoConnect = false;
          //  clearInterval(intervalObj);
            $('#connectMach').text("裝置連線(等待中.....)");
            $('#autoConnect').text("自動連線");

            $.ajax({
                type: "GET",
                url: protocol + "//" + hostname + ":3000/2.4/v1/closePort"
               
            })
	.success(function (msg) {
                if(msg.status=="error")
					alert(msg.message);
					else
					{
					$('#ringlinkicon').attr('glyphicon glyphicon-remove-circle');
									$("#qqa").text("()");
                $("#ringUUID").text("000000000");
                $("#ringV").text("0V");
                $("#ringDateTimeNow").text("2000/01/01 00:00:00");
                $("#ringcheck").text("2000/01/01 00:00:00"); 
                $("#GPStotal").text("0");
				$("#ringS").text("");
					}
                console.log("msgmsgmsg" + msg.response);
            
				
        
            })
	.fail(function () {
                console.log("error");
            })
	.always(function () {
                console.log("complete")
            });
        }
        else {
            autoConnect = true;
            $('#connectMach').text("裝置連線(連線中.....)");
            $('#autoConnect').text("自動關閉");
          //  intervalObj = setInterval(function () {
                autoConnectComPort();
          //  }, 1000);
        }
           
    });
    
    $('#TTypeBotton').on("click", function () {
		if(parseFloat($('#ringV').text().split("V")[0])>3.5)
		{
				$('.ringUUIDSet').children().text($('#ringUUID').text());
				$("#TTypeModal").modal('show');
		}
		else
		{
				$('#ErrorModal .modal-body').empty();
				$('#ErrorModal .modal-body').append("<div>執行動作，電量必須高於3.5V。</div>");
				$("#ErrorModal").modal('show');	
		}

	});
	
	
	    $('#mapNowBotton').on("click", function () {
		var G = $('#GPStotal').text();
		var V = parseFloat($('#ringV').text().split("V")[0]);
		var UID = $('#ringUUID').text();
		if(V<3.5)
		{
				$('#ErrorModal .modal-body').empty();
				$('#ErrorModal .modal-body').append("<div>執行動作，電量必須高於3.5V。</div>");
				$("#ErrorModal").modal('show');	
		}
		else if(G<10)
		{
				$('#ErrorModal .modal-body').empty();
				$('#ErrorModal .modal-body').append("<div>筆數不足，無法下載。</div>");
				$("#ErrorModal").modal('show');	
		}
		else 
		{
			console.log("secondsCount"+secondsCount);
			    $.blockUI({
                     message: "<div style='    font-size: 50px;'>設定中</div><i class='fa fa-spinner fa-pulse orange' style='font-size:600%'></i>", 
                    //borderWidth:'0px' 和透明背景
                    css: { borderWidth: '0px', backgroundColor: 'transparent' },
                });
		      setTimeout(function () {
				
			  		$.ajax({
						 type: "POST",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/timelyMapData",
						 data:{analyzeUID:UID}
					}).success(function(msg) {
						var qwe=Array();
						
						$(document).ready(function(){
						var map="<div id='mainmap' style='width: 63%;height: 80%;'></div>";
						$("#mapdata").append(map);
							mapGenerate(msg);
							});
							$('#flightmapModal').modal();
							
					});   
				$.unblockUI(); 	

            }, secondsCount);
		}

	});
	
	    $('#mapTypeBotton').on("click", function () {
		
			var analyzeUID = $('#ringUUID').text();
		$.ajax({
						 type: "POST",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/analyzeById",
						 data:{analyzeUID:analyzeUID}
					}).success(function(msg) {
					//$("#analyzeTable tbody").empty();
						for(var i=0;i<msg.response.length;i++){
							
								var row = 
							"<tr class='data' id='"+msg.response[i].id+"'>"+
								"<td name='num' class='num' data-field='tag_uid'>"+i+"</td>"+
								"<td class='tag_UID' data-	='last_modified'>"+msg.response[i].dataType+"</td>"+
								"<td class='tag_count' data-field='tag_uid'>"+msg.response[i].start_time+"</td>"+
							"</tr>";
							$("#analyzeTable").append(row);
							
					}
					
				$("#analyzeAppointModal").modal('show');	
				});	

	});
	
	
	$("#analyzeTable tbody").on("click","tr td:not(.delbutton)",function(){
		console.log("analyzeTable tbody"+$(this).parent().attr('id'));
		$.ajax({
						 type: "POST",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/flightmap",
						 data:{flightId:$(this).parent().attr('id')}
					}).success(function(msg) {
						var qwe=Array();
						
						$(document).ready(function(){
						var map="<div id='mainmap' style='width: 63%;height: 80%;'></div>";
						$("#mapdata").append(map);
							mapGenerate(msg);
							});
							$('#flightmapModal').modal();
							
					});     
    });	
	

		function timeback(seconds) {
		console.log("timeback"+seconds);
		if(secondsCount!=0){
			secondsCount=seconds-1000;
			setTimeout(timeback, 1000,secondsCount);
		}

		}
	
	function gcj02tobd09(lng, lat) {
var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
console.log("lng:"+lng+"lat:"+lat+"sd:"+Math.sqrt(lng * lng + lat * lat));
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
	console.log("z:"+z+"theta:"+theta);
    var bd_lng = (z * Math.cos(theta) + 0.0065).toFixed(6);
    var bd_lat = (z * Math.sin(theta) + 0.006).toFixed(6);
    return [bd_lng, bd_lat]
}
	function LatLogMapDraw(msg,markerGroup,isBaidu){

							var linedata=Array();
							var linelabel =Array();
							var y=1;
							var d=2;
							var linenum=0;
							var markertitle=1;
							var istart=msg.response.length-1;
							var pathmath =1;
							var fk=false;
							var fk1=false;
							var BB =false;
							var BBQ = false;
							var googleBaiduZoomLON=1;
							var googleBaiduZoomLAT=1;

					for(var i=0;i<msg.response.length;i++){
							var nowLONGITUDE = msg.response[i].LONGITUDE;
							var nowLATITUDE = msg.response[i].LATITUDE;
							var nextLONGITUDE = msg.response[pathmath].LONGITUDE;
							var nextLATITUDE = msg.response[pathmath].LATITUDE;
						if(isBaidu)
						{
							var logArr=gcj02tobd09(nowLONGITUDE,nowLATITUDE);
							nowLONGITUDE = logArr[0];
							nowLATITUDE = logArr[1];
							var logArrNext=gcj02tobd09(nextLONGITUDE,nextLATITUDE);
							nextLONGITUDE = logArrNext[0];
							nextLATITUDE = logArrNext[1];
							googleBaiduZoomLON = 0.597191;
							googleBaiduZoomLAT = 0.605899;
						}
						
							var DATE =new Date(msg.response[i].DATE);
							var DATEint1 =DATE.getFullYear()+"-"+addZero(DATE.getMonth()+1)+"-"+addZero(DATE.getDate())+" "+addZero(DATE.getHours())+":"+addZero(DATE.getMinutes())+":"+addZero(DATE.getSeconds());
							if(addZero(DATE.getHours())>12){
								var Tstate="PM";
							}else{
								var Tstate="AM";
							}
							 	if(y<istart){
									var determine1 =msg.response[i].DISTANCE-msg.response[y].DISTANCE;
									var lattotal1 = msg.response[i].LATITUDE-msg.response[y].LATITUDE;
									var lngtotal1 = msg.response[i].LONGITUDE-msg.response[y].LONGITUDE;
									var disy=getDistance(msg.response[y].LATITUDE,msg.response[y].LONGITUDE,msg.response[i].LATITUDE,msg.response[i].LONGITUDE);
									var disd=getDistance(latbefore,lngbefore,msg.response[y].LATITUDE,msg.response[y].LONGITUDE);
									if(d<istart){
										var determine2 =msg.response[i].DISTANCE-msg.response[d].DISTANCE;
										var lattotal2 = msg.response[i].LATITUDE-msg.response[d].LATITUDE;
										var lngtotal2 = msg.response[i].LONGITUDE-msg.response[d].LONGITUDE;
										//console.log("disdWWWWW"+disd);
										}
									}
								
							 var determinebefore =DISdatabdfore-msg.response[i].DISTANCE;
							 var latmath=latbefore-msg.response[i].LATITUDE;
							 var lngmath=lngbefore-msg.response[i].LONGITUDE;
						//
							
								/* console.log("i"+i);
							 console.log("lattotal1"+lattotal1);
							 console.log("latmath"+latmath);
							 console.log("lngtotal1"+lngtotal1);
							 console.log("lngmath"+lngmath);
							 console.log("lattotal2"+lattotal2);
							 console.log("lngtotal2"+lngtotal2);*/
							
							
							
							
							var disb=getDistance(latbefore,lngbefore,msg.response[i].LATITUDE,msg.response[i].LONGITUDE);
							var disc =disb-disy;
						//	if(markertitle==11){
							/*console.log("2222"+msg.response[i].LATITUDE+"1111"+msg.response[i].LONGITUDE);
							console.log("disb"+disb);
							console.log("disd"+disd);
							console.log("disy"+disy);
							console.log("disc"+disc);*/
							//}
							
							if(disy>disb){
								if(disd/disy<0.5){
									 fk=false;
									
									 fk1=true;
								}
							}else{
								if(disd/disb<0.5){
									 fk=false;
									
									 fk1=true;
								}
							}
							 /*if(disd<300&&Math.abs(disc)<300&&disb>disd&&disy>disd){
								
									 fk=false;
									
									 fk1=true;
									  //console.log("iiiiiii"+markertitle+fk1);
							 }*/
							 
							 /*if(Math.abs(lattotal1)>0.001&&Math.abs(lngtotal1)>0.003){
								if(Math.abs(lngtotal2)<0.005||Math.abs(lattotal2)<0.06){
								fk=true;
								console.log("isssss"+markertitle);
								}
							 }
				*/
							 //console.log("fk1"+fk1);
							 
					if(fk1==false||i==istart||i==0){
					if(determine1>0.1&&determinebefore>0.1&&msg.response[i].HDOP<2||i==istart||i==0){	 
						//if(Math.abs(lattotal1)>0.0004&&Math.abs(lngtotal1)>0.0004||i==istart||i==0){
						if(y<msg.response.length){
						if(i==istart||i==0){
							linedata.push(0);
						}else{
						var speednow = speedcount(msg.response[y].DATE,msg.response[i].DATE,msg.response[i].DISTANCE,msg.response[y].DISTANCE)
						linedata.push(speednow);
						}
						
						linelabel.push(linenum);
						linenum=linenum+1;
						}
						if(i==istart||i==0)
						{
						
						
						
							if(i==istart){
								var titledata="終點";
							}else{
								var titledata="起點";
							}
							console.log("i"+i);
							var myIcon = L.icon({
								iconUrl: 'img/map.png',
								iconSize: [,41],
								iconAnchor: [21, 41]
								});
								console.log("1response[i].LATITUDE"+msg.response[i].LATITUDE+"1response[i].LONGITUDE"+msg.response[i].LONGITUDE);
							L.marker([nowLATITUDE*googleBaiduZoomLAT,nowLONGITUDE*googleBaiduZoomLON],{
							icon: myIcon,
							title:titledata
							}).addTo(markerGroup)
							.bindPopup('時間'+DATEint1+" "+Tstate+'<br> 當前座標'+msg.response[i].LATITUDE+","+msg.response[i].LONGITUDE+'<br> 當前速度'+speednow);
							
							L.polyline.antPath([
								[nowLATITUDE*googleBaiduZoomLAT,nowLONGITUDE*googleBaiduZoomLON],
								[nextLATITUDE*googleBaiduZoomLAT,nextLONGITUDE*googleBaiduZoomLON]
							], {"delay":400,"dashArray":[10,20],"weight":5,"color":"#0000FF","pulseColor":"#FFFFFF","paused":false}).addTo(markerGroup);
					

						}else{
						
						L.marker([nowLATITUDE*googleBaiduZoomLAT,nowLONGITUDE*googleBaiduZoomLON],{
								title:markertitle,
								pane:"a"
								}).addTo(markerGroup)
								.bindPopup('時間'+DATEint1+" "+Tstate+'<br> 當前座標'+msg.response[i].LATITUDE+","+msg.response[i].LONGITUDE+'<br> 當前速度'+speednow);
							
						if(pathmath<msg.response.length){
							L.polyline.antPath([
								[nowLATITUDE*googleBaiduZoomLAT,nowLONGITUDE*googleBaiduZoomLON],
								[nextLATITUDE*googleBaiduZoomLAT,nextLONGITUDE*googleBaiduZoomLON]
							], {"delay":400,"dashArray":[10,20],"weight":5,"color":"#0000FF","pulseColor":"#FFFFFF","paused":false}).addTo(markerGroup);
							}
						markertitle=markertitle+1;
						}
								
							pathmath=i;
							}
						}else{
								fk1=false;
								//console.log("IIII");
							};
							y=i+2;
							d=i+3;
							var DISdatabdfore=msg.response[i].DISTANCE;
							var latbefore=msg.response[i].LATITUDE;
							var lngbefore=msg.response[i].LONGITUDE;
							
						}
						}
	
	var _map;
	function mapGenerate (msg){


							$('#flightmapModal').on('shown.bs.modal', function(){
							msg.response.reverse();
						
						
						var startdate =new Date(msg.response[0].DATE);
						var enddate =new Date(msg.response[msg.response.length-1].DATE);
						var intdate1 =startdate.getFullYear()+"-"+addZero(startdate.getMonth()+1)+"-"+addZero(startdate.getDate())+" "+addZero(startdate.getHours())+":"+addZero(startdate.getMinutes())+":"+addZero(startdate.getSeconds());
						var intdate2 =enddate.getFullYear()+"-"+addZero(enddate.getMonth()+1)+"-"+addZero(enddate.getDate())+" "+addZero(enddate.getHours())+":"+addZero(enddate.getMinutes())+":"+addZero(enddate.getSeconds());
						var url_normal = 'http://localhost:3000/mapdata/1818940751/{z}/{x}/{y}';
						var glayer_normal = new L.TileLayer(url_normal, { minZoom: 3, maxZoom: 15, attribution: '普通地圖' });

						var url_Godelnormal = 'http://localhost:3000/mapdata/788865972/{z}/{x}/{y}';
						var glayer_Godelnormal = new L.TileLayer(url_Godelnormal, { minZoom: 3, maxZoom: 15, attribution: '高德地圖' });
						
						var url_Bainormal = 'http://localhost:3000/mapdata/1082287436/{z}/{x}/{y}';
						var glayer_Bainormal = new L.TileLayer(url_Bainormal, { minZoom: 3, maxZoom: 15, attribution: '百度地圖' });
						
						var url_Baisatelite = 'http://localhost:3000/mapdata/506225996/{z}/{x}/{y}';
						var glayer_Baisatelite = new L.TileLayer(url_Baisatelite, { minZoom: 3, maxZoom: 15, attribution: '百度衛星' });
						
						var url_satelite = 'http://localhost:3000/mapdata/47626774/{z}/{x}/{y}';
						var glayer_satelite = new L.TileLayer(url_satelite, { minZoom: 3, maxZoom: 15, attribution: '衛星地圖' });

						var url_satelite = 'http://localhost:3000/mapdata/1024577166/{z}/{x}/{y}';
						var glayer_marker = new L.TileLayer(url_satelite, { minZoom: 3, maxZoom: 15, attribution: '混合地圖' });
						
						var latlng = new L.LatLng(25.0676,121.489);

						_map = new L.Map('mainmap', { center: latlng, zoom: 10, layers: [glayer_normal] });
						
					var baseLayers = {
						"普通地圖": glayer_normal,
						"衛星地圖": glayer_satelite,
						"混合地圖":glayer_marker,
						"高德地圖":glayer_Godelnormal,
						"百度地圖":glayer_Bainormal,
						"百度衛星":glayer_Baisatelite
						
					};
					var markerGroup = L.layerGroup().addTo(_map);
						_map.on('baselayerchange', function(e) { 
						//alert('changed'+e.name); 
						if(e.name=="百度地圖"||e.name=="百度衛星"){
						//alert('changedBAI'); 
							markerGroup.clearLayers();
							LatLogMapDraw(msg,markerGroup,true);
							var logArr=gcj02tobd09(121.489,25.0676);
							_map.setView(new L.LatLng(logArr[1]*0.605899,logArr[0]*0.597191), 10, { animation: true });  
						}
						else
						{
							markerGroup.clearLayers();
							LatLogMapDraw(msg,markerGroup,false);
							_map.setView(new L.LatLng(25.0676,121.489), 10, { animation: true });  
						}
						
						
						});

						var controllayers = L.control.layers(baseLayers);
								
						controllayers.addTo(_map);
						LatLogMapDraw(msg,markerGroup,false);


						
	
							
							});
							
							
						
$('#flightmapModal').on('hidden.bs.modal', function(){

						if(_map)
						{
						console.log('_mapremove');
						_map.remove();
						$("#mapdata").empty();
							_map=null;
							
						}
});




}
	
	function getDistance(lat1, lng1, lat2, lng2) { 
    var dis = 0;
    var radLat1 = toRadians(lat1);
    var radLat2 = toRadians(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = toRadians(lng1) - toRadians(lng2);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return dis * 6378137;

    function toRadians(d) {  return d * Math.PI / 180;}
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
	  
	$('#setTrainInfo').on("click", function () {
                $.blockUI({
                     message: "<div style='    font-size: 50px;'>設定中</div><i class='fa fa-spinner fa-pulse orange' style='font-size:600%'></i>", 
                    //borderWidth:'0px' 和透明背景
                    css: { borderWidth: '0px', backgroundColor: 'transparent' },
                });
                //3秒後，解除BlockUI

        var $this = $(this);
        var ringStatus = "0x49"; 
		var NowDate = new Date();
		var newdate = NowDate.getFullYear() + "/" + (NowDate.getMonth()+1) + "/" + NowDate.getDate();
		var newtime = NowDate.getHours() + ":" + NowDate.getMinutes() + ":" + NowDate.getSeconds();
        var ringDateNow = newdate;
        var ringTimeNow = newtime;
        var ringReservseDate = $('#datepicker').data("DateTimePicker").date().format("YYYY/MM/DD");
        var ringReservseTime =  $('#timepicker').data("DateTimePicker").date().format('HH:mm:ss');
        var ringUUID=  $('#ringUUID').text();
		var ringV=  $('#ringV').text();
        
        $this.button('loading');
       
        var datechange = $("#ringDateTimeNow").text();
        
        $.ajax({
            type: "POST",
            url: protocol + "//" + hostname + ":3000/2.4/v1/setRingInfo",
            data: { ringV:ringV,ringUUID:ringUUID,ringDateNow: ringDateNow, ringTimeNow: ringTimeNow, ringReservseDate: ringReservseDate, ringReservseTime: ringReservseTime ,ringStatus: ringStatus}
        })
	.success(function (msg) {
            if (msg.status == "error")
                alert(msg.message);
            setTimeout(function () {
                var datechange = $("#ringcheck").text();
				//console.log("datechange"+datechange);
				var NowDate = new Date();
				var ringReservseDate = $('#datepicker').data("DateTimePicker").date().format("YYYY/MM/DD");
				var ringReservseTime =  $('#timepicker').data("DateTimePicker").date().format('HH:mm:ss');
                var ringReservseDateTimeNow = ringReservseDate+" "+ ringReservseTime;
				console.log("ringReservseDateTimeNow"+ringReservseDateTimeNow);
                $this.button('reset');
               /* if (datechange == ringReservseDateTimeNow)
                    alert("成功");
                else
                    alert("失敗");
					*/
					
					  $.unblockUI(); 
			 $.blockUI({
			 theme: true,
            message: "<div>"+$("#OKModal").modal('show')+"</div>", 
                    //borderWidth:'0px' 和透明背景
            css: { borderWidth: '0px', backgroundColor: 'transparent' },
          });
		  $("#SetInfo").text("");
		  $("#OKModal").on('hidden.bs.modal', function(){
				console.log("OKModal hidden");
						$.unblockUI();
		});
            }, 5000);
			

           console.log("msgmsgmsg" + msg.response);
           // $("#inputChangeNum").text($("#inputChangeNum").text);

        
        })
	.fail(function () {
            console.log("error");
            setTimeout(function () {
                var datechange = $("#ringDateTimeNow").text();
				var NowDate = new Date();
				var newdate = NowDate.getFullYear() + "/" + (NowDate.getMonth()+1) + "/" + NowDate.getDate();
				var newtime = NowDate.getHours() + ":" + NowDate.getMinutes() + ":" + NowDate.getSeconds();
                var ringDateNow = newdate;
                var ringTimeNow = newtime;
                var ringDateTimeNow = ringDateNow + " " + ringTimeNow;
                var currDate = Date.parse((new Date(datechange)));
                var currDate2 = Date.parse((new Date(ringDateTimeNow)));
                console.log("currDate" + currDate);
                console.log("currDate2" + currDate2);
                $this.button('reset');
               /* if (currDate == currDate2)
                    alert("成功");
                else
                    alert("失敗");*/

            }, 3000);
        })
	.always(function () {
            console.log("complete")
        });
	});

	    $('#backHome').on("click", function () {
		      if($('.ringUUIDSet').children().text().indexOf($('#ringUUID').text())!=-1)
			  {
					$("#SetInfo").text('確認裝置是否拔除或替換');	
			  }
			  else
			  {
					window.location = "./Home";
			  }
		});
	
    $('#RTypeBotton').on("click", function () {
	
	
		if(parseFloat($('#ringV').text().split("V")[0])>3.5)
		{
				$('.ringUUIDSet').children().text($('#ringUUID').text());
				$("#RTypeModal").modal('show');
		}
		else
		{
				$('#ErrorModal .modal-body').empty();
				$('#ErrorModal .modal-body').append("<div>執行動作，電量必須高於3.5V。</div>");
				$("#ErrorModal").modal('show');	
		}

	});
	
	$('#setRaceInfo').on("click", function () {
	
	     $.blockUI({
            message: "<div style='    font-size: 50px;'>設定中</div><i class='fa fa-spinner fa-pulse orange' style='font-size:600%'></i>", 
                    //borderWidth:'0px' 和透明背景
            css: { borderWidth: '0px', backgroundColor: 'transparent' },
          });
        var $this = $(this);
        var ringStatus = "0x41"; 
		var NowDate = new Date();
		var newdate = NowDate.getFullYear() + "/" + (NowDate.getMonth()+1) + "/" + NowDate.getDate();
		var newtime = NowDate.getHours() + ":" + NowDate.getMinutes() + ":" + NowDate.getSeconds();
        var ringDateNow = newdate;
        var ringTimeNow = newtime;
        var ringReservseDate = $('#datepicker').data("DateTimePicker").date().format("YYYY/MM/DD");
        var ringReservseTime =  $('#timepicker').data("DateTimePicker").date().format('HH:mm:ss');
        
        var ringUUID=  $('#ringUUID').text();
		var ringV=  $('#ringV').text();
        $this.button('loading');
       
        var datechange = $("#ringDateTimeNow").text();
        
        $.ajax({
            type: "POST",
            url: protocol + "//" + hostname + ":3000/2.4/v1/setRingInfo",
            data: {ringV:ringV,ringUUID:ringUUID,ringDateNow: ringDateNow, ringTimeNow: ringTimeNow, ringReservseDate: ringReservseDate, ringReservseTime: ringReservseTime,ringStatus: ringStatus}
        })
	.success(function (msg) {
            if (msg.status == "error")
                alert(msg.message);
            setTimeout(function () {
                var datechange = $("#ringDateTimeNow").text();
				var NowDate = new Date();
				var newdate = NowDate.getFullYear() + "/" + (NowDate.getMonth()+1) + "/" + NowDate.getDate();
				var newtime = NowDate.getHours() + ":" + NowDate.getMinutes() + ":" + NowDate.getSeconds();
                var ringDateNow = newdate;
                var ringTimeNow = newtime;
                var ringDateTimeNow = ringDateNow+" "+ ringTimeNow;
                var currDate = Date.parse((new Date()).datechange);
                var currDate2 = Date.parse((new Date()).ringDateTimeNow);
                $this.button('reset');
              /*  if (currDate == currDate2)
                    alert("成功");
                else
                    alert("失敗");*/
					
					  $.unblockUI(); 
			 $.blockUI({
			 theme: true,
            message: "<div>"+$("#OKModal").modal('show')+"</div>", 
                    //borderWidth:'0px' 和透明背景
            css: { borderWidth: '0px', backgroundColor: 'transparent' },
          });
		  $("#SetInfo").text("");
		  $("#OKModal").on('hidden.bs.modal', function(){
				console.log("OKModal hidden");
						$.unblockUI();
		});
            }, 5000);

           // $("#inputChangeNum").text($("#inputChangeNum").text);

        
        })
	.fail(function () {
            console.log("error");
            setTimeout(function () {
                var datechange = $("#ringDateTimeNow").text();
				var NowDate = new Date();
				var newdate = NowDate.getFullYear() + "/" + (NowDate.getMonth()+1) + "/" + NowDate.getDate();
				var newtime = NowDate.getHours() + ":" + NowDate.getMinutes() + ":" + NowDate.getSeconds();
                var ringDateNow = newdate;
                var ringTimeNow = newtime;
                var ringDateTimeNow = ringDateNow + " " + ringTimeNow;
                var currDate = Date.parse((new Date(datechange)));
                var currDate2 = Date.parse((new Date(ringDateTimeNow)));
                console.log("currDate" + currDate);
                console.log("currDate2" + currDate2);
                $this.button('reset');
                if (currDate == currDate2)
                    alert("成功");
                else
                    alert("失敗");

            }, 3000);
        })
	.always(function () {
            console.log("complete")
        });
	});
    
    $('#readTrack').on("click", function () {
        
        var ringPassword = $('#exampleInputAmount').val();
		var GPSTotal = $('#GPStotal').text();
		var ringUUID = $('#ringUUID').text();
            $.ajax({
                type: "POST",
                url: protocol + "//" + hostname + ":3000/2.4/v1/readTrackData",
                data: {ringPassword: ringPassword,GPSTotal: GPSTotal,GPSUID: ringUUID}
               
            })
	.success(function (msg) {
                
              //  console.log("msgmsgmsg" + msg.status);
            
					$('#readTrack').button('loading');
					// simulating a timeout

					setTimeout(function () {
					$('#readTrack').button('reset');
						if(!msg.status)
							alert(msg.message);
					}, 8000);
        
            })
	.fail(function () {
                console.log("error");
            })
	.always(function () {
                console.log("complete")
            });
    });
    
    
	$('input:radio[name^="radio"]').on('change', function (event) {
	if($(this).attr('id')=="trainRadio")
		$('.BTime').addClass("invisible"); 
	else if($(this).attr('id')=="RaceRadio")
		$('.BTime').removeClass("invisible"); 
});





	$('#errormessagesend').on("click", function () {
		console.log("---------");
            $.ajax({
                type: "POST",
                url: protocol + "//" + hostname + ":3000/map/v1/email"
               
            })
	.success(function (msg) {
                
               console.log("msgmsgmsg" + msg.status);
            
        
            })
	.fail(function () {
                console.log("error");
            })
	.always(function () {
                console.log("complete")
            });
			

		});
		
		
	$('.UUIDChange').on("click", function () {
		
		if($(this).parent().prev().children().get(0).tagName=="INPUT")
			{
				var value = $(this).parent().prev().children().val();
				var ringChangeUUID = value;
		 		$(this).parent().prev().empty();
				$(this).parent().prev().append("<div>"+value+"</div>");
				
            $.ajax({
                type: "POST",
                url: protocol + "//" + hostname + ":3000/2.4/v1/ringUUIDChange",
                data: {ringChangeUUID:ringChangeUUID}
               
            })
	.success(function (msg) {
                
               console.log("msgmsgmsg" + msg.status);
            
        
            })
	.fail(function () {
                console.log("error");
            })
	.always(function () {
                console.log("complete")
            });

			}
			else
			{
				var value = $(this).parent().prev().children().text();
				$(this).parent().prev().empty();
				$(this).parent().prev().append("<input   onkeyup='value=value.replace(/[^\d]/g,'')' Maxlength='16' style='position: relative;line-height: 2.5em;cursor: pointer;-webkit-user-select: none; -moz-user-select: none;-ms-user-select: none;user-select: none;height: 36.67px;' type='text' class='form-control' id='inputChangeNum' placeholder='編號' value='"+value+"'></div>");
			}
			

		});
	
 var ringstatus="";
    $('#writeInfoOnRing').on("click", function () {
        var ringChangeUUID = "";
        var ringChangePassWord = "";
        var ringPassword = $('#exampleInputAmount').val();
        var ringReservseDate = "";
        var ringReservseTime = "";
        var ringDateNow = "";
        var ringTimeNow = "";
        var ringStatus = "";
        var $this = $(this);
      /*  if ($("#changeNum").prop("checked"))
            ringChangeUUID = $("#inputChangeNum").val();
        
        if ($("#changePass").prop("checked"))
            ringChangePassWord = $("#inputChangePass").val();*/
        
        if ($("#RaceRadio").prop("checked"))
            ringStatus = "0x41";     //A
        
        if ($("#trainRadio").prop("checked"))
            ringStatus = "0x49";     //I
        
		var NowDate = new Date();
		var newdate = NowDate.getFullYear() + "/" + (NowDate.getMonth()+1) + "/" + NowDate.getDate();
		var newtime = NowDate.getHours() + ":" + NowDate.getMinutes() + ":" + NowDate.getSeconds();
        var ringDateNow = newdate;
        var ringTimeNow = newtime;
        var ringReservseDate = $('#datepicker').data("DateTimePicker").date().format("YYYY/MM/DD");
        var ringReservseTime =  $('#timepicker').data("DateTimePicker").date().format('HH:mm:ss');
        
        
        $this.button('loading');
       
        var datechange = $("#ringDateTimeNow").text();
        console.log("datechange" + datechange);
        console.log("ringDateNow" + ringTimeNow);
        console.log("ringTimeNow" + ringDateNow);
        
        $.ajax({
            type: "POST",
            url: protocol + "//" + hostname + ":3000/2.4/v1/setRingInfo",
            data: {ringUUID: ringChangeUUID, ringDateNow: ringDateNow, ringTimeNow: ringTimeNow, ringReservseDate: ringReservseDate, ringReservseTime: ringReservseTime , ringPassword: ringPassword,ringChangePassWord: ringChangePassWord,ringStatus: ringStatus}
        })
	.success(function (msg) {
            if (msg.status == "error")
                alert(msg.message);
            setTimeout(function () {
                var datechange = $("#ringDateTimeNow").text();
				var NowDate = new Date();
				var newdate = NowDate.getFullYear() + "/" + (NowDate.getMonth()+1) + "/" + NowDate.getDate();
				var newtime = NowDate.getHours() + ":" + NowDate.getMinutes() + ":" + NowDate.getSeconds();
                var ringDateNow = newdate;
                var ringTimeNow = newtime;
                var ringDateTimeNow = ringDateNow+" "+ ringTimeNow;
                var currDate = Date.parse((new Date()).datechange);
                var currDate2 = Date.parse((new Date()).ringDateTimeNow);
                $this.button('reset');
                if (currDate == currDate2)
                    alert("成功");
                else
                    alert("失敗");

            }, 2000);

           console.log("msgmsgmsg" + msg.response);
           // $("#inputChangeNum").text($("#inputChangeNum").text);

        
        })
	.fail(function () {
            console.log("error");
            setTimeout(function () {
                var datechange = $("#ringDateTimeNow").text();
				var NowDate = new Date();
				var newdate = NowDate.getFullYear() + "/" + (NowDate.getMonth()+1) + "/" + NowDate.getDate();
				var newtime = NowDate.getHours() + ":" + NowDate.getMinutes() + ":" + NowDate.getSeconds();
                var ringDateNow = newdate;
                var ringTimeNow = newtime;
                var ringDateTimeNow = ringDateNow + " " + ringTimeNow;
                var currDate = Date.parse((new Date(datechange)));
                var currDate2 = Date.parse((new Date(ringDateTimeNow)));
                console.log("currDate" + currDate);
                console.log("currDate2" + currDate2);
                $this.button('reset');
                if (currDate == currDate2)
                    alert("成功");
                else
                    alert("失敗");

            }, 2000);
        })
	.always(function () {
            console.log("complete")
        });
    });
    


    $('#nowtime').on("click", function () {
        console.log("this.checked"+ this.checked);
        if (this.checked) {
            autoLocalTimeInterval = true;
        }
        else {
            autoLocalTimeInterval = false;
        }
    });
    
    function autoConnectComPort()
   {
    
    console.log(protocol + "//" + hostname + ":3000/2.4/v1/channel");
    $.ajax({
        type: "GET",
        //url: "http://10.1.1.77:3000/2.4/v1/readers ",
        //url: "http://1.163.240.170:3000/2.4/v1/readers ",
        url: protocol + "//" + hostname + ":3000/2.4/v1/channel",
    })
	.success(function (msg) {
            if (msg.status == "error")
                alert(msg.message);
        //alert(JSON.stringify(msg));
        //msg.response
           // $("#qqa").text(msg.ringVersion);
            if(msg.port)
                {
					$('#connectMach').text("裝置連線(連線" + msg.port + ")");
					$('#ringlinkicon').attr('glyphicon glyphicon-ok-circle');
					socketCounnect();
				}
            
            console.log("serverBaseUrl" + serverBaseUrl);
            
 
    })
	.fail(function () {
        console.log("error");
    })
	.always(function () {
        console.log("complete")
    });
    }
	
	
	function socketCounnect(){
		            var socket = io.connect("http://" + serverBaseUrl);
            socket.on('connect', function () {
                console.log("connectOKOK");
            });
            
            socket.on("channel1", function (readerObj) {
                //.toUpperCase()
				console.log("readerObj.ringUUID"+readerObj.ringUUID);
                if (readerObj.status == "error")
                    alert(readerObj.message);


				if(readerObj.ringStatus=="R")
					$("#ringS").text("比賽模式"); 
			   else if(readerObj.ringStatus=="T")
					$("#ringS").text("練習模式"); 
					
				ringstatus = readerObj.ringStatus;
				if(!readerObj.ringUUID)
				{
					$("#ringUUID").text("0000000000000000");
					$("#qqa").text("");
				} 
				else
				{				
				    console.log(readerObj.ringUUID+"wwq"+$("#ringUUID").text());
				if(readerObj.ringUUID&&$("#ringUUID").text()!=readerObj.ringUUID&&readerObj.ringUUID!="0000000000000000"&&parseInt(readerObj.GPSCount)>10)
				{
				    console.log("eeeee");
						var GPSTotal = readerObj.GPSCount;
						var ringUUID =	readerObj.ringUUID;
						$.ajax({
								type: "POST",
								url: protocol + "//" + hostname + ":3000/2.4/v1/readTrackData",
								data: {GPSTotal: GPSTotal,GPSUID: ringUUID,ringstatus:ringstatus}
               
							})
							.success(function (msg) {
                
								  console.log("msgmsgmsg" + msg.status);
            
								$('#readTrack').button('loading');
									// simulating a timeout
								secondsCount=8000;
								console.log("Start"+secondsCount);
								var timebackResult =setTimeout(timeback,1000,secondsCount);
								setTimeout(function () {
									$('#readTrack').button('reset');
										if(!msg.status)
											alert(msg.message);
								}, 8000);
        
							})
							.fail(function () {
									console.log("error");
							})
							.always(function () {
									console.log("complete")
							});
				}
					$("#ringUUID").text(readerObj.ringUUID);
					$("#qqa").text(readerObj.ringVersion+ "(" + readerObj.ringVersionID + ")");
				
				}

					var V = Math.round(readerObj.ringV * 100)/100;
					console.log("parseFloat(V)"+parseFloat(V));
					console.log("battery(V)"+$("#battery").attr('src'));
                if(parseFloat(V)<3.5&&$("#battery").attr('src')!="img/power_03.png")
				{
						$("#battery").attr('src',"img/power_03.png");
				}
				else if(parseFloat(V)>3.5&&parseFloat(V)<4&&$("#battery").attr('src')!="img/power_02.png")
				{
					console.log("2222222222222222222");
						$("#battery").attr('src',"img/power_02.png");
				}
				else if(parseFloat(V)>4&&$("#battery").attr('src')!="img/power_01.png")
				{
						$("#battery").attr('src',"img/power_01.png");
				}
                $("#ringV").text(V+"V");
                $("#ringDateTimeNow").text(readerObj.ringNow);
                $("#ringcheck").text(readerObj.ringReserve); 
                $("#GPStotal").text(readerObj.GPSCount);

            });

       
	}
   // ShowTime();
  /*  $('#datetimepicker6').datetimepicker({
        viewMode: 'years',
        format: 'YYYY/MM/DD'
    });
    
    $('#datetimepicker7').datetimepicker({
        viewMode: 'decades',
        format: 'HH:mm:ss'
    });*/

   /* $('#datetimepicker6').datetimepicker();
    $('#datetimepicker7').datetimepicker({
        useCurrent: false //Important! See issue #1075
    });*/
   /* $("#datetimepicker6").on("dp.change", function (e) {
        $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepicker7").on("dp.change", function (e) {
        $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
    });*/

  /*  $('#datetimepicker6').data("DateTimePicker").defaultDate(new Date());
    $('#datetimepicker7').data("DateTimePicker").defaultDate(new Date());
	


    $('#datetimepicker1').datetimepicker({
        viewMode: 'decades',
        format: 'YYYY/MM/DD'
    });
    
    $('#datetimepicker2').datetimepicker({
        viewMode: 'decades',
        format: 'HH:mm:ss'
    });*/

   /* $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker({
        useCurrent: false //Important! See issue #1075
    });*/
   /* $("#datetimepicker1").on("dp.change", function (e) {
        $('#datetimepicker6').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepicker6").on("dp.change", function (e) {
        $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
    });

    $('#datetimepicker1').data("DateTimePicker").defaultDate(new Date());
    $('#datetimepicker2').data("DateTimePicker").defaultDate(new Date());
*/
});

function ShowTime() {
    　var NowDate = new Date();
    var d = NowDate.getDay();
    var dayNames = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    document.getElementById('showbox').innerHTML = NowDate.toLocaleString() + '（' + dayNames[d] + '）';
    var newdate = NowDate.getFullYear() + "/" + (NowDate.getMonth()+1) + "/" + NowDate.getDate();
	today = NowDate;
    /*if (autoLocalTimeInterval) {
		console.log(newdate);
        $('#datetimepicker1').data("DateTimePicker").date(newdate);
        $('#datetimepicker2').data("DateTimePicker").date(NowDate);
    }*/
    setTimeout('ShowTime()', 1000);
}

/*function init() {

	
	console.log("server base url:"+"http://"+serverBaseUrl);
	var socket = io.connect("http://"+serverBaseUrl);

	socket.on('connect', function () {


	});	

	socket.on("channel1", function (readerObj) {
		console.log("2.4頁面receive"+JSON.stringify(readerObj));
 		console.log("get the reader name:"+readerObj.reader_name);	
		
		$("#readerTable tr").css('background','#FFFFFF');
		console.log("did I get readerTable:"+$("#readerTable").length);
		//adding color
		$("#"+readerObj.reader_name).css('background-color','#FFE700');
		if(readerObj.wrong_packet ==="1")
		{
			$("#"+readerObj.reader_name).css('background-color','#FF0000');
		
		}
		
		//position column
		$("#"+readerObj.reader_name+" td:nth-child(2)").text(readerObj.position);
		
		//tag name column
		$("#"+readerObj.reader_name+" td:nth-child(3)").text(readerObj.tag_name);
		
		//tag uid column
		$("#"+readerObj.reader_name+" td:nth-child(4)").text(readerObj.tag_uid);
		
		//strength column
		$("#"+readerObj.reader_name+" td:nth-child(5)").text(readerObj.strength);
		
		
		var date = new Date(readerObj.created_at);
		var formatDate = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+" "
		+addZero(date.getHours()) + ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds());                                
		
		//created at column
		$("#"+readerObj.reader_name+" td:nth-child(6)").text(formatDate);
		
		
		
		
	});	
	var protocol = location.protocol;
	var hostname = location.hostname;
	$.ajax({
		 type: "GET",
		 //url: "http://10.1.1.77:3000/2.4/v1/readers ",
		 //url: "http://1.163.240.170:3000/2.4/v1/readers ",
		 url: protocol+"//"+hostname+":3000/2.4/v1/readers",
	})
	.success(function( msg ) {
		//alert(JSON.stringify(msg));
		//msg.response
		
		var readerArray = msg.response;
		console.log("readerArray:"+JSON.stringify(readerArray));
		for(var i=0;i<readerArray.length;i++)
		{
			
			var row = 
				"<tr id='"+readerArray[i].reader_name+"'>"+
					"<td data-field='reader_name'>"+readerArray[i].reader_name+"</td>"+
					"<td data-field='position'>"+readerArray[i].position+"</td>"+
					"<td data-field='tag_name'></td>"+
					"<td data-field='tag_uid'></td>"+
					"<td data-field='strength'></td>"+
					"<td data-field='created_at'></td>"+
				"</tr>";
			$("#readerTable tbody").append(row);			
		
		
		}
		
		
	

	})
	.fail(function() {
			console.log("error");
	})
	.always(function() {
			console.log("complete")
	});

}*/
function addZero(n){
 return n < 10 ? '0' + n : '' + n;
}
$(document).on('ready', init);

