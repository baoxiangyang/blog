var router = require('koa-router')(),
	base = require('../common/base.js'),
	mongo = require('../dbs/index.js');

//留言解绑
router.post('/message', async function(ctx, next){
	let data =  ctx.request.body, obj = null;
	if(data.commenter.content.length > 200){
		obj = {
			errorCode: -9,
			msg: '留言内容不能大于200个字'
		};
	}
	if(obj){
		ctx.body = obj;
		return false;
	}

	data.commenter.userInfo = ctx.session.userInfo._id;
	try {
		let result = await mongo.saveMessage(data);
		let userInfo = await mongo.findMessage({});
		obj = {
			errorCode: 0,
			msg: result,
			userInfo
		};
	}catch(e){
		console.error(e);
		obj = {
			errorCode: -10,
			msg: '数据库报错数据错误'
		};
	}
	//delete data.content;
	ctx.body = obj;
});
module.exports = router;