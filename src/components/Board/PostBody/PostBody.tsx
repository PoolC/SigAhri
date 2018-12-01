import * as React from 'react';
import {PostContainer} from "../../../containers/Board";
import './PostBody.scss';
import * as moment from "moment";

export namespace PostBody {
  export interface Props {
    post: PostContainer.Info,
    handleVoteSubmit: (event : React.FormEvent<HTMLInputElement>) => void,
    checkVote: (event : React.FormEvent<HTMLInputElement>) => void,
    handleReVote: (event: React.FormEvent<HTMLInputElement>) => void,
    hasVoted: boolean,
    hasLogin: boolean
  }
}

const getLocalTime = (time: string) => {
  return moment.utc(time).local().format('YYYY-MM-DD HH:mm:ss');
};

const resizeVoteDiv = () => {
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

export const PostBody : React.SFC<PostBody.Props> = (props) => {
  const { post, hasVoted, checkVote, handleVoteSubmit, handleReVote, hasLogin } = props;
  resizeVoteDiv();

  return (
    <React.Fragment>
      <h4 className="post-title">{post.title}</h4>
      <div className="row author-info">
        <div className="col-auto mr-0 content-left">
          <span>{post.author.name}</span>
        </div>
        <div className="col-auto mr-auto content-right">
          <span>{getLocalTime(post.createdAt)}</span>
        </div>
      </div>
      <p>{post.body}</p>
      {!hasVoted && post.vote !== null && (
        <form>
          <fieldset>
            {post.vote.options.map((option: { id:number, text:string, votersCount:number, voters: { loginID: string }[] }) => {
              return (
                <div className="form-check" key={option.id}>
                  <input className="form-check-input" name={`vote${post.vote.id}`} type={post.vote.isMultipleSelectable ? "checkbox" : "radio"}
                         value={option.id} id={`option${option.id}`} onChange={event => checkVote(event)}/>
                  <label className="form-check-label" htmlFor={`option${option.id}`}>
                    {option.text}
                  </label>
                </div>
              )
            })}
            {hasLogin && <input className="btn btn-primary mt-2 vote-submit" type="submit" value="투표하기" onClick={(event) => { handleVoteSubmit(event) }} />}
          </fieldset>
        </form>
      )}
      {hasVoted && post.vote !== null && (
        <div className="container-fluid vote-progress">
          {post.vote.options.map((option: { id:number, text:string, votersCount:number, voters: { loginID: string }[] }) => {
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
          {hasLogin && <input className="btn btn-primary mt-2 vote-submit" type="submit" value="다시 투표" onClick={(event) => { handleReVote(event) }} />}
        </div>
      )}
    </React.Fragment>
  )
};