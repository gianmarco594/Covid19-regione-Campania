
$(function () {
    var map = $('#map').vectorMap({
        map: 'it_merc', zoomButtons: false, backgroundColor: '#F3F4FA', panOnDrag: false, zoomOnScroll: false, scale: 50,
        onRegionClick: function (event, code) {
            var socket = io.connect('http://localhost:8080');
            socket.on("connect", function () {
            var map = $('#map').vectorMap('get', 'mapObject');
                var regionName = map.getRegionName(code);
                socket.emit("NomeProvincia", regionName);
                socket.on('risultato', function (data) {
                    if (data == null) { 
                        alert("nullo provincia"); 
                    } else { 
                        //data � un singolo array
                        alert(data[0]); 
                    }
                    
                });

            });
        },
        regionStyle: {
            initial: {
                fill: '#B8E186'
            },
            hover: {
                "fill-opacity": 0.8,
                cursor: 'pointer'
            }
        },
        onRegionTipShow: function(e, el, code){
                el.html("Provincia di " + el.html());
        }
    });
    var mapObj = $("#map").vectorMap("get", "mapObject");
    var zoomSettings = { scale: 7.8, lat: 40.75, lng: 14.80, animate: false };
    mapObj.setFocus(zoomSettings);
});

var height = document.getElementsByClassName("header")[0].offsetHeight;
document.getElementsByClassName("regione")[0].style.marginTop = height+"px";
window.scrollTo(0, 0);




