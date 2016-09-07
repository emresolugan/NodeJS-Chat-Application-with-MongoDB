var express = require('express');
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require('http').Server(app);
var io = require('socket.io')(http);

/**
 * Controllers (route handlers).
 */
const accountController = require('./controller/account_controller');
const homeController = require('./controller/home_controller');

/**
 * Connect to MongoDB.
 */
mongoose.connect('mongodb://localhost:27017/chatdb');
mongoose.connection.on('error', () => {
console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
process.exit(1);
});

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/models'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());



/**
 * Route Maps
 */

app.post('/Register.html', accountController.postRegister);
app.get('/Register' ,accountController.getRegister);
app.get('/Login' ,accountController.getLogin);
app.post('/Login.html', accountController.postLogin);
app.get('/index', homeController.getIndex);

//app.get('/', function (req, res) {
//   res.sendFile('index.html');
//});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){ //tüm socket olaylarýnda çalýþýr. bir kullanýcýnýn baðlanmasý, clientten sunucuya istek yollanmasý gibi. 
console.log('User Connected..'); //
socket.on('disconnect', function(){ //disconnect olayýnda çalýþan fonksiyon
console.log('User Disconnected..');
});
 
socket.on('chat', function(msg){ //index.htmlden soket üzerinden sohbetmesaj olayý geldiðinde çalýþacak. 
console.log('Mesaj: ' + msg); //konsolda mesajý yazdýr. 
io.emit('chat', msg); //sunucudan diðer clientlere sohbetmesaj ve mesajý gönder
});
});
 
module.exports = app;
  
