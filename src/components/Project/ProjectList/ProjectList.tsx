import * as React from 'react';
import axios from 'axios';
import './ProjectList.scss';
import { Link } from 'react-router-dom';
import FadeLoader from 'react-spinners/FadeLoader';
import { css } from '@emotion/core';

export namespace ProjectList {
  export interface Props {
  }

  export interface State {
    projects: Array<ProjectInfo>,
    apiLoaded: boolean
  }

  interface ProjectInfo {
    id: number,
    name: string,
    genre: string,
    thumbnailURL: string,
    body: string,
    duration: string,
    participants: string,
    description: string
  }
}

export class ProjectList extends React.Component<ProjectList.Props, ProjectList.State> {
  constructor(props: ProjectList.Props) {
    super(props);

    this.state = {
      projects: [],
      apiLoaded: false
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
        projects {
          id,
          body,
          duration,
          name,
          genre,
          thumbnailURL,
          participants,
          description
        } 
      }`
    }).then((msg) => {
      const data = msg.data;

      this.setState({
        ...data.data,
        apiLoaded: true
      });
    }).catch((msg) => {

    });
  }

  render() {
    if(!this.state.apiLoaded) {
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
    return (
      <div className="project-list-container">
        {
          this.state.projects.map((project) =>
            (<Link to={`/project/${project.id}`} key={project.id}>
              <div className="card project-list-item">
                <img className="card-img-top project-list-time-img" src={project.thumbnailURL} width="180" height="120"/>
                <div className="card-body">
                  <span className="project-list-item-title"><strong>{project.name}</strong>
                    <p>[{project.genre}]</p>
                  </span>
                  <p className="card-text">{project.duration}</p>
                  <p className="card-text">{project.description}</p>
                </div>
              </div>
            </Link>))
        }
      </div>
    );
  }
}
