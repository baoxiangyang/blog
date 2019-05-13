let saveArticle = require('./saveArticle.js'),
	fs = require('fs'),
	mongo = require('../dbs/index.js'),
	logFile = require('../config/config.js').logFile;
module.exports = async function (data) {
	let urls = (typeof data.url == 'string') ? data.url.split(',') : data.url;
	fs.writeFileSync(logFile, `共${urls.length}篇文章\n`);
	for(let i = 0; i < urls.length; i++){
		try {
			let item = urls[i], url = (typeof item  == 'string') ? item : item.url,
				isArticle = await mongo.isArticle({id: item.id || url.match(/\d+/)[0]}),
				detailData = null, option = (typeof item == 'string') ? {} : item;
				option.cookie = data.cookie;
			fs.appendFileSync(logFile, '开始获取第 ' +i+ ' 条数据,url: '+ url  + '\n');
			if(isArticle){
				fs.appendFileSync(logFile, '文章' + url + ' 已存在... ' + '\n');
			}else{
				detailData = await saveArticle(url, option);
				let result = await mongo.saveArticle(detailData);
				fs.appendFileSync(logFile, '保存成功：' + url + '\n' + JSON.stringify(result) + '\n');
			}
		}catch (error){
			console.log('获取文章失败', error);
			fs.appendFileSync(logFile, error + '\n');
		}
	}
};