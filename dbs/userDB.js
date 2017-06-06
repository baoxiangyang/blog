let Mongoose = require('mongoose'),
	user_Schema =  new Mongoose.Schema({
	userName: {type: String, index: { unique: true, dropDups: true }},
	passwrod: {type: String},
	email: {type: String, unique: true},
	avatarImg: {type: String, default: ''},
	level: {type: Number, default: 10},
	time: {type: Date, default: Date.now},
});
module.exports = function(db){
	const UserModel = db.model('users', user_Schema);
	return {
		findUserInfo({username, email, passwrod}, showInfo = {__v: 0}){
			let findObj = null;
			if(!username && !email && !passwrod){
				throw Error('请至少输入一个查询条件');
			}
			if(passwrod){
				findObj = {$or:[{userName: username, passwrod: passwrod}, {email: username, passwrod: passwrod}]};
			}else{
				findObj = {$or:[{userName: username}, {email:email}]};
			}
			return UserModel.find(findObj, showInfo);
		},
		saveUserInfo(obj){
			return new UserModel(obj).save();
		}
	};
};
