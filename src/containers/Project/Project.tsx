import * as React from 'react';
import { Route, Switch } from 'react-router';
import { ProjectList, ProjectItem } from '../../components';
import {NotFound} from "../../components/NotFound/NotFound";

export namespace Project {
  export interface Props {

  }
}

export class Project extends React.Component<Project.Props> {
  render() {
    return (
      <Switch>
        <Route exact path="/project" component={ProjectList} />
        <Route exact path="/project/:projectID" component={ProjectItem} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}
