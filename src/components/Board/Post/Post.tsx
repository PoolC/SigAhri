import * as React from 'react';
import { returntypeof } from 'react-redux-typescript';
import { PostContainer } from '../../../containers';
import { Comment } from '../Comment/Comment'
import { CommentList } from "../CommentList/CommentList";
import {RootState} from "../../../reducers";
import {compose} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state: RootState) => ({
  isLogin: state.authentication.status.isLogin,
  isAdmin: state.authentication.status.isAdmin
});

const statePropTypes = returntypeof(mapStateToProps);

export namespace Post {
  export interface SubProps {
    info: PostContainer.Info,
    boardName: string,
    onDeletePost?: () => void
    onCreateComment?: (comment: string) => void
    onDeleteComment?: (id: number) => void
  }

  export type Props = typeof statePropTypes & SubProps
}

class PostClass extends React.Component<Post.Props> {

  handleUpdate = (event:React.MouseEvent<HTMLButtonElement>) => {
    window.location.pathname += "/edit"
  };

  handleDelete = (event:React.MouseEvent<HTMLButtonElement>) => {
    const { onDeletePost } = this.props;
    onDeletePost();
  };

  handleToBoard = (event:React.MouseEvent<HTMLButtonElement>) => {
    const name = this.props.boardName === "공지사항" ? "notice" : "free";
    window.location.pathname = `/board/${name}`;
  };

  render() {
    const {info, onCreateComment, onDeleteComment} = this.props;
    return (
      <React.Fragment>
        <h2>{info.title}</h2>
        <p>{`${info.author.name} | ${info.createdAt}`}</p>
        <p>{info.body}</p>
        <CommentList
          comments={info.comments}
          onDeleteComment={onDeleteComment}
        />
        <Comment
          onCreateComment={onCreateComment}
        />
        <button onClick={this.handleUpdate}>수정</button>
        <button onClick={this.handleDelete}>삭제</button>
        <button onClick={this.handleToBoard}>목록</button>
      </React.Fragment>
    )
  }
};

export const Post = compose(connect(mapStateToProps))(PostClass);
