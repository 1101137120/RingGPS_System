 var serverBaseUrl = document.domain+":9004";
function init() {

	console.log("server base url:"+"http://"+serverBaseUrl);
	var socket = io.connect("http://"+serverBaseUrl);

	socket.on('connect', function () {


	});	

	socket.on("channel1", function (readerObj) {
		console.log("2.4頁面receive"+JSON.stringify(readerObj));
 		console.log("get the reader name:"+readerObj.reader_name);	
		
		$("table tr").css('background','#FFFFFF');
		console.log("did I get readerTable:"+$("#readerTable").length);
		//adding color
		$("#"+readerObj.reader_name).css('background-color','#FFE700');
		if(readerObj.wrong_packet ==="1")
		{
			$("#"+readerObj.reader_name).css('background-color','#FF0000');
		
		}
		console.log("position:"+readerObj.position);
		//position column
		$("#"+readerObj.tag_uid+" td:nth-child(4)").text(readerObj.position);
		
		var date = new Date(readerObj.created_at);
		var formatDate = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+" "
		+addZero(date.getHours()) + ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds()); 
		
		$("#"+readerObj.tag_uid+" td:nth-child(5)").text(formatDate);
		$("#"+readerObj.tag_uid).css('background-color','#FFE700');
		//tag name column
		//$("#"+readerObj.reader_name+" td:nth-child(3)").text(readerObj.tag_name);
		
/* 		//tag uid column
		$("#"+readerObj.reader_name+" td:nth-child(4)").text(readerObj.tag_uid);
		
		//strength column
		$("#"+readerObj.reader_name+" td:nth-child(5)").text(readerObj.strength);
		
		
		var date = new Date(readerObj.created_at);
		var formatDate = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+" "
		+addZero(date.getHours()) + ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds());                                
		
		//created at column
		$("#"+readerObj.reader_name+" td:nth-child(6)").text(formatDate);
		 */
		
		
		
	});


	var protocol = location.protocol;
	var hostname = location.hostname;
	$.ajax({
		 type: "GET",
		 //url: "http://10.1.1.77:9004/2.4/v1/readers ",
		 //url: "http://1.163.240.170:9004/2.4/v1/readers ",
		 url: protocol+"//"+hostname+":9004/2.4/v1/department/tags",
	})
	.success(function( msg ) {
		// alert(JSON.stringify(msg));
		//msg.response
		
		var readerArray = msg.response;
		
		var tables = "";
		for(var i=0;i<readerArray.length;i++)
		{
			console.log("部門："+readerArray[i].department);
			tables += 
				"<h1>"+readerArray[i].department+"</h1><br>"+
				"<table id='"+readerArray[i].department+"' class='table'>"+
					"<thead>"+
						"<tr>"+
							"<th data-field='tag_id'>TAG ID</th>"+
							"<th data-field='tag_name'>TAG 名稱</th>"+
							"<th data-field='tag_uid'>TAG UID</th>"+
							"<th data-field='newest_position'>最新位置</th>"+
							"<th data-field='last_modified'>最後更新時間</th>"+
						"</tr>"+
					"</thead>"+
					"<tbody>"+
						
					"</tbody>"+
				"</table><br/>";			
		
		
		}
		$("#table_area").append(tables);
		var currenttime = new Date();
		for(var i=0;i<readerArray.length;i++)
		{		
			
			for(var j=0;j<readerArray[i].data.length;j++)
			{
				if(readerArray[i].data[j].tag_name.trim() !== "")
				{
					var row = 
						"<tr id='"+readerArray[i].data[j].tag_uid+"'>"+
							"<td data-field='tag_id'>"+readerArray[i].data[j].id+"</td>"+
							"<td data-field='tag_name'>"+readerArray[i].data[j].tag_name+"</td>"+
							"<td data-field='tag_uid'>"+readerArray[i].data[j].tag_uid+"</td>"+
							"<td data-field='newest_position'></td>"+
							"<td data-field='last_modified'></td>"+
						"</tr>";
					$("#"+readerArray[i].department+" tbody").append(row);
					var tag_id = readerArray[i].data[j].id;
					var tag_uid = readerArray[i].data[j].tag_uid;		
					(function(tag_uid){
						$.ajax({
							 type: "POST",
							 url: protocol+"//"+hostname+":9004/2.4/v1/tag_position",
							 data:{tag_id:tag_id}
						})
						.success(function(msg) {
							//alert(JSON.stringify(msg));
							// console.log("tag id:"+JSON.stringify(msg.response[0].position));
							console.log("tag_uid:"+tag_uid);
							$("#"+tag_uid+" td:nth-child(4)").text(msg.response[0].position);

							var date = new Date(msg.response[0].created_at);
							
							
							var diff = Math.abs(currenttime - date);
							
							if(diff > 1000 * 60 * 10)
							{
								$("#"+tag_uid).remove();
							
							
							}
							
							
							
							var formatDate = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+" "
							+addZero(date.getHours()) + ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds()); 
							
							$("#"+tag_uid+" td:nth-child(5)").text(formatDate);
							

						})
						.fail(function() {
								console.log("error");
						})
						.always(function() {
								console.log("complete")
						});					
					
					})(tag_uid);		
				}
			}
		}
		
///////////////////////		
/* 		console.log("readerArray:"+JSON.stringify(readerArray));
		for(var i=0;i<readerArray.length;i++)
		{
			if(readerArray[i].tag_name.trim() !== "")
			{
				var row = 
					"<tr id='"+readerArray[i].tag_uid+"'>"+
						"<td data-field='tag_id'>"+readerArray[i].id+"</td>"+
						"<td data-field='tag_name'>"+readerArray[i].tag_name+"</td>"+
						"<td data-field='tag_uid'>"+readerArray[i].tag_uid+"</td>"+
						"<td data-field='newest_position'></td>"+
						"<td data-field='last_modified'></td>"+
					"</tr>";
				$("#readerTable tbody").append(row);
				var tag_id = readerArray[i].id;
				var tag_uid = readerArray[i].tag_uid;
				
				(function(tag_uid){
					$.ajax({
						 type: "POST",
						 url: protocol+"//"+hostname+":9004/2.4/v1/tag_position",
						 data:{tag_id:tag_id}
					})
					.success(function(msg) {
						//alert(JSON.stringify(msg));
						// console.log("tag id:"+JSON.stringify(msg.response[0].position));
						console.log("tag_uid:"+tag_uid);
						$("#"+tag_uid+" td:nth-child(4)").text(msg.response[0].position);

						var date = new Date(msg.response[0].created_at);
						var formatDate = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+" "
						+addZero(date.getHours()) + ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds()); 
						
						$("#"+tag_uid+" td:nth-child(5)").text(formatDate);
						

					})
					.fail(function() {
							console.log("error");
					})
					.always(function() {
							console.log("complete")
					});					
				
				})(tag_uid);				
			}


			
			
			
		
			
			
			
			
			

		
		} */
		
		
	

	})
	.fail(function() {
			console.log("error");
	})
	.always(function() {
			console.log("complete")
	});

}
function addZero(n){
 return n < 10 ? '0' + n : '' + n;
}
$(document).on('ready', init);
