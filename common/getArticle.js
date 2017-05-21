let saveArticle = require('./saveArticle.js'),
	fs = require('fs'),
	mongo = require('../dbs/mongodb.js'),
	logFile = require('../config/config.js').logFile;
module.exports = async function (data) {
	let urls = data.url.split(',');
	fs.writeFileSync(logFile, `共${urls.length}篇文章\n`);
	for(let i = 0; i < urls.length; i++){
		try {
			let url = urls[i], isArticle = await mongo.isArticle({id: url.match(/\d+/)[0]}),
				detailData = null;
			fs.appendFileSync(logFile, '开始获取第 ' +i+ ' 条数据,url: '+ url  + '\n');
			if(isArticle){
				fs.appendFileSync(logFile, '文章' + url + ' 已存在... ' + '\n');
			}else{
				detailData = await saveArticle(url, data.cookie);
				let result = await mongo.saveArticle(detailData);
				fs.appendFileSync(logFile, '保存成功：' + url + '\n' + JSON.stringify(result) + '\n');
			}
			console.log(detailData);
		}catch (error){
			console.log(error);
			fs.appendFileSync(logFile, error + '\n');
		}
	}
};