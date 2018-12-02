import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import axios from 'axios';
import ReactMarkdown = require("react-markdown");
import './ProjectItem.scss';

export namespace ProjectItem {
  export interface Props extends RouteComponentProps<MatchParams> {
  }

  interface MatchParams {
    projectID: string
  }

  export interface State {
    project: Project
  }

  interface Project {
    name: string,
    genre: string,
    thumbnailURL: string,
    body: string
  }
}

export class ProjectItem extends React.Component<ProjectItem.Props, ProjectItem.State> {
  constructor(props: ProjectItem.Props) {
    super(props);

    this.state = {
      project: {
        name: "",
        genre: "",
        thumbnailURL: "",
        body: ""
      }
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
      console.log(data);

      this.setState(data.data);
    }).catch((msg) => {

    });
  }

  render() {
    console.log(this.state);
    const body = this.state.project.body.replace(/\n/g, "  \n");
    return (
      <div className="project-item-container">
        <img src={this.state.project.thumbnailURL} className="project-item-thumbnail"/>
        <div className="project-item-content">
          <div className="project-item-title">
            <h2>{this.state.project.name}</h2>
            {this.state.project.genre}
          </div>
          <ReactMarkdown source={body} />
        </div>
      </div>
    );
  }
}
