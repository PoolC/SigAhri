import * as React from "react";
import {PostContainer} from "../../../containers/Board";
import './CommentList.scss';
import dateUtils from "../../../utils/DateUtils";

export namespace CommentList {
  export interface Props {
    comments: Array<PostContainer.Comment>,
    onDeleteComment?: (id: number) => void
  }
}

export const CommentList: React.SFC<CommentList.Props> = (props) => {
  return (
    <React.Fragment>
      {props.comments.map((comment: PostContainer.Comment) => {
        return (
          <div className="row comments" key={comment.id}>
            <div className="col-sm-12 col-md-1">
              <strong>{comment.author.name}</strong>
            </div>
            <div className="col-sm-12 col-md-11">
              <span className="comment-body">{comment.body}</span>
              <span className="comment-date">{dateUtils.ParseDate(comment.createdAt, 'YYYY-MM-DD HH:mm:SS')}</span>
              {comment.writePermission &&
                <button onClick={() => {props.onDeleteComment(comment.id);}}
                        className="btn float-right btn-outline-secondary btn-sm comment-btn-delete">
                  삭제
                </button>
              }
            </div>
          </div>
        )
      })}
    </React.Fragment>
  )
};