import Vue from 'vue';
import Vuex from 'vuex';
import articleModule from './article/articleModule.js';
import {set_dialogLogin} from './mutation-types.js';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dialogLogin: false
  },
  mutations: {
	[set_dialogLogin](state, bool){
		state.dialogLogin = bool;
	}
  },
  modules: {
	articleModule
  }
});