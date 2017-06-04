module.exports = {
	mongodb: {
		host: '119.23.70.244',
		user: 'test',
		password: '123456',
		port: 27017,
		dbs: 'dbs'
	},
	redis: {
		host: '127.0.0.1',
		password: '',
		port: 6379,
		ttl: 60 * 30 //30分钟过期
	},
	imgSavePath: './article',
	htmlSavePath: './article/html',
	logFile: './tempFile/getArticleLog.txt',
	password: 'xxx'
};
