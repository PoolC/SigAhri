import * as React from 'react';
import { Authentication } from '../../components';
import { Route, Router, Switch } from 'react-router-dom';
import history from '../../history/history'
import { RegisterSuccess } from '../../components';

export namespace Register {
  export interface Props {

  }
}

export class Register extends React.Component<Register.Props> {
  public render(): JSX.Element {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/register" render={()=>(<Authentication mode={false} />)}/>
          <Route path="/register/success" component={RegisterSuccess} />
        </Switch>
      </Router>
    );
  }
}
