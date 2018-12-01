import * as React from 'react';

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
      <form>
        <div className="form-row align-items-center">
          <div className="col-8">
            <label className="sr-only">댓글</label>
            <input type="text" className="form-control" placeholder="댓글을 입력하세요"
                   onChange={this.updateComment}
                   value={this.state.comment}
            />
          </div>
          <div className="col-4">
            <button type="submit" className="btn float-right btn-primary"
                    onClick={this.handleNewComment}>
              댓글 달기
            </button>
          </div>
        </div>
      </form>
    )
  }
}