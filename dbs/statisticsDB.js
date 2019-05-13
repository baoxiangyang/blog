//访问统计
let Mongoose = require('mongoose'),
	statistics_Schema = new Mongoose.Schema({
		ip: {type: String, default: ''},
		url: {type: String, default: ''},
		method: {type: String, default: ''},
		userName: {type: String, default: ''},
		time: {type: Date, default: Date.now},
	});
const StatisticsModel  = Mongoose.model('statistics', statistics_Schema);
module.exports = {
	insertStatistic(data) {
		return StatisticsModel(data).save();
	},
	findStatistic(data) {
		return StatisticsModel.find(data);
	}
};