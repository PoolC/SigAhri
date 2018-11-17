import * as React from 'react';

export namespace Comment {
  export interface Props {
    onCreateComment?: (comment:string) => void
  }

  export interface State {
    comment: string
  }

}

export class Comment extends React.Component<Comment.Props, Comment.State> {
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
      <div className="comments">
        <h4>댓글 달기</h4>
        <form>
          <input type="text" name="Comment" placeholder="댓글을 입력하세요."
                 onChange={this.updateComment}
                 value={this.state.comment}
          />
          <input type="button" value="댓글 달기" onClick={this.handleNewComment} />
        </form>
      </div>
    )
  }
}