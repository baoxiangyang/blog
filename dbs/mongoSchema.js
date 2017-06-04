let Mongoose = require('mongoose'),
//文章数据
articleList_Schema =  new Mongoose.Schema({
	//id 为唯一索引不可重复
	id: {type: String, index: { unique: true, dropDups: true }},
	title: {type: String},
	time: {type: Date, default: Date.now},
	label: {type: Array, default: []},
	author: {type: String, default: ''},
	source: {type: String, default: ''},
	description: {type: String},
	address: {type: String}
}),
//用户数据
user_Schema =  new Mongoose.Schema({
	userName: {type: String, index: { unique: true, dropDups: true }},
	passwrod: {type: String},
	email: {type: String, unique: true},
	avatarImg: {type: String, default: ''},
	time: {type: Date, default: Date.now}
});
module.exports = {
	articleList_Schema,
	user_Schema
};