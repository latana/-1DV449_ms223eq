/**
 * Created by Latana on 2014-12-19.
 */

var socket = io.connect('http://localhost:8000');

var onlyOneGif;

socket.on('render', function (data) {

    var resultDiv = document.getElementById('result');

    while (resultDiv.firstChild) {
        resultDiv.removeChild(resultDiv.firstChild);
    }

    if(data !== null) {

        if(typeof data === "string"){

            var div = document.createElement('div');
            var domMessage = document.createElement('p');
            domMessage.setAttribute("class", "text-danger");

            domMessage.textContent = data;
            div.appendChild(domMessage);
            resultDiv.appendChild(div);
        }
        else{

            if(typeof data.title === "string"){

                addResult(data);
            }
            else{
                for(var i = 0; i < data.length; i++) {
                    addResult(data[i]);
                }
            }
        }

        var domForm = document.getElementById('gif');
        var loader = document.getElementById('loader');
        domForm.removeChild(loader);

        onlyOneGif = false;
    }
});

function addResult(data){

    var resultDiv = document.getElementById('result');
    var div = document.createElement('div');
    div.setAttribute("id", "resultDiv");

    var domTitle = document.createElement('p');
    domTitle.setAttribute("id", "domTitle");
    var domReleased = document.createElement('p');
    domReleased.setAttribute("id", "domReleased");
    var domScore = document.createElement('p');
    domScore.setAttribute("id", "domScore");
    var domDesc = document.createElement('p');
    domDesc.setAttribute("class", "domDesc");
    var domPublisher = document.createElement('p');
    domPublisher.setAttribute("id", "domPublisher");
    var domPlatform = document.createElement('p');
    domPlatform.setAttribute("id", "domPlatform");
    var domLastUpdate = document.createElement('p');
    domLastUpdate.setAttribute("id", "domLastUpdate");

    domTitle.textContent = "Title: " + titleHandler(data.title);
    domReleased.textContent = "Released: " + data.released;

    if(typeof data.score === "number"){
        domScore.textContent = "Score: " + data.score.toFixed(1);
    }
    else{
        domScore.textContent = "Score: " + data.score;
    }

    domDesc.textContent = "Description: " + data.description;
    domPublisher.textContent = "Publisher: " + data.publisher;

    var domPics = document.createElement('img');
    domPics.setAttribute("id", "domPics");

    if(data.pic === "") {
        domPics.setAttribute('src', "../img/noImg.png");
        domPics.setAttribute('alt', 'na');
    }
    else{
        domPics.setAttribute('src', data.pic);
        domPics.setAttribute('alt', 'na');
    }

    domPlatform.textContent = "Platform: " + data.platform;
    domLastUpdate.textContent = "Last Updated: " + data.lastUpdate;

    div.appendChild(domPics);
    div.appendChild(domTitle);
    div.appendChild(domReleased);
    div.appendChild(domScore);
    div.appendChild(domPublisher);
    div.appendChild(domPlatform);
    div.appendChild(domDesc);
    div.appendChild(domLastUpdate);
    resultDiv.appendChild(div);
}

function createTopFive() {

    socket.emit("top-Five");
    socket.on('top-Five', function (data) {

        if(data.length !== 0){

            var h3 = document.createElement("h3");
            h3.textContent = "Top 5 list";
            var top5Div = document.getElementById('top-5');
            top5Div.appendChild(h3);

            data.sort(function(obj1, obj2) {
                return obj2['score'] - obj1['score'];
            });

            for(var i = 0; i < data.length; i++){

                var div = document.createElement('div');
                var liTitle = document.createElement('p');
                var liScore = document.createElement('p');
                liTitle.textContent = i +  1 + ". " + titleHandler(data[i].title);
                liScore.textContent = data[i]['score'].toFixed(1);
                div.appendChild(liTitle);
                div.appendChild(liScore);
                top5Div.appendChild(div);
            }
        }
    });
}

window.onload = function () {

    document.getElementById("search").onclick = function (e) {

        var searchValue = document.getElementById("searchField").value;

        if(searchValue == "") {
            var resultDiv = document.getElementById('result');
            var domMessage = document.createElement('p');
            domMessage.setAttribute("class", "text-danger");
            domMessage.textContent = "The field is empty";
            resultDiv.appendChild(domMessage);
        }
        else{
            socket.emit("search", {search: searchValue});
            createLoadingGif();
        }
        e.preventDefault();
    }
};

function createLoadingGif() {

    if (!onlyOneGif) {

        onlyOneGif = true;

        var loader = document.createElement("img");
        loader.setAttribute("src", "img/loader.gif");
        loader.setAttribute("id", "loader");
        var domForm = document.getElementById('gif');
        domForm.appendChild(loader);
    }
}

function titleHandler(string){

    var title = string.split(" ");
    var tempTitle = "";
    var fullTitle = "";

    for (i in title) {

        tempTitle = title[i];
        fullTitle += tempTitle.substring(0,1).toUpperCase() + tempTitle.substring(1,tempTitle.length) + " ";
    }

    return fullTitle;
}

createTopFive();