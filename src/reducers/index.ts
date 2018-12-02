import { combineReducers } from 'redux';
import { RootState } from './state';
import { routerReducer, RouterState } from 'react-router-redux';
import {authenticationReducer} from './authentication';

export { RootState, RouterState };

export const rootReducer = combineReducers<RootState>({
  router: routerReducer as any,
  authentication: authenticationReducer as any
});
