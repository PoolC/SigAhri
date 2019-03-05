import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import './PostForm.scss';
import history from '../../../history/history';
import {Link} from 'react-router-dom';
import myGraphQLAxios from "../../../utils/ApiRequest";
import dateUtils from "../../../utils/DateUtils";
import Loadable from 'react-loadable';

const SimpleMDE = Loadable({
  loader: () => import(/* webpackChunkName: "simplemde" */ 'react-simplemde-editor') as Promise<any>,
  loading: () => null as null
});

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
    vote: Vote,
    authentication?: boolean
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
      vote: null,
      authentication: false
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
        deadline: dateUtils.ParseDate(Date.now(), 'YYYY-MM-DD HH:mm:SS'),
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

      if(this.props.type === PostFormType.new && dateUtils.getTimeDiff(voteInfo.deadline, Date.now()) <= 0) {
        alert('투표 마감기한은 현재시간 이후로 설정해주세요.');
        return;
      }
    }

    const isNew = this.props.type === PostFormType.new;
    let data = "";
    if(isNew) {
      data = voteInfo === null ?
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
          deadline: "${dateUtils.ParseDate(voteInfo.deadline, 'ISO')}",
          isMultipleSelectable: ${voteInfo.isMultipleSelectable ? 'true' : 'false'},
          optionTexts: [${voteInfo.optionText.map((text) => ('"' + text + '"'))}]
        }) {
          id
        }
      }`;
    } else {
      data =`mutation {
        updatePost(postID: ${this.props.match.params.postID}, PostInput: {
        title: "${title}",
        body: """${body}"""
        }) {
          id
        }
      }`
    }

    myGraphQLAxios(data, {
      authorization: true
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

      const redirectID = isNew ? data.data.createPost.id : data.data.updatePost.id;
      history.push(`/posts/${redirectID}`);
    }).catch((msg) => {
      console.log("post write API error");
      console.log(msg);
    });
  }

  componentDidMount() {
    const isEdit = this.props.type === PostFormType.edit;
    let data = "";
    if(isEdit) {
      data = `query {
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
          },
          isSubscribed
        }
      }`;
    } else {
      data = `query {
        board(boardID: ${this.props.match.params.boardID}) {
          name,
          writePermission
        }
      }`;
    }

    myGraphQLAxios(data, {
      authorization: true
    }).then((msg) => {
      if(isEdit) {
        const data = msg.data;

        if ('errors' in data) {
          if (data.errors[0].message === 'ERR403' || data.errors[0].message === 'ERR400') {
            history.push('/404');
            return;
          }
        }
        if (data.data === null) {
          history.push('/404');
          return;
        }

        const nextState: any = {
          boardName: data.data.post.board.name,
          postTitle: data.data.post.title,
          postContent: data.data.post.body,
          authentication: true
        };

        if (data.data.post.vote !== null) {
          const voteOptions = data.data.post.vote.options.map((item: {
            text: string
          }) => (item.text));
          const deadline = dateUtils.ParseDate(data.data.post.vote.deadline, 'YYYY-MM-DD HH:mm:SS');

          nextState['vote'] = {
            title: data.data.post.vote.title,
            deadline: deadline,
            isMultipleSelectable: data.data.post.vote.isMultipleSelectable,
            optionText: voteOptions
          };
        }

        this.setState(nextState);
      } else {
        // TODO: typing
        const data = msg.data.data;
        if(data === null) {
          history.push('/404');
          return;
        }

        this.setState({
          boardName: data.board.name,
          authentication: true
        });
      }
    }).catch((msg) => {
      console.log("post API error");
      console.log(msg);
    });
  }

  voteAddKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if(e.keyCode === 13) {
      this.handleVoteOptionAdd();
    }
  }

  render() {
    const isEdit = this.props.type === PostFormType.edit;

    if(!this.state.authentication) {
      return null;
    }

    let voteForm: JSX.Element = null;
    if(this.state.vote !== null) {
      voteForm = (
        <div className="post-form-vote-container">
          <h3>투표 첨부 {isEdit ? "(수정 X)" : null}</h3>
          <div className="form-group">
            <label>제목</label>
            <input className="post-form-input" onChange={this.handleVoteTitleChange} value={this.state.vote.title}
                    disabled={isEdit}
            />
          </div>

          <div className="form-group">
            <label>투표 마감</label>
            <input className="post-form-input" type="datetime-local" onChange={this.handleVoteDeadlineChange}
                    value={this.state.vote.deadline} disabled={isEdit}
            />
          </div>

          <div className="form-check">
            <input className="post-form-checkbox form-check-input" type="checkbox" value="isMultipleSelectable" id="input-is-mulitple-selectable"
                    onChange={this.handleVoteIsMultipleSelectableChange} checked={this.state.vote.isMultipleSelectable}
                    disabled={isEdit}
            />
            <label className="inline-block no-margin" htmlFor="input-is-mulitple-selectable">다중선택 가능</label>
          </div>

          <div className="post-form-vote-options-container">
            <h5>투표 선택지 {isEdit ? '' : '추가'}</h5>
            {
              isEdit ? null :
                (<div className="input-group">
                  <input id="post-vote-option" className="post-form-input-not-full" onKeyDown={this.voteAddKeyPress}/>
                  <div className="input-group-append">
                    <button type="button" className="btn btn-secondary" onClick={this.handleVoteOptionAdd}>추가</button>
                  </div>
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
      );
    }

    return (
      <div>
        <h1 className="post-form-title">{this.state.boardName}</h1>
        <form>
          <div className="form-group">
            <label>제목</label>
            <input
              className="post-form-input post-form-input-title"
              value={this.state.postTitle}
              onChange={this.handleTitleChange}
            />
          </div>
          <div className="form-group">
          <label>본문</label>
            <SimpleMDE>
              value={this.state.postContent}
              onChange={this.handleContentChange}
              id={"post-form-content-"+this.props.match.params.boardID}
              options={{
                  placeholder: "마크다운 문법을 이용해 입력해주세요.",
                  spellChecker: false,
                }
              }
            </SimpleMDE>
          </div>
          {this.state.vote !== null ? voteForm : null}
          <div className="post-form-button-container">
            {
              isEdit ? null :
                (this.state.vote === null ?
                (<button type="button" className="btn btn-secondary" onClick={this.handleAddVote}>투표 첨부</button>) :
                (<button type="button" className="btn btn-danger" onClick={this.handleDeleteVote}>투표 삭제</button>))
            }
            <Link to="/upload" target="_blank"><button type="button" className="btn btn-secondary">파일 첨부</button></Link>
            <button type="button" className="btn btn-primary" onClick={() => this.handleSubmit()}>작성</button>
          </div>
        </form>
      </div>
    );
  }
}
