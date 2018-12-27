import * as React from "react";
import {PostContainer} from "../../../containers/Board";
import * as moment from 'moment';
import './CommentList.scss';

export namespace CommentList {
  export interface Props {
    comments: Array<PostContainer.Comment>,
    onDeleteComment?: (id: number) => void
  }
}

const getLocalTime = (time: string) => {
  return moment.utc(time).local().format('YYYY-MM-DD HH:mm:ss');
};

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
              <span className="comment-date">{getLocalTime(comment.createdAt)}</span>
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