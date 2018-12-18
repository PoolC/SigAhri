import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import axios from 'axios';
import './PostForm.scss';
import history from '../../../history/history';
import SimpleMDE from 'react-simplemde-editor';
import {Link} from 'react-router-dom';
import * as moment from 'moment';

export enum PostFormType {
  new = 'NEW',
  edit = 'EDIT'
}

export namespace PostForm {
  export interface Props extends RouteComponentProps<MatchParams> {
    type: PostFormType, // new or edit
  }

  interface MatchParams {
    boardID?: string,
    postID?: string
  }

  export interface State {
    boardName: string,
    postTitle: string,
    postContent: string,
    vote: Vote
  }

  interface Vote {
    title: string,
    deadline: string,
    isMultipleSelectable: boolean,
    optionText: Array<string>
  }
}

export class PostForm extends React.Component<PostForm.Props, PostForm.State> {
  constructor(props: PostForm.Props) {
    super(props);

    this.state = {
      boardName: '',
      postTitle: '',
      postContent: '',
      vote: null
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleAddVote = this.handleAddVote.bind(this);
    this.handleDeleteVote = this.handleDeleteVote.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleVoteTitleChange = this.handleVoteTitleChange.bind(this);
    this.handleVoteDeadlineChange = this.handleVoteDeadlineChange.bind(this);
    this.handleVoteIsMultipleSelectableChange = this.handleVoteIsMultipleSelectableChange.bind(this);
    this.handleVoteOptionAdd = this.handleVoteOptionAdd.bind(this);
    this.handleVoteOptionDelete = this.handleVoteOptionDelete.bind(this);
    this.voteAddKeyPress = this.voteAddKeyPress.bind(this);
  }

  handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      postTitle: event.currentTarget.value
    });
  }

  handleContentChange(value: string) {
    this.setState({
      postContent: value
    });
  }

  handleAddVote() {
    this.setState({
      vote: {
        title: "",
        deadline: moment().format('YYYY-MM-DDTHH:mm'),
        isMultipleSelectable: false,
        optionText: []
      }
    });
  }

  handleDeleteVote() {
    this.setState({
      vote: null
    });
  }

  handleVoteTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      vote: {
        ...this.state.vote,
        title: event.currentTarget.value
      }
    })
  }

  handleVoteDeadlineChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      vote: {
        ...this.state.vote,
        deadline: event.currentTarget.value
      }
    })
  }

  handleVoteIsMultipleSelectableChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      vote: {
        ...this.state.vote,
        isMultipleSelectable: event.currentTarget.checked
      }
    })
  }

  handleVoteOptionAdd() {
    const newOption = (document.getElementById('post-vote-option') as HTMLInputElement).value;
    if (newOption === "") {
      alert("투표 항목의 이름을 입력해주세요.");
      return;
    }
    if (this.state.vote.optionText.indexOf(newOption) != -1) {
      alert("동일한 이름의 투표가 존재합니다.");
      return;
    }
    (document.getElementById('post-vote-option') as HTMLInputElement).value = '';

    const newOptionText = this.state.vote.optionText;
    newOptionText.push(newOption);
    this.setState({
      vote: {
        ...this.state.vote,
        optionText: newOptionText
      }
    });
  }

  handleVoteOptionDelete(option: string) {
    const newOptionText = this.state.vote.optionText.filter((text) => (text !== option));
    this.setState({
      vote: {
        ...this.state.vote,
        optionText: newOptionText
      }
    })
  }

  handleSubmit() {
    const title = this.state.postTitle;
    const body = this.state.postContent;
    let voteInfo = this.state.vote;

    if (title === '') {
      alert('제목을 입력해주세요.');
      return;
    } else if (body === '') {
      alert('내용을 입력해주세요.');
      return;
    } else if (voteInfo != null) {
      if (voteInfo.title === '') {
        alert('투표 제목을 입력해주세요.');
        return;
      } else if (voteInfo.deadline === "") {
        alert('투표 마감을 설정해주세요.');
        return;
      } else if (voteInfo.optionText.length === 0) {
        alert('투표 항목을 입력해주세요');
        return;
      }
    }

    const headers: any = {
      'Content-Type': 'application/graphql'
    };

    if (localStorage.getItem('accessToken') !== null) {
      headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    }

    if(this.props.type === PostFormType.new) {
      const data = voteInfo === null ?
        `mutation {
        createPost(boardID: ${this.props.match.params.boardID}, PostInput: {
          title: "${title}",
          body: """${body}"""
        }) {
          id
        }
      }` :
        `mutation {
        createPost(boardID: ${this.props.match.params.boardID}, PostInput: {
          title: "${title}",
          body: """${body}"""
        }, VoteInput: {
          title: "${voteInfo.title}",
          deadline: "${moment(voteInfo.deadline).format()}",
          isMultipleSelectable: ${voteInfo.isMultipleSelectable ? 'true' : 'false'},
          optionTexts: [${voteInfo.optionText.map((text) => ('"' + text + '"'))}]
        }) {
          id
        }
      }`;

      axios({
        url: apiUrl,
        method: 'post',
        headers: headers,
        data: data
      }).then((msg) => {
        const data = msg.data;

        if ('errors' in data) {
          const error = data.errors[0];
          if (error.message === "ERR401" || error.message === "ERR403") {
            alert("권한이 없습니다.");
          } else if (error.message === "ERR500") {
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
    } else {
      axios({
        url: apiUrl,
        method: 'post',
        headers: headers,
        data: `mutation {
          updatePost(postID: ${this.props.match.params.postID}, PostInput: {
          title: "${title}",
          body: """${body}"""
          }) {
            id
          }
        }`
      }).then((msg) => {
        const data = msg.data;

        if ('errors' in data) {
          const error = data.errors[0];
          if (error.message === "ERR401" || error.message === "ERR403") {
            alert("권한이 없습니다.");
          } else if (error.message === "ERR500") {
            alert("알 수 없는 에러가 발생하였습니다. 담당자에게 문의 부탁드립니다.");
            console.log("post write API error");
            console.log(msg);
          }
          return;
        }

        history.push(`/posts/${data.data.updatePost.id}`);
      }).catch((msg) => {
        console.log("post write API error");
        console.log(msg);
      });
    }
  }

  componentDidMount() {
    const headers: any = {
      'Content-Type': 'application/graphql'
    };

    if (localStorage.getItem('accessToken') !== null) {
      headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    }

    if (this.props.type === PostFormType.edit) {
      axios({
        url: apiUrl,
        method: 'post',
        headers: headers,
        data: `query {
          post(postID: ${this.props.match.params.postID}) {
            board {
              name
            },
            title,
            body,
            vote {
              title,
              deadline,
              isMultipleSelectable,
              options {
                text
              }
            }
          }
        }`
      }).then((msg) => {
        const data = msg.data;

        if('errors' in data) {
          if(data.errors[0].message === 'ERR403') {
            alert("권한이 없습니다.");
            // TODO: 404 page redirect
            history.push('/');
            return;
          }
        }

        const nextState: any = {
          boardName: data.data.post.board.name,
          postTitle: data.data.post.title,
          postContent: data.data.post.body,
        };

        if(data.data.post.vote !== null) {
          const voteOptions = data.data.post.vote.options.map((item: {
            text: string
          }) => (item.text));
          const deadline = moment(data.data.post.vote.deadline).format('YYYY-MM-DDTHH:mm');

          nextState['vote'] = {
            title: data.data.post.vote.title,
            deadline: deadline,
            isMultipleSelectable: data.data.post.vote.isMultipleSelectable,
            optionText: voteOptions
          };
        }

        this.setState(nextState);
      }).catch((msg) => {
        console.log("post API error");
        console.log(msg);
      });
    } else {
      axios({
        url: apiUrl,
        method: 'post',
        headers: headers,
        data: `query {
          board(boardID: ${this.props.match.params.boardID}) {
            name,
            writePermission
          }
        }`
      }).then((msg) => {
        // TODO: typing
        const data = msg.data.data;

        this.setState({
          boardName: data.board.name
        });

      }).catch((msg) => {
        console.log("boards API error");
        console.log(msg);
      });
    }
  }

  voteAddKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if(e.keyCode === 13) {
      this.handleVoteOptionAdd();
    }
  }

  render() {
    const isEdit = this.props.type === PostFormType.edit;

    let voteForm: JSX.Element = null;
    if(this.state.vote !== null) {
      voteForm = (
        <div className="post-form-vote-container">
          <h3>투표 {isEdit ? "(수정 X)" : null}</h3>
          <div>
            <div className="post-form-block">
              <h5>제목</h5>
              <input className="post-form-input" onChange={this.handleVoteTitleChange} value={this.state.vote.title}
                     disabled={isEdit}
              />
            </div>

            <div className="post-form-block">
              <h5>투표 마감</h5>
              <input className="post-form-input" type="datetime-local" onChange={this.handleVoteDeadlineChange}
                     value={this.state.vote.deadline} disabled={isEdit}
              />
            </div>

            <div className="post-form-block">
              <h5 className="inline-block no-margin">다중선택가능</h5>
              <input className="post-form-checkbox" type="checkbox" value="isMultipleSelectable"
                     onChange={this.handleVoteIsMultipleSelectableChange} checked={this.state.vote.isMultipleSelectable}
                     disabled={isEdit}
              />
            </div>

            <br />
            <div className="post-form-block">
              <h5>투표 항목 {isEdit?'':'추가'}</h5>
              {
                isEdit ? null :
                  (<div>
                    <input id="post-vote-option" className="post-form-input-not-full" onKeyDown={this.voteAddKeyPress}/>
                    <button className="btn btn-secondary post-form-option-add-button" onClick={this.handleVoteOptionAdd}>추가</button>
                  </div>)
              }
              <ul>
                {this.state.vote.optionText.map((text) => (
                  <li key={text}>
                    {text}
                    {isEdit ? null :
                      (<span> (<a href="#" onClick={()=>this.handleVoteOptionDelete(text)}>삭제</a>)</span>)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="post-form-title">{this.state.boardName}</h2>
        <div>
          <div className="post-form-block">
            <h5>제목</h5>
            <input
              className="post-form-input post-form-input-title"
              value={this.state.postTitle}
              onChange={this.handleTitleChange}
            />
          </div>
          <div className="post-form-block">
            <h5>본문</h5>
            <SimpleMDE
              value={this.state.postContent}
              onChange={this.handleContentChange}
              id={"post-form-content-"+this.props.match.params.boardID}
              options={{
                  placeholder: "마크다운 문법을 이용해 입력해주세요."
                }
              }
            />
          </div>
          {this.state.vote !== null ? voteForm : null}
          <div className="post-form-button-container">
            {
              isEdit ? null :
                (this.state.vote === null ?
                (<button className="btn btn-lg btn-secondary" onClick={this.handleAddVote}>투표 첨부</button>) :
                (<button className="btn btn-lg btn-danger" onClick={this.handleDeleteVote}>투표 삭제</button>))
            }
            <Link to="/upload" target="_blank"><button className="btn btn-lg btn-secondary">파일 첨부</button></Link>
            <button className="btn btn-lg btn-primary" onClick={() => this.handleSubmit()}>작성</button>
          </div>
        </div>
      </div>
    );
  }
}
