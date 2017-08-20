var router = require('koa-router')(),
	upload = require('../common/upload.js'),
	base = require('../common/base.js'),
	validator = require('../common/validator.js'),
	sendEmail = require('../common/sendEmail.js'),
	mongo = require('../dbs/index.js'),
	config = require('../config/config.js'),
	fs = require('fs');
//注册接口
router.post('/register', base.noLoginGo, async function(ctx, next){
	let postData = ctx.request.body;
	let validate = validator(postData, {
		userName: [{required: true}, {type: 'regexp', pattern: /^[\u4e00-\u9fa5\w]{3,20}$/}],
		password: {required: true, minLength: 6},
		email:{required: true, type:'email'},
		verificationCode: {required: true, minLength: 6, maxLength: 6, type: 'number'}
	}), obj = null;
	if(validate) {
		ctx.body = validate;
		return false;
	}
	if(!ctx.session.emailCode || (postData.verificationCode != ctx.session.emailCode.code && postData.email != ctx.session.emailCode.email)){
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
					password: postData.password,
					email: postData.email,
					avatarImg: avatarImgPath
				});
				obj = {
					errorCode: 0,
					msg: '注册成功'
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
router.post('/upAvatar', base.noLoginGo, upload.single('userAvatar'), async function (ctx, next) {
  ctx.session.avatarImg = ctx.req.file;
  ctx.body = {avatarImg: ctx.req.file.path};
});
//获取验证码
router.post('/getEmailCode', base.noLoginGo, async function(ctx, next){
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

		if(userList.length && !ctx.request.body.recover){
			ctx.body = {
				errorCode: -7,
				msg: '此邮箱已被注册，请重新输入'
			};
			return false;
		}
		if(!userList.length && ctx.request.body.recover){
			ctx.body = {
				errorCode: -7,
				msg: '此邮箱未被注册，请重新输入'
			};
			return false;
		}
	}catch(error){
		console.log(error);
	}
	let code = base.getRandomStr(), obj = null;
	try {
		let info = await sendEmail({to: ctx.request.body.email, code: code});
		ctx.session.emailCode = {
			code,
			email: ctx.request.body.email
		};
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
router.post('/userNameExist', base.noLoginGo, async function(ctx, next){
	let data = ctx.request.body;
	if(!data.userName){
		ctx.body = {
			errorCode: -5,
			msg: '用户名称不能为空'
		};
		return false;
	}
	try {
		let userList = await mongo.findUserInfo({userName: data.userName});
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
		console.error(error);
		ctx.body = {
			errorCode: 0,
			msg: ''
		};
	}
});
//登录
router.post('/login', base.noLoginGo, async function(ctx, next){
	let data = ctx.request.body;
	try{
		let	userInfo = await mongo.findUserInfo(data);
		if(userInfo.length){
			if(data.remember){
				let loginStatus = base.getRandomStr({
					number: true, capitalLetter: true, 
					lowerLetter: true, len: 30
				}) + Date.now();
				await mongo.updateUserInfo({email: userInfo[0].email}, {loginStatus});
				ctx.cookies.set('loginStatus', loginStatus, {
					maxAge: config.loginStatusTime,
					httpOnly: true,
					overwrite: true
				});
				userInfo[0].loginStatus = loginStatus;
			}
			ctx.session.userInfo = userInfo[0];
			ctx.body = {
				errorCode: 0,
				msg:'登录成功',
				data: {
					userName: userInfo[0].userName,
					avatarImg: userInfo[0].avatarImg,
					userId: userInfo[0]._id
				}
			};
		}else{
			ctx.body = {
				errorCode: 0,
				msg:'用户后密码错误，请重新登录',
				data: null
			};
		}
	}catch(err){
		console.error(err);
		ctx.body = {
			errorCode: -1,
			msg: '登录失败，请重试'
		};
	}
});
//找回密码
router.post('/recoverPassword', base.noLoginGo, async function(ctx, next){
	let data = ctx.request.body;
	if(!ctx.session.emailCode || (data.email != ctx.session.emailCode.email && data.verificationCode != ctx.session.emailCode.code)){
		ctx.body = {
			errorCode: -1,
			msg: '邮箱或然验证码错误，请重新输入'
		};
		return false;
	}
	try {
		let update = await mongo.updateUserInfo({email: data.email}, {password: data.password});
		console.log(update);
		ctx.body = {
			errorCode: 0,
			msg: '修改密码成功,请登录'
		};
	}catch(e){
		console.error(e);
		ctx.body = {
			errorCode: -2,
			msg: '修改密码失败，请重试'
		};
	}
});
//退出登录
router.post('/logOut', async function(ctx, next){
	ctx.session = {};
	ctx.cookies.set('loginStatus', '', {
		expires: new Date()
	});
	ctx.body = {
		errorCode: 0,
		msg: '退出登录成功'
	};
});
module.exports = router;
