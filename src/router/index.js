import Vue from "vue";
import Router from "vue-router";
import Routes from "./router";
import { getLocalStorage } from "@/common/utils";
import { STORAGE_ACCESS_TOKEN, STORAGE_STATUS_POLICY } from "@/common/constants";

Vue.use(Router);

const requireAuth = (to, from, next) => {
  const loginPath = "/";
  const token = getLocalStorage(STORAGE_ACCESS_TOKEN);
  if (token === null && to.path !== loginPath) {
    localStorage.removeItem(STORAGE_STATUS_POLICY);
    next(loginPath);
  } else {
    if (to.path === "/") {
      localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    }
    next();
  }
};

const checkLogin = (to, from, next) => {
  const homePath = "/home";
  const token = getLocalStorage(STORAGE_ACCESS_TOKEN);

  if (token !== null && to.path === "/") {
    next(homePath);
  } else {
    if (to.path === "/") {
      localStorage.removeItem(STORAGE_ACCESS_TOKEN);
      next('/login');
    }
    next();
  }
};

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login', '/register'];
//   const authRequired = !publicPages.includes(to.path);
//   const user = getLocalStorage('user');

//   if (authRequired && (!user || !user.token)) {
//     next('/login');
//   } else {
//     if (to.path === "/" || to.path == "/pi") {
//       next('/status');
//     }
//     next();
//   }
// });

export default new Router({
  mode: "history",
  routes: Routes.map(route => ({
    path: route.path,
    name: route.name,
    component: route.component,
    redirect: route.redirect,
    beforeEnter: route.name === "login" ? checkLogin : requireAuth,
    children: route.children
  }))
});
