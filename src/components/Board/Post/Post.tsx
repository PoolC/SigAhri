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
    onDeletePost?: () => void
    onCreateComment?: (comment: string) => void
    onDeleteComment?: (id: number) => void
  }

  export type Props = typeof statePropTypes & SubProps
}

class PostClass extends React.Component<Post.Props> {

  getDate = (date:string) : string => {
    const dsplit = date.split("T");
    const datepart = dsplit[0];
    const timepart = dsplit[1].slice(0, dsplit[1].indexOf('.'));

    const newTime = `${datepart} ${timepart}`;
    return newTime;
  };

  handleUpdate = (event:React.MouseEvent<HTMLButtonElement>) => {
    window.location.pathname += "/edit"
  };

  handleDelete = (event:React.MouseEvent<HTMLButtonElement>) => {
    const { onDeletePost } = this.props;
    onDeletePost();
  };

  handleToBoard = (event:React.MouseEvent<HTMLButtonElement>) => {
    const { urlPath } = this.props.info.board;
    window.location.pathname = `/board/${urlPath}`;
  };

  render() {
    const {info, onCreateComment, onDeleteComment} = this.props;
    return (
      <React.Fragment>
        <h2 className="board-title">{info.board.name}</h2>
        <h4 className="post-title">{info.title}</h4>
        <div className="row author-info">
          <div className="col-auto mr-0 content-left">
            <span>{info.author.name}</span>
          </div>
          <div className="col-auto mr-auto content-right">
            <span>{this.getDate(info.createdAt)}</span>
          </div>
        </div>
        <p>{info.body}</p>
        <hr className="post-end"/>
        <CommentList
          comments={info.comments}
          onDeleteComment={onDeleteComment}
        />
        <Comment
          onCreateComment={onCreateComment}
        />
        <div className="post-menu">
          <button onClick={this.handleToBoard} className="btn float-right">목록</button>
          <button onClick={this.handleDelete} className="btn float-right">삭제</button>
          <button onClick={this.handleUpdate} className="btn float-right last">수정</button>
        </div>
      </React.Fragment>
    )
  }
};

export const Post = compose(connect(mapStateToProps))(PostClass);
