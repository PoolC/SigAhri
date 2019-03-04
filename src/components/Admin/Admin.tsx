import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import './Admin.scss';
import { Member } from './Member/Member';
import { Board } from './Board/Board';
import { BoardForm, BoardFormType } from './Board/BoardForm/BoardForm';
import { Project } from './Project/Project';
import { ProjectForm, ProjectFormType } from './Project/ProjectForm/ProjectForm';
import history from '../../history/history';
import myGraphQLAxios from "../../utils/ApiRequest";

export namespace Admin {
  export interface Props {
  }

  export interface State {
    authentication: boolean
  }
}

export default class Admin extends React.Component<Admin.Props, Admin.State> {
  constructor(props: Admin.Props) {
    super(props);

    this.state = {
      authentication: false
    };

    if(window.location.pathname === "/admin") {
      window.location.pathname = "/admin/members";
    }
  }

  componentDidMount() {
    const data = `query {
      me {
        isActivated,
        isAdmin
      }
    }`;

    myGraphQLAxios(data, {
      authorization: true
    }).then((msg) => {
      const data = msg.data;
      if('errors' in data) {
        if(data.errors[0].message === 'ERR401' || data.erros[0].message === 'ERR403') {
          history.push('/404');
        } else {
          alert("알 수 없는 에러가 발생하였습니다. 담당자에게 문의 부탁드립니다.");
          console.log("me API error");
          console.log(msg);
        }
        return;
      }
      else if(!data.data.me.isActivated || !data.data.me.isAdmin) {
        history.push('/404');
      } else {
        this.setState({
          authentication: true
        });
      }
    }).catch((msg) => {
      console.log("me API error");
      console.log(msg);
    });
  }

  render() {
    if(!this.state.authentication)
      return null;

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
            <Route exact path="/admin/members" component={Member} />

            <Route exact path="/admin/boards" component={Board} />
            <Route exact path="/admin/boards/new"
                   render={(props) => (<BoardForm {...props} type={BoardFormType.new} />)} />
            <Route exact path="/admin/boards/edit/:boardID"
                   render={(props) => (<BoardForm {...props} type={BoardFormType.edit} />)} />

            <Route exact path="/admin/projects" component={Project}/>
            <Route exact path="/admin/projects/new"
                   render={(props) => (<ProjectForm {...props} type={ProjectFormType.new} />)} />
            <Route exact path="/admin/projects/edit/:projectID"
                   render={(props) => (<ProjectForm {...props} type={ProjectFormType.edit} />)} />
          </Switch>
        </div>
      </div>
    );
  }
}
