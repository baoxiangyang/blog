let Mongoose = require('mongoose'),
	user_Schema =  new Mongoose.Schema({
	userName: {type: String, index: { unique: true, dropDups: true }},
	password: {type: String},
	email: {type: String, unique: true},
	avatarImg: {type: String, default: ''},
	level: {type: Number, default: 10},
	time: {type: Date, default: Date.now},
	loginStatus: {type: String, default: ''}
});
module.exports = function(db){
	const UserModel = db.model('users', user_Schema);
	return {
		findUserInfo({userName, email, password}, showInfo = {__v: 0, _id: 0}){
			let findObj = null;
			if(!userName && !email && !password){
				throw Error('请至少输入一个查询条件');
			}
			if(password){
				findObj = {$or:[{userName: userName, password: password}, {email: userName, password: password}]};
			}else{
				findObj = {$or:[{userName: userName}, {email:email}]};
			}
			return UserModel.find(findObj, showInfo);
		},
		saveUserInfo(obj){
			return new UserModel(obj).save();
		},
		updateUserInfo(find, update){
			console.log(find, update);
			return UserModel.update(find, {$set:update});
		}
	};
};
