var express = require('express');
var app = express();

//app.use(express.static('public'));
app.use('/static', express.static('public'));
//app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/settings', function (req, res) {
   res.sendFile( __dirname + "/" + "settings.html" );
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

