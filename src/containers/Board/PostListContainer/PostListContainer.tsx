import * as React from 'react';
import axios from "axios";
import { PostList } from '../../../components';
import history from '../../../history/history';

export namespace PostListContainer {
  export interface Props {
    type: string,
    typeId: number,
    name: string
  }

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

export class PostListContainer extends React.Component<PostListContainer.Props, PostListContainer.State> {
  constructor(props: PostListContainer.Props) {
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

  render() {
    return (
      <PostList posts={this.state.posts} name={this.props.name} typeId={this.props.typeId}/>
    );
  }
}
