(function (){
	function myAjax(Vue, axios){
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
			if(!self.$store.state.userInfo){
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
	if (typeof exports == "object") {
		module.exports = myAjax;
	} else if (typeof define == "function" && define.amd) {
		define([], function(){ return myAjax; });
	} else if (window.Vue && window.axios) {
		Vue.use(myAjax, window.axios);
	}
})();
/*function myAjax(){};
myAjax.install = function(Vue, axios){
	Vue.prototype.$myAjax = function(){
		console.log(432);
	};
	Vue.prototype.$myAjax.get = function(){
		console.log(123);
	};
};
module.exports = myAjax;*/