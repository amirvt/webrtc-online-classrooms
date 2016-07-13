var config = require('./config.js').default;
var N = require('./nuve');
N.API.init(config.service.id, config.service.key, config.nuve_host);

var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync(__dirname + '/sslcert/server.key', 'utf8');
var certificate = fs.readFileSync(__dirname + '/sslcert/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var express = require('express');
var app = express();
var http = require('http').Server(app);
var httpsServer = https.createServer(credentials, app);
var io = require('socket.io')(httpsServer);

var roomData = require('roomdata');
var SocketEvent = require('./../src/constants/serverconstants').SocketEvent;
var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


app.use(express.static(__dirname + '/../dist'));

//TODO make into constant
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.post('/createRoom/', function (req, res) {

  N.API.createRoom('myRoom', function (roomID) {
    res.send(roomID);
  }, function (e) {
    res.status(500);
    res.send(e);
  });
});

app.get('/getRooms/', function (req, res) {

  N.API.getRooms(function (rooms) {
    res.send(rooms);
  }, function (e) {
    res.status(500);
    res.send("Internal Server Error");
  });
});

app.get('/getUsers/:room', function (req, res) {

  var room = req.params.room;
  N.API.getUsers(room, function (users) {
    res.send(users);
  }, function (e) {
    res.status(500);
    res.send("Internal Server Error");
  });
});

app.post('/createToken/:room', function (req, res) {

  var room = req.params.room;
  var username = req.body.username;
  var role = req.body.role;
  N.API.createToken(room, username, role, function (token) {
    res.send(token);
  }, function (e) {
    res.status(500);
    res.send("Internal Server Error");
  });
});

app.post('/getOrCreateRoom/', function (req, res) {
  var username = req.body.username;
  var roomName = req.body.roomName;
  var role = req.body.role;

  var createToken = function (id, username, role) {
    N.API.createToken(id, username, role, function (token) {
      res.send({token: token, roomId: id});
    }, function (e) {
      res.status(500);
      res.send({error: e});
    });
  };

  N.API.getRooms(function (roomList) {
    let rooms = JSON.parse(roomList);
    let room = rooms.find((room) => room.name === roomName);
    if (room) {
      createToken(room._id, username, role);
    } else {
      N.API.createRoom(roomName, function (room) {
        createToken(room._id, username, role);
      }, function (e) {
        res.status(500);
        res.send(e);
      });
    }
  }, function (e) {
    res.status(500);
    res.send(e);
  });
});


function isPresenter(socket) {
  return roomData.get(socket, 'info').presenter === socket.username;
}

io.on('connection', function (socket) {
  socket.on(SocketEvent.JOIN_ROOM, function (roomName, username) {

    socket.room = roomName;
    socket.username = username;
    roomData.joinRoom(socket, roomName);
    var info = roomData.get(socket, 'info');

    if (info) {
      socket.emit(SocketEvent.ROOM_INFO, JSON.stringify(info));
    } else {
      roomData.set(socket, 'info', {});
    }
  });

  socket.on(SocketEvent.REQ_PRESENTER, function () {
    var info = roomData.get(socket, 'info');
    if (info.presenter) {
      socket.emit(SocketEvent.REJECT_PRESENTER);
    } else {
      info.presenter = socket.username;
      roomData.set(socket, 'info', info);
      socket.emit(SocketEvent.ACCEPT_PRESENTER);
      socket.broadcast.to(socket.room).emit(SocketEvent.PRESENTATION_START, socket.username);
    }
  });

  socket.on(SocketEvent.STOP_PRESENTER, function () {
    if (isPresenter(socket)) {
      var info = roomData.get(socket, 'info');
      if (info.presenter) {
        info.presenter = null;
        roomData.set(socket, 'info', info);
        socket.broadcast.to(socket.room).emit(SocketEvent.PRESENTATION_STOP);
      }
    }
  });

  socket.on('disconnect', function () {
    if (isPresenter(socket)) {
      var info = roomData.get(socket, 'info');
      if (info.presenter) {
        info.presenter = null;
        roomData.set(socket, 'info', info);
        socket.broadcast.to(socket.room).emit(SocketEvent.PRESENTATION_STOP);
      }
    }
  });


  socket.on(SocketEvent.SET_SNAPSHOT, function (snapShot) {
    if (isPresenter(socket)) {
      var info = roomData.get(socket, 'info');
      info.snapShot = snapShot;
      roomData.set(socket, 'info', info);
      io.sockets.in(socket.room).emit(SocketEvent.SET_SNAPSHOT, snapShot);
    }
  });

  socket.on(SocketEvent.SET_PDF_FILE, function (pdfFile) {
    if (isPresenter(socket)) {
      var info = roomData.get(socket, 'info');
      info.pdfFile = pdfFile;
      roomData.set(socket, 'info', info);
      io.sockets.in(socket.room).emit(SocketEvent.SET_PDF_FILE, pdfFile);
    }
  });

  socket.on(SocketEvent.SET_PAGE, function (pageNumber) {
    if (isPresenter(socket)) {
      var info = roomData.get(socket, 'info');
      info.pageNumber = pageNumber;
      roomData.set(socket, 'info', info);
      io.sockets.in(socket.room).emit(SocketEvent.SET_PAGE, pageNumber);
    }
  });
});

http.listen(3015);
console.log("listening on 3015");
httpsServer.listen(3016);
console.log("https listening on 3016");
