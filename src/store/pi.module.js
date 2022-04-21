import PIService from '../services/piv4.service';
import {
  HOME_PI,
  NEXT_ACTION,
  RASPBERRY_PI_GATEWAY,
  RASPBERRY_PI_WIFI,
  RASPBERRY_PI_INTERFACE
} from './types/getters';

import {
  GET_REWORK_STATE_SUCCESS,
  GET_REWORK_STATE_FAILED,
  GET_INFO_CLOUD_SUCCESS,
  GET_INFO_CLOUD_FAILED,
  GET_INFO_V4_SUCCESS,
  GET_INFO_V4_FAILED,
  GET_REWORK_MODE_SUCCESS,
  GET_REWORK_MODE_FAILED,
  GET_REWORK_VERSION_SUCCESS,
  GET_REWORK_VERSION_FAILED,
  GET_REWORK_MAC_SUCCESS,
  GET_REWORK_MAC_FAILED,
  GET_GATEWAY_IP_SUCCESS,
  GET_GATEWAY_IP_FAILED,
  GET_WIFI_ACCOUNT_SUCCESS,
  GET_WIFI_ACCOUNT_FAILED,
  GET_INTERFACE_IP_SUCCESS,
  GET_INTERFACE_IP_FAILED,
  GET_SKIP_PLUME_CAS_SUCCESS,
  GET_SKIP_PLUME_CAS_FAILED,
  GET_SKIP_INSTALL_FW_SUCCESS,
  GET_SKIP_INSTALL_FW_FAILED,
  SET_REWORK_MAC_SUCCESS,
  SET_REWORK_MAC_FAILED,
  SET_PI_ACTION_SUCCESS,
  SET_PI_ACTION_FAILED
} from './types/mutations';

import {
  GET_REWORK_STATE,
  GET_INFO_CLOUD,
  GET_INFO_V4,
  GET_REWORK_MODE,
  GET_REWORK_VERSION,
  GET_REWORK_MAC,
  GET_GATEWAY_IP,
  GET_WIFI_ACCOUNT,
  GET_INTERFACE_IP,
  GET_SKIP_PLUME_CAS,
  GET_SKIP_INSTALL_FW,
  SET_REWORK_MAC,
  SET_PI_ACTION
} from './types/actions';

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
    [GET_REWORK_STATE]({ commit }) {
      return PIService.getReworkStates().then(
        res => {
          commit(GET_REWORK_STATE_SUCCESS, res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit(GET_REWORK_STATE_FAILED);
          return Promise.reject(error);
        }
      );
    },
    [GET_INFO_CLOUD]({ commit }) {
      return PIService.getInfoCloud().then(
        res => {
          commit(GET_INFO_CLOUD_SUCCESS, res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit(GET_INFO_CLOUD_FAILED);
          return Promise.reject(error);
        }
      );
    },
    [GET_INFO_V4]({ commit }) {
      return PIService.getV4Info().then(
        res => {
          commit(GET_INFO_V4_SUCCESS, res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit(GET_INFO_V4_FAILED);
          return Promise.reject(error);
        }
      );
    },
    [GET_REWORK_MODE]({ commit }) {
      return PIService.getReworkMode().then(
        res => {
          commit(GET_REWORK_MODE_SUCCESS, res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit(GET_REWORK_MODE_FAILED);
          return Promise.reject(error);
        }
      );
    },
    [GET_REWORK_VERSION]({ commit }) {
      return PIService.getReworkVersion().then(
        res => {
          commit(GET_REWORK_VERSION_SUCCESS, res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit(GET_REWORK_VERSION_FAILED);
          return Promise.reject(error);
        }
      );
    },
    [GET_REWORK_MAC]({ commit }) {
      return PIService.getReworkMAC().then(
        res => {
          commit(GET_REWORK_MAC_SUCCESS, res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit(GET_REWORK_MAC_FAILED);
          return Promise.reject(error);
        }
      );
    },
    [GET_GATEWAY_IP]({ commit }) {
      return PIService.getGatewayIP().then(
        res => {
          commit(GET_GATEWAY_IP_SUCCESS, res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit(GET_GATEWAY_IP_FAILED);
          return Promise.reject(error);
        }
      );
    },
    [GET_WIFI_ACCOUNT]({ commit }) {
      return PIService.getWifiAccount().then(
        res => {
          commit(GET_WIFI_ACCOUNT_SUCCESS, res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit(GET_WIFI_ACCOUNT_FAILED);
          return Promise.reject(error);
        }
      );
    },
    [GET_INTERFACE_IP]({ commit }) {
      return PIService.getInterfaceIP().then(
        res => {
          commit(GET_INTERFACE_IP_SUCCESS, res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit(GET_INTERFACE_IP_FAILED);
          return Promise.reject(error);
        }
      );
    },
    [GET_SKIP_PLUME_CAS]({ commit }) {
      return PIService.getSkipPlumeCas().then(
        res => {
          commit(GET_SKIP_PLUME_CAS_SUCCESS, res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit(GET_SKIP_PLUME_CAS_FAILED);
          return Promise.reject(error);
        }
      );
    },
    [GET_SKIP_INSTALL_FW]({ commit }) {
      return PIService.getSkipInstallFW().then(
        res => {
          commit(GET_SKIP_INSTALL_FW_SUCCESS, res.data);
          return Promise.resolve(res.data);
        },
        error => {
          commit(GET_SKIP_INSTALL_FW_FAILED);
          return Promise.reject(error);
        }
      );
    },
    [SET_REWORK_MAC]({ commit }, data) {
      return PIService.postReworkMAC(data).then(
        // eslint-disable-next-line no-unused-vars
        _res => {
          if (_res && _res.data && _res.data.length > 0) {
            if (_res.data[0].status) {
              commit(SET_REWORK_MAC_SUCCESS);
              return Promise.resolve(data);
            } else {
              commit(SET_REWORK_MAC_FAILED);
              return Promise.reject(data);
            }
          }
        },
        error => {
          commit(SET_REWORK_MAC_FAILED, data);
          return Promise.reject(error);
        }
      );
    },
    [SET_PI_ACTION]({ commit }, data) {
      return PIService.setAction(data).then(
        // eslint-disable-next-line no-unused-vars
        _res => {
          if (_res && _res.data && _res.data.length > 0) {
            if (_res.data[0].status) {
              commit(SET_PI_ACTION_SUCCESS, data);
              return Promise.resolve(data);
            } else {
              commit(SET_PI_ACTION_FAILED, data);
              return Promise.reject(data);
            }
          }
        },
        error => {
          commit(SET_PI_ACTION_FAILED, data);
          return Promise.reject(error);
        }
      );
    },
  },
  mutations: {
    [GET_REWORK_STATE_SUCCESS](state, pi) {
      state.pi = {
        ...state.pi,
        ...pi
      };
    },
    [GET_REWORK_STATE_FAILED]() {},
    [GET_INFO_CLOUD_SUCCESS](state, pi) {
      state.pi = {
        ...state.pi,
        cloud: pi
      };
    },
    [GET_INFO_CLOUD_FAILED]() {},
    [GET_INFO_V4_SUCCESS](state, pi) {
      state.pi = {
        ...state.pi,
        v4: pi
      };
    },
    [GET_INFO_V4_FAILED]() {},
    [GET_REWORK_MODE_SUCCESS](state, pi) {
      state.pi = {
        ...state.pi,
        pi_rework_mode: pi.pi_rework_mode
      };
    },
    [GET_REWORK_MODE_FAILED]() {},
    [SET_PI_ACTION_SUCCESS](state, action) {
      state.nextAction = {
        status: 'success',
        prevAction: state.pi.pi_v4_state,
        action: action.num
      };
    },
    [SET_PI_ACTION_FAILED](state, action) {
      state.nextAction = {
        status: 'failed',
        prevAction: state.pi.pi_v4_state,
        action: action.num
      };
    },
    [SET_REWORK_MAC_SUCCESS]() {},
    [SET_REWORK_MAC_FAILED]() {},
    [GET_REWORK_VERSION_SUCCESS](state, pi) {
      state.pi = {
        ...state.pi,
        version: {
          pi_rework_latest_ver: pi.pi_rework_latest_ver,
          pi_rework_current_ver: pi.pi_rework_current_ver
        }
      };
    },
    [GET_REWORK_VERSION_FAILED]() {},
    [GET_REWORK_MAC_SUCCESS](state, pi) {
      state.pi = {
        ...state.pi,
        isEnableMAC: pi.pi_rework_cm_mac_check
      };
    },
    [GET_REWORK_MAC_FAILED]() {},
    [GET_GATEWAY_IP_SUCCESS](state, data) {
      state.raspberry_pi.gateway = {
        hgj310v4_gw_ip: data.hgj310v4_gw_ip,
      };
    },
    [GET_GATEWAY_IP_FAILED]() {},
    [GET_WIFI_ACCOUNT_SUCCESS](state, data) {
      state.raspberry_pi.wifi = {
        ssid: data.ssid,
        password: data.password,
      };
    },
    [GET_WIFI_ACCOUNT_FAILED]() {},
    [GET_INTERFACE_IP_SUCCESS](state, data) {
      state.raspberry_pi.interface = {
        eth0: data.eth0,
        usb_to_ethernet: data['USB-to-Ethernet'],
        wifi: data['Wi-Fi']
      };
    },
    [GET_INTERFACE_IP_FAILED]() {},
    [GET_SKIP_PLUME_CAS_SUCCESS](state, data) {
      state.pi.skip_installing_plume_cas = data.skip_installing_plume_cas
    },
    [GET_SKIP_PLUME_CAS_FAILED]() {},
    [GET_SKIP_INSTALL_FW_SUCCESS](state, data) {
      state.pi.skip_installing_fw = data.skip_installing_fw
    },
    [GET_SKIP_INSTALL_FW_FAILED]() {},
  },
  getters: {
    [HOME_PI](state) {
        return state.pi;
    },
    [NEXT_ACTION](state) {
        return state.nextAction;
    },
    [RASPBERRY_PI_GATEWAY](state) {
      return state.raspberry_pi.gateway;
    },
    [RASPBERRY_PI_WIFI](state) {
      return state.raspberry_pi.wifi;
    },
    [RASPBERRY_PI_INTERFACE](state) {
      return state.raspberry_pi.interface;
    },
  }
};
