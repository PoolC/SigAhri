import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import history from '../../history/history';
import './Home.scss';

export namespace Home {
  export interface Props extends RouteComponentProps {
  }
}

export class Home extends React.Component<Home.Props> {

  constructor(props: Home.Props) {
    super(props);

    if(props.location.pathname.indexOf('/page/about') != -1) {
      history.push('/');
    }

    this.pageMove = this.pageMove.bind(this);
  }

  pageMove(url: string) {
    history.push(url);
  }

  render() {
    return (
      <div className="home">
        <div className="home-images">
          <div className="home-images-layer">
            <img src="https://api.poolc.org/files/home_img.jpg"/>
          </div>
          <div className="home-images-layer text-layer">
            <h1>PoolC</h1>
            <p>
              연세대학교 공과대학 프로그래밍 동아리<br />
              PoolC 홈페이지에 오신 것을 환영합니다!
            </p>
            <button type="button" className="btn btn-light btn-lg" onClick={()=>{this.pageMove('/project')}}>
              프로젝트 갤러리
            </button>
            <a href="mailto:poolc.official@gmail.com">
              <button type="button" className="btn btn-light btn-lg">구인/홍보 문의</button>
            </a>
          </div>
        </div>

        <div className="home-introduce container">
          <h2>동아리 활동</h2>
          <div className="row">
            <div className="home-introduce-item col-12 col-md-4">
              <i className="fab fa-slideshare"></i>
              <h5>프로그래밍 세미나/스터디</h5>
              <p>기존 회원들이 개최하는 다양한 분야의 세미나를 자유롭게 참여할 수 있습니다. 새롭게 공부하고 싶은 분야가 있다면 스터디를 지원해드립니다.</p>
            </div>
            <div className="home-introduce-item col-12 col-md-4">
              <i className="fas fa-gamepad"></i>
              <h5>게임제작 활동</h5>
              <p>매 학기마다 팀을 꾸려 게임을 제작하고 넥슨, 라인 발표회에 참석합니다. 기획, 개발, 디자인 등 어떤 분야라도 좋습니다!</p>
            </div>
            <div className="home-introduce-item col-12 col-md-4">
              <i className="fas fa-bed"></i>
              <h5>수면 활동</h5>
              <p>동방이 아늑해서 잠이 잘 와요.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}