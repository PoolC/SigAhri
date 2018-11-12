import * as React from 'react';
import axios from "axios";
import { Post } from '../../../components';
import {RouteComponentProps} from "react-router";

export namespace PostContainer {
  export interface Props extends RouteComponentProps<MatchParams>{
  }

  interface MatchParams {
    postId: string
  }

  export interface State {
    info: Info
  }

  export interface Info {
    id: number,
    title: string,
    author: { name: string },
    body: string,
    comments: Array<Comment>,
    createdAt: string,
    updatedAt: string
  }

  export interface Comment {
    id: number,
    author: { name: string },
    body: string,
    createdAt: string
  }
}

export class PostContainer extends React.Component<PostContainer.Props, PostContainer.State> {

  state: PostContainer.State = {
    info: {
      id: -1,
      title: "",
      author: { name: ""},
      body: "",
      comments: [],
      createdAt: "",
      updatedAt: ""
    }
  };

  componentDidMount() {
    axios({
      url: apiUrl,
      method: 'post',
      headers: {
        'Content-Type': 'application/graphql'
      },
      data: `query {
        post(postID:${this.props.match.params.postId}) {
          id,
          title,
          body,
          createdAt,
          updatedAt,
          comments {
            author {
              name
            },
            body,
            createdAt,
            id
          },
          author {name}
        }
      }`
    }).then((msg) => {
      const data = msg.data.data.post;
      this.setState({
        info: data
      })
    }).catch((msg) => {
    });
  }

  render() {
    if((typeof this.state.info === 'undefined') || this.state.info.id === -1)
      return null;

    return (
      <Post info={this.state.info}/>
    )
  }
}