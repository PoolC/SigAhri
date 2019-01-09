import * as React from 'react';
import { Login, Register, BoardContainer, Project, Header, Info } from '../';
import { Home, Upload, UploadSuccess, Admin, Footer } from '../../components';
import { Route, Switch } from 'react-router-dom';
import { Dispatch, compose } from 'redux';
import { returntypeof } from 'react-redux-typescript';
import { connect } from 'react-redux';
import { AuthenticationActions } from '../../actions';
import './App.scss';
import axios from 'axios';
import { NotFound } from '../../components/NotFound/NotFound';
import { RootState } from '../../reducers';

const mapStateToProps = (state: RootState) => ({
  init: state.authentication.status.init
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  tokenApplyRequest: (token: string) => {
    return dispatch(AuthenticationActions.tokenApplyRequest(token) as any);
  },
  authenticationInitializeOKRequest: () => {
    return dispatch(AuthenticationActions.authenticationInitializeOKRequest() as any);
  }
});

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

type Props = typeof statePropTypes & typeof actionPropTypes;

class App extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.tokenRefreshRequest = this.tokenRefreshRequest.bind(this);
  }

  tokenRefreshRequest(sendTokenApplyRequest: boolean) {
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
          this.props.authenticationInitializeOKRequest();
        } else {
          const token = data.data.refreshAccessToken.key;
          localStorage.setItem('accessToken', token);

          if(sendTokenApplyRequest) {
            this.props.tokenApplyRequest(token);
          }
          this.props.authenticationInitializeOKRequest();
        }
      }).catch((msg) => {
        console.log("refresh API Error -----");
        console.log(msg);
      });
    } else if(sendTokenApplyRequest) {
      this.props.authenticationInitializeOKRequest();
    }

    setTimeout(() => {
      this.tokenRefreshRequest(false)
    }, 60*60*1000);
  };

  componentDidMount() {
    this.tokenRefreshRequest(true);
  }


  render() {
    const content = this.props.init ? (
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/page/about" component={Home}/>
        <Route path="/board" render={(props)=>(<BoardContainer {...props} type="postList"/>)}/>
        <Route path="/posts" render={(props)=>(<BoardContainer {...props} type="post"/>)}/>
        <Route exact path="/article/view" render={(props)=>(<BoardContainer {...props} type="post"/>)}/>
        <Route path="/project" component={Project}/>
        <Route path="/register" component={Register}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/info" component={Info}/>
        <Route exact path="/upload" component={Upload}/>
        <Route exact path="/upload/success/:filename" component={UploadSuccess}/>

        <Route path="/admin" component={Admin}/>

        <Route exact path="/404" component={NotFound}/>
        <Route component={NotFound}/>
      </Switch>
      ) :
      null;

    return (
      <div className="app-container">
        <Header/>
        <div className="app-content-container">
          {content}
        </div>
        <Footer />
      </div>
    );
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(App);