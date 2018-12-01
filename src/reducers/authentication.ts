import { handleActions } from "redux-actions";
import { RootState } from "./state";
import { AuthenticationActions } from "../actions";
import { AuthenticationModel, AuthenticationActionModel } from "../model";
const update = require('react-addons-update');

const initialAuthState: RootState.AuthenticationState = {
  login: {
    status: 'INIT'
  },
  status: {
    isLogin: false,
    isAdmin: false
  }
};

const initialInfoState: RootState.UserInfo = {
  id: "",
  pw: "",
  readPermissions: "",
  writePermissions: ""
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
          isLogin: { $set: true }
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
    [AuthenticationActions.Type.AUTH_ADMIN_LOGIN]: (state, action) => {
      return update(state, {
        status: {
          isAdmin: { $set: true }
        }
      });
    },
  },
  initialAuthState
);

export const actionReducer = handleActions<RootState.UserInfo, AuthenticationActionModel>(
  {
    [AuthenticationActions.Type.AUTH_LOGIN_SUCCESS]: (state, action) => {
      return update(state, {
        id: { $set: action.payload },
        readPermissions: { $set: "" /*state.status.isAdmin ? "ADMIN" : (state.status.isLogin ? "MEMBER" : "PUBLIC")*/ },
        writePermissions: { $set: "" /*state.status.isAdmin ? "ADMIN" : (state.status.isLogin ? "MEMBER" : "PUBLIC")*/ }
      });
    },
    [AuthenticationActions.Type.AUTH_LOGOUT]: (state, action) => {
      return update(state, {
        id: { $set: "" },
        readPermissions: { $set: "" },
        writePermissions: { $set: "" }
      });
    }
  },
  initialInfoState
)