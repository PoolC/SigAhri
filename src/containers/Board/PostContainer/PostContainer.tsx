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
        author: { name: ""},
        body: "",
        comments: [],
        createdAt: "",
        updatedAt: ""
      }
    };

    this.handleGetPost = this.handleGetPost.bind(this);
  }

  componentDidMount() {
    this.handleGetPost();
  }

  componentDidUpdate(prevProps: PostContainer.Props) {
    // 로그아웃을 한 경우에 다시 업데이트를 해준다.
    // redux를 통해 props가 업데이트 되는경우 새로 Mount하지 않고 update만 하게 되는데, 이때는 componentDidMount가 불리지 않으므로
    // 직접 props가 변경되었는지 확인하여 새로 게시판 목록을 불러온다.
    if(this.props.isLogin !== prevProps.isLogin || this.props.isAdmin !== prevProps.isAdmin) {
      this.handleGetPost();
    }
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

  render() {
    if((typeof this.state.info === 'undefined') || this.state.info.id === -1)
      return null;

    console.log('render');
    return (
      <Post info={this.state.info}/>
    )
  }
}

export const PostContainer = compose(connect(mapStateToProps))(PostContainerClass);
