import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import history from '../../history/history';

export namespace Home {
  export interface Props extends RouteComponentProps {
  }
}

export class Home extends React.Component<Home.Props> {

  constructor(props: Home.Props) {
    super(props);

    if(props.location.pathname.indexOf('/page/about') != -1) {
      history.push('/');
    }
  }

  render() {
    return (
      <div>
        여기는 메인페이지
      </div>
    );
  }
}