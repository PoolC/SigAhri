import * as React from 'react';
import axios from 'axios';
import './ProjectList.scss';
import { Link } from 'react-router-dom';

export namespace ProjectList {
  export interface Props {
  }

  export interface State {
    projects: Array<ProjectInfo>
  }

  interface ProjectInfo {
    id: number,
    name: string,
    genre: string,
    thumbnailURL: string,
    body: string,
    duration: string,
    participants: string
  }
}

export class ProjectList extends React.Component<ProjectList.Props, ProjectList.State> {
  constructor(props: ProjectList.Props) {
    super(props);

    this.state = {
      projects: []
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
          participants
        } 
      }`
    }).then((msg) => {
      const data = msg.data;

      this.setState(data.data);
    }).catch((msg) => {

    });
  }

  render() {
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
                  <p className="card-text">요약: {project.body.substring(0, 20)}{project.body.length ? '...' : ''}</p>
                </div>
              </div>
            </Link>))
        }
      </div>
    );
  }
}
