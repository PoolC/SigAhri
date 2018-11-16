import * as React from 'react';
import { PostContainer } from '../../../containers';
import { Comment } from '../Comment/Comment'
import { CommentList } from "../CommentList/CommentList";

export namespace Post {
  export interface Props {
    info: PostContainer.Info,
    onNewComment?: (comment: string) => void
  }
}

export const Post: React.SFC<Post.Props> = (props) => {
  const { info, onNewComment } = props;
  return (
    <React.Fragment>
      <h2>{info.title}</h2>
      <p>{`${info.author.name} | ${info.createdAt}`}</p>
      <p>{info.body}</p>
      <CommentList
        comments={info.comments}
      />
      <Comment
        onNewComment={onNewComment}
      />
    </React.Fragment>
  )
}
