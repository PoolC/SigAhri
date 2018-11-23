import * as React from "react";
import {PostContainer} from "../../../containers/Board";

export namespace CommentList {
  export interface Props {
    comments: Array<PostContainer.Comment>,
    onDeleteComment?: (id: number) => void
  }
}

const getDate = (date:string) : string => {
  const dsplit = date.split("T");
  const datepart = dsplit[0];
  const timepart = dsplit[1].slice(0, dsplit[1].indexOf('.'));

  const newTime = `${datepart} ${timepart}`;
  return newTime;
};

export const CommentList: React.SFC<CommentList.Props> = (props) => {
  return (
    <React.Fragment>
      {props.comments.map((comment: PostContainer.Comment) => {
        return (
          <div className="row comments" key={comment.id}>
            <div className="col-3">
              {comment.author.name}
            </div>
            <div className="col-6 comment-body">
              {comment.body}&nbsp;
              <span className="comment-date">{getDate(comment.createdAt)}</span>
            </div>
            <div className="col-3">
              <button onClick={ () => { props.onDeleteComment(comment.id); } }
                      className="btn float-right btn-outline-secondary delete-comment"
              >삭제</button>
            </div>
          </div>
        )
      })}
    </React.Fragment>
  )
};