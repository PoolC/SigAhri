import * as React from 'react';
import './Authentication.scss';
import { Link } from 'react-router-dom';
import history from '../../history/history';
import axios from 'axios';

export namespace Authentication {
  export interface Props {
    mode: boolean, // true: login, false: register
    handleLogin?: (id: string, pw: string) => void;
  }

  export interface State {
    id: string,
    pw: string,
    pwConfirm: string,
    name?: string
    email?: string,
    phone?: string,
    department?: string,
    studentNumber?: string
  }
}

export class Authentication extends React.Component<Authentication.Props, Partial<Authentication.State>> {
  constructor(props: any) {
    super(props);

    // 이미 로그인이 되어있다면 메인페이지로 redirect
    if(localStorage.getItem('accessToken') !== null) {
      history.push('/');
      return;
    }

    if(this.props.mode) {
      this.state = {
        id: "",
        pw: ""
      };
      this.handleLogin = this.handleLogin.bind(this);
    } else {
      this.state = {
        id: "",
        pw: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        studentNumber: ""
      };
      this.handleRegister = this.handleRegister.bind(this);
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleLogin(): void {
    this.props.handleLogin(this.state.id, this.state.pw);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    let nextState = this.state as any;
    nextState[event.currentTarget.name] = event.currentTarget.value;
    this.setState(nextState);
  }

  handleRegister(): void {
    const id = this.state.id;
    const pw = this.state.pw;
    const pwConfirm = this.state.pwConfirm;
    const name = this.state.name;
    const email = this.state.email;
    const phone = this.state.phone;
    const department = this.state.department;
    const studentNumber = this.state.studentNumber;

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
          }) {
            uuid
          }
        }`
    }).then((msg) => {
      const data = msg.data;
      if('errors' in data) {
        console.log("create member API error -----");
        console.log(data);
      } else {
        history.push('/register/success');
      }
    }).catch((msg) => {
      console.log("create member API error -----");
      console.log(msg);
    });
  }

  public render(): JSX.Element {
    function getInputBox(label: string, inputName: string, inputType: string, classPointer: Authentication, placeHolder: string = ""): JSX.Element {
      return (
        <div>
          <label className="authentication-input-title">{label}</label>
          <input
          name={inputName}
          type={inputType}
          className="authentication-input"
          placeholder={placeHolder}
          onChange={classPointer.handleChange}/>
        </div>
      );
    }

    const loginView: JSX.Element = (
      <div className="authentication-container">
        <h1 className="authentication-title">로그인</h1>
        {getInputBox("아이디", "id", "text", this)}
        {getInputBox("비밀번호", "pw", "password", this)}
        <button onClick={() => this.handleLogin()} className="authentication-button btn btn-primary btn-lg">로그인</button>
        <div>
          <br />
          계정이 없으신 분은 우선 <Link to="/register">가입신청</Link>을 해주세요.
        </div>
      </div>
    );
    const registerView: JSX.Element = (
      <div className="authentication-container">
        <h1 className="authentication-title">가입 신청</h1>
        {getInputBox("아이디", "id", "text", this, "영/숫자 4~12자리")}
        {getInputBox("비밀번호", "pw", "password", this, "8자리 이상")}
        {getInputBox("비밀번호 (확인)", "pwConfirm", "password", this, "8자리 이상")}
        {getInputBox("이름", "name", "text", this, "홍길동")}
        {getInputBox("이메일", "email", "input", this, "예) temp@gmail.com")}
        {getInputBox("전화번호", "phone", "input", this, "예) 010-1234-1234")}
        {getInputBox("소속학과", "department", "input", this, "예) 컴퓨터과학과")}
        {getInputBox("학번", "studentNumber", "input", this, "예) 2018000000")}
        <button onClick={() => this.handleRegister()} className="authentication-button btn btn-primary btn-lg">회원가입</button>
      </div>
    );

    return (
      <div>
        {this.props.mode ? loginView : registerView}
      </div>
    );
  }
}

