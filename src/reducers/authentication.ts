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
    isLogin: false
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
          isLogin: { $set: false }
        }
      });
    }
  },
  initialState
);

