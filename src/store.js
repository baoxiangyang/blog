import Vue from 'vue';
import Vuex from 'vuex';
import articleModule from './article/articleModule.js';
import {set_dialogLogin, set_userInfo} from './mutation-types.js';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dialogLogin: false,
    userInfo: {}
  },
  mutations: {
    [set_dialogLogin](state, bool){
      state.dialogLogin = bool;
    },
    [set_userInfo](state, data) {
      state.userInfo = data;
      // state.userInfo = Object.assign({}, data);
    }
  },
  modules: {
    articleModule
  }
});