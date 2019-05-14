module.exports = {
	mongodb: {
		host: 'www.xiaobaozong.cn',
		user: 'xiaobaozong',
		password: 'baozi.234',
		port: 27017,
		dbs: 'dbs'
	},
	redis: {
		host: 'www.xiaobaozong.cn',
		password: 'redis.123456',
		port: 6379,
		ttl: 60 * 30 //30分钟过期
	},
	host: 'https://www.xiaobaozong.cn',
	github: {
		client_id: 'xxx',
		client_secret:'xxx',
		redirect_url: '/authGithub'
	},
	qq: {
		appId: 'xxx',
		appKey: 'xxx',
		redirect_url: '/authQQ'
	}, 
	loginStatusTime: 1000 * 60 * 60 * 24 * 15, //登录状态保存时间(ms)
	imgSavePath: './article',
	htmlSavePath: './article/html',
	logFile: './tempFile/getArticleLog.txt'
};
