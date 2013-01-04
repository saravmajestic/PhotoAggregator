//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , fs = require('fs')
    , port = (process.env.PORT || 8081),
    mongoose = require('mongoose');;

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
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

    require(__dirname + "/views/dust_compiled/layout.js");
    require(__dirname + "/views/dust_compiled/index.js");
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
server.get('/getdata', function(req,res){
    /*res.render('new.jade', {
        locals : {
            title : 'Your Page Title'
            ,description: 'Your Page Description'
            ,author: 'Your Name'
            ,analyticssiteid: 'XXXXXXX'
        }
    });*/


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
