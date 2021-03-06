import { getLocalStorage } from '../common/utils';

export default function authHeader() {
  let user = getLocalStorage('user');

  if (user) {
    return { Authorization: user.token }; // for Spring Boot back-end
    // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  } else {
    return {};
  }
}
