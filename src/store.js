import Vue from 'vue'
import Vuex from 'vuex'

import axios from './axios-auth.js';
import globalAxios from 'axios';
import router from './router';

import {aws} from './key';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null
  },
  mutations: {
    authUser(state, userData) {
      state.idToken = userData.token;
      state.userId = userData.userId;
    },
    storeUser(state, user) {
      state.user = user;
    },
    clearAuthData(state) {
      state.idToken = null;
      state.userId = null;
    }
  },
  actions: {
    setLogoutTimer({commit, dispatch}, expirationTime) {
      setTimeout(() => {
        dispatch('logout');
      } , expirationTime * 1000);
    },
    signup({commit, dispatch}, authData) {
      axios.post(`/signupNewUser?key=${aws}`, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(response => {
          console.log(response);
          commit('authUser', {
          token: response.data.idToken,
          userId: response.data.localId
          });
          const now = new Date();
          const expirationDate = new Date(now.getTime() + (response.data.expiresIn * 1000));
          localStorage.setItem('token', response.data.idToken);
          localStorage.setItem('userId', response.data.localId);
          localStorage.setItem('expirationDate', expirationDate);
          dispatch('storeUser', {authData});
          dispatch('setLogoutTimer', response.data.expiresIn);
          router.replace('/dashboard');
        })
        .catch(err => console.log(err));
    },
    login({commit, dispatch}, authData) {
      axios.post(`/verifyPassword?key=${aws}`, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(response => {
          console.log(response);
          commit('authUser', {
          token: response.data.idToken,
          userId: response.data.localId
          });
          const now = new Date();
          const expirationDate = new Date(now.getTime() + (response.data.expiresIn * 1000));
          localStorage.setItem('token', response.data.idToken);
          localStorage.setItem('userId', response.data.localId);
          localStorage.setItem('expirationDate', expirationDate);
          dispatch('setLogoutTimer', response.data.expiresIn);
          router.replace('/dashboard');
        })
        .catch(err => console.log(err));
    },
    tryAutoLogin({commit}) {
      const token = localStorage.getItem('token');
      if(!token) {
        return;
      }
      const expirationDate = localStorage.getItem('expirationDate');
      const now = new Date();
      if(now >= expirationDate) {
        return;
      }
      const userId = localStorage.getItem('userId');
      commit('authUser', {
        token,
        userId
      });
    },
    logout({commit}) {
      commit('clearAuthData');
      localStorage.removeItem('expirationDate');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      router.replace('/signin');
    },
    storeUser({commit, state}, userData) {
      if(!state.idToken){
        return
      }
      globalAxios.post(`/users.json?auth=${state.idToken}`, userData)
        .then(response => console.log(response))
        .catch(err => console.log(err));
    },
    fetchUser({commit, state}) {
      if(!state.idToken){
        return
      }
      globalAxios.get(`/users.json?auth=${state.idToken}`)
        .then(response => {
          console.log(response.data);
          const data = response.data;
          const users = [];

          for(let key in data) {
            const user = data[key];
            user.id = key;
            users.push(user);
          }
          console.log(users);
          commit('storeUser', users[0]);
        })
      .catch(err => console.log(err));
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return state.idToken !== null;
    }
  }
})