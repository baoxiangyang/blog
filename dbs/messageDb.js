let Mongoose = require('mongoose'),
	message_Schema = new Mongoose.Schema({
		id: {type: String, index: { unique: true, dropDups: true }},
		bgColor: {type: String, default: ''},
		color: {type: String, default: ''},
		type: {type: String, default: ''},
		commenter: {
			userInfo: {
				type : Mongoose.Schema.Types.ObjectId,
				ref : 'users'
			},
            content: {type: String, default: ''},
            time: {type: Date, default: Date.now}
		},
		commentList:[{
			commentInfo: {
				type : Mongoose.Schema.Types.ObjectId,
				ref : 'users'
			},
			content: {type: String, default: ''},
			time: {type: Date, default: Date.now}
		}]
	});
module.exports = function (db) {
	const MessageModel = db.model('messages', message_Schema);
	return {
		saveMessage(data){
			//保存留言
			return new MessageModel(data).save();
		},
		findMessage(data){
			//查询留言
			return MessageModel.find(data, {__v: 0}).populate([{
				path: 'commenter.userInfo',
				select: {
					avatarImg: 1,
					userName: 1,
					_id: 0
				}
			}, {
				path: 'commentList.commentInfo',
				select: {
					avatarImg: 1,
					userName: 1,
					_id: 0
				}
			}]);
		},
		addComment(data){
			//添加评论
			return MessageModel.update({_id: data.id}, {'$push':{commentList: data.comment}});
		}
	};
};