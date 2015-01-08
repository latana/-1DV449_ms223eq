/**
 * Created by Latana on 2014-12-12.
 */
var application_root = __dirname,
    express         = require('express'), //Web framework
    morgan          = require('morgan'), // (since Express 4.0.0)
    bodyParser      = require('body-parser'), // (since Express 4.0.0)
    errorHandler    = require('errorhandler'), // (since Express 4.0.0)
    path            = require( 'path' ), // Utilities for dealing with file
    request         = require('request'),
    fs              = require('fs'),
    unirest         = require('unirest'),
    app             = express(),
    mongo           = require('mongodb'),
    monk            = require('monk'),
    db              = monk('localhost:27017/test'),
    router          = express.Router();

var env = process.env.NODE_ENV || 'development';


if ('development' == env) {

    app.use('/', express.static(path.join(application_root, 'app')));
    app.use(morgan('dev'));
    app.use(bodyParser());
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
};

//Start server
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8000;

app.set('ipaddr', ipaddr);
app.set('port', port);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


var server = app.listen( port, ipaddr, function() {
    console.log( 'Express server listening on port %d in %s mode',
        port, app.settings.env );
});

var client;
var io = require('socket.io').listen(server);
var database = "usercollection";

app.post('/', function(request, response){

    var collection = db.get(database);
    var result = collection.find({title: request.body.search},function(err,data){

        var date = new Date();
        var dateNow = date.getTime();

        if(data.length === 1){

            if(Number(data[0]['timestamp']) < Number(dateNow)){

                collection.remove({_id: data[0]['_id']}, function(err, result) {

                    if (err) {
                        console.log(err);
                    }
                    else{
                        getMetaCritic(request.body.search);
                    }
                });
            }
            else{
                // rendera ut datan från database
                io.sockets.emit('render', data[0])
            }
        }
        else{
            //skickar det som användaren matat in i fältet
             getMetaCritic(request.body.search);
        }
    });

});

function getMetaCritic(search) {

    var metaCriticFile = JSON.parse(fs.readFileSync('MetaCritic.json'));

    getIgn(search,metaCriticFile);
    // Requesten som du ska använda sen när du hämtar från deras api
/**    var request = unirest.post("https://byroredux-metacritic.p.mashape.com/find/game")
        .header("X-Mashape-Key", "7NUyQhIDn9mshTIkUcz4vivSR0jBp1p2SlajsnfMX3QASk21pL")
        .field("platform", 1)
        .field("retry", 4)
        .field("title", search)
        .end(function (result) {

            getIgn(search, result.body);
        }); **/
}

function getIgn(search, metaArray){

    var ignFile = JSON.parse(fs.readFileSync('Ign.json'));

    mashup(metaArray, ignFile);
    // Requesten som du ska använda sen när du hämtar från deras api
/**    unirest.get("https://videogamesrating.p.mashape.com/get.php?count=1&game=" + search)
     .header("X-Mashape-Key", "7NUyQhIDn9mshTIkUcz4vivSR0jBp1p2SlajsnfMX3QASk21pL")
     .end(function (result) {
            mashup(metaArray, result.body);
    }); **/
}

app.get('/userlist', function(req, res) {

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


router.get('/gamescore', function(req, res) {
    res.render('index', { title: 'Express' });
});

app.get('/', function(req, res) {

    console.log('testing');
});

function storeInDataBase(hybrid){

    var date = new Date();
    var timeStamp = date.getTime() + 300000;
    hybrid['timestamp'] = timeStamp;


    var collection = db.get(database);

    collection.insert({
        "title" : hybrid['title'],
        "released" : hybrid['released'],
        "score" : hybrid['score'],
        "description" : hybrid['description'],
        "publisher" : hybrid['publisher'],
        "developer" : hybrid['developer'],
        "pic" : hybrid['pic'],
        "platform" : hybrid['platform'],
        "timestamp" : hybrid['timestamp']

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
    });


// Get our form values. These rely on the "name" attributes
 //   var userName = "testUser";
 //   var userEmail = "testEmail";

    // Set our collection
   /** var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "title" : hybrid['title'],
        "released" : hybrid['released'],
        "score" : hybrid['score'],
        "description" : hybrid['description'],
        "publisher" : hybrid['publisher'],
        "developer" : hybrid['developer'],
        "pic" : hybrid['pic'],
        "platform" : hybrid['platform'],
        "timestamp" : hybrid['timestamp']

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

}

function mashup(metaArray, ignArray){

    var hybrid = {};

    hybrid['title'] = metaArray['result']['name'];
    hybrid['released'] = metaArray['result']['rlsdate'];
    hybrid['score'] = Number(metaArray['result']['score'] / 10 + Number(ignArray[0]['score'])) / 2;
    hybrid['description'] = metaArray['result']['summary'];
    hybrid['publisher'] = ignArray[0]['publisher'];
    hybrid['developer'] = metaArray['result']['developer'];
    hybrid['pic'] = ignArray[0]['thumb'];

    for(i in ignArray[0]['platforms']){

        if(hybrid['platform'] == undefined) {

            hybrid['platform'] = (ignArray[0]['platforms'][i] + ",");
        }
        else{
            hybrid['platform'] += (ignArray[0]['platforms'][i] + ",");
        }
    }

    storeInDataBase(hybrid);

    io.sockets.emit('render', hybrid);
}