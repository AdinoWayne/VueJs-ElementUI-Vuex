import Vue from 'vue';
import Vuex from 'vuex';

import { auth } from './auth.module';
import { post } from './post.module';
import { pi } from './pi.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    post,
    pi
  }
});
