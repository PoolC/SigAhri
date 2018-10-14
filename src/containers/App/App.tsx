import * as React from 'react';
import { Home } from '../../components';
import { Login, Register, Board, Project, Header } from '../';
import { Route, Switch } from 'react-router-dom';

type Props = {}

const App: React.SFC<Props> = () => {
    return (
      <div className="app container">
        <Header/>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/board" component={Board}/>
          <Route path="/project" component={Project}/>
          <Route path="/register" component={Register}/>
          <Route path="/login" component={Login}/>
        </Switch>
      </div>
    );
};

export { App };