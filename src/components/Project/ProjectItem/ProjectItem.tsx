import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import axios from 'axios';
import ReactMarkdown = require("react-markdown");
import './ProjectItem.scss';
import history from '../../../history/history';

export namespace ProjectItem {
  export interface Props extends RouteComponentProps<MatchParams> {
  }

  interface MatchParams {
    projectID: string
  }

  export interface State {
    project: Project,
  }

  interface Project {
    name: string,
    genre: string,
    thumbnailURL: string,
    body: string,
  }
}

export class ProjectItem extends React.Component<ProjectItem.Props, ProjectItem.State> {
  constructor(props: ProjectItem.Props) {
    super(props);

    this.state = {
      project: null
    };

  }

  componentDidMount() {
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

      if('errors' in data) {
        if(data.errors[0].message === 'ERR403' || data.errors[0].message === 'ERR400') {
          history.push('/404');
          return;
        }
      }
      if(data.data === null) {
        history.push('/404');
        return;
      }

      this.setState(data.data);
    }).catch((msg) => {

    });
  }

  render() {
    if(this.state.project === null)
      return null;

    const body = this.state.project.body.replace(/\n/g, "  \n");
    return (
      <div>
        <img src={this.state.project.thumbnailURL} className="project-item-thumbnail"/>
        <div className="project-item-container">
          <div className="project-item-content">
            <h1>{this.state.project.name}</h1>
            {this.state.project.genre}

            <hr/>

            <ReactMarkdown source={body} />
          </div>
        </div>
      </div>
    );
  }
}
