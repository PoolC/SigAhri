import * as React from 'react';
import './Authentication.scss';
import { Link } from 'react-router-dom';
import history from '../../history/history';

export namespace Authentication {
  export interface Props {
    mode: number, // 1: login, 2: register, 3: info-modify, 4: password-reset(mail), 5: password-reset
    redirLink?: string,
    handleLogin?: (id: string, pw: string, redirLink: string) => void,
    handleRegister?: (id: string, pw: string, pwConfirm: string, name: string, email: string, phone: string,
                     department: string, studentNumber: string) => void,
    handleInfoModify?: (pw: string, email: string, phone: string) => void,
    sendPasswordResetMail?: (email: string) => void,
    passwordReset?: (password: string, passwordConfirm: string) => void,
    loginInfo?: {
      id: string,
      name: string,
      email: string,
      phone: string,
      department: string,
      studentNumber: string
    }
  }

  export interface State {
    id: string,
    pw: string,
    redirLink: string,
    pwConfirm?: string,
    name?: string,
    email?: string,
    phone?: string,
    department?: string,
    studentNumber?: string,
    prevProps?: Props
  }
}

export class Authentication extends React.Component<Authentication.Props, Partial<Authentication.State>> {
  constructor(props: Authentication.Props) {
    super(props);

    // 이미 로그인이 되어있다면 메인페이지로 redirect
    if(props.mode !== 3 && localStorage.getItem('accessToken') !== null) {
      history.push('/');
      return;
    }

    if(this.props.mode === 1) {
      this.state = {
        id: "",
        pw: "",
        redirLink: this.props.redirLink
      };
      this.handleLogin = this.handleLogin.bind(this);
      this.loginKeyPress = this.loginKeyPress.bind(this);
    } else if(this.props.mode === 2) {
      this.state = {
        id: "",
        pw: "",
        pwConfirm: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        studentNumber: "",
      };
      this.handleRegister = this.handleRegister.bind(this);
    } else if(this.props.mode === 3) {
      this.state = {
        id: props.loginInfo.id,
        pw: "",
        pwConfirm: "",
        name: props.loginInfo.name,
        email: props.loginInfo.email,
        phone: props.loginInfo.phone,
        department: props.loginInfo.department,
        studentNumber: props.loginInfo.studentNumber,
        prevProps: props
      }
    } else if(this.props.mode === 4) {
      this.state = {
        email: ""
      }
    } else {
      this.state = {
        pw: "",
        pwConfirm: ""
      }
    }
    this.handleChange = this.handleChange.bind(this);
  }

  static getDerivedStateFromProps(props: Authentication.Props, state: Authentication.State) {
    if(props.mode !== 3)
      return {};

    const prevProps = state.prevProps;
    const email = prevProps.loginInfo.email !== props.loginInfo.email ? props.loginInfo.email : state.email;
    const phone = prevProps.loginInfo.phone !== props.loginInfo.phone ? props.loginInfo.phone : state.phone;
    return {
      prevProps: props,
      email: email,
      phone: phone
    }
  }


  handleLogin(): void {
    this.props.handleLogin(this.state.id, this.state.pw, this.state.redirLink);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    let nextState = this.state as any;
    nextState[event.currentTarget.name] = event.currentTarget.value;
    this.setState(nextState);
  }

  handleRegister() {
    const id = this.state.id;
    const pw = this.state.pw;
    const pwConfirm = this.state.pwConfirm;
    const name = this.state.name;
    const email = this.state.email;
    const phone = this.state.phone;
    const department = this.state.department;
    const studentNumber = this.state.studentNumber;

    this.props.handleRegister(id, pw, pwConfirm, name, email, phone, department, studentNumber);
  }

  handleInfoModify() {
    const pw = this.state.pw;
    const email = this.state.email;
    const phone = this.state.phone;

    this.props.handleInfoModify(pw, email, phone);
  }

  sendPasswordResetMail() {
    const email = this.state.email;

    this.props.sendPasswordResetMail(email);
  }

  passwordReset() {
    const pw = this.state.pw;
    const pwConfirm = this.state.pwConfirm;

    this.props.passwordReset(pw, pwConfirm);
  }

  loginKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if(e.keyCode === 13) {
      this.handleLogin();
    }
  }

  public render(): JSX.Element {
    function getInputBox(label: string, inputName: string, inputType: string, classPointer: Authentication,
                         value: string, placeHolder: string = "", disabled: boolean = false): JSX.Element {
      return (
        <div className="form-group">
          <label>{label}</label>
          <input
            name={inputName}
            type={inputType}
            className="form-control"
            placeholder={placeHolder}
            value={value}
            onChange={classPointer.handleChange}
            disabled={disabled}
            onKeyDown={classPointer.props.mode === 1 ? classPointer.loginKeyPress : null}
          />
        </div>
      );
    }

    if (this.props.mode === 1) {
      return (
        <div className="authentication-container">
          <h1 className="authentication-title">로그인</h1>
          {getInputBox("아이디", "id", "text", this, this.state.id)}
          {getInputBox("비밀번호", "pw", "password", this, this.state.pw)}
          <button onClick={() => this.handleLogin()} className="btn btn-primary btn-block btn-lg">로그인
          </button>
          <div className="authentication-link">
            <br/>
            계정이 없으신 분은 우선 <Link to="/register">가입신청</Link>을 해주세요. <br />
            비밀번호를 잊으셨나요? <Link to="accounts/password-reset">비밀번호 찾기</Link>
          </div>
        </div>
      );
    } else if (this.props.mode === 2) {
      return (
        <div className="authentication-container">
          <h1 className="authentication-title">가입 신청</h1>
          {getInputBox("아이디", "id", "text", this, this.state.id, "영/숫자 4~12자리")}
          {getInputBox("비밀번호", "pw", "password", this, this.state.pw, "8자리 이상")}
          {getInputBox("비밀번호 (확인)", "pwConfirm", "password", this, this.state.pwConfirm, "8자리 이상")}
          {getInputBox("이름", "name", "text", this, this.state.name, "홍길동")}
          {getInputBox("이메일", "email", "input", this, this.state.email, "예) temp@gmail.com")}
          {getInputBox("전화번호", "phone", "input", this, this.state.phone, "예) 010-1234-1234")}
          {getInputBox("소속학과", "department", "input", this, this.state.department, "예) 컴퓨터과학과")}
          {getInputBox("학번", "studentNumber", "input", this, this.state.studentNumber, "예) 2018000000")}
          <button onClick={() => this.handleRegister()} className="btn btn-primary btn-block btn-lg">회원가입
          </button>
        </div>
      );
    } else if (this.props.mode === 3) {
      return (
        <div className="authentication-container">
          <h1 className="authentication-title">내 정보</h1>
          {getInputBox("아이디", "id", "text", this, this.props.loginInfo.id, "영/숫자 4~12자리", true)}
          {getInputBox("새 비밀번호", "pw", "password", this, this.state.pw, "8자리 이상")}
          {getInputBox("이름", "name", "text", this, this.props.loginInfo.name, "홍길동", true)}
          {getInputBox("이메일", "email", "input", this, this.state.email, "예) temp@gmail.com")}
          {getInputBox("전화번호", "phone", "input", this, this.state.phone, "예) 010-1234-1234")}
          {getInputBox("소속학과", "department", "input", this, this.props.loginInfo.department, "예) 컴퓨터과학과", true)}
          {getInputBox("학번", "studentNumber", "input", this, this.props.loginInfo.studentNumber, "예) 2018000000", true)}
          <button onClick={()=>this.handleInfoModify()} className="btn btn-primary btn-block btn-lg">정보 수정</button>
        </div>
      );
    } else if(this.props.mode === 4) {
      return (
        <div className="authentication-container">
          <h1 className="authentication-title">비밀번호 찾기</h1>
          <div>
            가입할 때 입력한 이메일을 입력해주세요.
          </div>
          {getInputBox("", "email", "input", this, this.state.email, "예) temp@gmail.com")}
          <button onClick={()=>this.sendPasswordResetMail()} className="btn btn-primary btn-block btn-lg">비밀번호 초기화</button>
        </div>
      );
    } else {
      return (
        <div className="authentication-container">
          <h1 className="authentication-title">새 비밀번호 설정</h1>
          {getInputBox("비밀번호", "pw", "password", this, this.state.pw, "8자리 이상")}
          {getInputBox("비밀번호 (확인)", "pwConfirm", "password", this, this.state.pwConfirm, "8자리 이상")}
          <button onClick={()=>this.passwordReset()} className="btn btn-primary btn-block btn-lg">비밀번호 초기화</button>
        </div>
      )
    }
  }
}

