import {get_messageList, set_messageState, set_userInfo} from '../mutation-types.js';
import axios from 'axios';
const messageModule = {
	state: {
		loading: false,
		messageList: [],
		errorCode: 0,
		msg: ''
	},
	mutations: {
		[get_messageList] (state, list){
			state.messageList = list;
		},
		[set_messageState] (state, data){
			state = Object.assign(state, data);
		}
	},
	getters: {
		noteList: state => {
			return state.messageList.map((item) => {
				item.btn = {
					comment: true
				};
				return item;
			});
		}
	},
	actions: {
		get_messageList ({state, commit, rootState}, postData = {}){
			if(!rootState.userInfo.userId){
				postData.userInfo = true;
			}
			commit(set_messageState, {loading: true});
			return axios.post('/messageWall/messageList', postData).then(res => {
				commit(get_messageList, res.data.data);
				if(res.data.userInfo){
					commit(set_userInfo, res.data.userInfo);
				}
			}).catch(error => {
				commit(set_messageState, {msg: '网络错误请重试！', errorCode: error.status, loading: false});
			});
		},
	}
};
export default messageModule;