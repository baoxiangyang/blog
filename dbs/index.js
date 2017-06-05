let mongoose = require('mongoose'),
	mongoConfig = require('../config/config.js').mongodb,
	db = mongoose.connect(`mongodb://${mongoConfig.user}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.dbs}`),
	articleDB = require('./articleDB.js'),
	userDB = require('./userDB.js');
	mongoose.Promise = global.Promise;

db.connection.on('open', function(){
	console.log('连接成功');
});

db.connection.on('error', function(err){
	console.log('连接错误', err);
});

let article = articleDB(db),
	user = userDB(db);

module.exports = Object.assign(article, user);
