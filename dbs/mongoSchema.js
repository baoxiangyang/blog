let Mongoose = require('mongoose'),
articleList_Schema =  new Mongoose.Schema({
	//id 为唯一索引不可重复
	id: {type: String, index: { unique: true, dropDups: true }},
	title: {type: String},
	time: {type: Date, default: Date.now},
	label: {type: String, default: ''},
	author: {type: String},
	description: {type: String},
	address: {type: String}
});
module.exports = {
	articleList_Schema
};