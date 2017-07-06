import {get_messageList, set_messageState, set_userInfo} from '../mutation-types.js';
import {formatTime} from '../common/base.js';
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
			//var heightTop = parseInt(window.getComputedStyle(document.getElementsByClassName('messageWall')[0], null).height);
			var heightTop = 890;
			return state.messageList.map((item) => {
				item.top = parseInt(Math.random() * heightTop);
				item.left = parseInt(Math.random() * 1140);
				item.commenter.time = formatTime(item.commenter.time, true, true);
				item.commentList.forEach(function(listItem){
					listItem.time = formatTime(listItem.time, true, true);
				});
				if(top < 50){
					item.top += 50;
				}
				item.btn = {
					comment: false
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