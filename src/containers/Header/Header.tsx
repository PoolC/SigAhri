import * as React from 'react';
import { Link } from 'react-router-dom';
import './Header.scss'
import { RootState } from '../../reducers';
import {compose, Dispatch} from 'redux';
import {AuthenticationActions} from '../../actions';
import { returntypeof } from 'react-redux-typescript';
import { connect } from 'react-redux';

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

  handleLogout() {
    this.props.logoutRequest();
  }

  render(): JSX.Element {
    let authenticationButton = (
      <li className="nav-item">
        <Link to="/login" className="nav-link">
          <button className="btn btn-outline-secondary">
            로그인
          </button>
        </Link>
      </li>
    );

    let infoButton = (
      <li className="nav-item">
        <Link to="/register" className="nav-link nav-underline">
          가입 신청
        </Link>
      </li>
    );

    if(this.props.isLogin) {
      authenticationButton = (
        <li className="nav-item">
          <a className="nav-link">
            <button className="btn btn-outline-secondary" onClick={() => this.handleLogout()}>
              로그아웃
            </button>
          </a>
        </li>
      );

      infoButton = (
        <li className="nav-item">
          <Link to="/info" className="nav-link nav-underline">
            내 정보
          </Link>
        </li>
      );
    }

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light header">
          <Link className="navbar-brand logo" to="/">PoolC</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
                  aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div id="navbarNavDropdown" className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to="/board" className="nav-link nav-underline">
                  게시판
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/project" className="nav-link nav-underline">
                  프로젝트
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              {infoButton}
              {authenticationButton}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(Header);
