import * as React from 'react';
import { Authentication } from '../../components';
import { RouteComponentProps } from 'react-router';
import { RootState } from '../../reducers';
import { connect } from 'react-redux';
import { AuthenticationActions } from '../../actions';
import { compose, Dispatch} from 'redux';
import { returntypeof } from 'react-redux-typescript';

const mapStateToProps = (state: RootState) => ({
  status: state.authentication.login.status
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loginRequest: (id: string, pw: string, redirLink: string) => {
    return dispatch(AuthenticationActions.loginRequest(id, pw, redirLink) as any); // TODO: 타입 정의
  }
});

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);


export interface SubProps extends RouteComponentProps{ }

type Props = typeof statePropTypes & typeof actionPropTypes & SubProps;
type State = {};

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(id: string, pw: string, redirLink: string) {
    this.props.loginRequest(id, pw, redirLink);
  }

  render(): JSX.Element {
    const { location } = this.props;
    return (
      <Authentication mode={1} redirLink={location.state ? location.state.redirLink : undefined} handleLogin={this.handleLogin}/>
    );
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(Login);