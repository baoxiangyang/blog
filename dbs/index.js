let mongoose = require('mongoose');
	mongoose.Promise = global.Promise;
let mongoConfig = require('../config/config.js').mongodb,
db = mongoose.connect(`mongodb://${mongoConfig.user}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.dbs}`, {useMongoClient: true}),
articleDB = require('./articleDB.js'),
userDB = require('./userDB.js'),
messageDb = require('./messageDb.js'),
statisticsDb = require('./statisticsDB.js');
	

db.then(() =>{
	console.log('连接成功');
}, (err) => {
	console.log('连接错误', err);
});

module.exports = Object.assign(articleDB, userDB, messageDb, statisticsDb);
