import axios from 'axios';
import { setLocalStorage } from '../common/utils';

const API_URL = 'http://localhost:3000/api/auth/';

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'login', {
        email: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data) {
          setLocalStorage('user', response.data);
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(API_URL + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    });
  }
}

export default new AuthService();
