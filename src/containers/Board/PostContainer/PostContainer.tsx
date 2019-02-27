import * as React from 'react';
import myGraphQLAxios from "../../../utils/ApiRequest";
import { Post } from '../../../components';
import { RouteComponentProps } from 'react-router';
import history from '../../../history/history';
import { RootState } from '../../../reducers';
import { returntypeof } from 'react-redux-typescript';
import { compose } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state: RootState) => ({
  isLogin: state.authentication.status.isLogin,
  isAdmin: state.authentication.status.isAdmin,
  id: state.authentication.userInfo.id
});

const statePropTypes = returntypeof(mapStateToProps);

export namespace PostContainer {
  export interface SubProps extends RouteComponentProps<MatchParams>{
    // Intentionally empty
  }

  export type Props = typeof statePropTypes & SubProps

  interface MatchParams {
    postId: string
  }

  export interface State {
    info: Info,
    hasWritePermissions: boolean
  }

  export interface Info {
    id: number,
    board: { name: string, urlPath: string },
    title: string,
    author: { name: string, loginID: string },
    body: string,
    comments: Array<Comment>,
    createdAt: string,
    updatedAt: string,
    vote: Vote,
    isSubscribed: boolean
  }

  export interface Comment {
    id: number,
    author: { name: string, loginID: string },
    body: string,
    createdAt: string,
    writePermission: boolean
  }

  export interface Vote {
    id: number,
    title: string,
    options: { id:number, text:string, votersCount:number, voters: { loginID: string }[] }[],
    deadline: string,
    isMultipleSelectable: boolean,
    totalVotersCount: number
  }
}

class PostContainerClass extends React.Component<PostContainer.Props, PostContainer.State> {

  constructor(props: PostContainer.Props) {
    super(props);

    this.state = {
      info: {
        id: -1,
        title: "",
        author: {name: "", loginID: ""},
        body: "",
        board: {name: "", urlPath: ""},
        comments: [],
        createdAt: "",
        updatedAt: "",
        vote: null,
        isSubscribed: false
      },
      hasWritePermissions: false
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
    const data = `query {
      post(postID:${this.props.match.params.postId}) {
        id,
        title,
        body,
        board { name, urlPath },
        createdAt,
        updatedAt,
        comments {
          author {
            name,
            loginID
          },
          body,
          createdAt,
          id
        },
        author { name, loginID },
        vote {
          id,
          title,
          options { id, text, votersCount, voters { loginID } },
          deadline,
          isMultipleSelectable,
          totalVotersCount
        },
        isSubscribed
      }
    }`;

    myGraphQLAxios(data, {
      authorization: true
    }).then((msg) => {
      if(msg.data.data === null) { // 잘못 내려옴
        history.push('/404');
        return;
      }
      const data = msg.data.data.post;
      const { isAdmin, id } = this.props;
      if(data === null) { // 권한 없음
        alert('권한이 없습니다. 로그인 해주세요');
        history.push({
          pathname: '/login',
          state: {
            redirLink: this.props.location.pathname
          }
        });
        return;
      }

      // comment write permission 정하기
      const comments = data.comments.map((comment: PostContainer.Comment) => ({
        ...comment,
        writePermission: isAdmin || (comment.author.loginID === id)
      }));
      data.comments = comments;

      this.setState({
        info: data,
        hasWritePermissions: isAdmin || (this.props.id === data.author.loginID)
      })
    }).catch((msg) => {
    });
  }

  handleDeletePost = () => {
    const data = `mutation {
      deletePost(postID: ${this.state.info.id}) {
        board { urlPath }
      }
    }`;

    myGraphQLAxios(data, {
      authorization: true
    }).then((msg) => {
      const { urlPath } = msg.data.data.deletePost.board;
      window.location.pathname = `/board/${urlPath}`;
    })
  };

  handleCreateComment = (comment: string) => {
    const data = `mutation {
      createComment(postID:${this.state.info.id}, body:"${comment}") {
        author{
          name,
          loginID
        },
        body,
        createdAt,
        id
      }
    }`;

    myGraphQLAxios(data, {
      authorization: true
    }).then((msg) => {
      const { info } = this.state;
      let newComment = msg.data.data.createComment;
      newComment.writePermission = this.props.isAdmin || (newComment.author.loginID === this.props.id);
      this.setState({
        info: {
          ...info,
          comments: [...info.comments, newComment]
        }
      });
    })
  };

  handleDeleteComment = (id:number) => {
    const data = `mutation {
      deleteComment(commentID: ${id}) {
        id,
        author { name, loginID },
        body
        createdAt
      }
    }`;

    myGraphQLAxios(data, {
      authorization: true
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

  handleVoteSubmit = (selectedOptions : number[]) => {
    const data = `mutation {
      selectVoteOption(optionIDs: [${selectedOptions}], voteID: ${this.state.info.vote.id}) {
        id,
        title,
        totalVotersCount,
        isMultipleSelectable,
        deadline,
        options {
          id,
          text,
          votersCount,
          voters {
            loginID
          }
        }
      }
    }`;

    myGraphQLAxios(data, {
      authorization: true
    }).then((msg) => {
      const { info } = this.state;
      const voteData : PostContainer.Vote = msg.data.data.selectVoteOption;
      this.setState({
        info: {
          ...info,
          vote: voteData
        }
      });
    })
  };

  onSubscribePost = () => {
    const data = `mutation {
      subscribePost(postID: ${this.state.info.id}) {
        memberUUID
      }
    }`;

    myGraphQLAxios(data, {
      authorization: true
    }).then((msg) => {
      // const memberUUID = msg.data.unsubscribeBoard.memberUUID;
      const data = msg.data;
      if('errors' in data) {
        const message = data.errors[0].message;
        if(message === 'ERR401' || message === 'ERR403') {
          alert("권한이 없습니다");
        }
        return;
      } else {
        this.setState({
          info: {
            ...this.state.info,
            isSubscribed: true
          }
        });
      }
    }).catch((msg) => {
      // TODO : 에러처리
    });
  };

  onUnsubscribePost = () => {
    const data = `mutation {
      unsubscribePost(postID: ${this.state.info.id}) {
        memberUUID
      }
    }`;

    myGraphQLAxios(data, {
      authorization: true
    }).then((msg) => {
      // const memberUUID = msg.data.unsubscribeBoard.memberUUID;
      const data = msg.data;
      if('errors' in data) {
        const message = data.errors[0].message;
        if(message === 'ERR401' || message === 'ERR403') {
          alert("권한이 없습니다");
        }
        return;
      } else {
        this.setState({
          info: {
            ...this.state.info,
            isSubscribed: false
          }
        });
      }
    }).catch((msg) => {
      // TODO : 에러처리
    });
  };

  render() {
    if((typeof this.state.info === 'undefined') || this.state.info.id === -1)
      return null;

    return (
      <Post
        info={this.state.info}
        onDeletePost={this.handleDeletePost}
        onCreateComment={this.handleCreateComment}
        onDeleteComment={this.handleDeleteComment}
        onVoteSubmit={this.handleVoteSubmit}
        hasWritePermissions={this.state.hasWritePermissions}
        hasLogin={this.props.isLogin}
        isSubscribed={this.state.info.isSubscribed}
        onSubscribePost={this.onSubscribePost}
        onUnsubcribePost={this.onUnsubscribePost}
      />
    )
  }
}

export const PostContainer = compose(connect(mapStateToProps))(PostContainerClass);
