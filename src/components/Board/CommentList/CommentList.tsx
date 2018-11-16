import * as React from "react";
import {PostContainer} from "../../../containers/Board";

export namespace CommentList {
  export interface Props {
    comments: Array<PostContainer.Comment>
  }
}

export const CommentList: React.SFC<CommentList.Props> = (props) => {
  return (
    <div className="comments">
      {props.comments.map((comment: PostContainer.Comment) => {
        return (<p key={comment.id}>{`${comment.author.name}    ${comment.body}  ${comment.createdAt}`}</p>);
      })}
    </div>
  )
}