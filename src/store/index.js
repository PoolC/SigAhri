import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from '../router';
import FCM from '../services/firebase';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAdmin: false,
    isLogin: false,
    loginID: '',
  },
  mutations: {
    login(state, result) {
      if (result.isLogin) state.isLogin = result.isLogin;
      if (result.isAdmin) state.isAdmin = result.isAdmin;
      if (result.loginID) state.loginID = result.loginID;
    },
    logout(state) {
      state.isLogin = false;
      state.isAdmin = false;
      state.loginID = '';
    },
  },
  actions: {
    async loginRequest({ commit }, userInput) {
      const req = axios.create({
        baseURL: 'https://api.poolc.org/graphql',
        method: 'post',
        headers: {
          'Content-Type': 'application/graphql',
        },
        timeout: 1500,
      });

      // eslint-disable-next-line no-underscore-dangle
      const res = await req.request({
        data: `mutation {
          createAccessToken(LoginInput: {
            loginID: "${userInput.id}",
            password: "${userInput.pw}"
          }) {
            key
          }
        }`,
      });

      if ('errors' in res.data) {
        if (res.data.errors[0].message === 'TKN000') {
          alert('아이디 혹은 비밀번호가 틀렸습니다');
        } else if (res.data.errors[0].message === 'TKN002') {
          alert('비활성화 된 계정입니다');
        } else {
          alert(`알 수 없는 오류가 발생하였습니다. 메시지: ${res.data.errors[0].message}`);
        }
        return;
      }

      const token = res.data.data.createAccessToken.key;
      localStorage.setItem('accessToken', token);

      const me = await req.request({
        data: `query {
          me {
            uuid,
            isActivated,
            isAdmin,
            loginID
          }
        }`,
        headers: {
          'Content-Type': 'application/graphql',
          Authorization: `Bearer ${token}`,
        },
      });

      const isLogin = me.data.data.me.uuid && me.data.data.me.isActivated;
      commit('login', {
        isLogin,
        isAdmin: isLogin && me.data.data.me.isAdmin,
        loginID: me.data.data.me.loginID,
      });
      FCM.register();
      router.push(userInput.redir ? userInput.redir : '/');
    },
    logoutRequest({ commit }) {
      localStorage.remoteItem('accessToken');
      commit('logout');
      FCM.unregister();
      router.push('/');
    },
  },
});
