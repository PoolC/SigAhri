import * as React from "react";
import {PostContainer} from "../../../containers/Board";

export namespace CommentList {
  export interface Props {
    comments: Array<PostContainer.Comment>,
    onDeleteComment?: (id: number) => void
  }
}

export const CommentList: React.SFC<CommentList.Props> = (props) => {
  return (
    <div className="comments">
      {props.comments.map((comment: PostContainer.Comment) => {
        return (
          <div className="comment" key={comment.id}>
            <p>{`${comment.author.name}    ${comment.body}  ${comment.createdAt}`}</p>
            <button onClick={ () => { props.onDeleteComment(comment.id); } }>댓글 삭제</button>
          </div>
        )
      })}
    </div>
  )
}