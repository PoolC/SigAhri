import * as React from 'react';
import { PostContainer } from '../../../containers';

export namespace Post {
  export interface Props {
    info: PostContainer.Info
  }
}

export const Post: React.SFC<Post.Props> = (props) => {
  const { info } = props;
  return (
    <React.Fragment>
      <h2>{info.title}</h2>
      <p>{`${info.author.name} | ${info.createdAt}`}</p>
      <p>{info.body}</p>
      <div className="comments">
        {info.comments.map((comment: PostContainer.Comment) => {
          return (<p key={comment.id}>{`${comment.author.name}    ${comment.body}  ${comment.createdAt}`}</p>);
        })}
      </div>
    </React.Fragment>
  )
}
