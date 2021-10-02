const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoSchema = new Schema({
	name: {type:String, require:true},
	address: {type:String, require:true},
	roll_no: {type:String,require:false},
	student_image: {type:String,require:false},
	date_of_birth: {type:Date,require:false},
},{timestamp:true}) 

module.exports = mongoose.model('mongo-crud',mongoSchema);