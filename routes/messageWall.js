var router = require('koa-router')(),
	base = require('../common/base.js'),
	mongo = require('../dbs/index.js');

//添加留言
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
//评论留言
router.post('/messageComment', async function(ctx, next){
	try {
		let body = ctx.request.body;
		console.log(body);
		let result = await mongo.addComment({_id: body.id}, {content: body.content, commentInfo: ctx.session.userInfo._id});
		ctx.body = {
			errorCode: 0,
			msg: '评论成功'
		};
	}catch(e){
		ctx.body = {
			errorCode: -9,
			msg: '评论失败，此留言已删除'
		};
		console.error(e);
	}
	
});
//编辑留言
router.post('/editMessage', async function(ctx, next){
	var body = ctx.request.body;
	if(body.content.length > 220 || body.content.length < 5){
		ctx.body = {
			errorCode: 10,
			msg: '请输入满足条件的内容',
		};
		return false;
	}
	try {
		let updata = await mongo.editMessage({_id: body.id, 'commenter.userInfo': ctx.session.userInfo._id}, {'commenter.content': body.content});
		ctx.body = {
			errorCode: 0,
			updata
		};
	}catch(e){
		let message = await mongo.findOneMessage({_id: body.id});
		ctx.body = {
			errorCode: -1,
			msg: '修改留言错误，请稍后再试'
		};
		console.error('修改留言：', e);
	}
});
//删除留言
router.post('/deleteMessage', async function(ctx, next){
	try {
		let message = await mongo.deleteMessage({'commenter.userInfo': ctx.session.userInfo._id, _id: ctx.request.body.id});
		ctx.body = {
			errorCode: 0,
			msg: '删除留言成功',
		};
	}catch(e){
		ctx.body = {
			errorCode: -12,
			msg: '删除留言失败',
		};
		console.error(e);
	}
});
//删除评论
router.post('/deleteComment', async function(ctx, next){
	try {
		let data = ctx.request.body;
		let message = await mongo.deleteComment({id: data.id, commentID: data.commentID});
		ctx.body = {
			errorCode: 0,
			msg: '删除评论成功',
		};
	}catch(e){
		ctx.body = {
			errorCode: -12,
			msg: '删除评论失败',
		};
		console.error(e);
	}
});
module.exports = router;