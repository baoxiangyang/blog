let router = require('koa-router')(),
	config = require('../config/config.js'),
	logFile = config.logFile,
	mongo = require('../dbs/index.js'),
	fs = require('fs'),
	base = require('../common/base.js'),
	fsPromise = base.fsPromise,
	path = require('path'),
	getArticle = require('../common/getArticle.js'),
	htmlSavePath = require('../config/config.js').htmlSavePath;
//获取文章列表
router.post('/articleList', async function (ctx, next) {
	let findObj = {
		currentPage: ctx.request.body.currentPage,
		pageSize: ctx.request.body.pageSize
	};
	if(ctx.request.body.search){
		let search = ctx.request.body.search;
		findObj.find = {$or:[{label: search}, {author: search}, {id: search}, {title: new RegExp(search)}, {description: new RegExp(search)}]};
	}else{
		switch (ctx.request.body.type) {
			case 'all':
				findObj.find = {};
				break;
			case 'javascript':
				findObj.find = {$or:[{label:'javascript'}, {label:'js'}]};
				break;
			case 'html':
				findObj.find = {$or:[{label:'html'}, {label:'html5'}]};
				break;
			case 'css':
				findObj.find = {$or:[{label:'css'}, {label:'css3'}, {label:'less'}, {label:'sass'}]};
				break;
			case 'webpack':
				findObj.find = {label:'webpack'};
				break;
			case 'gulp':
				findObj.find = {label:'gulp'};
				break;
			case 'node':
				findObj.find = {$or:[{label:'node'}, {label:'node.js'}]};
				break;
			case 'react':
				findObj.find = {$or:[{label:'react'}, {label:'react.js'}]};
				break;
			case 'vue':
				findObj.find = {$or:[{label:'vue'}, {label:'vue.js'}]};
				break;
			case 'other':
				findObj.find = {label:{$nin:['js', 'javascript', 'html', 'html5', 'css', 'css3',
					'less', 'sass', 'webpack', 'gulp', 'react', 'react.js', 'vue', 'vue.js', 'node', 'node.js']}};
				break;
			default:
				findObj.find = {};
		}
	}
	try{
		let articleData = await mongo.findArticleArr(findObj);
		ctx.body = {
			errorCode: 0,
			data: {
				articleData
			},
			msg: '获取文章列表成功'
		};
	}catch (e) {
		ctx.body = {
			errorCode: -1,
			msg: e
		};
	}
});
//获取文章详情
router.post('/articleDatails', async function(ctx, next){
	let id = ctx.request.body.id,
		filePath = htmlSavePath + '/' + id +'.html';
	if(fs.existsSync(filePath)){
		let fileData = null, articleDatail = null;
		if(ctx.request.body.datails){
			articleDatail = (async function(id){
				return await mongo.findOneArticle(id);
			})(id);
		}
		try {
			fileData = await fsPromise('readFile', filePath, 'utf8');
			articleDatail = await articleDatail;
			ctx.body = {
				errorCode: 0,
				msg: '',
				data: {
					fileData: fileData.data,
					articleDatail
				}
			}; 
		}catch(error){
			ctx.body = {
				errorCode: -2,
				msg: '获取文章失败，请稍后再试',
				articleDatail
			};
		}
	}else{
		ctx.body = {
			errorCode: -1,
			msg: '此文章不存在',
			data: null
		}; 
	}
});
//获取需要爬取的文章地址
router.post('/crawlerArticle', base.loginGo, async function(ctx, next){
	let body = ctx.request.body;
	if(!ctx.session.userInfo.level || ctx.session.userInfo.level > 3){
		ctx.body = {
			errorCode: -2,
			msg: '您的用户没有权限'
		};
		return false;
	}
	if(!body.url){
		ctx.body = {
			errorCode: -2,
			msg: '请输入需要获取的文章地址'
		};
	}else{
		getArticle(ctx.request.body);
		ctx.body = {
			errorCode: 0,
			data: '爬取文章指令下发成功'
		};

	}
});
//获取爬虫日志
router.post('/articleLog', async function(ctx, next){
	try {
		let log = await fsPromise('readFile', logFile, 'utf8');
		ctx.body = {
			errorCode: 0,
			data: log.data
		};
	}catch (e){
		ctx.body = {
			errorCode: -3,
			msg: e
		};
	}
});
module.exports = router;
