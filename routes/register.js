var router = require('koa-router')(),
	upload = require('../common/upload.js'),
	base = require('../common/base.js'),
	validator = require('../common/validator.js'),
	sendEmail = require('../common/sendEmail.js'),
	mongo = require('../dbs/index.js'),
	fs = require('fs');
//注册接口
router.post('/', async function(ctx, next){
	let postData = ctx.request.body;
	let validate = validator(postData, {
		userName: [{required: true}, {type: 'regexp', pattern: /^[\u4e00-\u9fa5\w]{3,10}$/}],
		passwrod: {required: true, minLength: 6},
		email:{required: true, type:'email'},
		verificationCode: {required: true, minLength: 6, maxLength: 6, type: 'number'}
	}), obj = null;
	if(validate) {
		ctx.body = validate;
		return false;
	}
	if(postData.verificationCode != ctx.session.emailCode){
		obj = {
			errorCode: -8,
			msg: '验证码错误，请重新输入'
		};
	}else{
		try{
			let userList = await mongo.findUserInfo({email: postData.email, userName: postData.userName});
			if(userList.length){
				userList = userList.map((item, index) => {
					if(item.userName == postData.userName){
						return {
							name: 'userName',
							msg: '用户名已存在，请重新输入'
						};
					}
					if(item.email == postData.email){
						return {
							name: 'email',
							msg: '邮箱已存在，请重新输入'
						};
					}
				});
				obj = {
					errorCode: -9,
					data: userList,
					msg: '用户名或邮箱已存在，请重新输入'
				};
			}else{
				let avatarImgPath = '';
				if(postData.userAvatar && fs.existsSync('./' + postData.userAvatar)){
					avatarImgPath = '/images/userAvatar/' + ctx.session.avatarImg.filename || postData.userAvatar.slice(postData.userAvatar.lastIndexOf('\\') +1);
					let mvAvatarImg = await base.fsPromise('rename', './'+ postData.userAvatar, './public'+avatarImgPath);
				}
				let result = await mongo.saveUserInfo({
					userName: postData.userName,
					passwrod: postData.passwrod,
					email: postData.email,
					avatarImg: avatarImgPath
				});
				obj = {
					errorCode: 0,
					msg: '注册成功',
					data: result
				};
			}	
		}catch(error){
			console.error(error);
			obj = {
				errorCode: -1,
				msg: '注册失败，请重试'
			};
		}
	}
	ctx.body = obj;
});
//上传头像
router.post('/upAvatar', upload.single('userAvatar'), async function (ctx, next) {
  ctx.session.avatarImg = ctx.req.file;
  ctx.body = {avatarImg: ctx.req.file.path};
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
	try {
		let userList = await mongo.findUserInfo({email: ctx.request.body.email});
		if(userList.length){
			ctx.body = {
				errorCode: -7,
				msg: '此邮箱已被注册，请重新输入'
			};
			return false;
		}
	}catch(error){
		console.log(error);
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
//判断用户是否存在
router.post('/userNameExist', async function(ctx, next){
	let data = ctx.request.body;
	if(!data.userName){
		ctx.body = {
			errorCode: -5,
			msg: '用户名称不能为空'
		};
		return false;
	}
	try {
		let userList = await mongo.findUserInfo({username: data.userName});
		if(userList.length){
			ctx.body = {
				errorCode: -6,
				msg: '用户名已存在'
			};
		}else{
			ctx.body = {
				errorCode: 0,
				msg: ''
			};
		}
	}catch(error){
		console.log(error);
		ctx.body = {
			errorCode: 0,
			msg: ''
		};
	}
});
module.exports = router;
