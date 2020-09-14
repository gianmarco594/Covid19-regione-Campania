
$(function () {
    var map = $('#map').vectorMap({
        map: 'it_merc', zoomButtons: false, backgroundColor: '#F3F4FA', panOnDrag: false, zoomOnScroll: false, scale: 50,
    
        onRegionClick: function (event, code) {
        },
        regionStyle: {
            initial: {
                fill: '#1d6c85'
            },
            hover: {
                "fill-opacity": 0.8,
                cursor: 'pointer'
            }
        },
        series: {
            regions: [{
              values: [1, 4, 10, 450, 1000],
              scale: ['#C8EEFF', '#0071A4'],
              normalizeFunction: 'polynomial'
            }]
          },
        onRegionTipShow: function (e, el, code) {
            el.html('<div id="tip">' + "PROVINCIA DI " + (el.html()).toUpperCase() + '</div><br><br><div id="tip2">TOTALE CASI DA INIZIO PANDEMIA</div><div id="tip3"></div><hr><br><div id="tip2">ANDAMENTO DA INIZIO PANDEMIA</div><br><div id="graficoTip"><canvas id="graficoProvincia"></canvas></div>').css({
                "backgroundColor": "rgba(255, 255, 255, 0.9)",
                "border-radius": "5px", "border-color": "rgba(255, 255, 255, 0.0)", "box-shadow": "0px 0px 11px 2px rgba(235,235,235,1)"
            });
                var socket = io.connect('http://localhost:8080');
                socket.on("connect", function () {
                var map = $('#map').vectorMap('get', 'mapObject');
                    var regionName = map.getRegionName(code);
                    socket.emit("NomeProvincia", regionName);
                    result = socket.on('risultato', function (data) {
                        if (data == null) {
                            alert("nullo provincia");
                        } else {
                            var array = data.casi_totali_provincia;
                            var last = array[array.length - 1];
                            document.getElementById("tip3").innerHTML = last;
                            createGrafici("graficoProvincia", array, "Casi totali", "rgb(29, 108, 133)");
                        }
                    });
            });
        },
        
    });
    var mapObj = $("#map").vectorMap("get", "mapObject");
    var zoomSettings = { scale: 7.8, lat: 40.75, lng: 14.80, animate: false };
    mapObj.setFocus(zoomSettings);
});

var height = document.getElementsByClassName("header")[0].offsetHeight;
document.getElementsByClassName("regione")[0].style.marginTop = height+"px";
window.scrollTo(0, 0);




