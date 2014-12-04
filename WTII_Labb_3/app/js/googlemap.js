/**
 * Created by Latana on 2014-12-01.
 */
function initialize() {

    var hybrid = [];
    var roadTrafic = [];
    var publicTransport = [];
    var scheduledInterference = [];
    var other = [];
    var all = [];

    var socket = io.connect('http://localhost:8000');
    socket.on('load', function(data){

        socket.emit('my other event', {client: "Here is client"});

            hybrid = data['messages'].reverse().slice(0,100).map(function(message, i){

                return {
                    title: message.title,
                    description: message.description,
                    latitude: message.latitude,
                    longitude: message.longitude,
                    createddate: message.createddate,
                    category: message.category,
                    subcategory: message.subcategory,
                    exactlocation: message.exactlocation
                }
            });

        hybrid.forEach(function(message){

            all.push(message);

            switch(Number(message.category)) {
                case 0:
                    roadTrafic.push(message);
                    break;
                case 1:
                    publicTransport.push(message);
                    break;
                case 2:
                    scheduledInterference.push(message);
                    break;
                case 3:
                    other.push(message);
                    break;
            }
        })

        var selected = document.querySelector('.switch');
        var number = selected.options[selected.selectedIndex].value;

        selected.addEventListener('change', function(e){

            var list = document.getElementById("ul");
            list.textContent="";

            switch(e.target.options.selectedIndex) {
                case 0:
                     render.createMarkers(roadTrafic);
                    break;
                case 1:
                     render.createMarkers(publicTransport);
                    break;
                case 2:
                    render.createMarkers(scheduledInterference);
                    break;
                case 3:
                     render.createMarkers(other);
                    break;
                default :
                    render.createMarkers(all);
                    break;
            }
        });
        render.createMarkers(hybrid);
    });

    var map;
    var render = {

        markers:[],
        addMarker: function(){

        },
        createMarkers: function(hybrid){
            render.markers.forEach(function(marker){

                marker.setMap(null);
            });
            render.markers = [];
            var previousMarker;

            hybrid.forEach(function(message){

                var infoString = markerBox(message);
                var position = new google.maps.LatLng(message.latitude, message.longitude);

                var marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: message.title,
                        infoWindow: new google.maps.InfoWindow({
                            content: infoString
                        })
                });
                render.markers.push(marker);

                var ul=document.getElementById('ul');
                var li=document.createElement('li');
                var a=document.createElement('a');
                a.title = message.exactlocation;
                a.href = "";
                li.appendChild(a);
                ul.appendChild(li);
                a.textContent=a.textContent + message.title;

                google.maps.event.addListener(marker, 'click', function(){

                    if(previousMarker !== undefined){
                        previousMarker.infoWindow.close();
                    }

                    map.setZoom(10);
                    map.setCenter(position);
                    marker.infoWindow.open(map,marker);
                    previousMarker = marker;
                });

                google.maps.event.addDomListener(li, "click", function(e){

                    // prevent href action to be called.
                    e.preventDefault();
                    google.maps.event.trigger(marker, "click");
                });
            });
        }
    };

    var latLng = new google.maps.LatLng(56.66282, 16.35524);
    var mapOptions = {
        center: latLng,
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);