 var serverBaseUrl = document.domain+":9004";
 var intervalArray = [];
function init() {

	console.log("server base url:"+"http://"+serverBaseUrl);
	var socket = io.connect("http://"+serverBaseUrl);

	socket.on('connect', function () {


	});	

	socket.on("channel1", function (readerObj) {
		// console.log("2.4頁面receive"+JSON.stringify(readerObj));
 		// console.log("get the reader name:"+readerObj.reader_name);	
		
		//$("#readerTable tr").css('background','#FFFFFF');
		// console.log("did I get readerTable:"+$("#readerTable").length);
		//adding color
		$("#"+readerObj.reader_name).css('background-color','#FFE700');
		if(readerObj.wrong_packet ==="1")
		{
			$("#"+readerObj.reader_name).css('background-color','#FF0000');
		
		}
		console.log("position:"+readerObj.position);
		$("#"+readerObj.tag_uid+" td:nth-child(4)").text(readerObj.strength);
		//position column
		
		console.log("channel send position:"+$("#"+readerObj.tag_uid+" td:nth-child(5)").text());
		var tag_name = $("#"+readerObj.tag_uid+" td:nth-child(2)").text();
		var tag_uid = $("#"+readerObj.tag_uid+" td:nth-child(3)").text();
		var position = $("#"+readerObj.tag_uid+" td:nth-child(5)").text();
		console.log("channel tag_name:"+tag_name);
		console.log("channel position:"+position);
		console.log("len:"+$("#"+readerObj.tag_uid+"").length);
		$("#"+readerObj.tag_uid+" td:nth-child(5)").text(readerObj.position);
		if($("#"+readerObj.tag_uid+"").length != 0)
		{
			if(position !== readerObj.position)
			{
			
				// alert("有重新算, text"+$("#"+readerObj.tag_uid+" td:nth-child(5)").val()+", new position:"+readerObj.position);
				//過10秒重新算
				clearInterval(intervalArray[tag_name]);
				delete intervalArray[tag_name];
				setTimeout(function(){
					console.log();
					
						
							// var tag_name = 'Jenny';
							
							console.log("in the setinterval");
							console.log("tag_name:"+tag_name);
							$.ajax({
								 type: "POST",
								 url: protocol+"//"+hostname+":9004/2.4/v1/duringtest",
								 data:{tag_name:tag_name}
							})
							.success(function(msg) {
								console.log("msg:"+JSON.stringify(msg));
								var ojb = JSON.parse(msg)
								console.log("ojb.response[0]:"+ojb.response[0].during);
								// $("#"+tag_uid+" td:nth-child(7)").text(ojb.response[0].during);
								var minCreated = ojb.response[0].minCreated;
								intervalArray[tag_name] = 
								
								
									setInterval(function(){
										// console.log("minCreated:"+minCreated);
										
										
										if(minCreated !== "1970-01-01 08:00:00")
										{
											var minTime = new Date(minCreated);
											// var currentTime = new Date();
											// var left_time = (currentTime.getTime() - minTime.getTime())/1000/60;
											var today = new Date(ojb.response[0].minCreated);
											var Christmas = new Date();
											var diffMs = (Christmas - today); // milliseconds between now & Christmas
											var diffDays = Math.floor(diffMs / 86400000); // days
											
											
											
											var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
											var diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
											var diffresult = diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes ";										
 											if(diffMs > 1000 * 60 * 5)
											{
											
												$("#"+tag_uid).css('background-color','#C3EEE7');
											}
											else
											{
													$("#"+tag_uid).css('background-color','#dfdfdf');
											
											
											}	 										
											// console.log(diffresult);									
											$("#"+tag_uid+" td:nth-child(7)").text(diffresult);
										
										}

										
									
									
									},1000);							

							})
							.fail(function(error) {
									console.log("error:"+JSON.stringify(error));
							})
							.always(function() {
									console.log("complete")
							});							

									
				
				
				
				
				
				
				},10000);
			
			}	
			else
			{
				//clearInterval(intervalArray[tag_name]);
				console.log("!!!clearInterval:"+intervalArray[tag_name]);
				console.log("!!!clearInterval tag_name:"+tag_name);			
			
			}
		
		
		}
		else
		{

		}


		
		
		
		var date = new Date(readerObj.created_at);
		var formatDate = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+" "
		+addZero(date.getHours()) + ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds()); 
		
		$("#"+readerObj.tag_uid+" td:nth-child(6)").text(formatDate);
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
		 url: protocol+"//"+hostname+":9004/2.4/v1/tags",
	})
	.success(function( msg ) {
		//alert(JSON.stringify(msg));
		//msg.response
		
		var readerArray = msg.response;
		console.log("readerArray:"+JSON.stringify(readerArray));
		for(var i=0;i<readerArray.length;i++)
		{
			if(readerArray[i].tag_name.trim() !== "")
			{
				var comment = "";
				console.log("comment:"+readerArray[i].comment);
 				if(readerArray[i].comment !== null)
				{
				
					comment = readerArray[i].comment;
				
				} 

				
				var row = 
					"<tr id='"+readerArray[i].tag_uid+"'>"+
						"<td data-field='tag_id'>"+readerArray[i].id+"</td>"+
						"<td data-field='tag_name'>"+readerArray[i].tag_name+"</td>"+
						"<td data-field='tag_uid'>"+readerArray[i].tag_uid+"</td>"+
						
						"<td data-field='tag_strength'></td>"+						
						"<td data-field='newest_position'></td>"+
						"<td data-field='last_modified'></td>"+
						"<td data-field='during'></td>"+
						"<td data-field='tag_comment'>"+comment+"</td>"+
					"</tr>";
				$("#readerTable tbody").append(row);
				
				
				
				
				var tag_id = readerArray[i].id;
				var tag_uid = readerArray[i].tag_uid;
				var tag_name = readerArray[i].tag_name;
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
						$("#"+tag_uid+" td:nth-child(5)").text(msg.response[0].position);

						var date = new Date(msg.response[0].created_at);
						var formatDate = date.getFullYear() + "-"+addZero(date.getMonth()+1)+"-"+addZero(date.getDate())+" "
						+addZero(date.getHours()) + ":" + addZero(date.getMinutes())+":"+addZero(date.getSeconds()); 
						
						$("#"+tag_uid+" td:nth-child(6)").text(formatDate);
						


					})
					.fail(function() {
							console.log("error");
					})
					.always(function() {
							console.log("complete")
					});					
				
				})(tag_uid);
/*      					(function(tag_uid,tag_name){
						// var tag_name = 'Jenny';
						setInterval(function(){
							console.log("in the setinterval");
							console.log("tag_name:"+tag_name);
							$.ajax({
								 type: "POST",
								 url: protocol+"//"+hostname+":9004/2.4/v1/duringtest",
								 data:{tag_name:tag_name}
							})
							.success(function(msg) {
								console.log("msg:"+JSON.stringify(msg));
								var ojb = JSON.parse(msg)
								console.log("ojb.response[0]:"+ojb.response[0].during);
								$("#"+tag_uid+" td:nth-child(7)").text(ojb.response[0].during);

							})
							.fail(function(error) {
									console.log("error:"+JSON.stringify(error));
							})
							.always(function() {
									console.log("complete")
							});							
						
						
						
						
						},60000);	 		
					
					
					
					
					
					
					})(tag_uid,tag_name); 	*/			
	
					(function(tag_uid,tag_name){
						// var tag_name = 'Jenny';

						console.log("in the setinterval");
						console.log("tag_name:"+tag_name);
						$.ajax({
							 type: "POST",
							 url: protocol+"//"+hostname+":9004/2.4/v1/duringtest",
							 data:{tag_name:tag_name}
						})
						.success(function(msg) {
							console.log("msg:"+JSON.stringify(msg));
							var ojb = JSON.parse(msg)
							console.log("ojb.response[0]:"+ojb.response[0].during);
							// $("#"+tag_uid+" td:nth-child(7)").text(ojb.response[0].during);
							var minCreated = ojb.response[0].minCreated;
							intervalArray[tag_name] = 
							
							
								setInterval(function(){
									// console.log("minCreated:"+minCreated);
									
									
									if(minCreated !== "1970-01-01 08:00:00")
									{
										var minTime = new Date(minCreated);
										// var currentTime = new Date();
										// var left_time = (currentTime.getTime() - minTime.getTime())/1000/60;
										var today = new Date(ojb.response[0].minCreated);
										var Christmas = new Date();
										var diffMs = (Christmas - today); // milliseconds between now & Christmas
										var diffDays = Math.floor(diffMs / 86400000); // days
										
										
										
										var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
										var diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
										var diffresult = diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes ";										
 										if(diffMs > 1000 * 60 * 5)
										{
										
												$("#"+tag_uid).css('background-color','#C3EEE7');
										}
										else
										{
												$("#"+tag_uid).css('background-color','#dfdfdf');
										
										
										} 
										// console.log(diffresult);									
										$("#"+tag_uid+" td:nth-child(7)").text(diffresult);
									
									}

									
								
								
								},1000);	

							console.log("what the hell to the interval array:"+intervalArray[tag_name]);								
/* 							(function(minCreated){
								setInterval(function(){
									console.log("minCreated:"+minCreated);
								
								
								
								
								},1000);							
							
							
							})(minCreated); */
							
							
							

						})
						.fail(function(error) {
								console.log("error:"+JSON.stringify(error));
						})
						.always(function() {
								console.log("complete")
						});							
						
						

					
					
					
					
					
					})(tag_uid,tag_name);  
				
				
				
			
			}


			
			
			
		
			
			
			
			
			

		
		}
		
		
	

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

