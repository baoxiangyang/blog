let request = require('request'),
	fs = require('fs'),
	cheerio = require('cheerio'),
	path = require('path'),
	config = require('../config/config.js'),
	htmlSavePath = config.htmlSavePath,
	imgSavePath = config.imgSavePath,
	logFile = config.logFile,
	addr = 'https://segmentfault.com';
function getData(url, imgpath){
	return new Promise((resolve, reject) => {
		request(addr + url, function (err, res, body) {
			if(err) {
				writeLog('获取文章失败： '+ url, true);
				reject({
					err: err,
					url: url
				});
				return;
			}
			writeLog('获取文章成功：'+ url); 
			let	promiseArr = [],
				$ = cheerio.load(body, {decodeEntities: false}),
				dataObject = {
					id: path.basename(url),
					title: $('#articleTitle').text().trim(),
					label: returnLabel($),
					author: $('.article__author a').text().trim(),
					time: returnTime($('.article__author').find('a').remove().end().text().trim()),
					description: $('meta[name="description"]').attr('content'),
					address: addr + url
				},
				container = $('.wrap .article__content');
				if(!container.html()){
					writeLog('文章获取失败： '+ url + '没有文章内容', true);
					reject({
						err: '没有文章内容',
						url: url
					});
					return;
				}
				let imgs = container.find('img'), imgSrcArr = [];
				writeLog('请求图片数量： '+ imgs.length);
				if(imgs.length){
					imgs.filter(function(item, index) {
						let src = $(this).data('src'),
							_src = undefined;
						if(src){
							let self = $(this);
							if(src.indexOf('http') == 0){
								_src = src;
								src = '/img/'+ path.basename(_src);
							}else{
								let dirname = path.dirname(imgSavePath + src);
								if(!fs.existsSync(dirname)){
									mkdirsSync(dirname);
								}
							}
							if(imgSrcArr.indexOf(src) != -1){
								return true;
							}
							imgSrcArr.push(src);
							promiseArr.push(new Promise((resolve2, reject2) => {
								writeLog('开始请求图片： '+ src);
								let imgError = false;
								let writeFile = fs.createWriteStream(imgSavePath + src), extname;
									request(_src || (addr + src), {timeout: 60000}).on('response', function(response){
										if(response.statusCode.toString().indexOf('4') == 0){
											self.remove();
											imgError = true;
											resolve2();
											return;
										}
										extname = path.extname(response.request.path);
										
										if(!extname && response.headers['content-type'].indexOf('image') != -1){
											extname = '.' + response.headers['content-type'].split('/')[1];
											if(extname.indexOf('svg') != -1){
												extname = '.svg';
											}
										}
										let imgSrc = _src ?  src : (imgpath || '')+ src + extname;
										self.attr('src', imgSrc);
									}).on('error', function(err){
										writeLog('请求图片失败： '+ (_src||src)+ ' 来至url： '+ url, true);
										//reject2(err)
										self.remove();
										imgError = true;
										reject2();
									}).pipe(writeFile);
									writeFile.on('finish', function(){
										if(imgError){
											return ;
										}
										if(extname){
											if(fs.existsSync(imgSavePath+src)){
												try{
													if(src.indexOf('.') != -1){
														resolve2('自带后缀： '+ src);
														return;
													}
													fs.renameSync(imgSavePath+src, imgSavePath+ src + extname);
													writeLog('修改图片： ' + src + extname);
													
												}catch(e){
													writeLog('修图图片失败原因： .'+ src + extname + '\n' + e, true);
												}
												resolve2(src + extname);
											}else {
												writeLog('图片不存在： .'+ src+ ' 来至url： '+ url, true);
												reject2(url);
											}
										}
									});
							}));
						}
					});
				}
				if(promiseArr.length){
					Promise.all(promiseArr).then((data)=>{
						mkdirsSync(htmlSavePath);
						fs.writeFile(htmlSavePath + '/'+ path.basename(url) +'.html', container.html().trim().slice(12, -14).trim(), function(err){
							if(err){
								reject({
									err: err,
									url: url
								});
							}else{
								resolve(dataObject);
							}
						});
					}, (err)=> {
						reject({
							err: err
						});
					});
				}else{
					mkdirsSync(htmlSavePath);
					fs.writeFile(htmlSavePath + '/'+ path.basename(url) +'.html', container.html().trim(), function(err){
						if(err){
							reject({
								err: err,
								url: url
							});
						}else{
							resolve(dataObject);
						}
					});
				}				
		});
	});
}
	

function returnTime(str){
	let arr = str.match(/\d+/g), tempTime,
		timeNumber;
		if(arr && arr.length == 2){
			arr.unshift('2017');
		}
	switch (true){
		case str.indexOf('小时前') != -1:
			timeNumber = Date.now() - Number(arr[0])*1000*60*60;
			tempTime = new Date(timeNumber).setHours(0, 0, 0);
			return new Date(tempTime);
		case str.indexOf('天前') != -1:
			timeNumber = Date.now() - Number(arr[0])*1000*60*60*24;
			tempTime = new Date(timeNumber).setHours(0, 0, 0);
			return new Date(tempTime);
		default:
			return arr ?  new Date(arr.join(',')) : new Date();

	}
}
function mkdirsSync(dirpath, mode) { 
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split(path.sep).forEach(function(dirname) {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
        });
    }
    return true; 
}
function returnLabel($){
	let arr = [];
	$('.taglist--inline .tagPopup').filter(function(){
		arr.push($(this).find('a').text());
	});
	return arr;
}
function writeLog(log, error){
	if(error){
		log = 'ERROR： ' + log;
	}
	fs.appendFileSync(logFile, log + '\n');
}
module.exports = getData;	


