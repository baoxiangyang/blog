let multer = require('koa-multer'),
	storage = multer.diskStorage({
		destination: function (req, file, cb) {
			//设置上传文件路径
			cb(null, './tempFile/uploads');
		}, 
		filename: function (req, file, cb) {
			//修改上传文件名称
			var fileFormat = (file.originalname).split(".");
			if(fileFormat.length == 1){
				cb(new Error('上传文件错误，文件没有后缀'));
			}else{
				cb(null, fileFormat[0] + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
			}
		}
	}),
	upload = multer({
		storage,
		limits: {
			//文件大小不能超快500k
			fileSize: 1024 * 500
		}
	});
module.exports = upload;