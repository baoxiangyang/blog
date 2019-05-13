import Vue from 'vue'
import Vuex from 'vuex'
import articleModule from './article/articleModule.js';
import messageModule from './messageBoard/messageModule.js';
import {set_dialogLogin, set_userInfo, set_default_route} from './mutation-types.js';

Vue.use(Vuex);


export default function createStore () {
  return new Vuex.Store({
    state: {
      dialogLogin: false,
      mainDefault: 'main-1',
      userInfo: {}
    },
    mutations: {
      [set_dialogLogin](state, bool){
        state.dialogLogin = bool;
      },
      [set_userInfo](state, data) {
        state.userInfo = data;
      },
      [set_default_route](state, data) {
        state.mainDefault = data;
      }
    },
    modules: {
      articleModule,
      messageModule
    }
  });
}