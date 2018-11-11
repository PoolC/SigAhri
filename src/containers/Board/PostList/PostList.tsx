import * as React from 'react';
import axios from "axios";
import {PostListItem} from "../PostListItem/PostListItem";
import {Link} from "react-router-dom";

export namespace PostList {
  export interface Props {
    type: string,
    typeId: number
  }

  export interface State {
    posts: Array<PostInfo>
  }

  export interface PostInfo {
    id: number,
    author: {[key:string]:string},
    title: string
  }
}

export class PostList extends React.Component<PostList.Props, PostList.State> {
  constructor(props: PostList.Props) {
    super(props);

    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    axios({
      url: apiUrl,
      method: 'post',
      headers: {
        'Content-Type': 'application/graphql'
      },
      data: `query {
        posts(boardID: ${this.props.typeId}) {
          id,
            author { name },
            ${ /* TODO: insert created_at */'' }
          title
        }
      }`
    }).then((msg) => {
      // TODO: data가 BoardInfo 의 Array인지 typing
      const data = msg.data.data.posts;
      this.setState({
        posts: data
      })
    }).catch((msg) => {
        // TODO : 에러처리
    });
  }

  render() {
    const { posts } = this.state;
    console.log(posts);
    return (
      <ul>
        { posts.map(post => {
          return (
            <PostListItem
              post={post}
              key={post.id}
            />
          )
        }) }
      </ul>
    );
  }
}
