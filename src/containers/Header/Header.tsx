import * as React from 'react';
import { Link } from 'react-router-dom';
import './Header.scss'
import { RootState } from '../../reducers';
import {compose, Dispatch} from 'redux';
import {AuthenticationActions} from '../../actions';
import { returntypeof } from 'react-redux-typescript';
import { connect } from 'react-redux';
import { NavBar } from '../../components/Header/NavBar'

const mapStateToProps = (state: RootState) => ({
  isLogin: state.authentication.status.isLogin
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  logoutRequest: () => {
    return dispatch(AuthenticationActions.logoutRequest() as any); // TODO: 타입 정의
  }
});

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

type Props = typeof statePropTypes & typeof actionPropTypes & {};
type State = {};

class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() : void {
    this.props.logoutRequest();
  }

  render() {
    return (
        <NavBar isLogin={this.props.isLogin} onLogout={this.handleLogout}/>
    );
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(Header);
