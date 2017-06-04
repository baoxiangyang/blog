var router = require('koa-router')(),
	upload = require('../common/upload.js'),
	base = require('../common/base.js'),
	validator = require('../common/validator.js'),
	sendEmail = require('../common/sendEmail.js');
//上传头像
router.post('/upAvatar', upload.single('userAvatar'), async function (ctx, next) {
  ctx.session.avatarImg = ctx.req.file;
  ctx.body = {avatarImg: ctx.req.file.filename};
});
//获取验证码
router.post('/getEmailCode', async function(ctx, next){
	let isEmail = validator(ctx.request.body, { email:{required:true, type: 'email'}});
	if(isEmail){
		ctx.body = {
			errorCode: -1,
			msg: '请输入正确的邮箱'
		};
		return false;
	}
	let code = base.getRandomStr(), obj = null;
	try {
		let info = await sendEmail({to: ctx.request.body.email, code: code});
		ctx.session.emailCode = code;
		obj = {
			errorCode: 0,
			msg: '发送验证码成功，请登录邮箱获取！'
		};
	}catch(error){
		console.log(error);
		obj = {
			errorCode: -2,
			msg: '发送验证码失败，请重试'
		};
	}
	ctx.body = obj;
});
module.exports = router;
