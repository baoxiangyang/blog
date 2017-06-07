import {set_articleList, set_articleStatus} from '../mutation-types.js';
import axios from 'axios';
import {formatTime} from '../common/base.js';
const articleModule = {
	state: {
		list: [],
		total: 0,
		currentPage: 1,
		pageSize: 10,
		msg: '',
		errorCode: 0,
		loading: false,
		activeIndex: '/article?type=all',
		search:'',
		type: 'all'
	},
	mutations: {
		//修改文章列表
		[set_articleList] (state, obj){
			state = Object.assign(state, obj, {loading: false});
		},
		//修改其他状态, 此方法不能修改list数组
		[set_articleStatus] (state, obj) {
			delete obj.list;
			state = Object.assign(state, obj);
		}
	},
	getters: {
		articleList: state => {
			return state.list.map(item => {
				item.timeMsg = formatTime(item.time, true);
				return item;
			});
		}
	},
	actions: {
		//获取文章列表
		get_articleList({commit, state}, postData) {
			commit(set_articleStatus, {loading: true});
			return axios.post('/article/articleList', postData).then(res => {
				commit(set_articleList, res.data.data.articleData);
			}).catch(error => {
				commit(set_articleStatus, {error: true, msg: '网络错误请重试！', errorCode: error.status, loading: false});
			});
		}
	}
};
export default articleModule;