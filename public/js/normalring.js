var serverBaseUrl = document.domain + ":3000";

var protocol = location.protocol;
var hostname = location.hostname;
function init() {
    

}
var autoLocalTimeInterval = null; 
$(document).ready(function () {

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
                type: "POST",
                url: protocol + "//" + hostname + ":3000/2.4/v1/closePort"
               
            })
	.success(function (msg) {
                if(msg.status=="error")
					alert(msg.message);
					else
					{
					$('#ringlinkicon').attr('glyphicon glyphicon-remove-circle');
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
    
    
    $('#readTrack').on("click", function () {
        
        var ringPassword = $('#exampleInputAmount').val();
		var GPSTotal = $('#GPStotal').text();
		var ringUUID = $('#ringUUID').text();
            $.ajax({
                type: "POST",
                url: protocol + "//" + hostname + ":3000/2.4/v1/readTrackData",
                data: {ringPassword: "12345678",GPSTotal: GPSTotal,GPSUID: ringUUID}
               
            })
	.success(function (msg) {
                
                console.log("msgmsgmsg" + msg.status);
            
					$('#readTrack').button('loading');
					// simulating a timeout
					setTimeout(function () {
					$('#readTrack').button('reset');
					}, 5000);
        
            })
	.fail(function () {
                console.log("error");
            })
	.always(function () {
                console.log("complete")
            });
    });
    
    

    $('#writeInfoOnRing').on("click", function () {
        var ringChangeUUID = "";
        var ringChangePassWord = "";
        var ringPassword = "";
        var ringReservseDate = "";
        var ringReservseTime = "";
        var ringDateNow = "";
        var ringTimeNow = "";
        var ringStatus = "";
        var $this = $(this);
        if ($("#changeNum").prop("checked"))
            ringChangeUUID = $("#inputChangeNum").val();
        
        if ($("#changePass").prop("checked"))
            ringChangePassWord = $("#inputChangePass").val();
        
        if ($("#RaceRadio").prop("checked"))
            ringStatus = "0x41";     //A
        
        if ($("#trainRadio").prop("checked"))
            ringStatus = "0x49";     //I
        
        var ringDateNow = $('#datetimepicker1').data("DateTimePicker").date().format("YYYY/MM/DD");
        var ringTimeNow = $('#datetimepicker2').data("DateTimePicker").date().format('HH:mm:ss');
        var ringReservseDate = $('#datetimepicker6').data("DateTimePicker").date().format("YYYY/MM/DD");
        var ringReservseTime =  $('#datetimepicker7').data("DateTimePicker").date().format('HH:mm:ss');
        
        
        $this.button('loading');
       
        var datechange = $("#ringDateTimeNow").text();
        console.log("datechange" + datechange);
        console.log("ringDateNow" + ringTimeNow);
        console.log("ringTimeNow" + ringDateNow);
        
        $.ajax({
            type: "POST",
            url: protocol + "//" + hostname + ":3000/2.4/v1/setRingInfo",
            data: {ringUUID: ringChangeUUID, ringDateNow: ringDateNow, ringTimeNow: ringTimeNow, ringReservseDate: ringReservseDate, ringReservseTime: ringReservseTime , ringPassword: "12345678",ringChangePassWord: ringChangePassWord,ringStatus: ringStatus}
        })
	.success(function (msg) {
            if (msg.status == "error")
                alert(msg.message);
            setTimeout(function () {
                var datechange = $("#ringDateTimeNow").text();
                var ringDateNow = $('#datetimepicker1').data("DateTimePicker").date().format("YYYY/MM/DD");
                var ringTimeNow = $('#datetimepicker2').data("DateTimePicker").date().format('HH:mm:ss');
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
                var ringDateNow = $('#datetimepicker1').data("DateTimePicker").date().format("YYYY/MM/DD");
                var ringTimeNow = $('#datetimepicker2').data("DateTimePicker").date().format('HH:mm:ss');
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
				}
            
            console.log("serverBaseUrl" + serverBaseUrl);
            
            var socket = io.connect("http://" + serverBaseUrl);
            socket.on('connect', function () {
                console.log("connectOKOK");
            });
            
            socket.on("channel1", function (readerObj) {
                //.toUpperCase()
                if (readerObj.status == "error")
                    alert(readerObj.message);

                console.log("qqa" + readerObj.ringVersion);
               // $("#qqa").text(readerObj.ringVersion);
                $("#qqa").text(readerObj.ringVersion+ "(" + readerObj.ringVersionID + ")");
                $("#ringUUID").text(readerObj.ringUUID);
                $("#ringV").text(Math.round(readerObj.ringV * 100)/100+"V");
                $("#ringDateTimeNow").text(readerObj.ringTimeNow);
                $("#ringcheck").text(readerObj.ringDateNow); 
                $("#GPStotal").text(readerObj.GPSCount);
            });

        
    })
	.fail(function () {
        console.log("error");
    })
	.always(function () {
        console.log("complete")
    });
    }
    ShowTime();
    $('#datetimepicker6').datetimepicker({
        viewMode: 'years',
        format: 'YYYY/MM/DD'
    });
    
    $('#datetimepicker7').datetimepicker({
        viewMode: 'decades',
        format: 'HH:mm:ss'
    });

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

    $('#datetimepicker6').data("DateTimePicker").defaultDate(new Date());
    $('#datetimepicker7').data("DateTimePicker").defaultDate(new Date());
    
    $('#datetimepicker1').datetimepicker({
        viewMode: 'decades',
        format: 'YYYY/MM/DD'
    });
    
    $('#datetimepicker2').datetimepicker({
        viewMode: 'decades',
        format: 'HH:mm:ss'
    });

   /* $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker({
        useCurrent: false //Important! See issue #1075
    });*/
    $("#datetimepicker1").on("dp.change", function (e) {
        $('#datetimepicker6').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepicker6").on("dp.change", function (e) {
        $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
    });

    $('#datetimepicker1').data("DateTimePicker").defaultDate(new Date());
    $('#datetimepicker2').data("DateTimePicker").defaultDate(new Date());

});

function ShowTime() {
    　var NowDate = new Date();
    var d = NowDate.getDay();
    var dayNames = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    document.getElementById('showbox').innerHTML = NowDate.toLocaleString() + '（' + dayNames[d] + '）';
    var newdate = NowDate.getFullYear() + "/" + (NowDate.getMonth()+1) + "/" + NowDate.getDate();
    if (autoLocalTimeInterval) {

        $('#datetimepicker1').data("DateTimePicker").date(newdate);
        $('#datetimepicker2').data("DateTimePicker").date(NowDate);
    }
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

