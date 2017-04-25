import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import index from './layout/index.vue';
import store from './store.js';
import router from './router.js';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(ElementUI);
Vue.use(VueAxios, axios);

new Vue({
  el: '#app',
  store,
  router,
	render: h => h(index)
});
