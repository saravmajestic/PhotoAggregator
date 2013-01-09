//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , fs = require('fs')
    , port = (process.env.PORT || 8081),
    querystring = require('querystring'),
    url = require('url'),
    OAuth = require('oauth').OAuth,
    mongoose = require('mongoose');;
global.ROOT_PATH = __dirname;
global.ctx = "http://localhost:8081/";
//Setup Express
var server = express.createServer();
var sessionOA = null;
server.configure(function(){
    server.set('views', ROOT_PATH + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(ROOT_PATH + '/static'));
    server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: { 
                  title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX' 
                },status: 404 });
    } else {
        res.render('500.jade', { locals: { 
                  title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err 
                },status: 500 });
    }
});
server.listen( port);

//Setup Socket.IO
var io = io.listen(server);
io.sockets.on('connection', function(socket){
  console.log('Client Connected');
  socket.on('message', function(data){
    socket.broadcast.emit('server_message',data);
    socket.emit('server_message',data);
  });
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', function(req,res){
    /*res.render('index.jade', {
     locals : {
     title : 'Your Page Title'
     ,description: 'Your Page Description'
     ,author: 'Your Name'
     ,analyticssiteid: 'XXXXXXX'
     }
     });
     return false;*/
    var dust = require('./lib/dust/dust.js');

//    var filePath = ;//using dirname to get absolute path, as it is looking in node bin folder
//    exports.index = function(req, res){
//    	  res.render('index', { title: 'Express' });
//    	};
    //    console.log(filePath, dust);

    require(ROOT_PATH + "/views/dust_compiled/layout.js");
    require(ROOT_PATH + "/views/dust_compiled/index.js");
//    fs.readFile(filePath, 'utf-8', function (err, data) {
//    	if (err) {
//            console.log(err);
//            res.end();
//    }
//    else {
//        var fn = dust.compileFn(data.toString(), "index")
//        fn({ name: "Bala" }, function (err, out) {
//            res.end(out);
//        })
    var dust_baseObj = require("./static/js/dust_base.js");
    var index_base = dust_baseObj.dust_base();

    dust.stream("index", index_base.push({ name: "Sarav" })).on('data', function(out){
        Schema = mongoose.Schema;
        db = mongoose.connect('mongodb://localhost:27017/test');

        var authorSchema = new Schema({
            author : String,
            note : String
        });

        mongoose.model('author', authorSchema);

        var Note = mongoose.model('author');

        var newNote = new Note();
        newNote.author = "Dan Brown";
        newNote.note = "The Lost Symbol";

        var callback = function(isSuccess){
            console.log("into callback");
            if (isSuccess) {
                res.write(JSON.stringify({"success" : true}));
            }
            else {
                res.write(JSON.stringify({"success" : false}));
            }
//            res.end("");
        }

        //Adding data to mongoDB
        newNote.save(function(err,arg2) {
            console.log("into save");
            if (err) {
//                util.log('FATAL ' + err);
                callback(err);
            }
            else {
                callback(true);
            }
        });

        //Retriving data from MongoDB
        Note.find({}, function(err,doc){
            if (err) {
                res.write(JSON.stringify({"success" : false, "err" : (err)}));
            }
            else {
                res.write("<br/>");
                res.write(JSON.stringify(doc));
            }
            res.end();
        });

        res.write(out);
    }).on('end', function(data){
//			return (this.response);
        }).on('error', function(err){
            //alert(err);
        });
});
server.get('/home', function(req,res){
    var dust = require(ROOT_PATH + '/lib/dust/dust.js');

    require(ROOT_PATH + "/views/dust_compiled/layout.js");
    require(ROOT_PATH + "/views/dust_compiled/home/index.js");

    var dust_baseObj = require("./static/js/dust_base.js");
    var index_base = dust_baseObj.dust_base();

    dust.stream("index", index_base.push({ name: "Sarav" })).on('data', function(out){
        res.end(out);
    });

});
server.get('/post', function(req,res){
    var PICASA_PHOTOS_URL = 'https://picasaweb.google.com/data/feed/api/user/110663635516294480741/albumid/5695112248738355201?alt=json';
//     PICASA_ALBUMS_URL = 'https://picasaweb.google.com/data/feed/api/user/110663635516294480741?alt=json';//Get List of Albums
    var PICASA_ALBUMS_URL = "https://picasaweb.google.com/data/feed/api/user/110663635516294480741?kind=album&alt=json";

    if(!sessionOA){
        res.redirect('/google_login');
        res.end();
        return ;
    }
    req.session.oa = sessionOA.oa;
    req.session.oauth_token = sessionOA.oauth_token;
    req.session.oauth_token_secret = sessionOA.oauth_token_secret;
    req.session.oa._headers['GData-Version'] = '3.0';

    req.session.oa.getProtectedResource(
        PICASA_ALBUMS_URL,
        "GET",
        req.session.oauth_access_token,
        req.session.oauth_access_token_secret,
        function (error, data, response) {
        //console.log(data);
            var feed = JSON.parse(data), entries = feed.feed.entry;
            var dust = require(ROOT_PATH + '/lib/dust/dust.js');

            require(ROOT_PATH + "/views/dust_compiled/layout.js");
            require(ROOT_PATH + "/views/dust_compiled/home/showphotos.js");

            var dust_baseObj = require("./static/js/dust_base.js");
            var index_base = dust_baseObj.dust_base();

            dust.stream("showphotos", index_base.push({ "albums": entries })).on('data', function(out){
                res.end(out);
            });
        });
   /* return false;

    var GDClientData = require('gdata');
    var GDClient =  GDClientData.GDClient;

    var google = new GDClient('355369241753.apps.googleusercontent.com', 'tbT3y_vOeg6NkwLSlAxT78PE');
//    console.log(google);
// call getAccessToken() to obtain, or setAccessToken() if you have one
    var url_parts = url.parse(req.url, true);
    var oauth_token = sessionOA.oauth_token;
//    console.log(oauth_token);
    google.setAccessToken(oauth_token);
//    console.log(google.getAccessToken());
    google.get(PICASA_ALBUMS_URL, function(err, feed) {//console.log(err, feed);
        if(err){
            res.end(JSON.stringify(err));
        }else{
        feed.getEntries().forEach(function(entry) {
            res.end('album: ' + entry.getTitle());
        });
        }
    });*/


});
server.post('/upload', function(reqs,res){
    ///*var header = {'GData-Version:  2', $authHeader, 'Content-Type: image/jpeg', 'Content-Length: ' . fileSize, 'Slug: cute_baby_kitten.jpg'};
    var sourceFile = reqs.files.source;
    //Get the binary image data
    var fileSize = sourceFile.size;
    var options = {
        host: "picasaweb.google.com",
        port: 80,
        path: '/data/feed/api/user/110663635516294480741/albumid/5695112248738355201',
        method: 'POST',
        //"POSTFIELDS" : sourceFile,
        headers: {
            'Content-Type': 'image/jpeg',
            'Content-Length': fileSize,
            'GData-Version' : 3,
            'Slug' : 'cute_baby_kitten.jpg'
        }
    };
    var http = require("http");
    var req = http.request(options, function(resp) {
        console.log('STATUS: ' + resp.statusCode);
        console.log('HEADERS: ' + JSON.stringify(resp.headers));
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });

        resp.on('end', function (chunk) {
            console.log('DONE: '    );
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

// write data to request body
    req.write('data\n');
    req.write('data\n');
    req.end();

    return;


//console.log(req.files.source);
//    req.form.on('progress', function(bytesReceived, bytesExpected){
//        var percent = (bytesReceived / bytesExpected * 100) | 0;
//        res.write('Uploading: %' + percent + '\r');
//    });
//
//    return false;
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();
//console.log(form);
    form.on('progress', function(bytesReceived, bytesExpected) {
        console.log("hih");
    });
    /*form.parse(req, function(err, fields, files) {console.log("hi");
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
    });*/
    form.on('end', function() {

    });
    return;
var sourceFile = req.files.source;

//    var imgName = $_SERVER['DOCUMENT_ROOT'] . '/picasa/cute_baby_kitten.jpg';

//Get the binary image data
    var fileSize = sourceFile.size;
//    $imgData = sourceFile;

    /*var header = {'GData-Version:  2', $authHeader, 'Content-Type: image/jpeg', 'Content-Length: ' . fileSize, 'Slug: cute_baby_kitten.jpg'};
    var data = sourceFile; //Make sure the image data is NOT Base64 encoded otherwise the upload will fail with a "Not an image" error

    $ret = "";
    $ch  = curl_init($albumUrl);
    $options = array(
        CURLOPT_SSL_VERIFYPEER=> false,
        CURLOPT_POST=> true,
        CURLOPT_RETURNTRANSFER=> true,
        CURLOPT_HEADER=> true,
        CURLOPT_FOLLOWLOCATION=> true,
        CURLOPT_POSTFIELDS=> $data,
        CURLOPT_HTTPHEADER=> $header
    );
    curl_setopt_array($ch, $options);
    $ret = curl_exec($ch);
    curl_close($ch);*/
});
server.get('/showalbum', function(req,res){
    var url_parts = url.parse(req.url, true);
    var PICASA_PHOTOS_URL = 'https://picasaweb.google.com/data/feed/api/user/110663635516294480741/albumid/'+url_parts.query.id+'?alt=json';

    if(!sessionOA){
        res.redirect('/google_login');
        res.end();
        return ;
    }
    req.session.oa = sessionOA.oa;
    req.session.oauth_token = sessionOA.oauth_token;
    req.session.oauth_token_secret = sessionOA.oauth_token_secret;
    req.session.oa._headers['GData-Version'] = '3.0';
console.log(req.session.oa);
    req.session.oa.getProtectedResource(
        PICASA_PHOTOS_URL,
        "GET",
        req.session.oauth_access_token,
        req.session.oauth_access_token_secret,
        function (error, data, response) {
            //console.log(data);
            var feed = JSON.parse(data), entries = feed.feed.entry;
            var dust = require(ROOT_PATH + '/lib/dust/dust.js');

            require(ROOT_PATH + "/views/dust_compiled/layout.js");
            require(ROOT_PATH + "/views/dust_compiled/home/showphotos.js");

            var dust_baseObj = require("./static/js/dust_base.js");
            var index_base = dust_baseObj.dust_base();

            dust.stream("showphotos", index_base.push({ "photos": entries })).on('data', function(out){
                res.end(out);
            });
        });


});
// Request an OAuth Request Token, and redirects the user to authorize it
server.get('/google_login', function(req, res) {

    var getRequestTokenUrl = "https://www.google.com/accounts/OAuthGetRequestToken";

    // GData specifid: scopes that wa want access to
    var gdataScopes = [
//        querystring.escape("https://www.google.com/m8/feeds/"),
//        querystring.escape("https://www.google.com/calendar/feeds/"),
        querystring.escape("https://picasaweb.google.com/data/")
    ];

    var oa = new OAuth(getRequestTokenUrl+"?scope="+gdataScopes.join('+'),
        "https://www.google.com/accounts/OAuthGetAccessToken",
        "anonymous",
        "anonymous",
        "1.0",
        "http://localhost:8081/google_cb"+( req.param('action') && req.param('action') != "" ? "?action="+querystring.escape(req.param('action')) : "" ),
        "HMAC-SHA1");

    oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
        if(error) {
            console.log('error');
            console.log(error);
        }
        else {
            // store the tokens in the session
            req.session.oa = oa;
            req.session.oauth_token = oauth_token;
            req.session.oauth_token_secret = oauth_token_secret;

            sessionOA = {};
            sessionOA["oa"] = oa;
            sessionOA["oauth_token"] = oauth_token;
            sessionOA["oauth_token_secret"] = oauth_token_secret;

            // redirect the user to authorize the token
            res.redirect("https://www.google.com/accounts/OAuthAuthorizeToken?oauth_token="+oauth_token);
        }
    })

});
// Callback for the authorization page
server.get('/google_cb', function(req, res) {

    // get the OAuth access token with the 'oauth_verifier' that we received
    req.session.oa = sessionOA.oa;
    req.session.oauth_token = sessionOA.oauth_token;
    req.session.oauth_token_secret = sessionOA.oauth_token_secret;
    req.session.oa.getOAuthAccessToken(
        req.session.oauth_token,
        req.session.oauth_token_secret,
        req.param('oauth_verifier'),
        function(error, oauth_access_token, oauth_access_token_secret, results2) {

            if(error) {
                console.log('error');
                console.log(error);
            }
            else {

                // store the access token in the session
                req.session.oauth_access_token = oauth_access_token;
                req.session.oauth_access_token_secret = oauth_access_token_secret;

                res.redirect((req.param('action') && req.param('action') != "") ? req.param('action') : "/post");
            }

        });

});
//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://127.0.0.1:' + port );
