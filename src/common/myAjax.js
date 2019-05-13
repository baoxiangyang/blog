const myAjax = {};
myAjax.install = function(Vue, axios){
	if (myAjax.installed) {
		return;
	}
	if (!axios) {
    console.error('You have to install axios');
    return;
	}
	myAjax.installed = true;
	Vue.prototype.$myAjax = function(){
		return axios;
	};
	Vue.prototype.$myAjax.get = function(self){
		return axios.get(...(Array.prototype.slice.call(arguments, 1))).then((res)=>{
			return Promise.resolve(res);
		});
	};
	Vue.prototype.$myAjax.post = function(self, url, data){
		if(!self.$store.state.userInfo.userId){
			data.userInfo = true;
		}
		return axios.post(url, data).then((res)=>{
			if(res.data.userInfo){
				self.$store.commit('set_userInfo', res.data.userInfo);
			}
			return Promise.resolve(res);
		}).catch((error)=> {
      self.errorCode = -4;
      self.msg = '网络错误，请重试';
  	});
	};
}
export default myAjax;