import { createAction } from 'redux-actions';
import { Dispatch } from 'redux';

export namespace AuthenticationActions {
  export enum Type {
    AUTH_LOGIN = "AUTH_LOGIN",
    AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS",
    AUTH_LOGIN_FAILURE = "AUTH_LOGIN_FAILURE",
    AUTH_LOGOUT = "AUTH_LOGOUT"
  }

  const login = createAction(Type.AUTH_LOGIN);
  const loginSuccess = createAction(Type.AUTH_LOGIN_SUCCESS);
  const loginFailure = createAction(Type.AUTH_LOGIN_FAILURE);
  const logout = createAction(Type.AUTH_LOGOUT);

  export const loginRequest = (id: string, pw: string) => {
    return (dispatch: Dispatch) => {
      dispatch(login());

      // TODO: API request
      setTimeout(() => {dispatch(loginSuccess())}, 5000);
    }
  };

  export const logoutRequest = () => {
    return (dispatch: Dispatch) => {
      dispatch(logout());
    }
  };
}

export type AuthenticationActions = Omit<typeof AuthenticationActions, 'Type'>;