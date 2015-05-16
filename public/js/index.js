 var serverBaseUrl = document.domain+":9004";
function init() {

	
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
		
		//position column
		$("#"+readerObj.reader_name+" td:nth-child(2)").text(readerObj.position);
		
		//tag name column
		$("#"+readerObj.reader_name+" td:nth-child(3)").text(readerObj.tag_name);
		
		//tag uid column
		$("#"+readerObj.reader_name+" td:nth-child(4)").text(readerObj.tag_uid);
		
		//strength column
		$("#"+readerObj.reader_name+" td:nth-child(5)").text(readerObj.strength);
		
		//created at column
		$("#"+readerObj.reader_name+" td:nth-child(6)").text(readerObj.created_at);
		
	});	

	$.ajax({
		 type: "GET",
		 url: "http://10.1.1.130:9004/2.4/v1/readers ",
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

}

$(document).on('ready', init);

