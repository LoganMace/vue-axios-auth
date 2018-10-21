import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

import router from './router'
import store from './store'

axios.defaults.baseURL = 'https://vue-max-course.firebaseio.com/';
// axios.defaults.headers.common['Authorization'] = 'test123';
axios.defaults.headers.get['Accepts'] = 'application/json';

// Adding interceptors

const reqInterceptor = axios.interceptors.request.use((config) => {
  console.log('Request: ', config);
  return config;
});
const resInterceptor = axios.interceptors.response.use((res) => {
  console.log('Response: ', res);
  return res;
});

// Removing interceptors

axios.interceptors.request.eject(reqInterceptor);
axios.interceptors.response.eject(resInterceptor);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});