var winDis=0;
var winStartDate="";
var leveldata = Array();
$( document ).ready(function() {
			
tableuupdate("tagTable","tagDataUpdate");
tableuupdate("levelTable","levelDataUpdate");

$(document).on('click', 'th', function() {
  var table = $(this).parents('table').eq(0);
  var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
  this.asc = !this.asc;
  if (!this.asc) {
    rows = rows.reverse();
  }
  table.children('tbody').empty().html(rows);
});

function comparer(index) {
  return function(a, b) {
    var valA = getCellValue(a, index),
      valB = getCellValue(b, index);
    return $.isNumeric(valA) && $.isNumeric(valB) ?
      valA - valB : valA.localeCompare(valB);
  };
}

function getCellValue(row, index) {
  return $(row).children('td').eq(index).text();
}


$("ul").on("click","li:eq(2)",function(){    
        	$.ajax({
						 type: "GET",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/leveldata"
					}).success(function(msg) {
					$("#levelTable tbody").empty();
					var a=1;
						for(var i=0;i<msg.response.length;i++){
						var row = 
							"<tr class='data' id='"+msg.response[i].id+"'>"+
								"<td name='num' class='num' data-field='tag_uid'>"+a+"</td>"+
								"<td class='name' data-field='tag_uid'>"+msg.response[i].name+"</td>"+
								"<td class='value' data-field='last_modified'>"+msg.response[i].value+"</td>"+
							"</tr>";
							$("#levelTable").append(row);
							a=a+1;
						}
					
					});
});



$("ul").on("click","li:eq(4)",function(){
winDis=0;
winStartDate="";  
$.ajax({
						 type: "GET",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/analyzeflight"
					}).success(function(msg) {
					$("#analyzeTable tbody").empty();
						for(var i=0;i<msg.response.length;i++){
							
								var row = 
							"<tr class='data' id='"+msg.response[i].tag_id+"'>"+
								"<td name='num' class='num' data-field='tag_uid'>"+i+"</td>"+
								"<td class='tag_UID' data-	='last_modified'>"+msg.response[i].tag_id+"</td>"+
								"<td class='tag_count' data-field='tag_uid'>"+msg.response[i].train_count+"</td>"+
								"<td class='name' data-field='last_modified'>"+msg.response[i].total_dis+"</td>"+
								"<td class='gender' data-field='last_modified'>"+msg.response[i].total_ar_speed+"</td>"+
								"<td class='age' data-field='last_modified'><p>最佳:"+msg.response[i].max_arspeed+"</p><p>最差:"+msg.response[i].min_arspeed+"</p></td>"+
								"<td class='Sorting' data-field='last_modified'><a href='#analyzeAppointModal' role='button' class='btn btn-primary' data-toggle='modal'>排序</a></td>"+
							"</tr>";
							$("#analyzeTable").append(row);
							for(var a=0;a<leveldata.length;a++){
							var ss =leveldata.length-1;
								if(msg.response[i].ar_speed>leveldata[a].value){
									
									var level="<td data-field='last_modified'>"+leveldata[a].name+"</td>";
									$("#"+msg.response[i].id).append(level);
									break;
								}
								if(a==ss){
								
									var level="<td data-field='last_modified'>最低等</td>";
									$("#"+msg.response[i].id).append(level);
								}
							
							}
							
					}
					load("analyzeTable");
				});	
			});
	

$("ul").on("click","li:eq(3)",function(){    
        	$.ajax({
						 type: "GET",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/tagdata"
					}).success(function(msg) {
					$("#tagTable tbody").empty();
					var a=1;
						for(var i=0;i<msg.response.length;i++){
						if(msg.response[i].gender=="1"){
								var gender="公";
							}else if(msg.response[i].gender=="2")
							{
								var gender="母";
							}else{
								var gender="未編輯";
							}
						var row = 
							"<tr class='data' id='"+msg.response[i].id+"'>"+
								"<td name='num' class='num' data-field='tag_uid'>"+a+"</td>"+
								"<td class='name' data-field='tag_uid'>"+msg.response[i].name+"</td>"+
								"<td class='gender' data-field='last_modified'>"+gender+"</td>"+
								"<td class='age' data-field='last_modified'>"+msg.response[i].age+"</td>"+
								"<td class='tag_uid' data-field='last_modified'>"+msg.response[i].tag_uid+"</td>"+
							"</tr>";
							$("#tagTable").append(row);
							a=a+1;
						}
					
					});
});

$("#analyzesearch").on("click",function(){

var flightdate="";
		if($('#datetimepicker3').data("DateTimePicker").date()){
		flightdate = $('#datetimepicker3').data("DateTimePicker").date().format();
		}
		var analyzeDIS=$("#analyzeDIS").val();
		var analyzeUID=$("#analyzeUID").val();
		winDis=analyzeDIS;
		winStartDate=flightdate;
$.ajax({
						 type: "POST",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/analyzeflightsearch",
						 data:{analyzeDIS:analyzeDIS,analyzeUID:analyzeUID,flightdate:flightdate}
					}).success(function(msg) {
					$("#analyzeTable tbody").empty();
						for(var i=0;i<msg.response.length;i++){
							
								var row = 
							"<tr class='data' id='"+msg.response[i].tag_id+"'>"+
								"<td name='num' class='num' data-field='tag_uid'>"+i+"</td>"+
								"<td class='tag_UID' data-	='last_modified'>"+msg.response[i].tag_id+"</td>"+
								"<td class='tag_count' data-field='tag_uid'>"+msg.response[i].train_count+"</td>"+
								"<td class='name' data-field='last_modified'>"+msg.response[i].total_dis+"</td>"+
								"<td class='gender' data-field='last_modified'>"+msg.response[i].total_ar_speed+"</td>"+
								"<td class='age' data-field='last_modified'><p>最佳:"+msg.response[i].max_arspeed+"</p><p>最差:"+msg.response[i].min_arspeed+"</p></td>"+
								"<td class='Sorting' data-field='last_modified'><a href='#analyzeAppointModal' role='button' class='Sorting btn btn-primary' data-toggle='modal')>排序</a></td>"+
							"</tr>";
							$("#analyzeTable").append(row);
							
					}
					load("analyzeTable");
				});	
			});
			
			
$("#testanalyze").on("click",function(){

$.ajax({
						 type: "POST",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/bestanalyzeflightsearch",
						 data:{analyzeDIS:winDis,flightdate:winStartDate}
					}).success(function(msg) {
					$("#testTable tbody").empty();
					var datasets=Array();
					var row = "<canvas id='testRadarChart'  style='height:30%;width:30%'></canvas>";
					$("#testRadar").append(row);
					var gcount=0;var gbef=0;
							var hcount=0;var hbef=0;
							var jcount=0;var jbef=0;
							var kcount=0;var kbef=0;
							var pcount=0;var pbef=0;
							
							var best5=Array();
					var backgroundColor=["rgba(200,0,0,0.2)","rgba(175,0,50,0.2)","rgba(150,0,100,0.2)","rgba(100,100,50,0.2)","rgba(50,100,100,0.2)"];
						for(var i=0;i<msg.response.length;i++){
											
								var row = 
							"<tr class='data' id='"+msg.response[i].tag_id+"'>"+
								"<td name='num' class='num' data-field='tag_uid' data-th='序號'>"+i+"</td>"+
								"<td class='tag_UID' data-	='last_modified' data-th='UID'>"+msg.response[i].tag_id+"</td>"+
								"<td class='tag_count' data-field='tag_uid' data-th='訓練次數'>"+msg.response[i].train_count+"</td>"+//訓練
								"<td class='gender' data-field='last_modified' data-th='最快飛速(爆發力)'>"+msg.response[i].explosiveforce+"</td>"+//爆發力
								"<td class='gender' data-field='last_modified' data-th='實際飛行均速'>"+msg.response[i].total_ar_speed+"</td>"+
								"<td class='gender' data-field='last_modified' data-th='目的距離(導航力)'>"+msg.response[i].S+"</td>"+//導航力
								"<td class='gender' data-field='last_modified' data-th='總休息(專注力)'>"+msg.response[i].focus+"</td>"+//專注
								"<td class='age' data-field='last_modified' data-th='速度'><p>最佳:"+msg.response[i].max_arspeed+"</p><p>最差:"+msg.response[i].min_arspeed+"</p></td>"+
							"</tr>";
							$("#testTable").append(row);
							
							if(gbef<msg.response[i].rel_ar_speed){
									console.log("msg.response[i].rel_ar_speed"+msg.response[i].rel_ar_speed);
									gbef=msg.response[i].rel_ar_speed;
									gcount=i;
								}
								
								if(hbef<msg.response[i].explosiveforce){
									hbef=msg.response[i].explosiveforce;
									hcount=i;
								}
								
								if(jbef<msg.response[i].focus){
									jbef=msg.response[i].focus;
									jcount=i;
								}
								
								if(kbef<msg.response[i].S){
									kbef=msg.response[i].S;
									kcount=i;
								}
								
								if(pbef<msg.response[i].train_count){
									pbef=msg.response[i].train_count;
									pcount=i;
								}
								
								console.log("gbef"+gbef);
								
							}
							best5.push(msg.response[gcount]);
							best5.push(msg.response[hcount]);
							best5.push(msg.response[jcount]);
							best5.push(msg.response[kcount]);
							best5.push(msg.response[pcount]);
							//var f=rel_ar_sleeptimetotal/flight_datacol;
							for(var q=0;q<best5.length;q++){
							var g=best5[q].rel_ar_speed/100*100;//K
							var h=best5[q].explosiveforce/10*100;//K
							var j=best5[q].focus*100;
							var k=best5[q].S*100;
							var p=best5[q].train_count/10*100;//K
							if(g>100){
								g=100;
							}
							else if(p>100)
							{
								p=100;
							}
							else if(h>100)
							{
								h=100;
							}
							else if(j>100)
							{
								j=100;
							}
							else if(k>100)
							{
								k=100;
							}
							
							if(q==0){
								var typerader="體力";
							}else if(q==1){
								var typerader="爆發力";
							}
							else if(q==2){
								var typerader="專注力";
							}
							else if(q==3){
								var typerader="導航力";
							}
							else if(q==4){
								var typerader="經驗";
							}
							datasets[q]={
								label: typerader+"("+best5[q].tag_id+")",
								backgroundColor: backgroundColor[q],
								pointHoverRadius: 10,
								radius: 6,
								pointRadius: 6,
								pointBorderWidth: 3,
								data: [h, k,p,j,g]
							};
							}
							

					
					console.log("datasets"+datasets);
					var marksCanvas = document.getElementById("testRadarChart");
					var marksData = {
						labels: ["爆發力", "導航力", "經驗", "專注力", "體力",],
							datasets:datasets
								
							};
							
					var chartOptions = {
					
						legend: {
    display: true,
    position: 'top',
    labels: {
      boxWidth: 80,
      fontColor: 'black'
    }
  },
					
						scale: {
							Override: false,
							ticks: {
								beginAtZero: true,
								Min: 0,
								Max: 100,
								maxTicksLimit:10
							},
							pointLabels: {
								fontSize: 18
							}
						},
						legend: {
							position: 'left'
							}
						};	
	
radarChart = new Chart(marksCanvas, {
  type: 'radar',
  data: marksData,
  options: chartOptions
});
$("#testModal").modal();
				});	
			});			
	
var radarChart="";
$("#analyzeTable tbody").on("click",".Sorting",function(){
		
		var analyzeUID = $(this).parent().attr('id');
		console.log("analyzeUID"+analyzeUID);
$.ajax({
						 type: "POST",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/analyzesearchById",
						 data:{analyzeDIS:winDis,analyzeUID:analyzeUID,flightdate:winStartDate}
					}).success(function(msg) {
					$("#analyzeAppointTable tbody").empty();
					$("#analyzeRadar").empty();
					var row = "<canvas id='analyzeRadarChart'  style='height:30%;width:30%'></canvas>";
					$("#analyzeRadar").append(row);
					var rel_ar_sleeptimetotal=0;
					var rel_ar_speedtotal=0;
					var explosiveforce=0;
					var sleeptimetotal=0;
					var lineDIStotal=0;
					var flight_datacol=0;
						for(var i=0;i<msg.response.length;i++){
							var timeresult=timecount(msg.response[i].total_time)-timecount(msg.response[i].sleeptimetotal);
							rel_ar_sleeptimetotal=rel_ar_sleeptimetotal+msg.response[i].rel_ar_sleeptime;
							rel_ar_speedtotal=rel_ar_speedtotal+msg.response[i].rel_ar_speed/100;//K
							explosiveforce=explosiveforce+msg.response[i].explosiveforce/10; //K
							sleeptimetotal=sleeptimetotal+timeresult/timecount(msg.response[i].total_time);
							lineDIStotal=lineDIStotal+msg.response[i].lineDIS/msg.response[i].distance;//K
							flight_datacol=flight_datacol+1;
							var startdate =new Date(msg.response[i].start_time);
							var enddate =new Date(msg.response[i].end_time);
						var intdate1 =startdate.getFullYear()+"-"+addZero(startdate.getMonth()+1)+"-"+addZero(startdate.getDate())+" "+addZero(startdate.getHours())+":"+addZero(startdate.getMinutes())+":"+addZero(startdate.getSeconds());
						var intdate2 =enddate.getFullYear()+"-"+addZero(enddate.getMonth()+1)+"-"+addZero(enddate.getDate())+" "+addZero(enddate.getHours())+":"+addZero(enddate.getMinutes())+":"+addZero(enddate.getSeconds());					
							var row = 
							"<tr class='data'  id='"+msg.response[i].id+"'>"+
								"<td name='num' class='num' data-field='tag_uid' data-th='序號'>"+i+"</td>"+
								"<td class='age' data-field	='last_modified' data-th='休息時間(體力)'>"+msg.response[i].rel_ar_sleeptime+"</td>"+
								"<td class='tag_uid' data-field='tag_uid' data-th='實際飛行均速'>"+msg.response[i].rel_ar_speed+"</td>"+
								"<td class='gender' data-field='last_modified' data-th='最快飛速(爆發力)'>"+msg.response[i].explosiveforce+"</td>"+
								"<td class='gender' data-field='last_modified' data-th='總休息(專注力)'>"+msg.response[i].sleeptimetotal+"</td>"+
								"<td class='gender' data-field='last_modified' data-th='目的距離(導航力)'>"+msg.response[i].lineDIS+"</td>"+
								"<td class='age' data-field='last_modified' data-th='時間'><p>開始:"+intdate1+"</p><p>結束:"+intdate2+"</p></td>"+
								"<td class='delbutton' data-field='last_modified' data-th='操作'><span class='btn btn-lg glyphicon glyphicon-remove-sign' ></span></td>"+
							"</tr>";
							$("#analyzeAppointTable").append(row);
							/*for(var a=0;a<leveldata.length;a++){
							var ss =leveldata.length-1;
								if(msg.response[i].ar_speed>leveldata[a].value){
									
									var level="<td data-field='last_modified'>"+leveldata[a].name+"</td>";
									$("#"+msg.response[i].id).append(level);
									break;
								}
								if(a==ss){
								
									var level="<td data-field='last_modified'>最低等</td>";
									$("#"+msg.response[i].id).append(level);
								}
							
							}*/
							
					}
					
					var f=rel_ar_sleeptimetotal/flight_datacol*100;
					var g=rel_ar_speedtotal/flight_datacol*100;
					var h=explosiveforce/flight_datacol*100;
					var j=sleeptimetotal/flight_datacol*100;
					var k=lineDIStotal/flight_datacol*100;
					var p=flight_datacol/10*100;//K
					console.log("j"+j);
					if(g>100){
						g=100;
					}
					else if(p>100)
					{
						p=100;
					}
					else if(h>100)
					{
						h=100;
					}
					else if(j>100)
					{
						j=100;
					}
					else if(k>100)
					{
						k=100;
					}
					
					var marksCanvas = document.getElementById("analyzeRadarChart");
					var marksData = {
						labels: ["爆發力", "導航力", "經驗", "專注力", "體力",],
							datasets: [{
								label: "素質分析",
								backgroundColor: "rgba(200,0,0,0.2)",
								pointHoverRadius: 10,
								radius: 6,
								pointRadius: 6,
								pointBorderWidth: 3,
								data: [h, k,p,j,g]
								}]
							};
							
					var chartOptions = {
					
						scale: {
							ticks: {
								max: 100,
								min:0,
								beginAtZero: true
							}
						}
						};	
	
radarChart = new Chart(marksCanvas, {
  type: 'radar',
  data: marksData,
  options: chartOptions
});
					load("analyzeTable");
				});	
			});		
	

$("#analyzeAppointTable tbody").on("dblclick","tr td:not(.delbutton)",function(){

			var id=$(this).parent().attr('id');
			console.log("id"+id);
			aaa(id,false);                  
    });
	
$("#analyzeAppointTable tbody").on("click","tr td:not(.delbutton)",function(){
			var analyzeID = $(this).parent().attr('id');
			$.ajax({
						 type: "POST",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/analyzeById",
						 data:{analyzeID:analyzeID}
					}).success(function(msg) {
					var rel_ar_sleeptimetotal=0;
					var rel_ar_speedtotal=0;
					var explosiveforce=0;
					var sleeptimetotal=0;
					var lineDIStotal=0;
					var flight_datacol=0;
					var timeresult=timecount(msg.response[0].total_time)-timecount(msg.response[0].sleeptimetotal);
							rel_ar_sleeptimetotal=rel_ar_sleeptimetotal+msg.response[0].rel_ar_sleeptime;
							rel_ar_speedtotal=rel_ar_speedtotal+msg.response[0].rel_ar_speed/100;//K
							//rel_ar_speedesttotal=rel_ar_speedesttotal+msg.response[0].rel_ar_speedest/100; //K
							explosiveforce=explosiveforce+msg.response[0].explosiveforce/10;//K
							sleeptimetotal=sleeptimetotal+timeresult/timecount(msg.response[0].total_time);
							lineDIStotal=lineDIStotal+msg.response[0].lineDIS/msg.response[0].distance;//K
							flight_datacol=flight_datacol+1;
					
					var f=rel_ar_sleeptimetotal/flight_datacol*100;
					var g=rel_ar_speedtotal/flight_datacol*100;
					var h=explosiveforce/flight_datacol*100;
					var j=sleeptimetotal/flight_datacol*100;
					var k=lineDIStotal/flight_datacol*100;
					var p=flight_datacol/10*100;//K
					if(g>100){
						g=100;
					}
					else if(p>100)
					{
						p=100;
					}
					else if(h>100)
					{
						h=100;
					}
					else if(j>100)
					{
						j=100;
					}
					else if(k>100)
					{
						k=100;
					}
					radarChart.data.datasets[0].data[0] = h;
					radarChart.data.datasets[0].data[1] = k;
					radarChart.data.datasets[0].data[2] = p;
					radarChart.data.datasets[0].data[3] = j;
					radarChart.data.datasets[0].data[4] = g;
					radarChart.update();			
					});              
    });	
	
var analyzeAppointid="";
$("#analyzeAppointTable tbody").on("click","tr td.delbutton",function(){
		console.log("fdddddgfg");
			 analyzeAppointid=$(this).parent().attr('id');
			$("#deldata").text("是否確認刪除該資料!!");
			$("#delectModal").modal('show');
			       
    });
	
	
$("#flightTable tbody").on("click","tr td.delbutton",function(){
		console.log("fdddddgfg");
			 analyzeAppointid=$(this).parent().attr('id');
			$("#deldata").text("是否確認刪除該資料!!");
			$("#delectModal").modal('show');
			       
    });

	$("#analyzeFlightDel").on("click",function(){
				$.ajax({
						 type: "POST",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/analyzeflightdel",
						 data:{id:analyzeAppointid}
					}).success(function(msg) {
							console.log(msg);
					});  
			
			});	 
	

	
	

$("#levelInsert").on("click",function(){
		console.log("fdddddgfg");
			var levelName=$("#levelName").val();
			var levelValue=$("#levelValue").val();
				$.ajax({
						 type: "POST",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/levelInsert",
						 data:{levelName:levelName,levelValue:levelValue}
					}).success(function(msg) {
							console.log(msg);
					});                      
    });

	
 $('#datetimepicker1').datetimepicker();
 $('#datetimepicker2').datetimepicker();	
 $('#datetimepicker3').datetimepicker();
	$.ajax({
						 type: "GET",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/leveldata"
					}).success(function(msg) {
						for(var i=0;i<msg.response.length;i++){
						leveldata[i]={name:msg.response[i].name,value:msg.response[i].value}
						}
					
					});
					

$("ul").on("click","li:eq(0)",function(){  
$.ajax({
						 type: "GET",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/flighttag"
					}).success(function(msg) {
					console.log(msg);
					$("#flightTable tbody").empty();
						for(var i=0;i<msg.response.length;i++){
							if(msg.response[i].gender=="1"){
								var gender="公";
							}else if(msg.response[i].gender=="2")
							{
								var gender="母";
							}else{
								var gender="未編輯";
							}
							
							var startdate= new Date(msg.response[i].start_time);
							var enddate = new Date(msg.response[i].end_time);
							var intdate1 =startdate.getFullYear()+"-"+addZero(startdate.getMonth()+1)+"-"+addZero(startdate.getDate())+" "+addZero(startdate.getHours())+":"+addZero(startdate.getMinutes())+":"+addZero(startdate.getSeconds());
							var intdate2 =enddate.getFullYear()+"-"+addZero(enddate.getMonth()+1)+"-"+addZero(enddate.getDate())+" "+addZero(enddate.getHours())+":"+addZero(enddate.getMinutes())+":"+addZero(enddate.getSeconds());
							
								var row = 
							"<tr class='data' id='"+msg.response[i].id+"'>"+
								"<td name='num' class='num' data-field='tag_uid'>"+i+"</td>"+
								"<td class='type' data-field='last_modified'>"+msg.response[i].dataType+"</td>"+
								"<td class='tag_uid' data-field='tag_uid'>"+msg.response[i].tag_uid+"</td>"+
								"<td class='start' data-field='last_modified'>"+intdate1+"</td>"+
								"<td class='end' data-field='last_modified'>"+intdate2+"</td>"+
								"<td class='total' data-field='last_modified'>"+msg.response[i].total_time+"</td>"+
								"<td class='gpsCount' data-field='last_modified'>"+msg.response[i].gpsDataCount+"</td>"+
								"<td class='name' data-field='last_modified'>"+msg.response[i].name+"</td>"+
								"<td class='gender' data-field='last_modified'>"+gender+"</td>"+
								"<td class='age' data-field='last_modified'>"+msg.response[i].age+"</td>"+
								"<td data-field='last_modified'><a href='#flightmapModal' role='button' class='btn btn-primary' data-toggle='modal' onclick=aaa('"+msg.response[i].id+"')>Open Map</a></td>"+
								"<td class='delbutton' data-field='last_modified' data-th='操作'><span class='btn btn-lg glyphicon glyphicon-remove-sign' ></span></td>"+
							"</tr>";
							$("#flightTable").append(row);
							/*for(var a=0;a<leveldata.length;a++){
							var ss =leveldata.length-1;
								if(msg.response[i].ar_speed>leveldata[a].value){
									if($("#"+msg.response[i].id).children().eq(12).text())
									{
										$("#"+msg.response[i].id).children().eq(12).text(leveldata[a].name);
									}
									else
									{
										var level="<td data-field='last_modified'>"+leveldata[a].name+"</td>";
										$("#"+msg.response[i].id).append(level);
									}

									break;
								}
								if(a==ss){
								
									var level="<td data-field='last_modified'>最低等</td>";
									$("#"+msg.response[i].id).append(level);
								}
							
							}*/
							
					}
					load("flightTable");
				});	
			});
			
			
$.ajax({
						 type: "GET",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/flighttag"
					}).success(function(msg) {
					
						for(var i=0;i<msg.response.length;i++){
							if(msg.response[i].gender=="1"){
								var gender="公";
							}else if(msg.response[i].gender=="2")
							{
								var gender="母";
							}else{
								var gender="未編輯";
							}
							
							var startdate= new Date(msg.response[i].start_time);
							var enddate = new Date(msg.response[i].end_time);
							var intdate1 =startdate.getFullYear()+"-"+addZero(startdate.getMonth()+1)+"-"+addZero(startdate.getDate())+" "+addZero(startdate.getHours())+":"+addZero(startdate.getMinutes())+":"+addZero(startdate.getSeconds());
							var intdate2 =enddate.getFullYear()+"-"+addZero(enddate.getMonth()+1)+"-"+addZero(enddate.getDate())+" "+addZero(enddate.getHours())+":"+addZero(enddate.getMinutes())+":"+addZero(enddate.getSeconds());
							
								var row = 
							"<tr class='data' id='"+msg.response[i].id+"'>"+
								"<td name='num' class='num' data-field='tag_uid'>"+i+"</td>"+
								"<td class='type' data-field='last_modified'>"+msg.response[i].dataType+"</td>"+
								"<td class='tag_uid' data-field='tag_uid'>"+msg.response[i].tag_uid+"</td>"+
								"<td class='start' data-field='last_modified'>"+intdate1+"</td>"+
								"<td class='end' data-field='last_modified'>"+intdate2+"</td>"+
								"<td class='total' data-field='last_modified'>"+msg.response[i].total_time+"</td>"+
								"<td class='gpsCount' data-field='last_modified'>"+msg.response[i].gpsDataCount+"</td>"+
								"<td class='name' data-field='last_modified'>"+msg.response[i].name+"</td>"+
								"<td class='gender' data-field='last_modified'>"+gender+"</td>"+
								"<td class='age' data-field='last_modified'>"+msg.response[i].age+"</td>"+
								"<td data-field='last_modified'><a  role='button' class='btn btn-primary' onclick=aaa('"+msg.response[i].id+"')>Open Map</a></td>"+
								"<td class='delbutton' data-field='last_modified' data-th='操作'><span class='btn btn-lg glyphicon glyphicon-remove-sign' ></span></td>"+
							"</tr>";
							$("#flightTable").append(row);
							for(var a=0;a<leveldata.length;a++){
							var ss =leveldata.length-1;
								if(msg.response[i].ar_speed>leveldata[a].value){
									
									if($("#"+msg.response[i].id).children().eq(12).text())
									{
										$("#"+msg.response[i].id).children().eq(12).text(leveldata[a].name);
									}
									else
									{
										var level="<td data-field='last_modified'>"+leveldata[a].name+"</td>";
										$("#"+msg.response[i].id).append(level);
									}


									break;
								}
								if(a==ss){
									console.log(a+" "+msg.response[i].id);
									var level="<td data-field='last_modified'>最低等</td>";
									$("#"+msg.response[i].id).append(level);
								}
							
							}
							
					}
					load("flightTable");
				});				
		});
		//分頁
load = function(tableId) {
	console.log("tableId"+tableId);
				window.tp = new Pagination('.paging-container', {
					itemsCount: 201,
					onPageSizeChange: function (ps) {
						console.log('changed to ' + ps);
					},
					onPageChange: function (paging) {
						//custom paging logic here
						console.log(paging);
						var start = paging.pageSize * (paging.currentPage - 1),
							end = start + paging.pageSize,
							$rows = $('#'+tableId).find('.data');

						$rows.hide();

						for (var i = start; i < end; i++) {
							$rows.eq(i).show();
						}
					}
				});
			}		

function aaa(K){
		console.log("K"+K);
		
		$.ajax({
						 type: "POST",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/flightmap",
						 data:{flightId:K}
					}).success(function(msg) {
						var qwe=Array();
						
						$(document).ready(function(){
						
						$("#mapdata").empty();
								var map="<div id='mainmap'></div>"+
						"<div id='right-panel'>"+
						"<div id='heightest'></div>"+
						"<div id='speedest'></div>"+
						"<div id='speed'></div>"+
						"<div id='height'></div>"+
						"<div id='DIStotal'></div>"+
						"<div id='dateS'></div>"+
						"<div id='dateE'></div>"+
						"<div id='Timetotal'></div>"+
						"<div style='width:300px;height:300px'><canvas id='myChart'></canvas></div>";
						$("#mapdata").append(map);
							mapGenerate(msg);
							});
							$('#flightmapModal').modal();
							
					});
}
function searchflight(){
		var flightdate="";
		if($('#datetimepicker1').data("DateTimePicker").date()){
		flightdate = $('#datetimepicker1').data("DateTimePicker").date().format();
		}
		var flightUID = $('#flightUID').val();
				$.ajax({
						 type: "POST",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/flightdatasearch",
						 data:{ flightdate:flightdate,
								flightUID:flightUID}
					}).success(function(msg) {
					console.log("ddddda"+msg.response.length);
							$('#flightTable tbody').empty();

							for(var i=0;i<msg.response.length;i++){
								console.log("msg.response"+msg.response[i]);
								console.log("msg.response"+msg.response[i].tag_uid);
								console.log("msg.response"+msg.response[i].gender);
								console.log("msg.response"+msg.response[i].age);
								
							var startdate= new Date(msg.response[i].start_time);
							var enddate = new Date(msg.response[i].end_time);
							var intdate1 =startdate.getFullYear()+"-"+addZero(startdate.getMonth()+1)+"-"+addZero(startdate.getDate())+" "+addZero(startdate.getHours())+":"+addZero(startdate.getMinutes())+":"+addZero(startdate.getSeconds());
							var intdate2 =enddate.getFullYear()+"-"+addZero(enddate.getMonth()+1)+"-"+addZero(enddate.getDate())+" "+addZero(enddate.getHours())+":"+addZero(enddate.getMinutes())+":"+addZero(enddate.getSeconds());
							
								var row = 
							"<tr class='data' id='"+msg.response[i].id+"'>"+
								"<td data-field='tag_uid'>"+i+"</td>"+
								"<td class='type' data-field='last_modified'>"+msg.response[i].dataType+"</td>"+
								"<td class='tag_uid' data-field='tag_uid'>"+msg.response[i].tag_uid+"</td>"+
								"<td class='start' data-field='last_modified'>"+intdate1+"</td>"+
								"<td class='end' data-field='last_modified'>"+intdate2+"</td>"+
								"<td class='total' data-field='last_modified'>"+msg.response[i].total_time+"</td>"+
								"<td class='gpsCount' data-field='last_modified'>"+msg.response[i].gpsDataCount+"</td>"+
								"<td class='name' data-field='last_modified'>"+msg.response[i].name+"</td>"+
								"<td data-field='last_modified'>"+msg.response[i].gender+"</td>"+
								"<td data-field='last_modified'>"+msg.response[i].age+"</td>"+
								"<td data-field='last_modified'><a role='button' class='btn btn-primary'  onclick=aaa('"+msg.response[i].id+"')>Open Map</a></td>"+
								"<td class='delbutton' data-field='last_modified' data-th='操作'><span class='btn btn-lg glyphicon glyphicon-remove-sign' ></span></td>"+
							"</tr>";
							$("#flightTable").append(row);
							for(var a=0;a<leveldata.length;a++){
							var ss =leveldata.length-1;
								if(msg.response[i].ar_speed>leveldata[a].value){
									console.log(leveldata[a].name);
									var level="<td data-field='last_modified'>"+leveldata[a].name+"</td>";
									$("#"+msg.response[i].id).append(level);
									break;
								}
							
								if(a==ss){
								
									var level="<td data-field='last_modified'>最低等</td>";
									$("#"+msg.response[i].id).append(level);
								}
							}
							
					}	
					
					
					
					});
		

}
var _map=null;

function mapGenerate (msg){


							$('#flightmapModal').on('shown.bs.modal', function(){
							msg.response.reverse();
						console.log('shown.bs.modal');

						var startdate =new Date(msg.flightresponse[0].start_time);
						var enddate =new Date(msg.flightresponse[0].end_time);
						var intdate1 =startdate.getFullYear()+"-"+addZero(startdate.getMonth()+1)+"-"+addZero(startdate.getDate())+" "+addZero(startdate.getHours())+":"+addZero(startdate.getMinutes())+":"+addZero(startdate.getSeconds());
						var intdate2 =enddate.getFullYear()+"-"+addZero(enddate.getMonth()+1)+"-"+addZero(enddate.getDate())+" "+addZero(enddate.getHours())+":"+addZero(enddate.getMinutes())+":"+addZero(enddate.getSeconds());
						$('#speed').text("平均時速:"+msg.flightresponse[0].ar_speed+"km/h");
							$('#height').text("平均高度:"+msg.flightresponse[0].ar_height+"m");
							$('#heightest').text("最高高度:"+msg.flightresponse[0].heightest+"m");
							$('#speedest').text("最快時速:"+msg.flightresponse[0].speedest+"km/h");
							$('#DIStotal').text("總長:"+msg.flightresponse[0].distance+"km");
							$('#dateS').text("起始時間:"+intdate1);
							$('#dateE').text("終止時間:"+intdate2);
							$('#Timetotal').text("總時間:"+msg.flightresponse[0].total_time);
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
						console.log("_map_map"+_map);
					//	if(_map==null)
					//	{
						console.log("RRRRRRRRRRRRRrrr");
						_map = new L.Map('mainmap', { center: latlng, zoom: 10, layers: [glayer_normal] });
						var baseLayers = {
						"普通地圖": glayer_normal,
						"衛星地圖": glayer_satelite,
						"混合地圖":glayer_marker,
						"高德地圖":glayer_Godelnormal,
						"百度地圖":glayer_Bainormal,
						"百度衛星":glayer_Baisatelite
						
					};	
					var controllayers = L.control.layers(baseLayers);
								
						controllayers.addTo(_map);
					/*	}
						else
						{
						
						//_map.removeLayer(markerGroup);
						_map.eachLayer(function(layer){
						console.log(layer);
						console.log(layer._leaflet_id);
					if(layer._animatedPathClass=="leaflet-ant-path"||layer._leaflet_id==80)
									_map.removeLayer(markerGroup);
						})
						}*/

					var markerGroup=L.layerGroup().addTo(_map);
					console.log('ddddddddddd');
						_map.on('baselayerchange', function(e) { 
						alert('changed'+e.name); 
						if(e.name=="百度地圖"||e.name=="百度衛星"){
						alert('changedBAI'); 
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


						LatLogMapDraw(msg,markerGroup,false);


						
	
							
							});
$('#flightmapModal').on('hidden.bs.modal', function(){

						var container = L.DomUtil.get('mainmap');
						if(container!=null)
						{
						console.log('_mapremove');
						mainmap.remove();
						_map.remove();
						_map.off();
						_map=null;
						/*container._leaflet_id= null;
						//$("#mapdata").empty();
						_map.remove();
						$("#mainmap").html("");
						$("#preMap").empty();
						_map.off();
						delete _map;*/
						//_map=null;
						console.log(_map);
							
						}
});

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

			

function linepage(){
console.log("AAAAAAADDDDDDDDD");
var dd=0;
$.ajax({
						 type: "GET",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/chartspage"
					})
					.success(function(msg) {
					$('#chartpage').empty();
					var speedbar=Array();
					var speedestbar=Array();
					var heightbar=Array();
					var heightestbar=Array();
					var chartstate=Array();
					var chartdate=Array();
					var speedstate=Array();
					var chartnum=Array();
					console.log("msg"+msg.response.length);
					for(var i=0;i<msg.response.length;i++){
					
					var startdate =new Date(msg.response[i].start_time);
					var intdate1 =startdate.getFullYear()+"-"+addZero(startdate.getMonth()+1)+"-"+addZero(startdate.getDate())+" "+addZero(startdate.getHours())+":"+addZero(startdate.getMinutes())+":"+addZero(startdate.getSeconds());
					speedbar.push(msg.response[i].ar_speed);
					speedestbar.push(msg.response[i].speedest);
					chartdate.push(intdate1);
					heightbar.push(msg.response[i].ar_height);
					heightestbar.push(msg.response[i].heightest);
					for(var a=0;a<leveldata.length;a++){
							var ss =leveldata.length-1;
								if(msg.response[i].ar_speed>leveldata[a].value){
									
									chartstate.push(leveldata[a].name);
									break;
								}
								if(a==ss){
								
									chartstate.push("最低等");
								}
							
							}
					}
					var CHdeduped=Array.from( new Set(chartstate));
					for(var w=0;w<chartstate.length;w++){
						for(var q=0;q<CHdeduped.length;q++){
							if(CHdeduped[q]==chartstate[w]){
							
							if(!chartnum[q]){
								console.log("q"+q);
								chartnum.push(1);
								console.log("chartnum"+chartnum);
							}else{
							console.log("chartnum[q]"+chartnum[q]);
								chartnum[q]=chartnum[q]+1;
							}
						}
						}
					}
					console.log("chartnum"+chartnum);
					console.log("CHdeduped"+CHdeduped);
					var row=
"<div class='col-md-5' id='speedbar'><canvas id='speedbarChart'></canvas></div>"+					
"<div class='col-md-5' id='speedestbar'><canvas id='speedestChart'></canvas></div>"+
"<div class='col-md-5' id='heightbar'><canvas id='heightbarChart'></canvas></div>"+
"<div class='col-md-5' id='heightestbar'><canvas id='heightestChart'></canvas></div>"+
"<div class='col-md-5' id='statepie'><canvas id='stateChart'></canvas></div>";
					$("#chartpage").append(row);
					var speedctx = document.getElementById('speedbarChart').getContext('2d');
					var speedestctx = document.getElementById('speedestChart').getContext('2d');
					var heightctx = document.getElementById('heightbarChart').getContext('2d');
					var heightestctx = document.getElementById('heightestChart').getContext('2d');
					var statectx = document.getElementById('stateChart').getContext('2d');
					var speedbarchart = new Chart(speedctx, {
					type: 'bar',
							// The data for our dataset
							data: {
								labels: chartdate,
								datasets: [{
												label: "平均速度",
												backgroundColor: 'rgb(151,187,205)',
												borderColor: 'rgb(151,187,205)',
												data: speedbar,
											}]
									}
					});
					
					var speedestbarchart = new Chart(speedestctx, {
					type: 'bar',
							// The data for our dataset
							data: {
								labels: chartdate,
								datasets: [{
												label: "最高速度",
												backgroundColor: 'rgb(220,220,220)',
												borderColor: 'rgb(220,220,220)',
												data: speedestbar,
											}]
									}
					});	
					var heightbarchart = new Chart(heightctx, {
					type: 'bar',
							// The data for our dataset
							data: {
								labels: chartdate,
								datasets: [{
												label: "平均高度",
												backgroundColor: 'rgb(220,220,220)',
												borderColor: 'rgb(220,220,220)',
												data: heightbar,
											}]
									}
					});
					var heightestbarchart = new Chart(heightestctx, {
					type: 'bar',
							// The data for our dataset
							data: {
								labels: chartdate,
								datasets: [{
												label: "最高高度",
												backgroundColor: 'rgb(220,220,220)',
												borderColor: 'rgb(220,220,220)',
												data: heightestbar,
											}]
									}
					});
					var statepiechart = new Chart(statectx, {
					type: 'pie',
							// The data for our dataset
							data: {
								labels: CHdeduped,
								datasets: [{
												label: "等級",
												backgroundColor: 'rgb(151,187,205)',
												borderColor: 'rgb(255,255,255)',
												data: chartnum,
											}]
									}
					});

})

}

function searchflightchart(){
		var flightdate="";
		if($('#datetimepicker2').data("DateTimePicker").date()){
		flightdate = $('#datetimepicker2').data("DateTimePicker").date().format();
		}
		var flightUID = $('#flightchartsUID').val();
				$.ajax({
						 type: "POST",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/flightdatasearch",
						 data:{ flightdate:flightdate,
								flightUID:flightUID}
					}).success(function(msg) {
					console.log("ddddda"+msg.response.length);
							$('#chartpage').empty();
							var speedbar=Array();
					var speedestbar=Array();
					var heightbar=Array();
					var heightestbar=Array();
					var chartstate=Array();
					var chartdate=Array();
					var speedstate=Array();
					var chartnum=Array();
					console.log("msg"+msg.response.length);
					for(var i=0;i<msg.response.length;i++){
					var startdate =new Date(msg.response[i].start_time);
					var intdate1 =startdate.getFullYear()+"-"+addZero(startdate.getMonth()+1)+"-"+addZero(startdate.getDate())+" "+addZero(startdate.getHours())+":"+addZero(startdate.getMinutes())+":"+addZero(startdate.getSeconds());
					speedbar.push(msg.response[i].ar_speed);
					speedestbar.push(msg.response[i].speedest);
					chartdate.push(intdate1);
					heightbar.push(msg.response[i].ar_height);
					heightestbar.push(msg.response[i].heightest);
					for(var a=0;a<leveldata.length;a++){
							var ss =leveldata.length-1;
								if(msg.response[i].ar_speed>leveldata[a].value){
									
									chartstate.push(leveldata[a].name);
									break;
								}
								if(a==ss){
								
									chartstate.push("最低等");
								}
							
							}
					}
					var CHdeduped=Array.from( new Set(chartstate));
					for(var w=0;w<chartstate.length;w++){
						for(var q=0;q<CHdeduped.length;q++){
							if(CHdeduped[q]==chartstate[w]){
							
							if(!chartnum[q]){
								console.log("q"+q);
								chartnum.push(1);
								console.log("chartnum"+chartnum);
							}else{
							console.log("chartnum[q]"+chartnum[q]);
								chartnum[q]=chartnum[q]+1;
							}
						}
						}
					}
					console.log("chartnum"+chartnum);
					console.log("CHdeduped"+CHdeduped);
					var row=
"<div class='col-md-6' id='speedbar'><canvas id='speedbarChart'></canvas></div>"+					
"<div class='col-md-6' id='speedestbar'><canvas id='speedestChart'></canvas></div>"+
"<div class='col-md-6' id='heightbar'><canvas id='heightbarChart'></canvas></div>"+
"<div class='col-md-6' id='heightestbar'><canvas id='heightestChart'></canvas></div>"+
"<div class='col-md-6' id='statepie'><canvas id='stateChart'></canvas></div>";
					$("#chartpage").append(row);
					var speedctx = document.getElementById('speedbarChart').getContext('2d');
					var speedestctx = document.getElementById('speedestChart').getContext('2d');
					var heightctx = document.getElementById('heightbarChart').getContext('2d');
					var heightestctx = document.getElementById('heightestChart').getContext('2d');
					var statectx = document.getElementById('stateChart').getContext('2d');
					var speedbarchart = new Chart(speedctx, {
					type: 'bar',
							// The data for our dataset
							data: {
								labels: chartdate,
								datasets: [{
												label: "平均速度",
												backgroundColor: 'rgb(151,187,205)',
												borderColor: 'rgb(151,187,205)',
												data: speedbar,
											}]
									}
					});
					
					var speedestbarchart = new Chart(speedestctx, {
					type: 'bar',
							// The data for our dataset
							data: {
								labels: chartdate,
								datasets: [{
												label: "最高速度",
												backgroundColor: 'rgb(220,220,220)',
												borderColor: 'rgb(220,220,220)',
												data: speedestbar,
											}]
									}
					});	
					var heightbarchart = new Chart(heightctx, {
					type: 'bar',
							// The data for our dataset
							data: {
								labels: chartdate,
								datasets: [{
												label: "平均高度",
												backgroundColor: 'rgb(220,220,220)',
												borderColor: 'rgb(220,220,220)',
												data: heightbar,
											}]
									}
					});
					var heightestbarchart = new Chart(heightestctx, {
					type: 'bar',
							// The data for our dataset
							data: {
								labels: chartdate,
								datasets: [{
												label: "最高高度",
												backgroundColor: 'rgb(220,220,220)',
												borderColor: 'rgb(220,220,220)',
												data: heightestbar,
											}]
									}
					});
					var statepiechart = new Chart(statectx, {
					type: 'pie',
							// The data for our dataset
							data: {
								labels: CHdeduped,
								datasets: [{
												label: "等級",
												backgroundColor: 'rgb(151,187,205)',
												borderColor: 'rgb(255,255,255)',
												data: chartnum,
											}]
									}
					});
					});
		
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
						
						var ctx = document.getElementById('myChart').getContext('2d');
						var chart = new Chart(ctx, {
							// The type of chart we want to create
							type: 'line',

							// The data for our dataset
							data: {
								labels: linelabel,
								datasets: [{
												label: "speed(km/h)",
												backgroundColor: 'rgb(151,187,205)',
												borderColor: 'rgb(151,187,205)',
												fill:false,
												data: linedata,
											}]
									},

									// Configuration options go here
							options: {scales: {
            yAxes: [{
                stacked: true
            }]
        }}
						});
						//console.log("linedata"+linedata);
						/*	var polygon = L.polygon([
                [25.069, 121.489],
                [25.0697, 121.488],
                [25.071, 121.489],
                [25.071, 121.491],
                [25.069, 121.491]
            ], {showMeasurements: true})
            .addTo(_map);*/
						

				
				

	  }	


function timecount(Stime){
					console.log("Stime"+Stime);
					var time=Stime.split(':');
					var times = parseInt(time[0])*3600+parseInt(time[1])*60+parseInt(time[2]);
					return times;
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

function addZero(n){
 return n < 10 ? '0' + n : '' + n;
}
	  
	  
function tableuupdate(tableId,tabledata){


$("#"+tableId+" tbody").on("dblclick","tr td",function(){
	//window.$currEditing=$(this).parents(".data").attr("id");
	//alert(currEditing);
        if(!$(this).is('.input')&&$(this).attr("class")!="tag_uid"&&$(this).attr("class")!="num"){    
            $(this).addClass('input').html('<input type="text" value="'+ $(this).text() +'" />').find('input').focus().blur(function(){
                var thisid = $(this).parents(".data").attr("id"); 
                var thisvalue=$(this).val();    
                var thisclass = $(this).parent("td").attr("class"); 
				$.ajax({
						 type: "POST",
						 url: location.protocol+"//"+location.hostname+":3000/map/v1/"+tabledata,
						 data:{thisid:thisid,thisvalue:thisvalue,thisclass:thisclass}
					}).success(function(msg) {
							console.log(msg);
					});
				
                $(this).parent().removeClass('input').html($(this).val() || 0);    
            });                        
        }    
    }).hover(function(){    
        $(this).addClass('hover');    
    }),function(){    
        $(this).removeClass('hover');
}	
}
	