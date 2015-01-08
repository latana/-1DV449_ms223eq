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
var gameTest = "gameTest4";
var topFive = "topFiveTest";

io.on("connection", function(socket){

    var collection = db.get(topFive);

    collection.find({}, function (err, data) {

      //  console.log(data[1]['title']);

        if(data.length !== 0) {

            data[1]['title'] = titleHandler(data[1]['title']);
            data[4]['title'] = titleHandler(data[4]['title']);

            for (i = 0; i < data.length; i++) {

                data[i]['title'] = titleHandler(data[i]['title']);
            }

            socket.emit('top-Five', data);
        }
    });

    /**
     * @param data object
     * Undersöker om titeln finns i databasen och gämför med timestamp. Om inte så görs ett anrop mot apierna.
     */
    socket.on('search', function (data) {

        var search = data.search;

    //    var platfrom = data.dropDown;

        var collection = db.get(gameTest);

        if(search !== undefined || search !== "") {

            collection.find({title: search.toLowerCase()}, function (err, data) {

                var date = new Date();
                var dateNow = date.getTime();

                if (data !== undefined && data.length === 1) {

                    if (Number(data[0]['timestamp']) < Number(dateNow)) {

                        collection.remove({_id: data[0]['_id']}, function (err, result) {

                            if (err) {
                                console.log(err);
                            }
                            else {
                                getIgn(search, socket);
                            }
                        });
                    }
                    else {

                        data[0]['title'] = titleHandler(data[0]['title']);

                        socket.emit('render', data[0])
                    }
                }
                else {
                    getIgn(search, socket);
                }
            });
        }
    });
});

function titleHandler(string){

    var title = string.split(" ");
    var tempTitle = "";
    var fullTitle = "";

    for (i in title) {

        tempTitle = title[i];
        fullTitle += tempTitle.substring(0,1).toUpperCase() + tempTitle.substring(1,tempTitle.length) + " ";
    }

  //  console.log(fullTitle);

    return fullTitle;
}

/**
 *
 * @param search string
 * @param ignArray array
 * @param socketToSendTo Object
 * @param platform number
 *
 * Gör ett anrop mot MetaCritic's api och kallar på omdb när den är klar
 */

/** function getMetaCritic(search, ignArray, socketToSendTo, platform) {

   // var metaCriticFile = JSON.parse(fs.readFileSync('MetaCritic.json'));

    //getIgn(search, metaCriticFile, socketToSendTo);
    // Requesten som du ska använda sen när du hämtar från deras api
     var request = unirest.post("https://byroredux-metacritic.p.mashape.com/find/game")
     .header("X-Mashape-Key", "7NUyQhIDn9mshTIkUcz4vivSR0jBp1p2SlajsnfMX3QASk21pL")
     .field("platform", platform)
     .field("retry", 1)
     .field("title", search)
     .end(function (result) {
            getOmdb(search, ignArray, result.body, socketToSendTo);
        });
} **/

/**
 *
 * @param search string
 * @param socketToSendTo object
 * @param platfrom number
 *
 * Gör ett anrop mot Ign's api och kallar på MetaCritic när den är klar
 */

function getIgn(search, socketToSendTo) {

    //var ignFile = JSON.parse(fs.readFileSync('Ign.json'));

   //mashup(metaArray, ignFile, socketToSendTo);
    // Requesten som du ska använda sen när du hämtar från deras api
        unirest.get("https://videogamesrating.p.mashape.com/get.php?count=1&game=" + search)
     .header("X-Mashape-Key", "7NUyQhIDn9mshTIkUcz4vivSR0jBp1p2SlajsnfMX3QASk21pL")
     .end(function (result) {
                console.log(result.body);
            getOmdb(search, result.body, socketToSendTo);
    });
}

/**
 *
 * @param search String
 * @param ignArray Array
 * @param metaObj Object
 * @param socketToSendTo Object
 *
 * Gör ett anrop mot imdb's api och kallar på mashup när den är klar
 */

function getOmdb(search, ignArray, socketToSendTo) {

    search = search.replace(/ /g, '+');

    unirest.get("http://www.omdbapi.com/?t=" + search + "&y=&plot=full&r=json")
        .end(function (result) {
            var omdbObj = JSON.parse(result.body);
            console.log(result.body);
            mashup(ignArray, omdbObj, socketToSendTo);
        });
}
app.get('/userlist', function (req, res) {

    // Get our form values. These rely on the "name" attributes
    /**    var userName = "testUser";
     var userEmail = "testEmail";

     // Set our collection
     var collection = db.get('usercollection');

     // Submit to the DB
     collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            console.log(err);
            console.log("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            console.log("success");
            // And forward to success page
        }
    }); **/


    /**    var db = req.db;
     var collection = db.get('test');
     console.log(collection);
     collection.find({},{},function(e,docs){
        res.render('userlist.html', {
            "userlist" : docs
        });
    }); **/
    /**   var collection = db.get(database);
     var result = collection.find({},function(err,data){
         console.log(data[0].username);
     });
     /**   db.open(function(err, db) {
        var collection = db.collection("usercollection");

        collection.findOne({}, function(err, item) {
                console.log(item.username);
                db.close();
            })
    }); **/
    //res.send(result);
});

/**
 *
 * @param hybrid object
 *
 * Sparar ner mashapen i en databas och sätter en timestamp på 5 min
 */

function storeInDataBase(hybrid) {
//  + 300000
    var date = new Date();
    var timeStamp = Number(date.getTime());
    hybrid['timestamp'] = timeStamp;

    var collection = db.get(gameTest);

    collection.insert({
        "title": hybrid['title'].toLowerCase(),
        "released": hybrid['released'],
        "score": hybrid['score'],
        "description": hybrid['description'],
        "publisher": hybrid['publisher'],
        "pic": hybrid['pic'],
        "platform": hybrid['platform'],
        "timestamp": hybrid['timestamp']

    }, function (err, doc) {
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
    });
}

/**
 *
 * @param ignArray array
 * @param metaObj object
 * @param omdbObj jsonObject
 * @param socketToSendTo object
 *
 * Lägger ihop de delar jag vill behålla och sätter ihopa poängen för att få ut snittet.
 * Kallar på storeInDataBase och skickar sedan data till klienten.
 */

function mashup(ignArray, omdbObj, socketToSendTo) {

    if(omdbObj['Response'] == "False" || isEmpty(ignArray)){

        var message = "The game could not be found";
        socketToSendTo.emit('render', message);
    }
    else {
        var hybrid = {};

        hybrid['title'] = ignArray[0]['title'];
        hybrid['released'] = omdbObj['Released'];
        hybrid['score'] = (Number(ignArray[0]['score']) + Number(omdbObj['imdbRating'])) / 2;
        hybrid['description'] = omdbObj['Plot'];
        hybrid['publisher'] = ignArray[0]['publisher'];
        hybrid['pic'] = omdbObj['Poster'];

        for (i in ignArray[0]['platforms']) {

            if (hybrid['platform'] == undefined) {

                hybrid['platform'] = (ignArray[0]['platforms'][i]);
            }
            else {
                hybrid['platform'] += ( ", " + ignArray[0]['platforms'][i]);
            }
        }
        storeInDataBase(hybrid);
        checkTopFive(hybrid);
        socketToSendTo.emit('render', hybrid);
    }
}

function checkTopFive(hybrid){

    var collection = db.get(topFive);

    collection.find({}, function (err, data) {

        if (data.length < 5) {

            for (i in data) {

                if (data[i]['title'] === hybrid['title'].toLowerCase()) {
                    return;
                }
            }
            collection.insert({
                "title": hybrid['title'].toLowerCase(),
                "released": hybrid['released'],
                "score": hybrid['score'],
                "description": hybrid['description'],
                "publisher": hybrid['publisher'],
                "pic": hybrid['pic'],
                "platform": hybrid['platform']
            });
        }
        else{

            for (i = 0; i < data.length; i++) {

                if(Number(data[i]['score']) < Number(hybrid['score'])){
                    data.splice(i, hybrid);
                    data.pop();

                }
            }
        }
    });
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
