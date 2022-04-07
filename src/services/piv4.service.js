import axios from './../common/api';
import authHeader from './auth-header';

const API_URL = 'http://192.168.100.222:8001/api/pi/';
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
    return axios.get(API_URL + 'get_rework_current_ver', { headers: authHeader() });
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
    return axios.post(API_URL + 'do_action', {
      action_name: data.action_name
    }, { headers: authHeader() });
  }
}

export default new PIService();
