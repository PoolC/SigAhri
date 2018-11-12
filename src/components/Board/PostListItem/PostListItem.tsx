import * as React from 'react';
import { PostList } from '../../../containers';
import { Link } from 'react-router-dom';

export namespace PostListItem {
  export interface Props {
    post: PostList.PostInfo
  }
}

export const PostListItem: React.SFC<PostListItem.Props> = (props) => {
  const { post } = props;
  return (
    <React.Fragment>
      <li>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
        <p>{post.author.name}</p>
      </li>
    </React.Fragment>
  )
};