import axios from 'axios';
const TOKEN_INVALID = "Token is invalid";
axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response && error.response.data && error.response.status === 400 && error.response.data.msg == TOKEN_INVALID) {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error)
})

export default axios;