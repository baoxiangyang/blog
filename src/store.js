import Vue from 'vue';
import Vuex from 'vuex';
import articleModule from './article/articleModule.js';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 1
  },
  modules: {
	articleModule
  }
});