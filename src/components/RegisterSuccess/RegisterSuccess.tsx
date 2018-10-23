import * as React from 'react';
import './RegisterSuccess.scss';

export namespace RegisterSuccess {
  export interface Props {

  }
}

const RegisterSuccess: React.SFC<RegisterSuccess.Props> = (props) => {
    return (
      <div className="register-success-container">
        <div className="card bg-light mb-3">
          <div className="card-body">
            회원가입 요청이 전송되었습니다.
            <br />
            관리자의 승인을 기다려주세요.
          </div>
        </div>
      </div>
    );
};

export default RegisterSuccess;
