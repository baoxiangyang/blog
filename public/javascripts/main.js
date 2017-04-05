import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import App from './App.vue';
import foo from './foo.vue';
import bar from './bar.vue';
Vue.use(VueRouter);
Vue.use(Vuex);
const moduleA = {
  state: { count: 50 },
  mutations: {
    increment (state) {
      state.count++;
    }
  },

  getters: {
    doubleCount (state) {
      return state.count * 2;
    }
  }
};

window.store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state, obj){
      obj.n ? state.count += obj.n : state.count++;
    }
  },
  modules: {
    moduleA
  }
});
window.router = new VueRouter({
  mode: 'hash',
  routes: [
	{ path: '/index', component: App,
		children: [{
			path: 'foo/:id',
			component: foo,
			meta: { requiresAuth: true }
		}]
	},
  { path: '/foo', component: foo},
  { path: '/bar', component: bar}
  ]
});
window.app2 = new Vue({
  el: '#app2',
  store,
  router
});
