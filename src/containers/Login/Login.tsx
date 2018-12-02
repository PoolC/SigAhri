import * as React from 'react';
import { Authentication } from '../../components';

import { RootState } from '../../reducers';
import { connect } from 'react-redux';
import { AuthenticationActions } from '../../actions';
import { compose, Dispatch} from 'redux';
import { returntypeof } from 'react-redux-typescript';

const mapStateToProps = (state: RootState) => ({
  status: state.authentication.login.status
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loginRequest: (id: string, pw: string) => {
    return dispatch(AuthenticationActions.loginRequest(id, pw) as any); // TODO: 타입 정의
  }
});

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

type Props = typeof statePropTypes & typeof actionPropTypes & {};
type State = {};

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(id: string, pw: string) {
    this.props.loginRequest(id, pw);
  }

  render(): JSX.Element {
    return (
      <Authentication mode={1} handleLogin={this.handleLogin}/>
    );
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(Login);