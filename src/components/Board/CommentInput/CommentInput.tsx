import * as React from 'react';
import './CommentInput.scss';

export namespace Comment {
  export interface Props {
    onCreateComment?: (comment:string) => void
  }

  export interface State {
    comment: string
  }

}

export class CommentInput extends React.Component<Comment.Props, Comment.State> {
  constructor(props: any) {
    super(props);

    this.state = {
      comment: ""
    }
  }

  handleNewComment = (event:React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { comment } = this.state;
    if(!comment) {
      return;
    }
    const { onCreateComment } = this.props;
    onCreateComment(comment);
    this.setState({
      comment: ""
    })
  }

  updateComment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const comment = event.target.value;
    this.setState({
      comment: comment
    });
  };

 render() {
    return (
      <div className="input-group comment-input">
        <input type="text" className="form-control" placeholder="댓글을 입력하세요"
               onChange={this.updateComment}
               value={this.state.comment}
        />
        <div className="input-group-append">
          <button type="submit" className="btn btn-primary" onClick={this.handleNewComment}>댓글 달기</button>
        </div>
      </div>
    )
  }
}