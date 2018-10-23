import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from './store';
import { App } from './containers';
import {Route, Switch} from 'react-router';
import { Router } from 'react-router-dom';
import history from './history/history'

const store = configureStore();

ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </Provider>
  </Router>,
  document.getElementById('root')
);