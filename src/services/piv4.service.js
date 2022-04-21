import axios from './../common/api';
import authHeader from './auth-header';

const API_URL = 'http://192.168.100.222:8888/api/pi/';
class PIService {
  getInfoCloud() {
    return axios.get(API_URL + 'get_cloud_info', { headers: authHeader() });
  }

  getReworkStates() {
    return axios.get(API_URL + 'get_rework_states', { headers: authHeader() });
  }

  getV4Info() {
    return axios.get(API_URL + 'get_v4_info', { headers: authHeader() });
  }

  getReworkMode() {
    return axios.get(API_URL + 'get_rework_mode', { headers: authHeader() });
  }

  getReworkVersion() {
    return axios.get(API_URL + 'get_pi_code_version', { headers: authHeader() });
  }

  getReworkMAC() {
    return axios.get(API_URL + 'pi_rework_cm_mac_check', { headers: authHeader() });
  }

  postReworkMAC(data) {
    return axios.post(API_URL + 'pi_rework_cm_mac_check', {
      pi_rework_cm_mac_check: data.pi_rework_cm_mac_check
    }, { headers: authHeader() });
  }

  setAction(data) {
    if (data.num !== undefined) {
      delete data.num;
    }
    return axios.post(API_URL + 'do_action', {
      ...data
    }, { headers: authHeader() });
  }

  getGatewayIP() {
    return axios.get(API_URL + 'get_hgj310v4_gw_ip', { headers: authHeader() });
  }

  getWifiAccount() {
    return axios.get(API_URL + 'get_rasp_pi_wifi_account', { headers: authHeader() });
  }

  getInterfaceIP() {
    return axios.get(API_URL + 'get_rasp_pi_interface_ips', { headers: authHeader() });
  }

  getSkipPlumeCas() {
    return axios.get(API_URL + 'get_skip_installing_plume_cas', { headers: authHeader() });
  }

  getSkipInstallFW() {
    return axios.get(API_URL + 'get_skip_installing_fw', { headers: authHeader() });
  }
}

export default new PIService();
