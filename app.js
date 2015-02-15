// Requires

var express = require('express');
var mongoose = require ("mongoose");

var app = express();
app.use(express.bodyParser());

var Appointment = require('./models/appointment');
var Client = require('./models/client');
var Employee = require('./models/employee');
var Type = require('./models/type');

var type1 = new Type({_id:1,type: "Technician"});
var type2 = new Type({_id:2,type: "Owner"});

type1.save(function (err) {
	if (err) return handleError(err);
 });
 
 type2.save(function (err) {
	if (err) return handleError(err);
 });

// Configure express
app.configure('development', function() {
  mongoose.connect('mongodb://localhost/appointments');
});

app.configure('test', function() {
  mongoose.connect('mongodb://'+ process.env.WERCKER_MONGODB_HOST + '/appointments');
});

app.configure('production', function() {
  mongoose.connect('mongodb://' + process.env.MONGOLAB_URI + '/appointments');
});

// Routes
app.get('/', function(req, res) {
  res.send({'version' : '0.0.1'});
});

app.get('/appointments', function(req, res) {
  Appointment.find(function(err, result) {
    res.send(result);
  });
});

app.get('/types', function(req, res) {
  Type.find(function(err, result) {
    res.send(result);
  });
});

app.get('/appointments/:notes', function(req, res) {
  Appointment.findOne({'notes': req.params.notes}, function(err, result) {
    if (err) {
      res.status(500);
      res.send(err);
    } else {
      res.send({result: result});
    }
  });
});

app.post('/appointments', function(req, res) {
  new Appointment({notes: req.body.notes}).save();
  res.send({'new appointment' : req.body.notes});
});

// startup server
port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on port number: ", port);
});

module.exports = app;