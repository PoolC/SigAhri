import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import ReactMarkdown from 'react-markdown';
import './ProjectItem.scss';
import history from '../../../history/history';
import FadeLoader from 'react-spinners/FadeLoader';
import { css } from '@emotion/core';
import myGraphQLAxios from "../../../utils/ApiRequest";

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
    participants: string,
    duration: string,
    description: string
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
    const data = `query {
      project(projectID: ${this.props.match.params.projectID}) {
        body,
        duration,
        name,
        genre,
        thumbnailURL,
        participants,
        body,
        description
      }
    }`;

    myGraphQLAxios(data, {
      authorization: true
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
    if(this.state.project === null) {
      const override = css`
        margin: 200px auto;
      `;
      return (
        <FadeLoader
          css={override}
          sizeUnit={"px"}
          size={15}
          color={'#aaaaaa'}
          loading={true}
          margin={'5px'}
        />
      );
    }

    const body = this.state.project.body.replace(/\n/g, "  \n");
    return (
      <div>
        <img src={this.state.project.thumbnailURL} className="project-item-thumbnail"/>
        <div className="project-item-container">
          <div className="project-item-content">
            <h1 className="project-item-title">{this.state.project.name}</h1>
            <span className="project-item-genre">{`[${this.state.project.genre}]`}</span>
            <h2 className="project-item-participants">{this.state.project.participants}</h2>
            <h2 className="project-item-duration">{this.state.project.duration}</h2>

            <hr/>

            <ReactMarkdown source={body} />
          </div>
        </div>
      </div>
    );
  }
}
