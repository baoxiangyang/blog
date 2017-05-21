let mongoose = require('mongoose'),
	mongoConfig = require('../config/config.js').mongodb,
	schema = require('./mongoSchema.js'),
	db = mongoose.connect('mongodb://'+ mongoConfig.host + ':'+ mongoConfig.port + '/'+mongoConfig.dbs);
	mongoose.Promise = global.Promise;

db.connection.on('open', function(){
	console.log('连接成功');
});

db.connection.on('error', function(err){
	console.log('连接错误', err);
});

let SfModel = db.model('sfdatas', schema.articleList_Schema);

//查数文章列表 返回promise
let findArticleArr = function({find = {}, pageSize = 10, currentPage = 1}){
	return	SfModel.find(find, {_id: 0, __v: 0}).sort({'time': -1}).then((docs) => {
		let data = {
			total: docs.length,
			pageSize: pageSize,
			currentPage: currentPage,
			list: docs.slice((currentPage -1) * pageSize, currentPage * pageSize),
			error: false
		};
		docs = null;
		return Promise.resolve(data);
	}).catch((error) => {
		return Promise.resolve({
			errorMsg: error,
			error: true,
			errorCode: -1
		});
	});
};
//判断文章在数据库中是否存在
let isArticle = async function(obj){
	return new Promise((resolve, reject) =>{
		SfModel.findOne(obj, function(err, doc){
			if(err){
				reject(err);
			}else{
				resolve(doc);
			}
		});
	}).catch(e =>{
		console.log(e);
	});
}; 

let saveArticle = async function(obj){
	return new Promise((resolve, reject) =>{
		new SfModel(obj).save(function(err, doc){
			if(err){
				if(err.code == 11000) {
					resolve({error: 11000});
				}else{
					reject(err);
				}
			}else{
				resolve(doc);
			}
		});
	}).catch(e =>{
		console.log(e);
	});
}; 

module.exports = {
	findArticleArr,
	isArticle,
	saveArticle
};
