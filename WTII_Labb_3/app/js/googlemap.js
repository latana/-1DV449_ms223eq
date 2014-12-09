/**
 * Created by Latana on 2014-12-01.
 */

function initialize() {

    var firstRender = true;

    var socket = io.connect('http://localhost:8000');
    socket.on('load', function(data){

        var roadTrafic = [];
        var publicTransport = [];
        var scheduledInterference = [];
        var other = [];
        var all = [];
        var allSorted = [];

            all = data['messages'].reverse().slice(0,100).map(function(message, i){

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

        allSorted = deleteCopy(all);

        allSorted.forEach(function(message){

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
        });

        var selected = document.querySelector('.switch');
        var list = document.getElementById("ul");


        selected.addEventListener('change', function(e){

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
                default:
                    render.createMarkers(allSorted);
                    break;
            }
        });
        if(firstRender === true) {
            firstRender = false;
            render.createMarkers(allSorted);

        }
    });

    var map;
    var render = {

        markers:[],

        createMarkers: function(data){

            render.markers.forEach(function(marker){

                marker.setMap(null);
            });
            render.markers = [];
            var previousMarker;

            data.forEach(function(message,i){

                var infoString = createInfoString(message);
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
                createList(message, i);

                google.maps.event.addListener(marker, 'click', function(){

                    if(previousMarker !== undefined){
                        previousMarker.infoWindow.close();
                    }

                    map.setZoom(10);
                    map.setCenter(position);
                    marker.infoWindow.open(map,marker);
                    previousMarker = marker;
                });
            });

            var ul=document.getElementById('ul');

            google.maps.event.addDomListener(ul, "click", function(e){

                e.preventDefault();

                if(e.target.nodeName !== 'A'){
                    return false;
                }
                else {
                    google.maps.event.trigger(render.markers[e.target.id], "click");
                }
            });
        }
    };

    var latLng = new google.maps.LatLng(62.56282, 13.35524);
    var mapOptions = {
        center: latLng,
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function createList(message,i){

    var ul = document.getElementById('ul');
    var li=document.createElement('li');
    li.setAttribute('class', 'li');
    var a=document.createElement('a');
    a.title = message.exactlocation;
    a.href = "";
    a.setAttribute('class', 'a');
    li.appendChild(a);
    ul.appendChild(li);
    a.setAttribute('id', i);
    a.textContent=a.textContent + message.title;

    return li;
}

function deleteCopy(array){

    var copy = {};

    var filterdArray = array.filter(function(item){
        return copy.hasOwnProperty(item.title) ? false : (copy[item.title] = true);
    });
    return filterdArray;

}
google.maps.event.addDomListener(window, 'load', initialize);