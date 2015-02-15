var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var employeeSchema= new Schema({
	first_name: String,
	last_name: String,
	phone_num: String,
	employee_type: { type: Number, ref: 'Type' }
});

employeeSchema.virtual('employee_id').get(function() {
    return this._id;
});

module.exports = mongoose.model('Employee', employeeSchema);