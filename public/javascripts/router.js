import Vue from 'vue';
import VueRouter from 'vue-router';
import index from './index/index.vue';
Vue.use(VueRouter);

export default new VueRouter({
  mode: 'hash',
  routes: [
	{ path: '/', component: index}
  ]
});