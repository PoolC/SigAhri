import * as React from 'react';
import { Authentication } from '../../components';
import history from '../../history/history';
import myGraphQLAxios from "../../utils/ApiRequest";

export namespace Info {
  export interface Props {

  }
  export interface State {
    id: string,
    name: string,
    email: string,
    phone: string,
    department: string,
    studentNumber: string
  }
}

export class Info extends React.Component<Info.Props, Info.State> {
  constructor(props: Info.Props) {
    super(props);

    this.state = {
      id: '',
      name: '',
      email: '',
      phone: '',
      department: '',
      studentNumber: ''
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('accessToken');

    if(token === null) {
      history.push('/404');
      return;
    }

    const data = `query {
      me {
        loginID,
        name,
        email,
        department,
        studentID,
        phoneNumber
      }
    }`;

    myGraphQLAxios(data, {
      authorization: true
    }).then((msg) => {
      // TODO: typing
      const data = msg.data;
      if('errors' in data) {
        if(data.errors[0].message === "ERR401") {
          history.push('/');
        } else {
          console.log("me API error -----");
          console.log(data);
        }
      } else {
        const data = msg.data.data.me;
        this.setState({
          id: data.loginID,
          name: data.name,
          email: data.email,
          department: data.department,
          studentNumber: data.studentID,
          phone: data.phoneNumber
        });
      }
    }).catch((msg) => {
      console.log("get member API error -----");
      console.log(msg);
    });
  }

  handleInfoModify(pw: string, email: string, phone: string) {
    if(pw.length !== 0) {
      if (pw.length < 8) {
        alert('비밀번호는 8자리 이상으로 설정해주세요.');
        return;
      }
      if (pw.length > 255) {
        alert('비밀번호가 너무 깁니다.');
        return;
      }
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

    const data = `mutation {
      updateMember(MemberInput: {
        email: "${email}"
        phoneNumber: "${phone}"
        ${pw.length===0 ? '' : ('password: "' + pw + '"')}
      }) {
        uuid
      }
    }`;

    myGraphQLAxios(data, {
      authorization: true
    }).then((msg) => {
      // TODO: typing
      const data = msg.data;
      if('errors' in data) {
        console.log("update member API error -----");
        console.log(data);
      } else {
        alert("수정되었습니다.");
        history.push('/');
      }
    }).catch((msg) => {
      console.log("update member API error -----");
      console.log(msg);
    });
  }

  render(): JSX.Element {
    if(this.state.id === '')
      return null;

    return (
      <Authentication mode={3} handleInfoModify={this.handleInfoModify} loginInfo={this.state}/>
    );
  }
}
