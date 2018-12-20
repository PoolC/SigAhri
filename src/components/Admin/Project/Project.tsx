import * as React from 'react';
import { Link } from 'react-router-dom';
import './Project.scss';
import axios from 'axios';
import history from '../../../history/history';

export namespace Project {
  export interface Props {

  }

  export interface State {
    projects: Array<ProjectInfo>
  }

  export interface ProjectInfo {
    id: number,
    name: string,
    genre: string,
    thumbnailURL: string,
    body: string
  }
}

export class Project extends React.Component<Project.Props, Project.State> {
  constructor(props: Project.Props) {
    super(props);

    this.state = {
      projects: []
    };

    this.handleProjectDelete = this.handleProjectDelete.bind(this);
  }

  handleProjectDelete(id: number, name: string) {
    if(confirm(`${name}을 삭제하시겠습니까?`)) {
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
          deleteProject(projectID: ${id}) {
            id
          }
        }`
      }).then((msg) => {
        const data = msg.data;
        if('errors' in data) {
          const message = data.erros[0].message;
          if(message === 'ERR401' || message === 'ERR403') {
            alert("권한이 없습니다.");
          } else {
            alert("알 수 없는 에러가 발생하였습니다. 담당자에게 문의 부탁드립니다.");
            console.log("me API error");
            console.log(msg);
          }
          return;
        }

        alert("삭제되었습니다.");
        this.handleLoadProjects();
      }).catch((msg) => {
        console.log("project delete API error");
        console.log(msg);
      });
    }
  }

  componentDidMount() {
    this.handleLoadProjects();
  }

  handleLoadProjects() {
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
        projects {
          id,
          name,
          genre,
          thumbnailURL,
          body
        }
      }`
    }).then((msg) => {
      const data = msg.data.data.projects;
      this.setState({
        projects: data
      });
    }).catch((msg) => {
      console.log("me API error");
      console.log(msg);
    });
  }

  render() {
    return (
      <div className="admin-project-container">
        <div className="admin-project-list-head">
          <h2 className="admin-project-list-name">프로젝트 관리</h2>
        </div>
        <table className="table admin-project-table">
          <thead>
          <tr>
            <th scope="col">이름</th>
            <th scope="col">장르</th>
            <th scope="col">동작</th>
          </tr>
          </thead>
          <tbody>
          {this.state.projects.map((project: Project.ProjectInfo) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.genre}</td>
              <td>
                <Link to={"/admin/projects/edit/"+project.id}>편집</Link> /
                <Link to="#" onClick={()=>this.handleProjectDelete(project.id, project.name)}>삭제</Link>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        <Link to="/admin/projects/new">
          <button className="admin-project-add-button btn btn-primary">추가</button>
        </Link>
      </div>
    );
  }
}
