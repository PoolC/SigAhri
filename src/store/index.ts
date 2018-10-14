import { Store, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { rootReducer } from '../reducers';
import { RootState } from "../reducers/state";

const logger = (createLogger as any)();

export function configureStore(initialState?: RootState): Store<RootState> {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, logger)
  );
}