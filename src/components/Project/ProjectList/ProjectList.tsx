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
    body: string
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
    return (
      <div className="project-list-container">
        {
          this.state.projects.map((project) =>
            (<Link to={`/project/${project.id}`} key={project.id}>
              <div className="project-list-item">
                <img src={project.thumbnailURL} width="250px" height="200px"/>
                <div className="project-list-item-content">
                  <div className="project-list-item-title">{project.name}</div>
                  <div>{project.genre}</div>
                  <div>{project.body.length >= 20 ? project.body.slice(0, 17)+"..." : project.body}</div>
                </div>
              </div>
            </Link>))
        }
      </div>
    );
  }
}
