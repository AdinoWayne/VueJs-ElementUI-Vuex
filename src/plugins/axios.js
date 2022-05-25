"use strict";

import Vue from "vue";
import axios from "axios";
import store from "@/store";

import {
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_ERROR,
  LOGOUT
} from "@/store/types/actions";

import { getLocalStorage } from '@/common/utils';
import { STORAGE_ACCESS_TOKEN, STATUS_CODE } from "@/common/constants";

axios.defaults.headers.common["Content-Encoding"] = "gzip";

axios.defaults.headers.common["Access-Token"] = getLocalStorage(
  STORAGE_ACCESS_TOKEN
);

axios.defaults.headers.get["Pragma"] = "no-cache";
axios.defaults.headers.get["Cache-Control"] = "no-cache, no-store";

let config = {};

const _axios = axios.create(config);
let apiRequestCount = 0;

_axios.interceptors.request.use(
  config => {
    const showLoading = config.showLoading;
    if (config.contentType) {
      axios.defaults.headers.common["Content-Type"] = config.contentType;
    }
    if (showLoading) {
      apiRequestCount++;
      if (apiRequestCount === 1) {
        store.dispatch(SHOW_LOADING);
      }
    }
    
    return config;
  },
  error => {
    // Do something with request error
    apiRequestCount = 0;
    store.dispatch(SHOW_ERROR, error);
    store.dispatch(LOGOUT);
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  response => {
    // Do something with response data
    if (apiRequestCount > 0) {
      apiRequestCount--;
    }
    if (apiRequestCount === 0) {
      store.dispatch(HIDE_LOADING);
    }
    return response;
  },
  error => {
    // Do something with response error
    let vAcceptUnAuth = false;
    if (error.config.acceptUnAuth !== null && error.config.acceptUnAuth) {
      vAcceptUnAuth = error.config.acceptUnAuth;
    }
      if (vAcceptUnAuth) {
        // Do not thing
        store.dispatch(HIDE_LOADING);
      } else {
        apiRequestCount = 0;
        if (error.message !== "Network Error") {
          store.dispatch(HIDE_LOADING);
  
          /* Show error if need */
          const vStatus = error.response.status;
  
          if (vStatus) {
            if(vStatus === STATUS_CODE.UNAUTHORIZED) {
              store.dispatch(SHOW_ERROR, error);
            }
          }
          if (vStatus) {
            if(vStatus === STATUS_CODE.UNAUTHORIZED) {
              store.dispatch(LOGOUT);
            }
          }
        }
      }
    // }   

    return Promise.reject(error);
  }
);

// eslint-disable-next-line no-unused-vars
const axiosPlugin = {};
axiosPlugin.install = (Vue) => {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    }
  });
};

Vue.use(axiosPlugin);

export default axiosPlugin;
