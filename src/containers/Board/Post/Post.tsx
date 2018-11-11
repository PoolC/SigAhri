import * as React from 'react';
import axios from "axios";

export namespace Post {
  export interface Props {
    postId: number
  }

  export interface State {
    info: Info
  }

  export interface Info {
    id: number,
    title: string,
    author: string,
    body: string,
    comments: Array<Comment>,
    created_at: string,
    updated_at: string
  }

  export interface Comment {
    id: number,
    author: { string: string },
    body: string,
    createdAt: string
  }
}

export class Post extends React.Component<Post.Props, Post.State> {

  state: Post.State = {
    info: {
      id: -1,
      title: "",
      author: "",
      body: "",
      comments: [],
      created_at: "",
      updated_at: ""
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
        post(postID:${this.props.postId}) {
          id,
          title,
          body,
          author {name}
        }
      }`
    }).then((msg) => {
      console.log(msg)
      const data = msg.data.data.boards;
      this.setState({
        info: data
      })
    }).catch((msg) => {
    });
  }

  render() {
    const { info } = this.state;
    return (
      <React.Fragment>
        <h2>info.title</h2>
        <p>{`${info.author} | ${info.created_at}`}</p>
        <p>{info.body}</p>
        <div className="comments">
          {info.comments.map(comment => {
            <p>{`${comment.author}    ${comment.body}  ${comment.createdAt}`}</p>
          })}
        </div>
      </React.Fragment>
    )
  }
}