// Requires
var express = require('express');
var mongoose = require ("mongoose");

var app = express();
app.use(express.bodyParser());

var Appointment = require('./models/appointment');
var Client = require('./models/client');
var Employee = require('./models/employee');
var Type = require('./models/type');


/*
var type1 = new Type({_id:1,type: "Technician"});
var type2 = new Type({_id:2,type: "Owner"});

type1.save(function (err) {
	if (err) return handleError(err);
 });
 
 type2.save(function (err) {
	if (err) return handleError(err);
 });
 
var john = new Employee({first_name: 'John',last_name: 'Tucker',phone_num:'18009999999', employee_type:1});
var cady = new Employee({first_name: 'Cady',last_name: 'Heron',phone_num:'18009999999', employee_type:2});

john.save(function (err) {
	if (err) return handleError(err);
 });
 
 cady.save(function (err) {
	if (err) return handleError(err);
 });

var tim = new Client({first_name: 'Timmy',last_name: 'Turner',phone_num:'18009999999', address: '1600 Pennsylvania Ave.',city: 'Washington'});
var tom = new Client({first_name: 'Tom',last_name: 'Hanks',phone_num:'18009999999', address: '1601 Pennsylvania Ave.',city: 'Washington'});
 
 tim.save(function (err) {
	if (err) return handleError(err);
 });
 
 tom.save(function (err) {
	if (err) return handleError(err);
 });
 */
 
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

app.get('/clients', function(req, res) {
  Client.find(function(err, result) {
    res.send(result);
  });
});

app.get('/employees', function(req, res) {
  Employee.find(function(err, result) {
    res.send(result);
  });
});

app.get('/appointments/:id', function(req, res) {
  Appointment.findOne({'_id': req.params.id}, function(err, result) {
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