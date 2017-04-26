import {set_articleList, set_articleStatus} from '../mutation-types.js';
import axios from 'axios';
const articleModule = {
	state: {
		list: [],
		total: 0,
		currentPage: 1,
		error: 0,
		loading: false
	},
	mutations: {
		//修改文章列表
		[set_articleList] (state, obj){
			state.list = obj.data.list;
			state.loading = false;
		},
		//修改其他状态, 此方法不能修改list数组
		[set_articleStatus] (state, obj) {
			delete obj.list;
			state = Object.assign(state, obj);
		}
	},
	actions: {
		//获取文章列表
		get_articleList({commit, state}, obj) {
			return axios.post('/api/articleList', {
        data: obj
      }).then((res) => {
        commit(set_articleList, res.data);
      });
		}
	}
};
export default articleModule;