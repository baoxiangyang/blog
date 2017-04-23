import Vue from 'vue';
import VueRouter from 'vue-router';
import index from './layout/index.vue';
import articleList from './article/index.vue';
Vue.use(VueRouter);

export default new VueRouter({
  mode: 'hash',
  routes: [
	{ path: '/', component: articleList}
  ]
});