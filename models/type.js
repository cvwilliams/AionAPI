var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var typeSchema= new Schema({
	_id: Number,
	type: String
});

typeSchema.virtual('type_id').get(function() {
    return this._id;
});

module.exports = mongoose.model('Type', typeSchema);