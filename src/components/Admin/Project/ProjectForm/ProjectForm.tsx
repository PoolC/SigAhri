import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import './ProjectForm.scss';
import history from '../../../../history/history';
import myGraphQLAxios from "../../../../utils/ApiRequest";
import dateUtils from "../../../../utils/DateUtils";
import Loadable from 'react-loadable';

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
    body: string,
    duration: string,
    participants: string,
    description: string,
    SimpleMDE: any
  }
}

export class ProjectForm extends React.Component<ProjectForm.Props, ProjectForm.State> {
  constructor(props: ProjectForm.Props) {
    super(props);

    this.state = {
      name: "",
      genre: "",
      thumbnailURL: "",
      body: "",
      duration: "",
      participants: "",
      description: "",
      SimpleMDE: null
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
    const projectInput = `ProjectInput: {
      name: "${this.state.name}",
      genre: "${this.state.genre}",
      thumbnailURL: "${this.state.thumbnailURL}",
      body: """${this.state.body}""",
      duration: "${this.state.duration}",
      participants: "${this.state.participants}",
      description: "${this.state.description}"
    }`;
    const data = this.props.type === ProjectFormType.new ?
      `mutation {
        createProject(${projectInput}) {
          id
        }
      }`:
      `mutation {
        updateProject(projectID: ${this.props.match.params.projectID}, ${projectInput}) {
          id
        }
      }`;

    myGraphQLAxios(data, {
      authorization: true
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

  componentWillMount() {
    const SimpleMDE = Loadable({
      loader: () => import(/* webpackChunkName: "simplemde" */ 'react-simplemde-editor') as Promise<any>,
      loading: () => null as null,
      render(loaded, props) {
        let Component = loaded.default;
        if(Component) {
          return <Component {...props} />;
        }
        return null;
      }
    });
    this.setState({ SimpleMDE });
  }

  componentDidMount() {
    if(this.props.type === ProjectFormType.new) {
      this.setState({
        duration: `${dateUtils.ParseDate(Date.now(), 'YYYY-MM-DD HH:mm:SS')} ~ ${dateUtils.ParseDate(Date.now(), 'YYYY-MM-DD HH:mm:SS')}`
      });

      return;
    }

    const data = `query {
      project(projectID: ${this.props.match.params.projectID}) {
        name,
        genre,
        thumbnailURL,
        body,
        duration,
        participants,
        description
      }
    }`;

    myGraphQLAxios(data, {
      authorization: true
    }).then((msg) => {
      const data = msg.data;
      this.setState(data.data.project);
    }).catch((msg) => {
      console.log("me API error");
      console.log(msg);
    });
  }

  render() {
    const { SimpleMDE } = this.state;

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
          <h5>참여자</h5>
          <input
            className="admin-project-form-input"
            name="participants"
            value={this.state.participants}
            onChange={this.handleInputChange}
            placeholder="예) 송재우, 양세종"
          />
        </div>
        <div className="admin-project-form-block">
          <h5>활동기간</h5>
          <input
            className="admin-project-form-input"
            name="duration"
            value={this.state.duration}
            onChange={this.handleInputChange}
            placeholder="예) 2018-09-01 ~ 2019-01-30"
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
          <h5>요약</h5>
          <input
            className="admin-project-form-input"
            name="description"
            value={this.state.description}
            onChange={this.handleInputChange}
            placeholder="공백 포함 30자 내로 입력해주세요"
            maxLength={30}
          />
        </div>
        <div className="admin-project-form-block">
          <h5>내용</h5>
          <SimpleMDE
            value={this.state.body}
            onChange={this.handleBodyChange}
          />
        </div>
        <div className="admin-project-form-button-container">
          <button className="btn btn-primary" onClick={() => this.handleSubmit()}>저장</button>
        </div>
      </div>
    )
  }
}
