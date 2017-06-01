import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import index from './layout/index.vue';
import store from './store.js';
import router from './router.js';
import axios from 'axios';
import VueAxios from 'vue-axios';
import myAjax from './common/myAjax.js';
import {assign, Promise} from './common/base.js';
assign();
Promise();
Vue.use(ElementUI);
Vue.use(myAjax, axios);
window.a = new Vue({
  el: '#app',
  store,
  router,
	render: h => h(index)
});
