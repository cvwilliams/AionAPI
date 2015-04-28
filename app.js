// Requires
var express = require('express');
var mongoose = require ("mongoose");

var app = express();
app.use(express.bodyParser());

var Appointment = require('./models/appointment');
var Client = require('./models/client');
var Employee = require('./models/employee');
var Type = require('./models/type');
 
 var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};


 
// Configure express
app.configure('development', function() {
	app.use(allowCrossDomain);
  mongoose.connect('mongodb://localhost/appointments');
});

app.configure('test', function() {
  mongoose.connect('mongodb://'+ process.env.WERCKER_MONGODB_HOST + '/appointments');
});

app.configure('production', function() {
	app.use(allowCrossDomain);
  mongoose.connect('mongodb://' + process.env.MONGOLAB_URI + '/appointments');
});



// GET Routes
app.get('/', function(req, res) {
  res.send({'version' : '1.1.0'});
});

app.get('/appointments', function(req, res) {
	Appointment.find().populate('client_id employee_id').exec(function (err, result){
		res.send(200,{status: 200,
						URL: '/appointments',
						request: 'GET',
						data: result
		});
	});
  });

app.get('/types', function(req, res) {
  Type.find(function(err, result) {
    res.send({status: 200,
					URL: '/types',
					request: 'GET',
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

app.get('/appointments/:year/:month/:date', function(req, res) {
  /*Appointment.find().populate('client_id employee_id').exec(function (err, result){
		res.send(200,{status: 200,
						URL: '/appointments',
						request: 'GET',
						data: result
		});
	});
	*/
	var curr_date = new Date(req.params.year + "-" + req.params.month + "-" + req.params.date);
	var next_date = new Date(req.params.year + "-" + req.params.month + "-" + ++req.params.date);
	
  
	  Appointment.where('date')
		.find()
		.gte(curr_date.getTime())
		.lt(next_date.getTime())
		.populate('client_id employee_id')
		.exec(function (err, result){
			if (err) {
			  res.send(500,
								{status: 500,
								URL: '/appointments/:year/:month/:date',
								error: err
						});
			} 
			else if (result.length == 0){
				res.send(404,{status: 404,
							URL: '/appointments/:year/:month/:date',
							temp: curr_date.getTime(),
							data: result
					});
			}
			else {
				res.send(200,{status: 200,
							URL: '/appointments/:year/:month/:date',
							data: result			
				});
			}
		  });
});

// POST Routes
app.post('/appointments', function(req,res) {
	var appointment;
	appointment = new Appointment({
		client_id: req.body.client,
		employee_id:  req.body.employee,
		notes: req.body.notes,
		lat: req.body.lat,
		lon: req.body.lon,
		date: req.body.date
	});
	appointment.save(function (err) {
		if (!err) {
		  return console.log("created");
		} else {
		  return console.log(err);
		}
	});
	return res.send(appointment);
});

app.post('/client', function(req,res) {
	var client;
	client = new Client({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		address: req.body.address,
		phone_num: req.body.phone_num,
		city: req.body.city,
		state: req.body.state
	});
	client.save(function (err) {
		if (!err) {
		  return console.log("created");
		} else {
		  return console.log(err);
		}
	});
	return res.send(client);
});

// PUT Routes
app.put('/appointments/:id/in', function(req, res) {
	var timestamp = req.body.timestamp;
	Appointment.findById(req.params.id, function (err, result) {
		result.timein = timestamp;
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
	var timestamp = req.body.timestamp;
	Appointment.findById(req.params.id, function (err, result) {
		result.timeout = timestamp;
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
	var timestamp = req.body.timestamp;
	Appointment.findById(req.params.id, function (err, result) {
		result.cancelled = timestamp;
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
  
  
 var landscape = new Appointment({client_id: "54e1114f0fa1f90300000003",employee_id: "54e1114f0fa1f90300000001", notes: "Test Note",lat: 38.897676,lon: -77.03653});
 landscape.save(function (err) {
 	if (err) return handleError(err);
  });

*/
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
var cady = new Employee({first_name: 'Tony',last_name: 'Banks',phone_num:'18009999999', employee_type:2});

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
 var landscape = new Appointment({client_id: tim._id,employee_id: cady._id, notes: "1. Clean the yard\n2.Rake the leaves",lat: 38.897676,lon: -77.03653, date: 1425272400010});
 var landscape2 = new Appointment({client_id: tim._id,employee_id: cady._id, notes: "Carefully spray the exterior with rodent repellent",lat: 40.742364,lon: -74.178593, date: 1425272400013});
  landscape.save(function (err) {
	if (err) return handleError(err);
 });
 
   landscape2.save(function (err) {
	if (err) return handleError(err);
 });*/