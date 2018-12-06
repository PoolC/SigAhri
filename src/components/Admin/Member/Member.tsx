import * as React from 'react';
import './Member.scss';
import axios from 'axios';

export namespace Member {
  export interface Props {

  }
  export interface State {
    members: Array<MemberInfo>
  }
  export interface MemberInfo {
    uuid: string,
    name: string,
    studentID: string,
    loginID: string,
    email: string,
    phoneNumber: string,
    isActivated: string,
    isAdmin: string
  }
}

export class Member extends React.Component<Member.Props, Member.State> {
  constructor(props: Member.Props) {
    super(props);

    this.state = {
      members: []
    };

    this.handleLoadMembers = this.handleLoadMembers.bind(this);
    this.handleToggleActivated = this.handleToggleActivated.bind(this);
  }

  componentDidMount() {
    this.handleLoadMembers();
  }

  handleLoadMembers() {
    const headers: any = {
      'Content-Type': 'application/graphql'
    };

    if(localStorage.getItem('accessToken') !== null) {
      headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    }

    axios({
      url: apiUrl,
      method: 'post',
      headers: headers,
      data: `query {
        members {
          uuid,
          name,
          studentID,
          loginID,
          email,
          phoneNumber,
          isActivated,
          isAdmin
        }
      }`
    }).then((msg) => {
      const data = msg.data.data;
      this.setState(data);
    }).catch((msg) => {
      console.log("me API error");
      console.log(msg);
    });
  }

  handleToggleActivated(uuid: string) {
    const headers: any = {
      'Content-Type': 'application/graphql'
    };

    if(localStorage.getItem('accessToken') !== null) {
      headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    }

    axios({
      url: apiUrl,
      method: 'post',
      headers: headers,
      data: `mutation {
        toggleMemberIsActivated(memberUUID: "${uuid}") {
          uuid
        }
      }`
    }).then((msg) => {
      this.handleLoadMembers();
    }).catch((msg) => {
      console.log("me API error");
      console.log(msg);
    });

    return false;
  }

  render() {
    return (
      <div className="admin-member-container">
        <div className="admin-member-list-head">
          <h2 className="admin-member-list-name">회원 관리</h2>
        </div>
        <table className="table admin-member-table">
          <thead>
          <tr>
            <th scope="col">이름</th>
            <th scope="col">학번</th>
            <th scope="col">아이디</th>
            <th scope="col">이메일</th>
            <th scope="col">연락처</th>
            <th scope="col">승인</th>
            <th scope="col">관리자</th>
            <th scope="col">동작</th>
          </tr>
          </thead>
          <tbody>
          {this.state.members.map((member: Member.MemberInfo) => (
            <tr key={member.uuid}>
              <td>{member.name}</td>
              <td>{member.studentID}</td>
              <td>{member.loginID}</td>
              <td>{member.email}</td>
              <td>{member.phoneNumber}</td>
              <td>{member.isActivated ? 'O' : 'X'}</td>
              <td>{member.isAdmin ? 'O' : 'X'}</td>
              <td>
                {member.isActivated ?
                  (<a href="#" onClick={(event) => {
                    event.preventDefault();
                    this.handleToggleActivated(member.uuid);
                  }}>탈퇴</a>) :
                  (<a href="#" onClick={(event) => {
                    event.preventDefault();
                    this.handleToggleActivated(member.uuid);
                  }}>승인</a>)}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }
}