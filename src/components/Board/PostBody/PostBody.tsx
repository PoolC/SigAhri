import * as React from 'react';
import {PostContainer} from "../../../containers/Board";
import './PostBody.scss';

export namespace PostBody {
  export interface Props {
    post: PostContainer.Info,
    onVoteSubmit: (selectedOptions : number[]) => void
  }

  export interface State {
    selectedOptions: {[optionValue:number]: boolean},
    hasVoted: boolean // TODO: 이미 투표했는지 정보 가져오기
  }
}

const getDate = (date:string) : string => {
  const dsplit = date.split("T");
  const datepart = dsplit[0];
  const timepart = dsplit[1].slice(0, dsplit[1].indexOf('.'));

  const newTime = `${datepart} ${timepart}`;
  return newTime;
};

export class PostBody extends React.Component<PostBody.Props, PostBody.State> {
  constructor(props : PostBody.Props) {
    super(props);

    this.state = {
      selectedOptions: {},
      hasVoted: false  // TODO: erase
    }
  }

  shouldComponentUpdate(nextProps: PostBody.Props, nextState: PostBody.State, nextContext: any) {
    if((this.props.post.vote !== null && this.state.hasVoted !== nextState.hasVoted)
      || (this.props.post !== nextProps.post)){
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    this.resizeVoteDiv();
  }

  resizeVoteDiv = () => {
    // 투표 div에서 <div className="row"> 를 잡음
    const vote_row = document.getElementsByClassName("vote-row");

    for(let j=0 ; j<vote_row.length; j++) {
      let row = vote_row[j];
      if(window.innerWidth < 768) {
        for(let i=0 ; i<row.children.length; i++) {
          if(row.children[i].classList.contains("vote-col-text")) {
            row.children[i].classList.add("col-6");
          }
          if(row.children[i].classList.contains("vote-col")) {
            row.children[i].classList.add("col-6");
          }
        }
      } else {
        for(let i=0 ; i<row.children.length; i++) {
          if(row.children[i].classList.contains("vote-col-text")) {
            row.children[i].classList.add("col-3");
          }
          if(row.children[i].classList.contains("vote-col")) {
            row.children[i].classList.add("col-3");
          }
        }
      }
    }
  };

  checkVote = (event : React.FormEvent<HTMLInputElement>) => {
    const { selectedOptions } = this.state;
    const { isMultipleSelectable } = this.props.post.vote;
    const _resetOptions = (options: {[optionValue:number]:boolean}) => {
      let returnObject = {};
      for(let key of Object.keys(options)) {
        returnObject = {...returnObject, [key]:false}
      }
      return returnObject;
    };

    let currentSelectedOptions : {[optionValue:number]:boolean};
    if(isMultipleSelectable) {
      currentSelectedOptions = {...selectedOptions, [event.currentTarget.value] : event.currentTarget.checked };
    } else {
      const resetOptions = _resetOptions(selectedOptions);
      currentSelectedOptions = {...resetOptions, [event.currentTarget.value] : event.currentTarget.checked};
    }

    this.setState({
      selectedOptions: currentSelectedOptions
    });
  };

  handleVoteSubmit = (event : React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { onVoteSubmit } = this.props;
    const { selectedOptions } = this.state;

    let submitOptions : number[] = [];
    for(let _optionID of Object.keys(selectedOptions)) {
      const optionID = parseInt(_optionID);
      if(selectedOptions[optionID]) {
        submitOptions = submitOptions.concat(optionID);
      }
    }

    onVoteSubmit(submitOptions);
    this.setState({
      selectedOptions: [],
      hasVoted: true
    })
  };

  handleReVote = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      hasVoted: false
    })
  };

  render() {
    const { post } = this.props;
    const { hasVoted } = this.state;

    return (
      <React.Fragment>
        <h4 className="post-title">{post.title}</h4>
        <div className="row author-info">
          <div className="col-auto mr-0 content-left">
            <span>{post.author.name}</span>
          </div>
          <div className="col-auto mr-auto content-right">
            <span>{getDate(post.createdAt)}</span>
          </div>
        </div>
        <p>{post.body}</p>
        {!hasVoted && (
          <form>
            <fieldset>
              {post.vote !== null && post.vote.options.map((option: { id:number, text:string, votersCount:number, voters: { studentID: string } }) => {
                return (
                  <div className="form-check" key={option.id}>
                    <input className="form-check-input" name={`vote${post.vote.id}`} type={post.vote.isMultipleSelectable ? "checkbox" : "radio"}
                           value={option.id} id={`option${option.id}`} onChange={event => this.checkVote(event)}/>
                    <label className="form-check-label" htmlFor={`option${option.id}`}>
                      {option.text}
                    </label>
                  </div>
                )
              })}
              <input className="btn btn-primary mt-2 vote-submit" type="submit" value="투표하기" onClick={(event) => { this.handleVoteSubmit(event) }} />
            </fieldset>
          </form>
        )}
        {hasVoted && (
          <div className="container-fluid vote-progress">
            {post.vote !== null && post.vote.options.map((option: { id:number, text:string, votersCount:number, voters: { studentID: string } }) => {
              const { totalVotersCount } = post.vote;
              const selectRatio = totalVotersCount > 0 ? option.votersCount / totalVotersCount : 0;
              return (
                <div className="row vote-row" key={option.id}>
                  <div className="vote-col-text">{option.text}</div>
                  <div className="vote-col">
                    <div className="progress">
                      <div className="progress-bar" role="progressbar" style={{width: `${selectRatio * 100}%`}} aria-valuenow={selectRatio}
                           aria-valuemin={0} aria-valuemax={1}>{`${option.votersCount}명`}</div>
                    </div>
                  </div>
                </div>
              )
            })}
            <input className="btn btn-primary mt-2 vote-submit" type="submit" value="다시 투표" onClick={(event) => { this.handleReVote(event) }} />
          </div>
        )}
      </React.Fragment>
    )
  }
};