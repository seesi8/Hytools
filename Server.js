const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.static(__dirname + '/'));
app.get('/', function(req, res) {
  var name = 'hello';
  res.sendFile(__dirname + "/baazar/default.html", {name:name});
});
var server = app.listen(5000, function () {
    console.log('Server is listening at port 5000...');
});