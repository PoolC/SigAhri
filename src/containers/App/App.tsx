import * as React from 'react';
import { Login, Register, BoardContainer, Project, Header, Info } from '../';
import { Home, Upload, UploadSuccess, Admin } from '../../components';
import { Route, Switch } from 'react-router-dom';
import { Dispatch, compose } from 'redux';
import { returntypeof } from 'react-redux-typescript';
import { connect } from 'react-redux';
import { AuthenticationActions } from '../../actions';
import './App.scss';
import axios from 'axios';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  tokenApplyRequest: (token: string) => {
    return dispatch(AuthenticationActions.tokenApplyRequest(token) as any);
  }
});

const actionProps = returntypeof(mapDispatchToProps);

type Props = typeof actionProps;

class App extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.tokenRefreshRequest = this.tokenRefreshRequest.bind(this);
  }

  tokenRefreshRequest() {
    const headers: any = {
      'Content-Type': 'application/graphql'
    };

    if(localStorage.getItem('accessToken') !== null) {
      headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');

      axios({
        url: apiUrl,
        method: 'post',
        headers: headers,
        data: `mutation {
          refreshAccessToken{
            key
          }
        }`
      }).then((msg) => {
        const data = msg.data;
        if('errors' in data) {
          console.log("refresh token API error -----");
          console.log(data);
        } else {
          const token = data.data.refreshAccessToken.key;
          localStorage.setItem('accessToken', token);
          console.log("refreshed");
          console.log(token);
        }
      }).catch((msg) => {
        console.log("refresh API Error -----");
        console.log(msg);
      });
    }

    setTimeout(() => {
      this.tokenRefreshRequest()
    }, 60*60*1000);
  };

  componentDidMount() {
    const token = localStorage.getItem('accessToken');
    this.props.tokenApplyRequest(token);

    this.tokenRefreshRequest();
  }


  render() {
    return (
      <div className="app my-container">
        <Header/>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/page/about" component={Home}/>
          <Route path="/board" render={(props)=>(<BoardContainer {...props} type="postList"/>)}/>
          <Route path="/posts" render={(props)=>(<BoardContainer {...props} type="post"/>)}/>
          <Route path="/article/view" render={(props)=>(<BoardContainer {...props} type="post"/>)}/>
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