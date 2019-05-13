import Vue from 'vue';
import createRouter from './router.js';
import createStore  from './store'
import { sync } from 'vuex-router-sync'
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import index from './layout/index.vue';

import axios from './common/axios.js';
import VueAxios from 'vue-axios';
import myAjax from './common/myAjax.js';

Vue.use(ElementUI);
Vue.use(myAjax, axios);

export function createApp() {
  const router = createRouter();
  const store = createStore();
  sync(store, router)
  const app = new Vue({
    router,
    store,
  	render: h => h(index)
  });
  return {app, router, store};
}