import * as React from 'react';
import { PostList } from '../../../components';
import * as queryString from 'query-string';
import history from '../../../history/history';
import { RouteComponentProps } from 'react-router';
import FadeLoader from 'react-spinners/FadeLoader';
import { css } from '@emotion/core';
import myGraphQLAxios from "../../../utils/ApiRequest";

export enum queryType {
  before = "BEFORE",
  after = "AFTER",
  nothing = "NOTHING"
}

export namespace PostListContainer {
  export interface Props extends RouteComponentProps {
    type: string,
    typeId: number,
    name: string,
    writePermission: boolean,
    isSubscribed: boolean,
    subscribeBoard: () => void,
    unsubscribeBoard: () => void,
    hasLogin: boolean
  }

  export interface State {
    pageInfo: PostList.pageInfo,
    posts: Array<PostInfo>,
    apiLoaded: boolean
  }

  export interface PostInfo {
    id: number,
    author: {[key:string]:string},
    createdAt: string,
    title: string,
    comments: Array<CommentInfo>,
    isSubscribed: boolean,
  }

  interface CommentInfo {
    id: number
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
      apiLoaded: false
    };

    this.handleGetPostList = this.handleGetPostList.bind(this);
    this.afterPageAction = this.afterPageAction.bind(this);
    this.beforePageAction = this.beforePageAction.bind(this);
    this.firstPageAction = this.firstPageAction.bind(this);
  }

  componentDidMount() {
    const params = queryString.parse(this.props.location.search);

    if(!('before' in params || 'after' in params)) {
      this.handleGetPostList(queryType.nothing, null);
    } else if('after' in params) {
      if(typeof params.after === 'string' && !isNaN(Number(params.after)))
        this.handleGetPostList(queryType.after, parseInt(params.after));
    } else {
      if(typeof params.before === 'string' && !isNaN(Number(params.before))) {
        this.handleGetPostList(queryType.before, parseInt(params.before));
      }
    }
  }

  handleGetPostList(inputQueryType: queryType, inputQueryID: number) {
    const pageItemNum = 15;
    let params = '';
    if(inputQueryType === queryType.nothing) {
      params = `boardID: ${this.props.typeId}, count: ${pageItemNum}`;
    } else if(inputQueryType === queryType.after) {
      params = `boardID: ${this.props.typeId}, after: ${inputQueryID}, count: ${pageItemNum}`;
    } else {
      params = `boardID: ${this.props.typeId}, before: ${inputQueryID}, count: ${pageItemNum}`;
    }

    const data = `query {
        postPage(${params}) {
          pageInfo {
            hasNext,
            hasPrevious
          },
          posts {
            id,
            author { name },
            createdAt,
            title,
            comments {
              id
            }
            isSubscribed
          }
        }
      }`;

    myGraphQLAxios(data, {
      authorization: true
    }).then((msg) => {
      // TODO: typing
      const data = msg.data.data.postPage;

      this.setState({
        ...data,
        apiLoaded: true
      });

    }).catch((msg) => {

    });
  }

  afterPageAction() {
    history.push(this.props.location.pathname + `?after=${this.state.posts[0].id}`);
    this.handleGetPostList(queryType.after, this.state.posts[0].id);
  }

  beforePageAction() {
    history.push(this.props.location.pathname + `?before=${this.state.posts[this.state.posts.length-1].id}`);
    this.handleGetPostList(queryType.before, this.state.posts[this.state.posts.length-1].id);
  }

  firstPageAction() {
    history.push(this.props.location.pathname);
    this.handleGetPostList(queryType.nothing, null);
  }

  render() {
    if(!this.state.apiLoaded) {
      const override = css`
        margin: 200px auto;
      `;
      return (
        <FadeLoader
          css={override}
          sizeUnit={"px"}
          size={15}
          color={'#aaaaaa'}
          loading={true}
          margin={'5px'}
        />
      );
    }

    return (
      <PostList posts={this.state.posts} name={this.props.name}
                typeId={this.props.typeId} writePermission={this.props.writePermission} pageInfo={this.state.pageInfo}
                afterPageAction={this.afterPageAction} beforePageAction={this.beforePageAction}
                firstPageAction={this.firstPageAction} onSubscribeBoard={this.props.subscribeBoard}
                onUnsubscribeBoard={this.props.unsubscribeBoard} isSubscribed={this.props.isSubscribed}
                hasLogin={this.props.hasLogin}
      />
    );
  }
}
