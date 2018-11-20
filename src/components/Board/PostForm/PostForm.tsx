import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import axios from 'axios';

export namespace PostForm {
  export interface Props extends RouteComponentProps<MatchParams> {
  }

  interface MatchParams {
    boardID: string
  }

  export interface State {
    boardName: string
  }
}

export class PostForm extends React.Component<PostForm.Props, PostForm.State> {
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
        boards {
          id,
          name,
          writePermission
        }
      }`
    }).then((msg) => {

      console.log(msg);
    }).catch((msg) => {
      console.log("boards API error");
      console.log(msg);
    });
  }

  render() {
    return (
      <div>{this.props.match.params.boardID}</div>
    );
  }
}
