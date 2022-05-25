import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VeeValidate from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import "@/plugins/axios";
import I18n from "@/plugins/i18n";
import "@/plugins/element.js";
import { LANG } from '@/config';

import { getLocalStorage } from '@/common/utils';
import { STORAGE_LANGUAGE } from '@/common/constants'
let defaultLanguage;
if (LANG) {
  defaultLanguage = LANG.DEFAULT_LANGUAGE;
}
library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VeeValidate);
Vue.component('font-awesome-icon', FontAwesomeIcon);

let vLanguage = getLocalStorage(STORAGE_LANGUAGE);

if (vLanguage === null || vLanguage === undefined) {
  vLanguage = defaultLanguage;
  getLocalStorage(STORAGE_LANGUAGE, vLanguage);
}
I18n.locale = vLanguage;

new Vue({
  router,
  store,
  i18n: I18n, // the vue-i18n plugin instance
  i18nRootKey: "validations", // the nested key under which the validation messages will be located
  render: h => h(App)
}).$mount('#app');
