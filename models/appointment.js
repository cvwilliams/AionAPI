var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var appointmentSchema= new Schema({
	client_id: ObjectId,
	employee_id: ObjectId,
	visit_reason: ObjectId,
	notes: String,
	geocode: {type: [], index: '2d'},
	timein: Date,
	timeout: Date,
	cancelled: Boolean
});

module.exports = mongoose.model('Appointment', appointmentSchema);
