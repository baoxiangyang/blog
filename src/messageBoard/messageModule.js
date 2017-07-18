import {get_messageList, set_messageState, set_userInfo} from '../mutation-types.js';
import {formatTime} from '../common/base.js';
import axios from 'axios';
const messageModule = {
	state: {
		loading: false,
		userInfo: {},
		messageList: [],
		errorCode: 0,
		heightTop: 0,
		widthLeft: 0,
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
			let heightTop = state.heightTop,
				widthLeft = state.widthLeft;
			if(state.messageList.length < 50){
				heightTop = heightTop / 2;
			}
			return state.messageList.map((item) => {
				item.top = parseInt(Math.random() * heightTop);
				item.left = parseInt(Math.random() * widthLeft);
				item.commenter.timeMsg = formatTime(item.commenter.time, true, true);
				item.commentList.forEach(function(listItem){
					listItem.timeMsg = formatTime(listItem.time, true, true);
					if(listItem.commentInfo.userName == state.userInfo.userName){
						listItem.deleteCommentBtn = true;
					}
				});
				if(item.top < 50){
					item.top += 50;
				}
				if(item.left > widthLeft - 220){
					item.left = widthLeft - 220;
				}
				if(item.commenter.userInfo.userName == state.userInfo.userName){
					item.btn = {
						edit: true,
						delete: true
					};
				}else{
					item.btn = {
						comment: false
					};
				}
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