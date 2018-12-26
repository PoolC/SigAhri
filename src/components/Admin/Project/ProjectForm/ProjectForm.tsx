import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import axios from 'axios';
import './ProjectForm.scss';
import history from '../../../../history/history';
import SimpleMDE from 'react-simplemde-editor';

export enum ProjectFormType {
  new = 'NEW',
  edit= 'EDIT'
}

namespace ProjectForm {
  export interface Props extends RouteComponentProps<MatchParams> {
    type: ProjectFormType
  }

  interface MatchParams {
    projectID?: string
  }

  export interface State {
    name: string,
    genre: string,
    thumbnailURL: string,
    body: string
  }
}

export class ProjectForm extends React.Component<ProjectForm.Props, ProjectForm.State> {
  constructor(props: ProjectForm.Props) {
    super(props);

    this.state = {
      name: "",
      genre: "",
      thumbnailURL: "",
      body: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextState: any = {};
    nextState[event.target.name] = event.target.value;

    this.setState(nextState);
  }

  handleBodyChange(value: string) {
    this.setState({
      body: value
    });
  }

  handleSubmit() {
    const headers: any = {
      'Content-Type': 'application/graphql'
    };

    if(localStorage.getItem('accessToken') !== null) {
      headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    }

    const query = this.props.type === ProjectFormType.new ?
      `mutation {
        createProject(ProjectInput: {
          name: "${this.state.name}",
          genre: "${this.state.genre}",
          thumbnailURL: "${this.state.thumbnailURL}",
          body: """${this.state.body}"""
        }) {
          id
        }
      }`:
      `mutation {
        updateProject(projectID: ${this.props.match.params.projectID}, ProjectInput: {
          name: "${this.state.name}",
          genre: "${this.state.genre}",
          thumbnailURL: "${this.state.thumbnailURL}",
          body: """${this.state.body}"""
        }) {
          id
        }
      }`;

    axios({
      url: apiUrl,
      method: 'post',
      headers: headers,
      data: query
    }).then((msg) => {
      const data = msg.data;
      if('errors' in data) {
        const message = data.errors[0].message;
        if(message === 'ERR401' || message === 'ERR403') {
          alert("권한이 없습니다.");
        } else {
          alert("알 수 없는 에러가 발생하였습니다. 담당자에게 문의 부탁드립니다.");
          console.log("me API error");
          console.log(msg);
        }
        return;
      }

      alert("저장되었습니다.");
      history.push('/admin/projects');
    }).catch((msg) => {
      console.log("project API error");
      console.log(msg);
    });
  }

  componentDidMount() {
    if(this.props.type === ProjectFormType.new)
      return;

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
        project(projectID: ${this.props.match.params.projectID}) {
          name,
          genre,
          thumbnailURL,
          body
        }
      }`
    }).then((msg) => {
      const data = msg.data;
      this.setState(data.data.project);
    }).catch((msg) => {
      console.log("me API error");
      console.log(msg);
    });
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <div className="admin-project-list-head">
          <h2 className="admin-project-list-name">프로젝트 관리</h2>
        </div>
        <div className="admin-project-form-block">
          <h5>이름</h5>
          <input
            className="admin-project-form-input"
            name="name"
            value={this.state.name}
            onChange={this.handleInputChange}
            placeholder="프로젝트 이름"
          />
        </div>
        <div className="admin-project-form-block">
          <h5>장르</h5>
          <input
            className="admin-project-form-input"
            name="genre"
            value={this.state.genre}
            onChange={this.handleInputChange}
            placeholder="예) 모바일 게임"
          />
        </div>
        <div className="admin-project-form-block">
          <h5>썸네일 URL</h5>
          <input
            className="admin-project-form-input"
            name="thumbnailURL"
            value={this.state.thumbnailURL}
            onChange={this.handleInputChange}>
          </input>
        </div>
        <div className="admin-project-form-block">
          <h5>내용</h5>
          <SimpleMDE
            value={this.state.body}
            onChange={this.handleBodyChange}>
          </SimpleMDE>
        </div>
        <div className="admin-project-form-button-container">
          <button className="btn btn-primary" onClick={() => this.handleSubmit()}>저장</button>
        </div>
      </div>
    )
  }
}
