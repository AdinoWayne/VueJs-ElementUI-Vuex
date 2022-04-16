import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Scan from './views/Scan.vue';
import Upgrade from './views/Upgrade.vue';
import Login from './views/Login.vue';
import { getLocalStorage } from './common/utils';
Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/status',
      name: 'Status',
      component: Home
    },
    {
      path: '/scan',
      name: 'Scan',
      component: Scan
    },
    {
      path: '/upgrade',
      name: 'Upgrade',
      component: Upgrade
    },
    {
      path: '/login',
      component: Login
    }
  ]
});

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login', '/register'];
//   const authRequired = !publicPages.includes(to.path);
//   const user = getLocalStorage('user');

//   if (authRequired && (!user || !user.token)) {
//     next('/login');
//   } else {
//     if (to.path === "/") {
//       next('/status');
//     }
//     next();
//   }
// });
