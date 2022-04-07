import PIService from '../services/piv4.service';

const initialState = {
    pi: {
      cloud: {},
      v4: {},
      pi_rework_mode: "",
      version: {}
    },
    isEnableMAC: false,
    nextAction: {
      status: 'success',
      prevAction: 0,
      action: 0
    }
};

export const pi = {
  namespaced: true,
  state: initialState,
  actions: {
    getReworkStates({ commit }) {
      return PIService.getReworkStates().then(
        res => {
          commit('getReworkStatesSuccess', res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit('getReworkStatesFailed');
          return Promise.reject(error);
        }
      );
    },
    getInfoCloud({ commit }) {
      return PIService.getInfoCloud().then(
        res => {
          commit('getInfoCloudSuccess', res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit('getInfoCloudFailed');
          return Promise.reject(error);
        }
      );
    },
    getV4Info({ commit }) {
      return PIService.getV4Info().then(
        res => {
          commit('getV4InfoSuccess', res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit('getV4InfoFailed');
          return Promise.reject(error);
        }
      );
    },
    getReworkMode({ commit }) {
      return PIService.getReworkMode().then(
        res => {
          commit('getReworkModeSuccess', res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit('getReworkModeFailed');
          return Promise.reject(error);
        }
      );
    },
    getReworkVersion({ commit }) {
      return PIService.getReworkVersion().then(
        res => {
          commit('getReworkVersionSuccess', res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit('getReworkVersionFailed');
          return Promise.reject(error);
        }
      );
    },
    getReworkMAC({ commit }) {
      return PIService.getReworkMAC().then(
        res => {
          commit('getReworkMACSuccess', res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit('getReworkMACFailed');
          return Promise.reject(error);
        }
      );
    },
    postReworkMAC({ commit }, data) {
      return PIService.postReworkMAC(data).then(
        // eslint-disable-next-line no-unused-vars
        _res => {
          if (_res && _res.data && _res.data.length > 0) {
            if (_res.data[0].status) {
              commit('postReworkMACSuccess');
              return Promise.resolve(data);
            } else {
              commit('postReworkMACFailed');
              return Promise.reject(data);
            }
          }
        },
        error => {
          commit('postReworkMACFailed', data);
          return Promise.reject(error);
        }
      );
    },
    doAction({ commit }, data) {
      return PIService.setAction(data).then(
        // eslint-disable-next-line no-unused-vars
        _res => {
          if (_res && _res.data && _res.data.length > 0) {
            if (_res.data[0].status) {
              commit('setPiActionSuccess', data);
              return Promise.resolve(data);
            } else {
              commit('setPiActionFailed', data);
              return Promise.reject(data);
            }
          }
        },
        error => {
          commit('setPiActionFailed', data);
          return Promise.reject(error);
        }
      );
    },
  },
  mutations: {
    getReworkStatesSuccess(state, pi) {
      state.pi = {
        ...state.pi,
        ...pi
      };
    },
    getReworkStatesFailed() {
        // TODO
    },
    getInfoCloudSuccess(state, pi) {
      state.pi = {
        ...state.pi,
        cloud: pi
      };
    },
    getInfoCloudFailed() {
      // TODO
    },
    getV4InfoSuccess(state, pi) {
      state.pi = {
        ...state.pi,
        v4: pi
      };
    },
    getV4InfoFailed() {
      // TODO
    },
    getReworkModeSuccess(state, pi) {
      state.pi = {
        ...state.pi,
        pi_rework_mode: pi.pi_rework_mode
      };
    },
    getReworkModeFailed() {
      // TODO
    },
    setPiActionSuccess(state, action) {
      state.nextAction = {
        status: 'success',
        prevAction: state.pi.pi_v4_state,
        action: action.num
      };
    },
    setPiActionFailed(state, action) {
      state.nextAction = {
        status: 'failed',
        prevAction: state.pi.pi_v4_state,
        action: action.num
      };
    },
    postReworkMACSuccess() {},
    postReworkMACFailed() {},
    getReworkVersionSuccess(state, pi) {
      state.pi = {
        ...state.pi,
        version: {
          pi_rework_latest_ver: pi.pi_rework_latest_ver,
          pi_rework_current_ver: pi.pi_rework_current_ver
        }
      };
    },
    getReworkVersionFailed() {},
    getReworkMACSuccess(state, pi) {
      state.pi = {
        ...state.pi,
        isEnableMAC: pi.pi_rework_cm_mac_check
      };
    },
    getReworkMACFailed() {},
  },
  getters: {
    pi(state) {
        return state.pi;
    },
    nextAction(state) {
        return state.nextAction;
    }
  }
};
