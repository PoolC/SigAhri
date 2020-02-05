import * as React from 'react';
import { Login, BoardContainer, Project, Header, Seminar } from '../';
import { Home, Footer } from '../../components';
import { Route, Switch } from 'react-router-dom';
import { Dispatch, compose } from 'redux';
import { returntypeof } from 'react-redux-typescript';
import { connect } from 'react-redux';
import { AuthenticationActions } from '../../actions';
import './App.scss';
import myGraphQLAxios from '../../utils/ApiRequest';
import { NotFound } from '../../components/NotFound/NotFound';
import { RootState } from '../../reducers';
import Loadable from 'react-loadable';

const Loading: React.FC<Loadable.LoadingComponentProps> = props => {
  return (
    <React.Fragment></React.Fragment>
  )
};

const Register = Loadable({
  loader: () => import(/* webpackChunkName: "Register" */ '../Register/Register') as Promise<any>,
  loading: () => null as null
});
const Info = Loadable({
  loader: () => import(/* webpackChunkName: "Info" */ '../Info/Info') as Promise<any>,
  loading: () => null as null
});
const PasswordReset = Loadable({
  loader: () => import(/* webpackChunkName: "PasswordReset" */ '../PasswordReset/PasswordReset') as Promise<any>,
  loading: () => null as null
});
const Upload = Loadable({
  loader: () => import(/* webpackChunkName: "Upload" */ '../../components/Upload/Upload') as Promise<any>,
  loading: () => null as null
});
const UploadSuccess = Loadable({
  loader: () => import(/* webpackChunkName: "UploadSucess" */ '../../components/Upload/UploadSuccess/UploadSuccess') as Promise<any>,
  loading: () => null as null
});
const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "Admin" */ '../../components/Admin/Admin') as Promise<any>,
  loading: () => null as null
});

const mapStateToProps = (state: RootState) => ({
  init: state.authentication.status.init
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  tokenApplyRequest: (token: string) => {
    return dispatch(AuthenticationActions.tokenApplyRequest(token) as any);
  },
  authenticationInitializeOKRequest: () => {
    return dispatch(AuthenticationActions.authenticationInitializeOKRequest() as any);
  },
  logoutRequest: () => {
    return dispatch(AuthenticationActions.logoutRequest() as any);
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
    const token = localStorage.getItem('accessToken');
    if(token) {
      const data = `mutation {
        refreshAccessToken{
          key
        }
      }`;
      myGraphQLAxios(data, {
        authorization: true
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
        this.props.logoutRequest();
        this.props.authenticationInitializeOKRequest();
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
    import('../Register/Register')
  }

  render() {
    const content = this.props.init ? (
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/page/about" component={Home}/>
        <Route exact path="/login" component={Login}/>
        <Route path="/seminar" render={(props)=>(<Seminar {...props} />)}/>
        <Route path="/project" component={Project}/>
        <Route path="/board" render={(props)=>(<BoardContainer {...props} type="postList"/>)}/>
        <Route path="/posts" render={(props)=>(<BoardContainer {...props} type="post"/>)}/>
        <Route exact path="/article/view" render={(props)=>(<BoardContainer {...props} type="post"/>)}/>

        <Route path="/register" component={Register}/>
        <Route exact path="/info" component={Info}/>
        <Route path="/accounts/password-reset" component={PasswordReset}/>
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
