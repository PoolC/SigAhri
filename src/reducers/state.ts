import { RouterState } from 'react-router-redux';
import { AuthenticationModel } from '../model';

export interface RootState {
  router: RouterState;
  authentication: RootState.AuthenticationState;
}

export namespace RootState {
  export type AuthenticationState = AuthenticationModel;
}