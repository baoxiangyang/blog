import {get_messageList, set_messageState, 
	edit_messageList, push_commentList,
	set_userInfo, push_messageList, 
	delete_messageList, delte_commenter} from '../mutation-types.js';
import {formatTime} from '../common/base.js';
import axios from 'axios';
const messageModule = {
	state: {
		loading: false,
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
		},
		[push_messageList] (state, data){
			//创建留言
			state.messageList.push(data);
		},
		[delete_messageList] (state, id) {
			//删除留言
			let deleteItem = state.messageList.filter(function(item, index){
				return item._id == id;
			})[0];
			state.messageList.splice(state.messageList.indexOf(deleteItem), 1);
		},
		[delte_commenter] (state, ids){
			//删除评论
			let messageItem = state.messageList.filter(function(item, index){
				return item._id == ids.id;
			})[0],
			deleteItem = state.messageList.filter(function(item, index){
				return item._id == ids.commentID;
			})[0];
			messageItem.commentList.splice(messageItem.commentList.indexOf(deleteItem), 1);
		},
		[edit_messageList] (state, data) {
			//编辑留言
			let deleteItem = state.messageList.filter(function(item, index){
				return item._id == data.id;
			})[0];
			deleteItem.commenter.content = data.content;
		},
		[push_commentList] (state, data) {
			//添加评论
			let deleteItem = state.messageList.filter(function(item, index){
				return item._id == data.id;
			})[0];
			deleteItem.commentList.push({
				content: data.content,
				time: Date.now(),
				commentInfo: data.userInfo
			});
		}
	},
	getters: {
		position(state) {
			let heightTop = state.heightTop,
				widthLeft = state.widthLeft,
				tempArr = [], count = 0, cover = 50,
				_createPosition = (item) => {
					count++;
					let x = parseInt(Math.random() * widthLeft),
						y = parseInt(Math.random() * heightTop),
						h = 183 + 65 * (item.commentList.length || 0),
						w = 270, bool = true;
						x = x > widthLeft - w ? widthLeft - w : x;
						y = y > heightTop - h ?  heightTop - h : y;
					for(let i = 0; i < tempArr.length; i++){
						let item = tempArr[i];
						if(!(y + h - item.y < cover || item.y + item.h - y < cover || x + w - item.x < cover || item.x + w - x < cover)){
							bool = false;
						}
					}
					if(bool){
						item.top = y;
						item.left = x;
						tempArr.push({x, y, h});
					}else{
						if(count > 50){
							count = 0;
							tempArr = [];
						}
						_createPosition(item);
					}
					return item;
				};
			return state.messageList.map(_createPosition);
		},
		noteList: (state, getters, rootState) => {
			return getters.position.map((item) => {
				item.commenter.timeMsg = formatTime(item.commenter.time, true, true);
				item.commentList.forEach(function(listItem){
					listItem.timeMsg = formatTime(listItem.time, true, true);
					if(listItem.commentInfo.userName == rootState.userInfo.userName && listItem._id){
						listItem.deleteCommentBtn = true;
					}
				});
				if(item.commenter.userInfo.userName == rootState.userInfo.userName){
					item.btn = {
						edit: true,
						delete: true
					};
				}else{
					item.btn = {
						comment: true
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