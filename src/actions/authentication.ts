import { createAction } from 'redux-actions';
import { Dispatch } from 'redux';
import axios from 'axios';
import history from '../history/history'
import FCM from './firebase';

export namespace AuthenticationActions {
  export enum Type {
    AUTH_LOGIN = "AUTH_LOGIN",
    AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS",
    AUTH_LOGIN_FAILURE = "AUTH_LOGIN_FAILURE",
    AUTH_LOGOUT = "AUTH_LOGOUT",
    AUTH_LOGIN_INIT = "AUTH_LOGIN_INIT",
    AUTH_GET_USERID = "AUTH_GET_USERID",
    AUTH_INIT_OK = "AUTH_INIT_OK"
  }

  const login = createAction(Type.AUTH_LOGIN);
  const loginSuccess = createAction(Type.AUTH_LOGIN_SUCCESS);
  const loginFailure = createAction(Type.AUTH_LOGIN_FAILURE);
  const logout = createAction(Type.AUTH_LOGOUT);
  const loginInit = createAction(Type.AUTH_LOGIN_INIT);
  const setUserID = createAction(Type.AUTH_GET_USERID);
  const authenticationInitializeOK = createAction(Type.AUTH_INIT_OK);

  export const loginRequest = (id: string, pw: string, redirLink: string) => {
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
          if(data.errors[0].message === "TKN000") {
            alert('아이디 혹은 비밀번호가 틀렸습니다.');
          } else if(data.errors[0].message === "TKN002") {
            alert('비활성화된 계정입니다.');
          } else {
            console.log("login API error -----");
            console.log(data);
          }
          dispatch(loginFailure());
        } else {
          const token = data.data.createAccessToken.key;
          localStorage.setItem('accessToken', token);
          tokenApplyRequest(token)(dispatch);

          // TODO: 맨처음 방문한 곳이 로그인 페이지면 '/'로 이동
          // TODO: 그렇지 않은 경우에는 뒤로가기
          let url = redirLink ? redirLink : '/';
          history.push(url);
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
      FCM.unregisterToken();

      history.push('/');
    }
  };

  export const tokenApplyRequest = (token: string) => {
    return (dispatch: Dispatch) => {
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
            isAdmin,
            loginID
          }
        }`
      }).then((msg) => {
        const data = msg.data;
        const me = data.data.me;
        if('errors' in data) {
          dispatch(loginInit());
        } else {
          FCM.initializeFCM();
          dispatch(loginSuccess(me.isAdmin));
          dispatch(setUserID(me.loginID));
        }
      }).catch((msg) => {
        console.log("token apply error -----");
        console.log(msg);
        // token expired
        logoutRequest()(dispatch);
      });
    }
  };

  export const authenticationInitializeOKRequest = () => {
    return (dispatch: Dispatch) => {
      dispatch(authenticationInitializeOK());
    }
  };
}

export type AuthenticationActions = Omit<typeof AuthenticationActions, 'Type'>;