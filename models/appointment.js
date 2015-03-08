var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var appointmentSchema= new Schema({
	client_id: {type: ObjectId, ref: 'Client'},
	employee_id: ObjectId,
	notes: String,
	lat: Number,
	lon: Number,
	timein: Date,
	timeout: Date,
	cancelled: Date,
	date: Number
});

appointmentSchema.virtual('appointment_id').get(function() {
    return this._id;
});

module.exports = mongoose.model('Appointment', appointmentSchema);
