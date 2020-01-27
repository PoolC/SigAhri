import * as React from "react";
import {Link} from "react-router-dom";
import './NavBar.scss';

namespace NavBar {
  export interface Props {
    isLogin: boolean,
    isAdmin: boolean,
    onLogout: () => void
  }
}

export class NavBar extends React.Component<NavBar.Props, null> {

  static defaultProps = {
    isLogin: false,
    isAdmin: false,
    onLogout: () => console.log("handleLogout not defined")
  };

  handleLogout = () => {
    const { onLogout } = this.props;
    onLogout();
  };

  slideUp = () => {
    const button = document.getElementById('header-slide-button');
    if(button.getAttribute('aria-expanded') === 'true') {
      button.click();
    }
  };

  render(): JSX.Element {
    let authenticationButton = (
      <li className="nav-item">
        <Link to="/login" className="nav-link" onClick={() => { this.slideUp(); }}>
          <button className="btn btn-outline-light btn-sm">
            로그인
          </button>
        </Link>
      </li>
    );

    let infoButton = (
      <li className="nav-item">
        <Link to="/register" className="nav-link nav-underline" onClick={() => { this.slideUp(); }}>
          가입 신청
        </Link>
      </li>
    );

    let seminarButton = null;
    if(this.props.isLogin) {
      seminarButton = (
        <li className="nav-item">
          <Link to="/seminar" className="nav-link nav-underline" onClick={() => { this.slideUp() }}>
            세미나
          </Link>
        </li>
      );

      authenticationButton = (
        <li className="nav-item">
          <a className="nav-link">
            <button className="btn btn-outline-light btn-sm" onClick={() => {
              this.handleLogout();
              this.slideUp();
            }}>
              로그아웃
            </button>
          </a>
        </li>
      );

      infoButton = (
        <li className="nav-item">
          <Link to="/info" className="nav-link nav-underline" onClick={() => { this.slideUp(); }}>
            내 정보
          </Link>
        </li>
      );
    }

    let adminButton = null;
    if(this.props.isAdmin) {
      adminButton = (
        <li className="nav-item">
          <Link to="/admin" className="nav-link nav-underline" onClick={() => {this.slideUp(); }}>
            관리자
          </Link>
        </li>
      );
    }

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark header">
          <Link className="navbar-brand logo" to="/">PoolC</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
                  aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation"
                  id="header-slide-button">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div id="navbarNavDropdown" className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to="/board/notice" className="nav-link nav-underline" onClick={() => { this.slideUp(); }}>
                  게시판
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/project" className="nav-link nav-underline" onClick={() => { this.slideUp() }}>
                  프로젝트
                </Link>
              </li>
              {seminarButton}
            </ul>
            <ul className="navbar-nav">
              {infoButton}
              {adminButton}
              {authenticationButton}
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}