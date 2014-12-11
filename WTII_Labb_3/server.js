var application_root = __dirname,
    express         = require('express'), //Web framework
    morgan          = require('morgan'), // (since Express 4.0.0)
    bodyParser      = require('body-parser'), // (since Express 4.0.0)
    errorHandler    = require('errorhandler'), // (since Express 4.0.0)
    path            = require( 'path' ), // Utilities for dealing with file
    request         = require('request'),
    fs              = require('fs'),
    app             = express();

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

var server = app.listen( port, ipaddr, function() {
    console.log( 'Express server listening on port %d in %s mode',
        port, app.settings.env );
});

var io = require('socket.io').listen(server);

var parse = JSON.parse("{}");
try{
    parse = JSON.parse(fs.readFileSync('trafikFile.json'));
}
catch(e){
    console.log("Error");
}

var update = function(){

    var url = 'http://api.sr.se/api/v2/traffic/messages?format=json&size=5000&indent=true';

    request(url, function (err, resp, data){

        if(err !== true && resp.statusCode== 200 && resp.statusCode == undefined){

            var jsonData = JSON.parse(data);
            if(JSON.stringify(jsonData) !== JSON.stringify(parse)) {

                try {
                    parse = jsonData;
                    io.sockets.emit('load', jsonData);
                    fs.writeFile('trafikFile.json', data, function (err) {

                        if (err) throw err;
                    });
                }
                catch (e) {
                    fs.writeFile('trafikFile.json', "{}");
                }
            }
            else{
                console.log('Ingen ny data');
            }
        }
    });
};

update();
setInterval(update, 300000);

io.sockets.on('connection', function(client){

    client.emit('load', parse);
});
