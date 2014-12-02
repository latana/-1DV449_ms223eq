/**
 * Created by Latana on 2014-12-01.
 */

function initialize() {

    var hybrid = [];

    jQuery.get('/map', function(data, textString, jqHRX){

        hybrid = data['messages'].map(function(message, i){
            return {
                title: message.title,
                description: message.description,
                latitude: message.latitude,
                longitude: message.longitude,
                createddate: message.createddate
            }
        });
        console.log(hybrid.reverse());
        render.markers = render.createMarkers(hybrid.reverse().slice(0,100));

    });

    var map;
    var render = {

        markers:[],
        addMarker: function(){

        },
        createMarkers: function(hybrid){

            hybrid.forEach(function(message){

                var position = new google.maps.LatLng(message.latitude, message.longitude);

                var infowindow = new google.maps.InfoWindow({
                    content: message.description
                });

                var marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: message.title
                });
                render.markers.push(marker);
                google.maps.event.addListener(marker, 'click', function(){

                    map.setZoom(10);
                    map.setCenter(position);
                    infowindow.open(map,marker);
                });
            });
        }
    };

// google stuff
    var latlng = new google.maps.LatLng(56.66282, 16.35524);
    var mapOptions = {
        center: latlng,
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);