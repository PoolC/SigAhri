import * as React from 'react';
import axios from "axios";
import { PostList } from '../../../components';
import history from '../../../history/history';
import {number} from "prop-types";

export enum queryType {
  before = "BEFORE",
  after = "AFTER",
  nothing = "NOTHING"
}

export namespace PostListContainer {
  export interface Props {
    type: string,
    typeId: number,
    name: string,
    writePermission: boolean
  }

  export interface State {
    pageInfo: PostList.pageInfo,
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
      pageInfo: {
        hasNext: false,
        hasPrevious: false
      },
      posts: [],
    };

    this.handleGetPostList = this.handleGetPostList.bind(this);
    this.afterPageAction = this.afterPageAction.bind(this);
    this.beforePageAction = this.beforePageAction.bind(this);
    this.firstPageAction = this.firstPageAction.bind(this);
  }

  componentDidMount() {
    this.handleGetPostList(queryType.nothing, null);
  }

  handleGetPostList(inputQueryType: queryType, inputQueryID: number) {
    const headers: any = {
      'Content-Type': 'application/graphql'
    };

    if(localStorage.getItem('accessToken') !== null) {
      headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    }

    const pageItemNum = 5;
    let query = '';
    if(inputQueryType === queryType.nothing) {
      query = `query {
        postPage(boardID: ${this.props.typeId}, count: ${pageItemNum}) {
          pageInfo {
            hasNext,
            hasPrevious
          },
          posts {
            id,
            author { name },
            createdAt,
            title
          }
        }
      }`;
    } else if(inputQueryType === queryType.after) {
      query = `query {
        postPage(boardID: ${this.props.typeId}, after: ${inputQueryID}, count: ${pageItemNum}) {
          pageInfo {
            hasNext,
            hasPrevious
          },
          posts {
            id,
            author { name },
            createdAt,
            title
          }
        }
      }`;
    } else {
      query = `query {
        postPage(boardID: ${this.props.typeId}, before: ${inputQueryID}, count: ${pageItemNum}) {
          pageInfo {
            hasNext,
            hasPrevious
          },
          posts {
            id,
            author { name },
            createdAt,
            title
          }
        }
      }`;
    }

    axios({
      url: apiUrl,
      method: 'post',
      headers: headers,
      data: query
    }).then((msg) => {
      // TODO: typing
      const data = msg.data.data.postPage;
      if(!('posts' in data)) {
        // TODO: 읽기 권한이 없을때 404 페이지로 이동
        history.push('/');
        return;
      }

      this.setState(data);
    }).catch((msg) => {
        // TODO : 에러처리
    });
  }

  afterPageAction() {
    if(this.state.posts.length > 0)
      this.handleGetPostList(queryType.after, this.state.posts[0].id);
  }

  beforePageAction() {
    if(this.state.posts.length > 0)
      this.handleGetPostList(queryType.before, this.state.posts[this.state.posts.length-1].id);
  }

  firstPageAction() {
    this.handleGetPostList(queryType.nothing, null);
  }

  render() {
    return (
      <PostList posts={this.state.posts} name={this.props.name}
                typeId={this.props.typeId} writePermission={this.props.writePermission} pageInfo={this.state.pageInfo}
                afterPageAction={this.afterPageAction} beforePageAction={this.beforePageAction}
                firstPageAction={this.firstPageAction}
      />
    );
  }
}
