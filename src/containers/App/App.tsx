import * as React from 'react';
import { Login, Register, BoardContainer, Project, Header, Info } from '../';
import { Home, Upload, UploadSuccess, Admin } from '../../components';
import { Route, Switch } from 'react-router-dom';
import { Dispatch, compose } from 'redux';
import { returntypeof } from 'react-redux-typescript';
import { connect } from 'react-redux';
import { AuthenticationActions } from '../../actions';
import './App.scss';

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
    if (token !== null) {
      this.props.tokenApplyRequest(token);
    }
  }

  render() {
    return (
      <div className="app my-container">
        <Header/>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/board" render={(props)=>(<BoardContainer {...props} type="postList"/>)}/>
          <Route path="/posts" render={(props)=>(<BoardContainer {...props} type="post"/>)}/>
          <Route path="/project" component={Project}/>
          <Route path="/register" component={Register}/>
          <Route path="/login" component={Login}/>
          <Route path="/info" component={Info}/>
          <Route exact path="/upload" component={Upload}/>
          <Route exact path="/upload/success/:filename" component={UploadSuccess}/>

          <Route path="/admin" component={Admin}/>
        </Switch>
      </div>
    );
  }
}

export default compose(connect(null, mapDispatchToProps))(App);