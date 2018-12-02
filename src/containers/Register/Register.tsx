import * as React from 'react';
import { Authentication } from '../../components';
import { Route, Router, Switch } from 'react-router-dom';
import history from '../../history/history'
import { RegisterSuccess } from '../../components';
import axios from 'axios';

export namespace Register {
  export interface Props {

  }
}

export class Register extends React.Component<Register.Props> {
  handleRegister(id: string, pw: string, pwConfirm: string, name: string, email: string, phone: string,
                 department: string, studentNumber: string) {
    if(!(/^[A-Za-z0-9+]{4,12}$/).test(id)) {
      alert('아이디는 영문/숫자 4~12자리로 설정해주세요.');
      return;
    }
    if(pw.length < 8) {
      alert('비밀번호는 8자리 이상으로 설정해주세요.');
      return;
    }
    if(pw.length > 255) {
      alert('비밀번호가 너무 깁니다.');
      return;
    }
    if(pw !== pwConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if(name.length === 0) {
      alert('이름을 적어주세요.');
      return;
    }
    if(name.length > 255) {
      alert('이름이 너무 깁니다.');
      return;
    }
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
    if(!(/^\d{3}-\d{3,4}-\d{4}$/).test(phone)) {
      alert('휴대폰 번호를 다시 한번 확인해주세요.');
      return;
    }
    if(department.length === 0) {
      alert('학과를 적어주세요.');
      return;
    }
    if(studentNumber.length === 0) {
      alert('학번을 적어주세요');
      return;
    }

    axios({
      url: apiUrl,
      method: 'post',
      headers: {
        'Content-Type': 'application/graphql'
      },
      data: `mutation {
          createMember(MemberInput:{
            loginID: "${id}"
            password: "${pw}"
            email: "${email}"
            name: "${name}"
            department: "${department}"
            studentID: "${studentNumber}"
            phoneNumber: "${phone}"
          }) {
            uuid
          }
        }`
    }).then((msg) => {
      const data = msg.data;
      if('errors' in data) {
        if(data.errors[0].message === "MEM000") {
          alert("아이디가 중복됩니다.");
        } else if(data.errors[0].message === "MEM001") {
          alert("이메일이 중복됩니다.");
        } else {
          console.log("create member API error -----");
          console.log(data);
        }
      } else {
        history.push('/register/success');
      }
    }).catch((msg) => {
      console.log("create member API error -----");
      console.log(msg);
    });
  }

  public render(): JSX.Element {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/register" render={()=>(<Authentication mode={2} handleRegister={this.handleRegister}/>)}/>
          <Route path="/register/success" component={RegisterSuccess} />
        </Switch>
      </Router>
    );
  }
}
