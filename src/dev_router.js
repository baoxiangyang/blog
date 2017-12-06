import Vue from 'vue';
import VueRouter from 'vue-router';
import article from './article/index.vue';
import articleList from './article/articleList.vue';
import articleDetails from './article/articleDetails.vue';
import crawler from './crawler/index.vue';
import register from './user/register.vue';
import messageBoard from './messageBoard/index.vue';
import profile from './profile/index.vue';

Vue.use(VueRouter);
export default new VueRouter({
  mode: 'history',
  routes: [
		{ path: '/',  redirect:{name: 'articleList'}, name: 'index'},
		{ path:'/article', name:'article', component: article ,
			children:[
				{ path: 'list.html', name: 'articleList', component: articleList },
				{ path: 'articleDetails.html', name: 'articleDetails', component: articleDetails }
			]
		},
		{ path: '/crawler.html', name: 'crawler', component: crawler },
		{ path: '/register.html', name: 'register', component: register },
		{ path: '/messageBoard.html', name: 'messageBoard', component: messageBoard},
		{ path: '/profile.html', name: 'profile', component: profile }
  ]
});