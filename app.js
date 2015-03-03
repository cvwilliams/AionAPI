// Requires
var express = require('express');
var mongoose = require ("mongoose");

var app = express();
app.use(express.bodyParser());

var Appointment = require('./models/appointment');
var Client = require('./models/client');
var Employee = require('./models/employee');
var Type = require('./models/type');
 
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



// GET Routes
app.get('/', function(req, res) {
  res.send({'version' : '1.0.1'});
});

app.get('/appointments', function(req, res) {
  Appointment.find(function(err, result) {
	res.status(200);
    res.send({status: 200,
					URL: '/appointments',
					data: result			
	});
  });
});

app.get('/types', function(req, res) {
  Type.find(function(err, result) {
    res.status(200);
    res.send({status: 200,
					URL: '/types',
					data: result			
	});
  });
});

app.get('/clients', function(req, res) {
  Client.find(function(err, result) {
    res.status(200);
    res.send({status: 200,
					URL: '/clients',
					data: result			
	});
  });
});

app.get('/employees', function(req, res) {
  Employee.find(function(err, result) {
    res.status(200);
    res.send({status: 200,
					URL: '/employees',
					data: result			
	});
  });
});

app.get('/appointments/:date', function(req, res) {
  Appointment.find({date: req.params.date}, function(err, result) {
    if (err) {
      res.status(500);
      res.send({status: 500,
						URL: '/appointments/:date',
						error: err
				});
    } else {
      	res.status(200);
		res.send({status: 200,
					URL: '/appointments/:date',
					data: result			
	});
    }
  });
});

// PUT Routes
app.put('/appointments/:id/in', function(req, res) {
	Appointment.findById(req.params.id, function (err, result) {
		result.timein = new Date(Date.now());
		return result.save(function (err) {
		  if (!err) {
			console.log("updated");
		  } else {
			console.log(err);
		  }
		  return res.send(result);
		});
	});
});

app.put('/appointments/:id/out', function(req, res) {
	Appointment.findById(req.params.id, function (err, result) {
		result.timeout = Date.now();
		return result.save(function (err) {
		  if (!err) {
			console.log("updated");
		  } else {
			console.log(err);
		  }
		  return res.send(result);
		});
	});
});

app.put('/appointments/:id/cancel', function(req, res) {
	Appointment.findById(req.params.id, function (err, result) {
		result.cancelled = Date.now();
		return result.save(function (err) {
		  if (!err) {
			console.log("updated");
		  } else {
			console.log(err);
		  }
		  return res.send(result);
		});
	});
});

// startup server
port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on port number: ", port);
});

module.exports = app;

//Sample Data

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
 var landscape = new Appointment({client_id: "54e1114f0fa1f90300000003",employee_id: "54e1114f0fa1f90300000001", notes: "Test Note",lat: 38.897676,lon: -77.03653, date: 1425272400010});
 var landscape2 = new Appointment({client_id: "54e1114f0fa1f90300000003",employee_id: "54e1114f0fa1f90300000001", notes: "Test Note",lat: 38.897676,lon: -77.03653, date: 1425272400013});
  landscape.save(function (err) {
	if (err) return handleError(err);
 });
 
   landscape2.save(function (err) {
	if (err) return handleError(err);
 });*/