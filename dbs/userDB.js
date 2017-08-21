let Mongoose = require('mongoose'),
	user_Schema =  new Mongoose.Schema({
	userName: {type: String, index: { unique: true, dropDups: true }},
	password: {type: String, default: ''},
	email: {type: String, default: ''},
	avatarImg: {type: String, default: ''},
	level: {type: Number, default: 10},
	time: {type: Date, default: Date.now},
	loginStatus: {type: String, default: ''},
	authId: {type: String, default: ''},
	gender: {type: String},
	type: {type: String, default: 'register'}
});
const UserModel = Mongoose.model('users', user_Schema);

module.exports = {
	findUserInfo({userName, email, password, loginStatus}, showInfo = {__v: 0}){
		let findObj = null;
		if(!userName && !email && !password && !loginStatus){
			throw Error('请至少输入一个查询条件');
		}
		if(userName || email){
			if(password){
				findObj = {$or:[{userName: userName, password: password}, {email: userName, password: password}]};
			}else{
				findObj = {$or:[{userName: userName}, {email:email}]};
			}
		}else{
			findObj = {loginStatus: loginStatus};
		}
		return UserModel.find(findObj, showInfo);
	},
	findUserOne(findObj) {
		return UserModel.findOne(findObj);
	},
	saveUserInfo(obj){
		return new UserModel(obj).save();
	},
	updateUserInfo(find, updata){
		return UserModel.update(find, {$set:updata});
	}
};
