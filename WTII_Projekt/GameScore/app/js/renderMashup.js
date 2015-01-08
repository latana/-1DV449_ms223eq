/**
 * Created by Latana on 2014-12-19.
 */

var socket = io.connect('http://localhost:8000');

socket.on('render', function (data) {

    if(data !== null) {

        var resultDiv = document.getElementById('result');
        var div = document.createElement('div');

        if(typeof data === "string"){

            var domMessage = document.createElement('p');
            domMessage.textContent = data;
            div.appendChild(domMessage);
            resultDiv.appendChild(div);
        }
        else {

            var domTitle = document.createElement('p');
            var domReleased = document.createElement('p');
            var domScore = document.createElement('p');
            var domDesc = document.createElement('p');
            var domPublisher = document.createElement('p');
            var domDeveloper = document.createElement('p');
            var domPics = document.createElement('img');
            var domPlatform = document.createElement('p');

            domTitle.textContent = "Title: " + data.title;
            domReleased.textContent = "Released: " + data.released;
            domScore.textContent = "Score: " + data.score.toFixed(1);
            domDesc.textContent = "Description: " + data.description;
            domPublisher.textContent = "Publisher: " + data.publisher;
            domPics.setAttribute('src', data.pic);
            domPics.setAttribute('alt', 'na');

            domPlatform.textContent = "Platform: " + data.platform;

            div.appendChild(domPics);
            div.appendChild(domTitle);
            div.appendChild(domReleased);
            div.appendChild(domScore);
            div.appendChild(domDesc);
            div.appendChild(domPublisher);
            div.appendChild(domPlatform);
            resultDiv.appendChild(div);

        }

        var domForm = document.getElementById('form');
        var loader = document.getElementById('loader');
        domForm.removeChild(loader);

        onlyOneGif = false;
    }
});

function createTopFive() {
    socket.on('top-Five', function (data) {

        if(data.length !== 0){

            var h3 = document.createElement("h3");
            h3.textContent = "Top 5 list";
            var top5Div = document.getElementById('top-5');
            top5Div.appendChild(h3);

            for(i = 0; i < data.length; i++){

                var div = document.createElement('div');
                var liTitle = document.createElement('p');
                var liScore = document.createElement('p');
                liTitle.textContent = data[i].title;
                liScore.textContent = data[i].score.toFixed(1);
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

var onlyOneGif;

function createLoadingGif() {

    if (!onlyOneGif) {

        onlyOneGif = true;

        var loader = document.createElement("img");
        loader.setAttribute("src", "img/loader.gif");
        loader.setAttribute("id", "loader");
        var domForm = document.getElementById('form');
        domForm.appendChild(loader);
    }
}

createTopFive();