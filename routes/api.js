let router = require('koa-router')(),
	mongo = require('../dbs/mongodb.js');

router.post('/articleList', async function (ctx, next) {
	let articleData = await mongo.findArticleArr(ctx.request.body || {});
	ctx.body = {
		state: 0,
		data: {
			articleData
		},
		msg: '获取文章列表成功'
	};
});

module.exports = router;
