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
    pw: ""
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
          id: { $set: "" }
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
    [AuthenticationActions.Type.AUTH_GET_USERID]: (state, action) => {
      return update(state, {
        userInfo: {
          id: { $set: action.payload }
        }
      });
    },
  },
  initialState
);