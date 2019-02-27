import * as React from 'react';
import './ProjectList.scss';
import { Link } from 'react-router-dom';
import myGraphQLAxios from "../../../utils/ApiRequest";

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
    participants: string,
    description: string
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
    const data = `query {
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
    }`;

    myGraphQLAxios(data, {
      authorization: true
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
                  <p className="card-text">{project.description}</p>
                </div>
              </div>
            </Link>))
        }
      </div>
    );
  }
}
