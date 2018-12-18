import * as React from 'react';
import { PostContainer } from '../../../containers';
import { CommentInput } from '../CommentInput/CommentInput'
import { CommentList } from "../CommentList/CommentList";
import {PostBodyContainer} from "../../../containers/Board/PostBodyContainer/PostBodyContainer";
import history from '../../../history/history';
import './Post.scss';

export namespace Post {
  export interface Props {
    info: PostContainer.Info,
    onDeletePost?: () => void,
    onCreateComment?: (comment: string) => void,
    onDeleteComment?: (id: number) => void,
    onVoteSubmit?: (selectedOptions : number[]) => void,
    hasWritePermissions: boolean,
    hasLogin: boolean
  }
}

export class Post extends React.Component<Post.Props> {

  handleUpdate = (event:React.MouseEvent<HTMLButtonElement>) => {
    history.push(`${history.location.pathname}/edit`)
  };

  handleDelete = (event:React.MouseEvent<HTMLButtonElement>) => {
    if(!confirm("정말로 삭제하시겠습니까?")) {
      return;
    }
    const { onDeletePost } = this.props;
    onDeletePost();
  };

  handleToBoard = (event:React.MouseEvent<HTMLButtonElement>) => {
    const { urlPath } = this.props.info.board;
    history.push(`/board/${urlPath}`);
  };

  render() {
    const {info, onCreateComment, onDeleteComment, onVoteSubmit, hasWritePermissions, hasLogin} = this.props;
    return (
      <React.Fragment>
        <h2 className="board-title">{info.board.name}</h2>
        <PostBodyContainer post={info} onVoteSubmit={onVoteSubmit} />
        <hr className="post-end"/>
        <CommentList comments={info.comments} onDeleteComment={onDeleteComment} />
        {hasLogin && <CommentInput onCreateComment={onCreateComment} /> }
        <div className="post-menu">
          <button onClick={this.handleToBoard} className="btn float-right">목록</button>
          {hasWritePermissions &&
          <button onClick={this.handleDelete} className="btn float-right">삭제</button>
          }
          {hasWritePermissions &&
          <button onClick={this.handleUpdate} className="btn float-right last">수정</button>
          }
        </div>
      </React.Fragment>
    )
  }
};