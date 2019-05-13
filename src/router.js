import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/',  redirect:{name: 'articleList'}, name: 'index'},
      { path:'/article', name:'article', component: () => import(/* webpackChunkName: "article" */ './article/index.vue') ,
        children:[
          { path: 'list.html', name: 'articleList', component: () => import(/* webpackChunkName: "articleList" */ './article/articleList.vue') },
          { path: 'articleDetails.html', name: 'articleDetails', component: () => import(/* webpackChunkName: "articleDetails" */ './article/articleDetails.vue') }
        ]
      },
      { path: '/crawler.html', name: 'crawler', component: () => import(/* webpackChunkName: "crawler" */ './crawler/index.vue') },
      { path: '/register.html', name: 'register', component: () => import(/* webpackChunkName: "register" */ './user/register.vue') },
      { path: '/messageBoard.html', name: 'messageBoard', component: () => import(/* webpackChunkName: "messageBoard" */ './messageBoard/index.vue')},
      { path: '/profile.html', name: 'profile', component: () => import(/* webpackChunkName: "profile" */ './profile/index.vue') }
    ]
  })
}