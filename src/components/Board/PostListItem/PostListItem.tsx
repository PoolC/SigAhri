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
      <tr>
        <td><Link to={`/posts/${post.id}`}>{post.title}</Link></td>
        <td>{post.author.name}</td>
        <td>{post.createdAt}</td>
      </tr>
    </React.Fragment>
  )
};