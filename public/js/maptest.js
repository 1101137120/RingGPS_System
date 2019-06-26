      var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 9,
          center: new google.maps.LatLng(23.849647,120.922398),
          mapTypeId: 'terrain'
        });

        $.ajax({
						 type: "GET",
						 url: location.protocol+"//"+location.hostname+":9004/2.4/v1/maptest"
					}).success(function(msg) {
					var results=msg.response;
					window.results = function(results) {
        for (var i = 0; i < response.length; i++) {
          var coords = results[i].geometry.coordinates;
          var latLng = new google.maps.LatLng(results[i].LATITUDE,results[i].LONGITUDE);
          var marker = new google.maps.Marker({
            position: latLng,
            map: map
          });
        }
      }
					});
					}

      // Loop through the results array and place a marker for each
      // set of coordinates.
	  
	  
 /* $(document).ready(function() {
    $.ajax({
        url : location.protocol+"//"+location.hostname+":9004/2.4/v1/maptest",   // JSON 資料路徑
        success : function(data) {
            var markers = data.response;
            
            // -- 設定地圖樣式
            var styles = [
                {
                    stylers: [
                        { saturation: -50 }
                    ]
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [
                        { lightness: 30 },
                        { visibility: "simplified" }
                    ]
                },
                {
                    featureType: "road",
                    elementType: "labels",
                    stylers: [
                        { visibility: "off" }
                    ]
                }
            ];  // -- 設定地圖樣式

            var styledMap = new google.maps.StyledMapType(styles, {name: "My Map!"});
  
            var map = new google.maps.Map(document.getElementById("map"), {
                center : new google.maps.LatLng(23.849647, 120.922398), // 指定地圖的中心點，這邊我設在台灣
                zoom : 9,
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                }
            });

            map.mapTypes.set('map_style', styledMap);
            map.setMapTypeId('map_style');

            var infoWindow = new google.maps.InfoWindow(); // 設定氣泡框 (message bubble)，顯示地標相關的資訊

            var markerClusterer = [];   // 設定標記叢集 (marker clusterer)

            for ( var i = 0; i < markers.length; i++) {
                var DATE = markers[i].DATE;
                var TIME = markers[i].TIME;
                var point = new google.maps.LatLng(parseFloat(markers[i].LATITUDE), parseFloat(markers[i].LONGITUDE)); // 將 JSON 裡讀出來的地標逐一加到地圖上
                var html = "<h3>" + DATE + "</h3><p>" + TIME +"</p>"; // 設定點選地圖標記後的對話氣泡框的內容 (可以使用 HTML tag)
                // 把地標加到地圖上
                var marker = new google.maps.Marker({
                    map : map,
                    position : point
                });

                bindInfoWindow(marker, map, infoWindow, html); // 把對話框內容綁到地圖標記上頭
                // 先把所有要做成標記叢集 (marker clusterer) 的標記通通塞進一個集合 (collection)
                markerClusterer.push(marker); 
            }

            // 設定標記叢集的外觀
            var markerClusterDraw = new MarkerClusterer(map, markerClusterer, {
                gridSize: 80,  // 多少範圍內的標記要撿在一組 (是用 grid 的概念，落在框外的有時會自成單一地圖標記 (marker)，不會轉成 marker clusterer)
                styles: [{
                    height: 45,
                    width: 50,
                    anchor: [1, 12],    // 文字出現在標記上的哪個位置 (position on marker)
                    textColor: '#ffffff',
                    textSize: 13
                },
                {
                    height: 45,
                    width: 50,
                    anchor: [1, 8],
                    textColor: '#ffffcc',
                    textSize: 8
                }],
            });
        }
    });
});

// 設定地圖標記 (marker) 點開後的對話氣泡框 (message bubble)
function bindInfoWindow(marker, map, infoWindow, html) {
    // 除了 click 事件，也可以用 mouseover 等事件觸發氣泡框顯示
    google.maps.event.addListener(marker, 'click', function() { 
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
}*/	  