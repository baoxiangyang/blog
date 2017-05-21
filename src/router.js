import Vue from 'vue';
import VueRouter from 'vue-router';
import index from './layout/index.vue';
import article from './article/index.vue';
import articleList from './article/articleList.vue';
import articleDetails from './article/articleDetails.vue';
import crawler from './crawler/index.vue';
Vue.use(VueRouter);

export default new VueRouter({
  mode: 'hash',
  routes: [
		{ path: '/',  redirect:'/article', name: 'index'},
		{ path:'/article', component: article, name:'article',
			children:[
				{ path: '', component: articleList, name: 'articleList'},
				{ path: 'articleDetails', component: articleDetails, name: 'articleDetails'}
			]
		},
		{ path: '/crawler', name: 'crawler', component: crawler }
  ]
});