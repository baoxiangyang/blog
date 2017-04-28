let router = require('koa-router')(),
	mongo = require('../dbs/mongodb.js');

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
	
	let articleData = await mongo.findArticleArr(findObj);
	ctx.body = {
		state: 0,
		data: {
			articleData
		},
		msg: '获取文章列表成功'
	};
});

module.exports = router;
