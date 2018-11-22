import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import axios from 'axios';
import './PostForm.scss';
import history from '../../../history/history';
import SimpleMDE from 'react-simplemde-editor';
import {Link} from 'react-router-dom';
import * as moment from 'moment';

export namespace PostForm {
  export interface Props extends RouteComponentProps<MatchParams> {
  }

  interface MatchParams {
    boardID: string
  }

  export interface State {
    boardName: string,
    postTitle: string,
    postContent: string,
    vote: Vote
  }

  interface Vote {
    title: string,
    duration: number,
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
    this.handleVoteDurationChange = this.handleVoteDurationChange.bind(this);
    this.handleVoteIsMultipleSelectableChange = this.handleVoteIsMultipleSelectableChange.bind(this);
    this.handleVoteOptionAdd = this.handleVoteOptionAdd.bind(this);
    this.handleVoteOptionDelete = this.handleVoteOptionDelete.bind(this);
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
        duration: 0,
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

  handleVoteDurationChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      vote: {
        ...this.state.vote,
        duration: Number(event.currentTarget.value)
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
    if(newOption === "") {
      alert("투표 항목의 이름을 입력해주세요.");
      return;
    }
    if(newOption in this.state.vote.optionText) {
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

    if(title === '') {
      alert('제목을 입력해주세요.');
      return;
    } else if(body === '') {
      alert('내용을 입력해주세요.');
      return;
    } else if(voteInfo != null) {
      if (voteInfo.title === '') {
        alert('투표 제목을 입력해주세요.');
        return;
      } else if (voteInfo.duration < 1 || voteInfo.duration > 365) {
        alert('투표 기간은 1~365의 숫자를 입력해주세요.');
        return;
      } else if(voteInfo.optionText.length === 0) {
        alert('투표 항목을 입력해주세요');
        return;
      }
    }

    const headers: any = {
      'Content-Type': 'application/graphql'
    };

    if(localStorage.getItem('accessToken') !== null) {
      headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    }

    const data = voteInfo === null ?
      `mutation {
        createPost(boardID: ${this.props.match.params.boardID}, PostInput: {
          title: "${title}",
          body: "${body}"
        }) {
          id
        }
      }` :
      `mutation {
        createPost(boardID: ${this.props.match.params.boardID}, PostInput: {
          title: "${title}",
          body: "${body}"
        }, VoteInput: {
          title: "${voteInfo.title}",
          deadline: "${moment().add(voteInfo.duration, 'd').format()}",
          isMultipleSelectable: ${voteInfo.isMultipleSelectable?'true':'false'},
          optionTexts: [${voteInfo.optionText.map((text) => ('"'+text+'"'))}]
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
    //console.log(moment().add(7, 'd').format());
    console.log(this.state.vote);
    let voteForm: JSX.Element = null;
    if(this.state.vote !== null) {
      voteForm = (
        <div>
          <h3>투표</h3>
          <div>
            <div>
              제목 <br />
              <input onChange={this.handleVoteTitleChange}/>
            </div>

            <div>
              투표 기간 <input type="number" min="1" max="365" onChange={this.handleVoteDurationChange}/>일
            </div>

            <input type="checkbox" value="isMultipleSelectable" onChange={this.handleVoteIsMultipleSelectableChange}/>
            다중선택가능 <br />
          </div>
          <div>
            <input id="post-vote-option" />
            <button className="btn btn-secondary" onClick={this.handleVoteOptionAdd}>추가</button>
            <ul>
              {this.state.vote.optionText.map((text) => (
                <li key={text}>{text} (<a onClick={()=>this.handleVoteOptionDelete(text)}>삭제</a>)</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2>{this.state.boardName}</h2>
        <div>
          <div className="post-form-title">
            <div>제목</div>
            <input
              value={this.state.postTitle}
              onChange={this.handleTitleChange}
            />
          </div>
          <div className="post-form-content">
            <div>본문</div>
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
          <div className="post-form-button">
            {
              this.state.vote === null ?
              (<button className="btn btn-secondary" onClick={this.handleAddVote}>투표 첨부</button>) :
              (<button className="btn btn-danger" onClick={this.handleDeleteVote}>투표 삭제</button>)
            }
            <Link to="/upload" target="_blank"><button className="btn btn-secondary">파일 첨부</button></Link>
            <button className="btn btn-primary" onClick={() => this.handleSubmit()}>작성</button>
          </div>
        </div>
      </div>
    );
  }
}
