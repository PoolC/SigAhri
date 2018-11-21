import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import axios from 'axios';
import './PostForm.scss';
import history from '../../../history/history';

export namespace PostForm {
  export interface Props extends RouteComponentProps<MatchParams> {
  }

  interface MatchParams {
    boardID: string
  }

  export interface State {
    boardName: string,
    postTitle: string,
    postContent: string
  }
}

export class PostForm extends React.Component<PostForm.Props, PostForm.State> {
  constructor(props: PostForm.Props) {
    super(props);

    this.state = {
      boardName: "공지사항", // TODO: DELETE
      postTitle: "",
      postContent: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    let nextState = {} as any;
    nextState[event.currentTarget.name] = event.currentTarget.value;
    this.setState(nextState);
  }

  handleSubmit() {
    const headers: any = {
      'Content-Type': 'application/graphql'
    };

    if(localStorage.getItem('accessToken') !== null) {
      headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    }

    axios({
      url: apiUrl,
      method: 'post',
      headers: headers,
      data: `mutation {
        createPost(boardID: ${this.props.match.params.boardID}, PostInput: {
          title: "${this.state.postTitle}",
          body: "${this.state.postContent}"
        }) {
          id
        }
      }`
    }).then((msg) => {
      const data = msg.data;
      console.log(data);

      if('errors' in data) {
        const error = data.errors[0];
        if(error.message === "ERR401" || error.message === "ERR403") {
          alert("권한이 없습니다.");
        } else if(error.message === "ERR500") {
          alert("알 수 없는 에러가 발생하였습니다. 담당자에게 문의 부탁드립니다.");
          console.log("post write API error");
          console.log(msg);
        }
        return;
      }

      history.push(`/posts/${data.data.createPost.id}`);
    }).catch((msg) => {
      console.log("post write API error");
      console.log(msg);
    });
  }

  componentDidMount() {
    const headers: any = {
      'Content-Type': 'application/graphql'
    };

    if(localStorage.getItem('accessToken') !== null) {
      headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    }

    axios({
      url: apiUrl,
      method: 'post',
      headers: headers,
      data: `query {
        boards {
          id,
          name,
          writePermission
        }
      }`
    }).then((msg) => {
      // TODO: typing
      const data = msg.data.data;
      console.log(data);
      // TODO: set boardName, 권한이 없으면 404
    }).catch((msg) => {
      console.log("boards API error");
      console.log(msg);
    });
  }

  render() {
    return (
      <div>
        <h2>{this.state.boardName}</h2>
        <div>
          <div className="post-form-title">
            <div>제목</div>
            <input
              name="postTitle"
              onChange={this.handleChange}
            />
          </div>
          <div className="post-form-content">
            <div>본문</div>
            <input
              name="postContent"
              onChange={this.handleChange}
            />
          </div>
          <div className="post-form-button">
            <button className="btn btn-primary" onClick={() => this.handleSubmit()}>작성</button>
          </div>
        </div>
      </div>
    );
  }
}
