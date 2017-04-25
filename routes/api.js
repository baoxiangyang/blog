let router = require('koa-router')(),
	mongo = require('../dbs/mongodb.js');

router.post('/articleList', async function (ctx, next) {
	console.log(ctx.request.body);
	let list = await mongo.findArticleArr({});
	ctx.body = {
		state: 0,
		data: {
			list
		},
		msg: '获取文章列表成功'
	};
});

module.exports = router;
