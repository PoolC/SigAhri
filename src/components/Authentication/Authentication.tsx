import * as React from 'react';

export namespace Authentication {
  export interface Props {
    mode: boolean, // true: login, false: register
    handleLogin?: Function
  }
}

export class Authentication extends React.Component<Authentication.Props> {
  public render(): JSX.Element {
    const loginView: JSX.Element = (
      <div>
        <h1>로그인</h1>
        <button onClick={() => this.props.handleLogin("id", "pw")}>이버튼을 누르면 5초뒤에 로그인됨</button>
      </div>
    );
    const registerView: JSX.Element = (
      <div>
        여기는 회원가입페이지
      </div>
    );

    return (
      <div>
        {this.props.mode ? loginView : registerView}
      </div>
    );
  }
}

