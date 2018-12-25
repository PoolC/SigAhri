import * as React from 'react';
import './Footer.scss';

export const Footer: React.SFC = (props) => {
  return (
    <div className="footer-container">
      <footer className="justify-content-center row">
        <span className="footer-content col-12 col-md-3">
          <img src={logoUrl} />
        </span>
        <span className="footer-content footer-brief col-12 col-md-4">
          <h4>CONTACT</h4>
          <i className="fas fa-map-marker-alt" /> 연세대학교 제1공학관 537호 <br />
          <i className="far fa-envelope" /> poolc.official@gmail.com <br />
          <i className="fas fa-phone" /> 회장 이정현 010-5515-8646 <br />
        </span>
        <span className="footer-content footer-detail col-12 col-md-5">
          회원가입은 매 학기 초마다 지정된 시기에 받고 있습니다. <br />
          프로그래밍에 관심이 있는 모든 학우분들의 연락을 환영합니다. <br />
          <br />
          구인/홍보 문의는 이메일로 연락주시기 바랍니다. <br />
          ⓒ 2018 All Rights Reserved. PoolC
          <br />
          <br />
          <a href="http://poolc.github.io/Regulation/" target="_blank">동아리 회칙</a>&nbsp;|&nbsp;
          <a href="https://github.com/PoolC" target="_blank">GitHub</a>
        </span>
      </footer>
    </div>
  );
};
