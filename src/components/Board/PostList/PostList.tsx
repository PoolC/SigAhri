import * as React from 'react';
import { Link } from 'react-router-dom';
import { PostListContainer } from '../../../containers/Board';
import './PostList.scss';
import * as moment from 'moment';

namespace PostListItem {
  export interface Props {
    post: PostListContainer.PostInfo,
  }
}

const PostListItem: React.SFC<PostListItem.Props> = (props) => {
  const { post } = props;
  return (
    <React.Fragment>
      <tr>
        <td>
          <Link to={`/posts/${post.id}`}>
            {post.title} {post.comments.length !== 0 ? `[${post.comments.length}]` : ''}
          </Link>
        </td>
        <td>{post.author.name}</td>
        <td>{moment.utc(post.createdAt).local().format('YYYY-MM-DD')}</td>
      </tr>
    </React.Fragment>
  )
};

export namespace PostList {
  export interface Props {
    posts: Array<PostListContainer.PostInfo>,
    name: string,
    typeId: number,
    writePermission: boolean,
    pageInfo: pageInfo,

    afterPageAction: () => void,
    beforePageAction: () => void,
    firstPageAction: () => void
  }

  export interface pageInfo {
    hasNext: boolean,
    hasPrevious: boolean
  }
}

export const PostList: React.SFC<PostList.Props> = (props) => {
  return (
    <div>
      <div className="post-list-head">
        <h2 className="post-list-name">{props.name}</h2>
        {
          props.writePermission ?
            (<Link to={"/posts/new/"+props.typeId}><button className="btn btn-primary post-list-new">글쓰기</button></Link>) :
            (null)
        }
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
      <div>
        <button onClick={() => props.firstPageAction()}><a href="#">첫 페이지</a></button>
        { props.pageInfo.hasPrevious ?
          (<button onClick={() => props.afterPageAction()}><a href="#">이전 페이지</a></button>) :
          null
        }
        { props.pageInfo.hasNext ?
          (<button onClick={() => props.beforePageAction()}><a href="#">다음 페이지</a></button>) :
          null
        }
      </div>
    </div>
  );
};
