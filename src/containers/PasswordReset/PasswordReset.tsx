import * as React from 'react';
import { Authentication } from '../../components';
import * as queryString from 'query-string';
import { RouteComponentProps } from 'react-router';
import history from '../../history/history';
import myGraphQLAxios from "../../utils/ApiRequest";

export namespace PasswordReset {
  export interface Props extends RouteComponentProps {

  }

  export interface State {
    token?: string | string[]
  }
}

export default class PasswordReset extends React.Component<PasswordReset.Props, PasswordReset.State> {
  constructor(props: PasswordReset.Props) {
    super(props);

    this.sendPasswordResetMail = this.sendPasswordResetMail.bind(this);
    this.passwordReset = this.passwordReset.bind(this);

    const params = queryString.parse(this.props.location.search);
    this.state = {
      token: params.token ? params.token : null
    }
  }

  sendPasswordResetMail(email: string) {
    if(email.length === 0) {
      alert('이메일을 적어주세요.');
      return;
    }
    if(!(/^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email.toLowerCase())) {
      alert('이메일 형식을 맞춰주세요');
      return;
    }
    if(email.length > 255) {
      alert('이메일이 너무 깁니다.');
      return;
    }

    const data = `mutation {
      requestMemberPasswordReset(email: "${email}")
    }`;

    myGraphQLAxios(data, {
      authorization: true
    }).then((msg) => {
      if(msg.data.data.requestMemberPasswordReset) {
        alert("비밀번호 초기화 메일을 보냈습니다.");
      }
    }).catch((msg) => {
      console.log("request member password reset API error -----");
      console.log(msg);
    });
  }

  passwordReset(newPassword: string, newPasswordConfirm: string) {
    if(newPassword.length < 8) {
      alert('비밀번호는 8자리 이상으로 설정해주세요.');
      return;
    }
    if(newPassword.length > 255) {
      alert('비밀번호가 너무 깁니다.');
      return;
    }
    if(newPassword !== newPasswordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const data = `mutation {
      updateMemberPassword(input: {
        token: "${this.state.token}",
        password: "${newPassword}"
      }) {
        uuid
      }
    }`;

    myGraphQLAxios(data, {
      authorization: true
    }).then((msg: any) => {
      const data = msg.data;
      console.log(data);
      if('errors' in data) {
        if(data.errors[0].message === 'TKN001')
          alert("토큰 유효기간이 만료되었습니다. 비밀번호 찾기를 다시 해주세요.");
      } else {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        history.push('/login');
      }
    }).catch((msg) => {
      console.log("request member password reset API error -----");
      console.log(msg);
    });
  }

  render() {
    if(this.state.token === null)
      return (<Authentication mode={4} sendPasswordResetMail={this.sendPasswordResetMail}/>);
    else
      return (<Authentication mode={5} passwordReset={this.passwordReset}/>)
  }
}
