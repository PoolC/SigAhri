import { handleActions } from "redux-actions";
import { RootState } from "./state";
import { AuthenticationActions } from "../actions";
import { AuthenticationModel } from "../model";
const update = require('react-addons-update');

const initialState: RootState.AuthenticationState = {
  login: {
    status: 'INIT'
  },
  status: {
    isLogin: false,
    isAdmin: false
  },
  userInfo: {
    id: "",
    pw: "",
    readPermissions: "PUBLIC",
    writePermissions: "PUBLIC"
  }
};

export const authenticationReducer = handleActions<RootState.AuthenticationState, AuthenticationModel>(
  {
    [AuthenticationActions.Type.AUTH_LOGIN]: (state, action) => {
      return update(state, {
        login: {
          status: { $set: 'WAITING' }
        }
      });
    },
    [AuthenticationActions.Type.AUTH_LOGIN_SUCCESS]: (state, action) => {
      return update(state, {
        login: {
          status: { $set: 'SUCCESS' }
        },
        status: {
          isLogin: { $set: true },
          isAdmin: { $set: action.payload }
        }
      });
    },
    [AuthenticationActions.Type.AUTH_LOGIN_FAILURE]: (state, action) => {
      return update(state, {
        login: {
          status: { $set: 'FAILURE' }
        }
      });
    },
    [AuthenticationActions.Type.AUTH_LOGOUT]: (state, action) => {
      return update(state, {
        login: {
          status: { $set: 'INIT' }
        },
        status: {
          isLogin: { $set: false },
          isAdmin: { $set: false }
        },
        userInfo: {
          id: { $set: "" },
          readPermissions: { $set: "" },
          writePermissions: { $set: "" }
        }
      });
    },
    [AuthenticationActions.Type.AUTH_LOGIN_INIT]: (state, action) => {
      return update(state, {
        login: {
          status: { $set: 'INIT' }
        }
      });
    },
    [AuthenticationActions.Type.AUTH_CHECK_PERMISSIONS]: (state, action) => {
      return update(state, {
        status: {

        },
        userInfo: {
          id: { $set: action.payload },
          readPermissions: { $set: state.status.isAdmin ? "ADMIN" : (state.status.isLogin ? "MEMBER" : "PUBLIC") },
          writePermissions: { $set: state.status.isAdmin ? "ADMIN" : (state.status.isLogin ? "MEMBER" : "PUBLIC") }
        }
      });
    },
  },
  initialState
);