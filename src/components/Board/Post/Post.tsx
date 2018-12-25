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
    hasLogin: boolean,
    isSubscribed: boolean,
    onSubscribePost: () => void,
    onUnsubcribePost: () => void
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

  handleSubscribe = (event:React.MouseEvent<HTMLButtonElement>) => {
    if(this.props.isSubscribed) {
      this.props.onUnsubcribePost();
    } else {
      this.props.onSubscribePost();
    }
  };

  render() {
    const {info, onCreateComment, onDeleteComment, onVoteSubmit, hasWritePermissions, hasLogin } = this.props;

    return (
      <React.Fragment>
        <PostBodyContainer post={info} onVoteSubmit={onVoteSubmit} handleSubscribe={this.handleSubscribe} />
        <div className="post-menu">
          <button onClick={this.handleToBoard} className="btn float-right">목록</button>
          {hasWritePermissions &&
          <button onClick={this.handleDelete} className="btn float-right">삭제</button>
          }
          {hasWritePermissions &&
          <button onClick={this.handleUpdate} className="btn float-right last">수정</button>
          }
        </div>
        
        <hr></hr>
        
        <CommentList comments={info.comments} onDeleteComment={onDeleteComment} />
        {hasLogin && <CommentInput onCreateComment={onCreateComment} /> }
      </React.Fragment>
    )
  }
};