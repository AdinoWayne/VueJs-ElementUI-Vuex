import Scan from '@/views/Scan.vue';
import Login from '@/views/Login.vue';
// import { getLocalStorage } from '../common/utils';

const Routes = [
  {
    path: '/status',
    name: 'status',
    component: Scan
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]
export default Routes;