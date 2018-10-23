import * as React from 'react';
import { Home } from '../../components';
import { Login, Register, Board, Project, Header } from '../';
import { Route, Switch } from 'react-router-dom';
import { Dispatch, compose } from 'redux';
import { returntypeof } from 'react-redux-typescript';
import { connect } from 'react-redux';
import { AuthenticationActions } from '../../actions';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  tokenApplyRequest: (token: string) => {
    return dispatch(AuthenticationActions.tokenApplyRequest(token) as any);
  }
});

const actionProps = returntypeof(mapDispatchToProps);

type Props = typeof actionProps;

class App extends React.Component<Props> {
  componentDidMount() {
    const token = localStorage.getItem('accessToken');
    if(token !== null) {
      this.props.tokenApplyRequest(token);
    }
  }

  render() {
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
  }
}

export default compose(connect(null, mapDispatchToProps))(App);