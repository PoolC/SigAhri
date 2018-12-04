import * as React from 'react';
import {PostContainer} from "../../../containers/Board";
import './PostBody.scss';
import * as moment from "moment";
import ReactMarkdown = require("react-markdown")

export namespace PostBody {
  export interface Props {
    post: PostContainer.Info,
    handleVoteSubmit: (event : React.FormEvent<HTMLInputElement>) => void,
    checkVote: (event : React.FormEvent<HTMLInputElement>) => void,
    handleReVote: (event: React.FormEvent<HTMLInputElement>) => void,
    hasVoted: boolean,
    hasLogin: boolean,
    voteHasFinished: boolean
  }
}

const getLocalTime = (time: string) => {
  return moment.utc(time).local().format('YYYY-MM-DD HH:mm:ss');
};

export const PostBody : React.SFC<PostBody.Props> = (props) => {
  const { post, hasVoted, checkVote, handleVoteSubmit, handleReVote, hasLogin, voteHasFinished } = props;

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
      <ReactMarkdown source={post.body.replace(/\n/g, "  \n")} />
      {post.vote !== null && !hasVoted && !voteHasFinished && (
        <form>
          <fieldset>
            {post.vote.options.map((option: { id:number, text:string, votersCount:number, voters: { loginID: string }[] }) => {
              return (
                <div className="form-check" key={option.id}>
                  <input className="form-check-input" name={`vote${post.vote.id}`} type={post.vote.isMultipleSelectable ? "checkbox" : "radio"}
                         value={option.id} id={`option${option.id}`} onChange={event => checkVote(event)} disabled={!hasLogin} />
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
      {post.vote !== null && ((hasVoted) || (voteHasFinished)) && (
        <div className="container-fluid vote-progress">
          {post.vote.options.map((option: { id:number, text:string, votersCount:number, voters: { loginID: string }[] }) => {
            const { totalVotersCount } = post.vote;
            const selectRatio = totalVotersCount > 0 ? option.votersCount / totalVotersCount : 0;
            return (
              <div className="row vote-row" key={option.id}>
                <div className={window.innerWidth < 768 ? `vote-col-text col-6` : `vote-col-text col-3` }>{option.text}</div>
                <div className={window.innerWidth < 768 ? `vote-col col-6` : `vote-col col-3` }>
                  <div className="progress">
                    <div className="progress-bar" role="progressbar" style={{width: `${selectRatio * 100}%`}} aria-valuenow={selectRatio}
                         aria-valuemin={0} aria-valuemax={1}>{`${option.votersCount}명`}</div>
                  </div>
                </div>
              </div>
            )
          })}
          {hasLogin && !voteHasFinished && <input className="btn btn-primary mt-2 vote-submit" type="submit" value="다시 투표" onClick={(event) => { handleReVote(event) }} />}
        </div>
      )}
    </React.Fragment>
  )
};