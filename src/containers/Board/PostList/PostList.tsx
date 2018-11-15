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
    typeId: number,
    name: string
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

  // TODO: board-name 클래스 이름을 바꾸고 container에서 마크업은 뺴야함
  render() {
    const { posts } = this.state;
    return (
      <div>
        <h2 className="board-name">{this.props.name}</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">제목</th>
              <th scope="col">작성자</th>
              <th scope="col">작성일</th>
            </tr>
          </thead>
          <tbody>
            { posts.map(post => {
              return (
                <PostListItem post={post} key={post.id}/>
              )
            }) }
          </tbody>
        </table>
      </div>
    );
  }
}

export const PostList = compose(connect(mapStateToProps))(PostListClass);
