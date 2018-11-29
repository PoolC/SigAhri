import { createAction } from 'redux-actions';
import { Dispatch } from 'redux';
import axios from 'axios';
import history from '../history/history'

export namespace AuthenticationActions {
  export enum Type {
    AUTH_LOGIN = "AUTH_LOGIN",
    AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS",
    AUTH_LOGIN_FAILURE = "AUTH_LOGIN_FAILURE",
    AUTH_LOGOUT = "AUTH_LOGOUT",
    AUTH_LOGIN_INIT = "AUTN_LOGIN_INIT",
    AUTH_ADMIN_LOGIN = "AUTH_ADMIN_LOGIN"
  }

  const login = createAction(Type.AUTH_LOGIN);
  const loginSuccess = createAction(Type.AUTH_LOGIN_SUCCESS);
  const loginFailure = createAction(Type.AUTH_LOGIN_FAILURE);
  const logout = createAction(Type.AUTH_LOGOUT);
  const loginInit = createAction(Type.AUTH_LOGIN_INIT);
  const adminLogin = createAction(Type.AUTH_ADMIN_LOGIN);

  export const loginRequest = (id: string, pw: string) => {
    return (dispatch: Dispatch) => {
      dispatch(login());

      axios({
        url: apiUrl,
        method: 'post',
        headers: {
          'Content-Type': 'application/graphql'
        },
        data: `mutation {
          createAccessToken(LoginInput:{
            loginID: "${id}"
            password: "${pw}"
          }) {
            key
          }
        }`
      }).then((msg) => {
        const data = msg.data;
        if('errors' in data) {
          alert('아이디 혹은 비밀번호가 틀렸습니다.');
          dispatch(loginFailure());
        } else {
          const token = data.data.createAccessToken.key;
          localStorage.setItem('accessToken', token);
          tokenApplyRequest(token)(dispatch);

          // TODO: 맨처음 방문한 곳이 로그인 페이지면 '/'로 이동
          // TODO: 그렇지 않은 경우에는 뒤로가기
          history.push('/');
        }
      }).catch((msg) => {
        console.log("login API Error -----");
        console.log(msg);
      });
    }
  };

  export const logoutRequest = () => {
    return (dispatch: Dispatch) => {
      localStorage.removeItem('accessToken');
      dispatch(logout());
      history.push('/');
    }
  };

  export const tokenApplyRequest = (token: string) => {
    return (dispatch: Dispatch) => {
      console.log(token);
      if(token === null) {
        return;
      }
      axios({
        url: apiUrl,
        method: 'post',
        headers: {
          'Content-Type': 'application/graphql',
          'Authorization': `Bearer ${token}`
        },
        data: `query {
          me {
            isAdmin
          }
        }`
      }).then((msg) => {
        const data = msg.data;
        console.log(data);
        if('errors' in data) {
          dispatch(loginInit());
        } else {
          dispatch(loginSuccess());
          if(data.data.me.isAdmin) {
            dispatch(adminLogin());
          }
        }
      }).catch((msg) => {
        console.log("token apply error -----");
        console.log(msg);
        // token expired
        logoutRequest()(dispatch);
      });
    }
  }
}

export type AuthenticationActions = Omit<typeof AuthenticationActions, 'Type'>;