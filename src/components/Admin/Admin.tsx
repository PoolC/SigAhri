import * as React from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import './Admin.scss';
import {Board} from './Board/Board';
import {BoardForm, BoardFormType} from './Board/BoardForm/BoardForm';
import axios from 'axios';
import history from '../../history/history';

export namespace Admin {
  export interface Props {
  }

  export interface State {
  }
}

export class Admin extends React.Component<Admin.Props, Admin.State> {
  constructor(props: Admin.Props) {
    super(props);

    if(window.location.pathname === "/admin") {
      window.location.pathname = "/admin/members";
    }
  }

  componentDidMount() {
    // 권한이 없다면 404
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
        me {
          isActivated,
          isAdmin
        }
      }`
    }).then((msg) => {
      const data = msg.data;
      if('errors' in data) {
        if(data.errors[0].message === 'ERR401' || data.erros[0].message === 'ERR403') {
          alert("권한이 없습니다.");
          // TODO: 404 page
          history.push('/');
        } else {
          alert("알 수 없는 에러가 발생하였습니다. 담당자에게 문의 부탁드립니다.");
          console.log("me API error");
          console.log(msg);
        }
        return;
      }
      if(!data.data.me.isActivated || !data.data.me.isAdmin) {
        alert("권한이 없습니다.");
        // TODO: 404 page
        history.push('/');
      }
    }).catch((msg) => {
      console.log("me API error");
      console.log(msg);
    });
  }

  render() {
    return (
      <div className="row">
        <div className="admin-nav">
          <div className="admin-list list-group">
            <Link to="/admin/members"
                  className="admin-item list-group-item list-group-item-action">
              회원 관리
            </Link>
            <Link to="/admin/boards"
                  className="admin-item list-group-item list-group-item-action">
              게시판 관리
            </Link>
            <Link to="/admin/projects"
                  className="admin-item list-group-item list-group-item-action">
              프로젝트 관리
            </Link>
          </div>
        </div>
        <div className="col">
          <Switch>
            <Route exact path="/admin/members"
                   render={(props) => (
                     <div>회원관리</div>
                   )}
            />

            <Route exact path="/admin/boards" component={Board} />
            <Route exact path="/admin/boards/new"
                   render={(props) => (<BoardForm {...props} type={BoardFormType.new} />)} />
            <Route exact path="/admin/boards/edit/:boardID"
                   render={(props) => (<BoardForm {...props} type={BoardFormType.edit} />)} />

            <Route exact path="/admin/projects"
                   render={(props) => (
                     <div>프로젝트관리</div>
                   )}
            />
          </Switch>
        </div>
      </div>
    );
  }
}
