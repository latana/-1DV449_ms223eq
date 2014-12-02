var application_root = __dirname,
    express         = require('express'), //Web framework
    morgan          = require('morgan'), // (since Express 4.0.0)
    bodyParser      = require('body-parser'), // (since Express 4.0.0)
    errorHandler    = require('errorhandler'), // (since Express 4.0.0)
    path            = require( 'path' ), // Utilities for dealing with file
    request         = require('request');
    fs              = require('fs');
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

app.get('/map', function(req, res) {

 /**   request('http://api.sr.se/api/v2/traffic/messages?format=json&size=5000&indent=true', function(error, response, body){

        if(!error && response.statusCode == 200) {

            fs.writeFile('trafikFile.json',body, function(error){

                console.log('Saved to file!');
            });
            res.send(JSON.parse(body));
        }
    }); **/
 res.send(JSON.parse(fs.readFileSync('trafikFile.json')));
});
