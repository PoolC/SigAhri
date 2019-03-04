import * as React from 'react';
import { Link } from 'react-router-dom';
import { PostListContainer } from '../../../containers/Board';
import './PostList.scss';
import dateUtils from "../../../utils/DateUtils";

namespace PostListItem {
  export interface Props {
    post: PostListContainer.PostInfo,
  }
}

const PostListItem: React.SFC<PostListItem.Props> = (props) => {
  const { post } = props;
  return (
    <React.Fragment>
      <tr className="post-list-row">
        <td>
          <Link to={`/posts/${post.id}`}>
            {post.title} {post.comments.length !== 0 ? `[${post.comments.length}]` : ''}
          </Link>
        </td>
        <td>{post.author.name}</td>
        <td>{dateUtils.ParseDate(post.createdAt, 'YYYY-MM-DD')}</td>
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
    isSubscribed: boolean,
    hasLogin: boolean

    afterPageAction: () => void,
    beforePageAction: () => void,
    firstPageAction: () => void,

    onSubscribeBoard: () => void,
    onUnsubscribeBoard: () => void
  }

  export interface pageInfo {
    hasNext: boolean,
    hasPrevious: boolean
  }
}

export const PostList: React.SFC<PostList.Props> = (props) => {
  const handleSubscribe = (event:React.MouseEvent<HTMLButtonElement>) => {
    if(props.isSubscribed) {
      props.onUnsubscribeBoard();
    } else {
      props.onSubscribeBoard();
    }
  };

  const notifications_on = <i className="far fa-bell post-list"></i>;
  const notifications_off = <i className="far fa-bell-slash"></i>;
  const icon = props.isSubscribed ? notifications_on : notifications_off;
  return (
    <div>
      <div className="post-list-head">
        <h1 className="post-list-name">{props.name}</h1>
        {props.hasLogin &&
        <button className="post-list-noti-button" onClick={handleSubscribe}>
          {icon}
        </button>
        }
        {
          props.writePermission ?
            (<Link to={"/posts/new/"+props.typeId}><button className="btn btn-primary post-list-new">글쓰기</button></Link>) :
            (null)
        }
      </div>
      <table className="table">
        <thead>
        <tr>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
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
      <div className="post-pager text-center">
        { <button className="btn btn-secondary" onClick={() => props.firstPageAction()}>첫 페이지</button> }
        { props.pageInfo.hasPrevious ?
          (<button className="btn btn-secondary" onClick={() => props.afterPageAction()}>이전 페이지</button>) :
          null
        }
        { props.pageInfo.hasNext ?
          (<button className="btn btn-secondary" onClick={() => props.beforePageAction()}>다음 페이지</button>) :
          null
        }
      </div>
    </div>
  );
};