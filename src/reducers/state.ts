import { RouterState } from 'react-router-redux';
import { AuthenticationModel, AuthenticationActionModel } from '../model';

export interface RootState {
  router: RouterState;
  authentication: RootState.AuthenticationState;
  userInfo: RootState.UserInfo;
}

export namespace RootState {
  export type AuthenticationState = AuthenticationModel;
  export type UserInfo = AuthenticationActionModel;
}