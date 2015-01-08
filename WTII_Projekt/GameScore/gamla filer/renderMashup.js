/**
 * Created by Latana on 2014-12-19.
 */
function search() {
console.log('i function');
    var socket = io.connect('http://localhost:8000');

    socket.on('render', function(data){

        var resultDiv = document.getElementById('result');
        var div = document.createElement('div');
        var domTitle = document.createElement('p');
        var domReleased = document.createElement('p');
        var domScore = document.createElement('p');
        var domDesc = document.createElement('p');
        var domPublisher = document.createElement('p');
        var domDeveloper = document.createElement('p');
        var domPics = document.createElement('img');
        var domPlatform = document.createElement('p');


        domTitle.textContent = "Title: " + data.title;
        domReleased.textContent = "Released: " + data.relesed;
        domScore.textContent = "Score: "+data.score;
        domDesc.textContent = data.description;
        domPublisher.textContent = "Publisher: " + data.publisher;
        domDeveloper.textContent = "Developer: " + data.developer;
        domPics.setAttribute('src', data.pic);
        domPics.setAttribute('alt', 'na');

        domPlatform.textContent = data.platform;

        div.appendChild(domPics);
        div.appendChild(domTitle);
        div.appendChild(domReleased);
        div.appendChild(domScore);
        div.appendChild(domDesc);
        div.appendChild(domPublisher);
        div.appendChild(domDeveloper);
        div.appendChild(domPlatform);
        resultDiv.appendChild(div);
    });
}

 window.onload = function() {
    document.getElementById("search").onclick = function start() {
        search();
    }
};