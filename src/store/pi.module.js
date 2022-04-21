import PIService from '../services/piv4.service';

const initialState = {
    pi: {
      cloud: {},
      v4: {},
      pi_rework_mode: "",
      version: {},
      isEnableMAC: false,
      skip_installing_plume_cas: false,
      skip_installing_fw: false,
    },
    nextAction: {
      status: 'success',
      prevAction: 0,
      action: 0
    },
    raspberry_pi: {
      gateway: {
        hgj310v4_gw_ip: '',
      },
      wifi: {
        ssid: '',
        password: '',
      },
      interface: {
        eth0: '',
        usb_to_ethernet: '',
        wifi: '',
      }
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
    getGatewayIP({ commit }) {
      return PIService.getGatewayIP().then(
        res => {
          commit('getGatewayIPSuccess', res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit('getGatewayIPFailed');
          return Promise.reject(error);
        }
      );
    },
    getWifiAccount({ commit }) {
      return PIService.getWifiAccount().then(
        res => {
          commit('getWifiAccountSuccess', res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit('getWifiAccountFailed');
          return Promise.reject(error);
        }
      );
    },
    getInterfaceIP({ commit }) {
      return PIService.getInterfaceIP().then(
        res => {
          commit('getInterfaceIPSuccess', res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit('getInterfaceIPFailed');
          return Promise.reject(error);
        }
      );
    },
    getSkipPlumeCas({ commit }) {
      return PIService.getSkipPlumeCas().then(
        res => {
          commit('getSkipPlumeCasSuccess', res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit('getSkipPlumeCasFailed');
          return Promise.reject(error);
        }
      );
    },
    getSkipInstallFW({ commit }) {
      return PIService.getSkipInstallFW().then(
        res => {
          commit('getSkipInstallFWSuccess', res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit('getSkipInstallFWFailed');
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
    getGatewayIPSuccess(state, data) {
      state.raspberry_pi.gateway = {
        hgj310v4_gw_ip: data.hgj310v4_gw_ip,
      };
    },
    getGatewayIPFailed() {},
    getWifiAccountSuccess(state, data) {
      state.raspberry_pi.wifi = {
        ssid: data.ssid,
        password: data.password,
      };
    },
    getWifiAccountFailed() {},
    getInterfaceIPSuccess(state, data) {
      state.raspberry_pi.interface = {
        eth0: data.eth0,
        usb_to_ethernet: data['USB-to-Ethernet'],
        wifi: data['Wi-Fi']
      };
    },
    getInterfaceIPFailed() {},
    getSkipPlumeCasSuccess(state, data) {
      state.pi.skip_installing_plume_cas = data.skip_installing_plume_cas
    },
    getSkipPlumeCasFailed() {},
    getSkipInstallFWSuccess(state, data) {
      state.pi.skip_installing_fw = data.skip_installing_fw
    },
    getSkipInstallFWFailed() {},
  },
  getters: {
    pi(state) {
        return state.pi;
    },
    nextAction(state) {
        return state.nextAction;
    },
    raspberry_pi_gateway(state) {
      return state.raspberry_pi.gateway;
    },
    raspberry_pi_wifi(state) {
      return state.raspberry_pi.wifi;
    },
    raspberry_pi_interface(state) {
      return state.raspberry_pi.interface;
    },
  }
};
