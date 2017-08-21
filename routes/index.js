var router = require('koa-router')(),
	upload = require('../common/upload.js'),
	base = require('../common/base.js'),
	validator = require('../common/validator.js'),
	sendEmail = require('../common/sendEmail.js'),
	myRequest = require('../common/myRequest.js'),
	mongo = require('../dbs/index.js'),
	querystring = require('querystring'),
	config = require('../config/config.js');
router.get(['/', 'article', 'article/list.html', 'article/articleDetails.html', 'crawler.html', 'register.html', 'messageBoard.html', 'profile.html'], async function (ctx, next) {
  ctx.state = {
    title: '小包总'
  };
  await ctx.render('index');
});
//上传头像
router.post('upAvatar', upload.single('userAvatar'), async function (ctx, next) {
  ctx.session.avatarImg = ctx.req.file;
  ctx.body = {avatarImg: ctx.req.file.filename};
});
//获取验证码
router.post('getEmailCode', async function(ctx, next){
	let isEmail = validator(ctx.req.request, { email:{required:true, type: 'email'}});
	if(isEmail){
		ctx.body = {
			error: -1,
			msg: '请输入正确的邮箱'
		};
		return false;
	}
	let code = base.getRandomStr(), obj = null;
	try {
		let info = await sendEmail({to: ctx.req.request.email, code: code});
		ctx.session.emailCode = code;
		obj = {
			error: 0,
			data: info,
			msg: '发送验证码成功，请登录邮箱获取！'
		};
	}catch(error){
		console.log(error);
		obj = {
			error: -2,
			msg: '发送验证码失败，请重试'
		};
	}
	ctx.body = obj;
});
//授权登录接口
router.get('authLogin.html', async function(ctx, next){
	let type =  ctx.request.query.type;
	if(type == "GITHUB"){
		await ctx.redirect(`https://github.com/login/oauth/authorize?client_id=${config.github.client_id}&state=${Date.now()}&redirect_uri=${config.host}${config.github.redirect_url}`);
	}else{
		await ctx.redirect(`https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${config.qq.appId}&state=${Date.now()}&redirect_uri=${config.host}${config.qq.redirect_url}`);
	}
});
//获取授权数据
router.get('authGithub', async function(ctx, next){
	try{
	let code = ctx.request.query.code,
	data = querystring.parse(await myRequest(`https://github.com/login/oauth/access_token?client_id=${config.github.client_id}&client_secret=${config.github.client_secret}&code=${code}&redirect_uri=${config.host}${config.github.redirect_url}`));
	if(data.error){
		console.error(data);
		await ctx.render('error', {error: { status: 500, message: '授权登录失败，请重试'}});
		return false;
	}
	let userInfo = JSON.parse(await myRequest({
		url: `https://api.github.com/user?access_token=${data.access_token}`,
		headers: {
			'User-Agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36'
		}
	})),
	saveData = {
		userName: userInfo.name,
		email: userInfo.email,
		avatarImg: userInfo.avatar_url,
		authId: userInfo.id,
		type: 'github'
	};
	if(!saveData.userName){
		console.error(userInfo);
		await ctx.render('error', {error:{status: 500, message: '授权登录失败，请重试'}});
		return false;
	}
	let loginData = await mongo.findUserOne({authId: saveData.authId});
	if(loginData){
		saveData._id = loginData._id;
		saveData.level = loginData.loginData;
		ctx.session.userInfo = saveData;
		if(saveData.userName != loginData.userName || saveData.email != loginData.email || saveData.avatarImg != loginData.avatarImg){
			mongo.updateUserInfo({authId: userInfo.id}, saveData);
		}
	}else{
		loginData = await mongo.saveUserInfo(saveData);
		ctx.session.userInfo = loginData;
	}
	ctx.redirect('/');
	}catch(e){
		if(e.code == 11000){
			await ctx.render('error', {error:{ status: 500, message: '用户名已注册，无法授权登陆'}});
		}else{
			console.error(e);
			await ctx.render('error', {error:{ status: 500, message: '授权登录失败，请重试'}});
		}
	}
});

router.get('authQQ', async function(ctx, next){
	try{
		let code = ctx.request.query.code,
		tokenUrl = `https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=${config.qq.appId}&client_secret=${config.qq.appKey}&code=${code}&redirect_uri=${config.host}${config.qq.redirect_url}`,
		tokenData = querystring.parse(await myRequest(tokenUrl)),
		openId = await myRequest(`https://graph.qq.com/oauth2.0/me?access_token=${tokenData.access_token}`),
		startIndex = openId.indexOf('{'), 
		endIndex = openId.indexOf('}') + 1,
		openData = JSON.parse(openId.slice(startIndex, endIndex)),
		userInfo = JSON.parse(await myRequest(`https://graph.qq.com/user/get_user_info?access_token=${tokenData.access_token}&openid=${openData.openid}&oauth_consumer_key=${openData.client_id}`)),
		saveData = {
			userName: userInfo.nickname,
			avatarImg: userInfo.figureurl_1,
			gender: userInfo.gender,
			authId: openData.openid,
			type: 'qq'
		};
		if((userInfo && userInfo.msg < 0) || !saveData.authId){
			console.error(userInfo);
			await ctx.render('error', {error:{status: 500, message: '授权登录失败，请重试'}});
			return false;
		}
		let loginData = await mongo.findUserOne({authId: saveData.authId});
		if(loginData){
			saveData._id = loginData._id;
			saveData.level = loginData.loginData;
			ctx.session.userInfo = saveData;
			if(saveData.userName != loginData.userName || saveData.gender != loginData.gender || saveData.avatarImg != loginData.avatarImg){
				mongo.updateUserInfo({authId: userInfo.id}, saveData);
			}
		}else{
			loginData = await mongo.saveUserInfo(saveData);
			ctx.session.userInfo = loginData;
		}
		ctx.redirect('/');
	}catch(e){
		if(e.code == 11000){
			await ctx.render('error', {error:{ status: 500, message: '用户名已注册，无法授权登陆'}});
		}else{
			console.error(e);
			await ctx.render('error', {error:{ status: 500, message: '授权登录失败，请重试'}});
		}
	}
});
module.exports = router;
