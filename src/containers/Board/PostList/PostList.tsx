import * as React from 'react';
import axios from "axios";
import { PostListItem } from '../../../components';
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

export namespace PostList {
  export interface SubProps {
    type: string,
    typeId: number
  }

  export type Props = typeof statePropTypes & SubProps

  export interface State {
    posts: Array<PostInfo>
  }

  export interface PostInfo {
    id: number,
    author: {[key:string]:string},
    createdAt: string,
    title: string
  }
}

class PostListClass extends React.Component<PostList.Props, PostList.State> {
  constructor(props: PostList.Props) {
    super(props);

    this.state = {
      posts: []
    };

    this.handleGetPostList = this.handleGetPostList.bind(this);
  }

  componentDidMount() {
    this.handleGetPostList();
  }

  componentDidUpdate(prevProps: PostList.Props) {
    // 로그아웃을 한 경우에 다시 업데이트를 해준다.
    // redux를 통해 props가 업데이트 되는경우 새로 Mount하지 않고 update만 하게 되는데, 이때는 componentDidMount가 불리지 않으므로
    // 직접 props가 변경되었는지 확인하여 새로 게시판 목록을 불러온다.
    if(this.props.isLogin !== prevProps.isLogin || this.props.isAdmin !== prevProps.isAdmin) {
      this.handleGetPostList();
    }
  }

  handleGetPostList() {
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
        posts(boardID: ${this.props.typeId}) {
          id,
          author { name },
          createdAt,
          title
        }
      }`
    }).then((msg) => {
      // TODO: data가 BoardInfo 의 Array인지 typing
      const data = msg.data.data.posts;
      if(data === null) {
        // TODO: 읽기 권한이 없을때 404 페이지로 이동
        history.push('/');
        return;
      }

      this.setState({
        posts: data
      })
    }).catch((msg) => {
        // TODO : 에러처리
    });
  }

  render() {
    console.log("render2");
    const { posts } = this.state;
    return (
      <ul>
        { posts.map(post => {
          return (
            <PostListItem
              post={post}
              key={post.id}
            />
          )
        }) }
      </ul>
    );
  }
}

export const PostList = compose(connect(mapStateToProps))(PostListClass);
