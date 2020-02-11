import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import router from '../router';
import FCM from '../services/firebase';

Vue.use(Vuex);

const req = axios.create({
  baseURL: 'https://api.poolc.org/graphql',
  method: 'post',
  headers: {
    'Content-Type': 'application/graphql',
  },
  timeout: 1500,
});

const STATES = {
  INIT: 0,
  LOADING: 1,
  ERROR: 2,
  LOADED: 3,
};

export default new Vuex.Store({
  state: {
    curState: STATES.INIT,
    isAdmin: false,
    isLogin: false,
    loginID: '',
  },
  mutations: {
    login(state, result) {
      state.curState = STATES.LOADED;
      if (result.isLogin) state.isLogin = result.isLogin;
      if (result.isAdmin) state.isAdmin = result.isAdmin;
      if (result.loginID) state.loginID = result.loginID;
    },
    logout(state) {
      state.curState = STATES.LOADED;
      state.isLogin = false;
      state.isAdmin = false;
      state.loginID = '';
    },
  },
  actions: {
    init({ state, commit }) {
      state.curState = STATES.LOADING;
      localStorage.removeItem('accessToken');
      commit('logout');
      FCM.unregister();
    },
    async refresh({ state, commit }, token) {
      state.curState = STATES.LOADING;
      const me = await req.request({
        data: `query {
          me {
            loginID, isAdmin, uuid, isActivated
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
    },
    async loginRequest({ state, commit }, userInput) {
      state.curState = STATES.LOADING;

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
          state.curState = STATES.ERROR;
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
    logoutRequest({ state, commit }) {
      state.curState = STATES.LOADING;
      localStorage.removeItem('accessToken');
      commit('logout');
      FCM.unregister();
      router.push('/');
    },
  },
});
