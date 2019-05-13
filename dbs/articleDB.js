let Mongoose = require('mongoose'),
//文章数据
articleList_Schema =  new Mongoose.Schema({
	//id 为唯一索引不可重复
	id: {type: String, index: { unique: true, dropDups: true }},
	title: {type: String},
	time: {type: Date, default: Date.now},
	label: {type: Array, default: []},
	author: {type: String, default: ''},
	source: {type: String, default: ''},
	description: {type: String},
	address: {type: String}
});
const SfModel = Mongoose.model('sfdatas', articleList_Schema);
module.exports = {
	//查数文章列表(分页)
	async findArticleArr({find = {}, pageSize = 10, currentPage = 1}){
		let total = (async() => {
			return await SfModel.find(find).count();
		})(),
		list = (async () => {
			return await SfModel.find(find, {_id: 0, __v: 0})
				.sort({'time': -1}).skip((currentPage - 1) * pageSize).limit(pageSize);
		})();
		return {
				list: await list,
				total: await total,
				pageSize,
				currentPage,
		};
	},
	//查询单条文章信息
	findOneArticle(id){
		return SfModel.findOne({id: id}, {_id: 0, __v: 0});
	},
	//判断文章在数据库中是否存在
	isArticle(obj){
		return SfModel.findOne(obj);
	},
	//保存文章信息
	saveArticle(obj){
		return new Promise((resolve, reject) =>{
			new SfModel(obj).save(function(err, doc){
				if(err){
					if(err.code == 11000) {
						resolve({error: 11000});
					}else{
						reject(err);
					}
				}else{
					resolve(doc);
				}
			});
		});
	}
};