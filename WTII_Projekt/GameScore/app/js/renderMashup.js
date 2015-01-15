/**
 * Created by Latana on 2014-12-19.
 */

if(navigator.onLine) {
    var socket = io.connect('Hemlig socketanslutning');
    storeLocal();
    createTopFive();
}
var onlyOneGif;
var offline;

/**
 * Renderar ut datan om den finns.
 * Annars renderar ett meddelande
 */
if(navigator.onLine) {
    socket.on('render', function (data) {

        var resultDiv = document.getElementById('result');

        deleteDiv();
        deleteGif();

        if (data !== null) {

            if (typeof data === "string") {

                message(data, resultDiv);
            }
            else {
                if (typeof data.title === "string") {

                    addResult(data);
                }
                else {
                    for (var i = 0; i < data.length; i++) {
                        addResult(data[i]);
                    }
                }
            }
        }
    });
}
/**
 *
 * @param data objekt
 * Renderar ut objektet
 */
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
    domLastUpdate.textContent = "Last Update: " + data.lastUpdate;

    var picDiv = document.createElement("div");
    picDiv.setAttribute('id', 'picDiv');

    picDiv.appendChild(domPics);
    var infoDiv = document.createElement('div');
    infoDiv.setAttribute('id', 'infoDiv');

    div.appendChild(picDiv);
    infoDiv.appendChild(domTitle);
    infoDiv.appendChild(domReleased);
    infoDiv.appendChild(domScore);
    infoDiv.appendChild(domPublisher);
    infoDiv.appendChild(domPlatform);
    infoDiv.appendChild(domDesc);
    infoDiv.appendChild(domLastUpdate);
    div.appendChild(infoDiv);
    resultDiv.appendChild(div);
}

/**
 * Frågar serversidan om top 5 listan och skriver ut datan om det finns någon.
 */
function createTopFive() {

    socket.emit("top-Five");
    socket.on('top-Five', function (data) {

        if(data.length !== 0){

            var h3 = document.createElement("h3");
            h3.setAttribute("id", "topfiveTitle");
            h3.textContent = "Top 5 list";
            h3.setAttribute('class', 'text-center')
            var top5Div = document.getElementById('top-5');
            top5Div.appendChild(h3);
            var table = document.createElement("table");
            table.setAttribute('class', 'table table-striped');
            var tr = document.createElement('tr');
            var th1 = document.createElement('th');
            var th2 = document.createElement('th');
            th1.textContent = "Title";
            th2.textContent = "Score";
            tr.appendChild(th1);
            tr.appendChild(th2);
            table.appendChild(tr);
            top5Div.appendChild(table);

            data.sort(function(obj1, obj2) {
                return obj2['score'] - obj1['score'];
            });

            for(var i = 0; i < data.length; i++){

                var div = document.createElement('tr');
                var liTitle = document.createElement('td');
                var liScore = document.createElement('td');
                liTitle.textContent = i +  1 + ". " + titleHandler(data[i].title);
                liScore.textContent = data[i]['score'].toFixed(1);
                div.appendChild(liTitle);
                div.appendChild(liScore);
                table.appendChild(div);
            }
        }
    });
}

/**
 * Skickar det användaren matat in till serversidan.
 */
window.onload = function () {

    document.getElementById("search").onclick = search;
    document.getElementById("form").onsubmit = search;
};

function search(e) {
    e.preventDefault();

    var searchValue = document.getElementById("searchField").value;

    if(searchValue === "") {

        var resultDiv = document.getElementById('result');

        deleteDiv();

        var domMessage = document.createElement('p');
        domMessage.setAttribute("class", "text-danger");
        domMessage.textContent = "The field is empty";
        resultDiv.appendChild(domMessage);
    }
    else{
        createLoadingGif();

        if(navigator.onLine){

            offline = false;
            online();
            socket.emit("search", {search: searchValue});
        }
        else {

            deleteDiv();
            offlineNotify();

            var storage = localStorage.getItem("localList");

            if(storage !== null) {

                storage = JSON.parse(storage);
                var count = 0;

                for(var i = 0; i < storage.length; i++) {

                    count ++;
                    if (storage[i].title == searchValue.toLowerCase()) {

                        createLoadingGif();
                        addResult(storage[i]);
                        break;
                    }
                    if (count === storage.length){
                        var div = document.getElementById("result");
                        var notFound = "The game could not be found in offline mode";
                        message(notFound, div);
                    }
                }
                deleteGif();
            }
            else{
                var offlinediv = document.getElementById("result");
                var offlineMessage = "There is no data in offline mode";
                message(offlineMessage, offlinediv);
                deleteGif();
            }
        }
    }
}

/**
 * skapar en laddnings gif men bara ifall den inte redan finns framme.
 */
function createLoadingGif() {

    if (!onlyOneGif) {

        onlyOneGif = true;

        var loader = document.createElement("img");
        loader.setAttribute("src", "img/loader.gif");
        loader.setAttribute("id", "loader");
        var domForm = document.getElementById('gif');
        var loadingText = document.createElement('p');
        loadingText.textContent = "Searching...";
        loadingText.setAttribute('id', 'loading');

        domForm.appendChild(loadingText);
        domForm.appendChild(loader);
    }
}

/**
 * @param string string
 * @returns string fullTitle
 * Ser till att titlen får stor bokstav
 */
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

/**
 *
 * @param data string
 * @param resultDiv domObject
 */
function message(data, resultDiv){

    var div = document.createElement('div');
    var domMessage = document.createElement('p');
    domMessage.setAttribute("class", "text-danger");

    domMessage.textContent = data;
    div.appendChild(domMessage);
    resultDiv.appendChild(div);
}

/**
 * Tar bort allt innehåll i result diven.
 */
function deleteDiv(){

    var resultDiv = document.getElementById('result');

    while (resultDiv.firstChild) {
        resultDiv.removeChild(resultDiv.firstChild);
    }
}

/**
 * Kallar på servern och får data som sparas i localstore
 */
function storeLocal(){

    socket.emit("localStore");
    socket.on('localStore', function (data) {

        localStorage.setItem("localList", JSON.stringify(data));
    });
}

/**
 * Ser till att skriva ut offline mode om man inte är offline
 */
function offlineNotify(){

    if(!navigator.onLine){

        if(!offline) {

            offline = true;
            var offlineDiv = document.getElementById('offline');
            var offlinetext = document.createElement('h4');
            offlinetext.textContent = "Offline Mode"
            offlineDiv.appendChild(offlinetext);
        }
    }
}

/**
 * Tar bort offlinetexten när man är online.
 */
function online(){

    var offlineDiv = document.getElementById('offline');

    while (offlineDiv.firstChild) {
        offlineDiv.removeChild(offlineDiv.firstChild);
    }
}

/**
 * Tar bort laddnings giffen.
 */
function deleteGif(){

    var domForm = document.getElementById('gif');
    var loader = document.getElementById('loader');
    var loadingText = document.getElementById('loading');
    domForm.removeChild(loader);
    domForm.removeChild(loadingText);

    onlyOneGif = false;
}

offlineNotify();
