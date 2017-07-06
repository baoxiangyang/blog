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
		obj = {
			errorCode: 0,
			data: {
				messageId: result._id
			},
			msg: '留言成功'
		};
	}catch(e){
		console.error(e);
		obj = {
			errorCode: -10,
			msg: '数据库报错数据错误',
			errorMsg: e
		};
	}
	ctx.body = obj;
});
//获取留言列表
router.post('/messageList', async function(ctx, next){
	let data = await mongo.findMessage();
	ctx.body = {
		errorCode: 0,
		data,
		msg: '请求留言数据成功'
	};
});
router.post('/messageComment', async function(ctx, next){
	console.log(ctx.request.body);
	let result = await mongo.addComment(ctx.request.body);
	ctx.body = {
		errorCode: 0,
		msg: '评论成功',
		result
	};
});
module.exports = router;