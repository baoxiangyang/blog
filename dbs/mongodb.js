let mongoose = require('mongoose'),
	mongoConfig = require('./config.js').mongodb,
	schema = require('./mongoSchema.js'),
	db = mongoose.connect('mongodb://'+ mongoConfig.host + ':'+ mongoConfig.port + '/'+mongoConfig.dbs);
	mongoose.Promise = global.Promise;

db.connection.on('open', function(){
	console.log('连接成功');
});

db.connection.on('error', function(err){
	console.log('连接错误', err);
});

let sfModel = db.model('sfdatas', schema.articleList_Schema);

//查数文章列表 返回promise
let findArticleArr = function(obj){
	return	sfModel.find(obj, {_id: 0, __v: 0});
};

module.exports = {
	findArticleArr
};
