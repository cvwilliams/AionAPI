var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var clientSchema= new Schema({
	first_name: String,
	last_name: String,
	address: String,
	phone_num: String,
	city: String
});

clientSchema.virtual('client_id').get(function() {
    return this._id;
});

module.exports = mongoose.model('Client', clientSchema);