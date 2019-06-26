var protocol = location.protocol;
var hostname = location.hostname;
var serverBaseUrl = document.domain + ":3000";
$( document ).ready(function() {


	function autoConnect() {

        console.log("INCONNECT");

            $('#connectMach').text("裝置連線(連線中.....)");
            $('#autoConnect').text("自動關閉");
          //  intervalObj = setInterval(function () {
                autoConnectComPort();
          //  }, 1000);
           
    };
	
	
function autoConnectComPort()
   {
    
    $.ajax({
        type: "GET",
        url: protocol + "//" + hostname + ":3000/2.4/v1/channel",
    })
	.success(function (msg) {
	console.log("aa"+msg.status);
            if (msg.status == "error")
			{
				$('#connectInfo').text(msg.message);
				
				setTimeout(function () {
					$('#connectInfo').text("重新連接");
					autoConnectComPort();

				}, 2000);
			}
			else
			{
            var socket = io.connect("http://" + serverBaseUrl);
            socket.on('connect', function () {
                console.log("connectOKOK");
            });
            
            socket.on("channel1", function (readerObj) {
                //.toUpperCase()
				
				console.log("readerObj.ringUUID"+readerObj.ringUUID);
                if (readerObj.status == "error")
                    alert(readerObj.message);
					
					
					
				else if(!readerObj.ringUUID)
				{
					$('#connectInfo').text("請置入 GPS 腳環");
				}
				else if(readerObj.ringUUID)
				{
						$('#connectInfo').text("GPS腳環連接成功");
						
						setTimeout(function () {
							
						window.location = "./ring";

						}, 2000);
				}

		

            });
			}
               


        
    })
	.fail(function () {
        console.log("error");
    })
	.always(function () {
        console.log("complete")
    });
    }
	
	setTimeout(function () {
					 console.log("GOG")		
			autoConnectComPort();

		}, 4000);
	
});
	