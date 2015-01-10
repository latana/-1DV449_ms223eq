/**
 * Created by Latana on 2014-12-12.
 */
var application_root = __dirname,
    express = require('express'), //Web framework
    morgan = require('morgan'), // (since Express 4.0.0)
    bodyParser = require('body-parser'), // (since Express 4.0.0)
    errorHandler = require('errorhandler'), // (since Express 4.0.0)
    path = require('path'), // Utilities for dealing with file
    request = require('request'),
    fs = require('fs'),
    unirest = require('unirest'),
    app = express(),
    mongo = require('mongodb'),
    monk = require('monk'),
    db = monk('localhost:27017/test'),
    router = express.Router();

var env = process.env.NODE_ENV || 'development';


if ('development' == env) {

    app.use('/', express.static(path.join(application_root, 'app')));
    app.use(morgan('dev'));
    app.use(bodyParser());
    app.use(errorHandler({dumpExceptions: true, showStack: true}));
}

//Start server
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8000;

app.set('ipaddr', ipaddr);
app.set('port', port);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


var server = app.listen(port, ipaddr, function () {
    console.log('Express server listening on port %d in %s mode',
        port, app.settings.env);
});


var io = require('socket.io').listen(server);
var gameTest = "gameTest5";
var topFive = "topFiveTest1";

io.on("connection", function(socket){

    socket.on('top-Five', function(){

        var collection = db.get(topFive);

        collection.find({}, function (err, data) {

            if(data.length !== 0) {

                socket.emit('top-Five', data);
            }
        });
    });

    /**
     * @param data object
     * Undersöker om titeln finns i databasen och gämför med timestamp. Om inte så görs ett anrop mot apierna.
     */
    socket.on('search', function (data) {

        var search = data.search;

        var collection = db.get(gameTest);

        if(search !== undefined || search !== "") {

            var query = { title: new RegExp('^' + search) };

            collection.find(query,function(err, data){

                var date = new Date();
                var dateNow = date.getTime();

                if (data.length !== 0) {

                    var timeStampToLow = false;

                    for (var i = 0; i < data.length; i++) {

                        if (Number(data[i]['timestamp']) < Number(dateNow)) {
                            timeStampToLow = true;
                            break;
                        }
                    }
                    if(timeStampToLow === true) {
                        getIgn(search, socket);
                    }
                    else{
                        socket.emit('render', data);
                    }
                }
                else {
                    getIgn(search, socket);
                }
            });
        }
    });
});

/**
 *
 * @param search string
 * @param socketToSendTo object
 * Gör ett anrop mot Ign's api och kallar på MetaCritic när den är klar
 */

function getIgn(search, socketToSendTo) {

    unirest.get("https://videogamesrating.p.mashape.com/get.php?count=20&game='" + search + "'")
     .header("X-Mashape-Key", "7NUyQhIDn9mshTIkUcz4vivSR0jBp1p2SlajsnfMX3QASk21pL")
     .end(function (result) {

            if(result.body.length === 0){

                var message = "The game could not be found";
                socketToSendTo.emit('render', message);
            }
            else{
                getOmdb(result.body, socketToSendTo);
            }
    });
}

/**
 *
 * @param ignArray Array
 * @param socketToSendTo Object
 *
 * Gör ett anrop mot imdb's api och kallar på mashup när den är klar
 */

function getOmdb(ignArray, socketToSendTo) {

    var omdbArray = [];
    var count = 0;

    for(var i = 0; i < ignArray.length; i++){

        var search = ignArray[i].title;

        search = search.replace(/ /g, '+');

        unirest.get("http://www.omdbapi.com/?t=" + search + "&y=&plot=full&r=json")
            .end(function (result) {

                count ++;

                var temp = JSON.parse(result.body);

                if(temp['Response'] === "True" && temp['Type'] === "game"){

                    omdbArray.push(temp);
                }
                if(count === ignArray.length){

                    if(omdbArray.length === 0){

                        var message = "omdb fail";
                        socketToSendTo.emit('render', message);
                    }
                    else{
                        mashup(ignArray, omdbArray, socketToSendTo);
                    }
                }
            });
    }

}
app.get('/userlist', function (req, res) {

});

/**
 *
 * @param hybridArray array
 *
 * Sparar ner mashapen i en databas och sätter en timestamp på 5 min
 */

function storeInDataBase(hybridArray) {

    var collection = db.get(gameTest);

    collection.find({}, function (err, data) {

        var count = 0;
        var tempArray = [];
        var deleteArray = [];
        var date = new Date();
        var dateNow = date.getTime();

        if(data.length === 0){

            hybridArray.forEach(function (newObj) {

                data.push(newObj);
            });

            data.forEach(function (element) {
                collection.insert(element);
            });
        }
        else {
            hybridArray.forEach(function (newObj) {
                data.every(function (oldObj) {

                    count++;

                    if (oldObj.title === newObj.title) {
                        if (Number(oldObj.timestamp) < Number(dateNow)) {

                            tempArray.push(newObj);
                            deleteArray.push(oldObj);
                        }
                        return false; //Break every-loop
                    }
                    if (count === data.length) {

                        tempArray.push(newObj);

                        return false; //Break every-loop
                    }
                    return true; //Continue every-loop
                });
                count = 0;
            });

            deleteArray.forEach(function(element) {
                collection.remove({_id: element._id});
            });

            tempArray.forEach(function (element) {
                collection.insert(element);
            });
        }

   /**     collection.insert(data, function (err, doc) {
            if (err) {
                // If it failed, return error
                console.log(err);
                console.log("There was a problem adding the information to the database.");
            }
            else {
                // If it worked, set the header so the address bar doesn't still say /adduser
                console.log('success');
                // And forward to success page
            }
        }); **/
    });

}

/**
 *
 * @param ignArray array
 * @param omdbArray jsonObject
 * @param socketToSendTo object
 *
 * Lägger ihop de delar jag vill behålla och sätter ihopa poängen för att få ut snittet.
 * Kallar på storeInDataBase och skickar sedan data till klienten.
 */

function mashup(ignArray, omdbArray, socketToSendTo) {

    var hybridArray = [];

    ignArray.forEach(function(ignObject){
        omdbArray.every(function (omdbObject) {
            if(ignObject.title === omdbObject.Title){

                var hybrid = {};

                hybrid['title'] = ignObject['title'].toLowerCase();
                hybrid['released'] = checkValue(omdbObject['Released']);

                if(ignObject['score'] === "" || omdbObject['imdbRating'] === "N/A"){

                    hybrid['score'] = "No information";
                }
                else{
                    hybrid['score'] = (Number(ignObject['score']) + Number(omdbObject['imdbRating'])) / 2;
                }

                hybrid['description'] = checkValue(omdbObject['Plot']);
                hybrid['publisher'] = checkValue(ignObject['publisher']);
                hybrid['pic'] = ignObject['thumb'];

                for (i in ignObject['platforms']) {

                    if (hybrid['platform'] == undefined) {

                        hybrid['platform'] = (ignObject['platforms'][i]);
                    }
                    else {
                        hybrid['platform'] += ( ", " + ignObject['platforms'][i]);
                    }
                }
                var date = new Date();

                var timeStamp = Number(date.getTime() + 300000);
                hybrid['timestamp'] = timeStamp;

                hybridArray.push(hybrid);

                return false; //Break every-loop
            }
            return true; //Continue every-loop
        });
    });

    storeInDataBase(hybridArray);
    checkTopFive(hybridArray);
    socketToSendTo.emit('render', hybridArray);
}

function checkTopFive(hybridArray){

    var collection = db.get(topFive);

    collection.find({}, function (err, data) {

        data = sortData(data);

        if(data.length === 0){

            hybridArray.forEach(function (newObj) {

                data.push(newObj);
            });

            data.forEach(function (element) {
                collection.insert(element);
            });
        }
        else if (data.length < 5) {

            var tempArray = [];
            var count = 0;

            hybridArray.forEach(function (newObj) {
                data.every(function (oldObj) {

                    count ++;

                    if(oldObj.title === newObj.title) {
                        return false; //Break every-loop
                    }

                    if(count === data.length) {

                        tempArray.push(newObj);

                        return false; //Break every-loop
                    }

                    return true; //Continue every-loop
                });
                count = 0;
            });

            pushData(data, tempArray);
            data = spliceData(sortData(data));
            collection.remove();

            data.forEach(function (element) {
                delete element._id;
                collection.insert(element);
            });
        }
        else{
            var tempArray = [];

            hybridArray.forEach(function (newObj) {
                data.every(function (oldObj) {

                    if(oldObj.title === newObj.title) {
                        return false; //Break every-loop
                    }

                    if (Number(newObj.score) > Number(oldObj.score)) {
                        tempArray.push(newObj);

                        return false; //Break every-loop
                    }
                    return true; //Continue every-loop
                });
            });

            pushData(data, tempArray);

            data = spliceData(sortData(data));
            collection.remove();

            data.forEach(function (element) {
                delete element._id;
                collection.insert(element);
            });
        }
    });
}

function sortData(data){

    data.sort(function(obj1, obj2) {
        return obj2['score'] - obj1['score'];
    });
    return data;
}

function spliceData(data){

    data = data.slice(0, 5);

    return data;
}

function pushData(data, tempArray){

    for(var i = 0; i < tempArray.length; i++){

        data.push(tempArray[i]);
    }

    return data;
}

function checkValue(string){

    if(string === "N/A" || string === ""){

        string = "No information";
    }
    return string;
}

app.use(function(req, res) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', {url: req.url});
        return;
    }
});