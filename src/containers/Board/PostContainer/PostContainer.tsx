import * as React from 'react';
import axios from "axios";
import { Post } from '../../../components';
import { RouteComponentProps } from 'react-router';
import history from '../../../history/history';
import { RootState } from '../../../reducers';
import { returntypeof } from 'react-redux-typescript';
import { compose } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state: RootState) => ({
  isLogin: state.authentication.status.isLogin,
  isAdmin: state.authentication.status.isAdmin
});

const statePropTypes = returntypeof(mapStateToProps);

export namespace PostContainer {
  export interface SubProps extends RouteComponentProps<MatchParams>{
    boardID: number,
    boardName: string
  }

  export type Props = typeof statePropTypes & SubProps

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

class PostContainerClass extends React.Component<PostContainer.Props, PostContainer.State> {

  constructor(props: PostContainer.Props) {
    super(props);

    this.state = {
      info: {
        id: -1,
        title: "",
        author: { name: "" },
        body: "",
        comments: [],
        createdAt: "",
        updatedAt: ""
      }
    };

    this.handleGetPost = this.handleGetPost.bind(this);
  }

  ShouldComponentUpdate(nextProps:any, nextState:any) {
    return !(this.state.info.comments !== nextState.info.comments);
  }

  componentDidMount() {
    this.handleGetPost();
  }

  handleGetPost() {
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
      if(data === null) {
        // TODO: 읽기 권한이 없을때 404 페이지로 이동
        // TODO: 해당 글이 없을 때 또한 404 페이지로 이동
        history.push('/');
        return;
      }
      this.setState({
        info: data
      })
    }).catch((msg) => {
    });
  }

  handleCreatePost = ({title, body}:{title:string, body:string }) => {
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
      data: `mutation {
        createPost(boardID: ${this.props.boardID}, PostInput: {
          title: ${title},
          body: ${body}
        }) {
          id,
          title,
          author { name },
          body,
          comments {
            id,
            author { name },
            body,
            createdAt
          },
          createdAt,
          updatedAt
        }
      }`
    }).then((msg) => {
      const { info } = this.state;
      const newComment = msg.data.data.createComment;
      this.setState({
        info: {
          ...info,
          comments: [...info.comments, newComment]
        }
      });
    })
  };

  handleUpdatePost = ({title, body}:{title:string, body:string }) => {
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
      data: `mutation {
        updatePost(postID: ${this.state.info.id}, PostInput: {
          title: ${title},
          body: ${body}
        }) {
          id,
          title,
          author { name },
          body,
          comments {
            id,
            author { name },
            body,
            createdAt
          },
          createdAt,
          updatedAt
        }
      }`
    }).then((msg) => {
      const { info } = this.state;
      const newComment = msg.data.data.createComment;
      this.setState({
        info: {
          ...info,
          comments: [...info.comments, newComment]
        }
      });
    })
  };

  handleDeletePost = () => {
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
      data: `mutation {
        deletePost(postID: ${this.state.info.id}) {
          id,
          title,
          author { name },
          body,
          comments {
            id,
            author { name },
            body,
            createdAt
          },
          createdAt,
          updatedAt
        }
      }`
    }).then((msg) => {
      const { info } = this.state;
      //const deletedPost = msg.data.data.deletePost;
      const name = this.props.boardName === "공지사항" ? "notice" : "free";
      window.location.pathname = `/board/${name}`;
    })
  };

  handleCreateComment = (comment: string) => {
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
      data: `mutation {
        createComment(postID:${this.state.info.id}, body:"${comment}") {
          author{
            name
          },
          body,
          createdAt,
          id
        }
      }`
    }).then((msg) => {
      const { info } = this.state;
      const newComment = msg.data.data.createComment;
      this.setState({
        info: {
          ...info,
          comments: [...info.comments, newComment]
        }
      });
    })
  };

  handleDeleteComment = (id:number) => {
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
      data: `mutation {
        deleteComment(commentID: ${id}) {
          id,
          author { name },
          body
          createdAt
        }
      }`
    }).then((msg) => {
      const { info } = this.state;
      const deletedComment = msg.data.data.deleteComment;
      this.setState({
        info: {
          ...info,
          comments: info.comments.filter(comment => comment.id !== deletedComment.id)
        }
      });
    })
  };

  render() {
    if((typeof this.state.info === 'undefined') || this.state.info.id === -1)
      return null;

    return (
      <Post
        info={this.state.info}
        boardName={this.props.boardName}
        onDeletePost={this.handleDeletePost}
        onCreateComment={this.handleCreateComment}
        onDeleteComment={this.handleDeleteComment}
      />
    )
  }
}

export const PostContainer = compose(connect(mapStateToProps))(PostContainerClass);