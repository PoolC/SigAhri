import * as React from 'react';
import { Link } from 'react-router-dom';
import './PostList.scss';

namespace PostListItem {
  export interface Props {
    post: PostList.PostInfo
  }
}

const PostListItem: React.SFC<PostListItem.Props> = (props) => {
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


export namespace PostList {
  export interface Props {
    posts: Array<PostInfo>,
    name: string,
    typeId: number
  }

  export interface PostInfo {
    id: number,
    author: {[key:string]:string},
    createdAt: string,
    title: string
  }
}

export const PostList: React.SFC<PostList.Props> = (props) => {
  return (
    <div>
      <div className="post-list-head">
        <h2 className="post-list-name">{props.name}</h2>
        <Link to={"/posts/new/"+props.typeId}><button className="btn btn-primary post-list-new">글쓰기</button></Link>
      </div>
      <table className="table">
        <thead>
        <tr>
          <th scope="col">제목</th>
          <th scope="col">작성자</th>
          <th scope="col">작성일</th>
        </tr>
        </thead>
        <tbody>
        { props.posts.map(post => {
          return (
            <PostListItem post={post} key={post.id}/>
          )
        }) }
        </tbody>
      </table>
    </div>
  );
}
