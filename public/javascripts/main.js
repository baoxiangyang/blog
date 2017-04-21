import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import index from './layout/index.vue';
import store from './store.js';
import router from './router.js';

Vue.use(ElementUI);

new Vue({
  el: '#app',
  store,
  router,
	render: h => h(index)
});
