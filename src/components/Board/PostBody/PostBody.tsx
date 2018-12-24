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
    votedId: Array<number>,
    hasLogin: boolean,
    voteHasFinished: boolean
  }
}

const getLocalTime = (time: string) => {
  return moment.utc(time).local().format('YYYY-MM-DD HH:mm:ss');
};

export const PostBody : React.SFC<PostBody.Props> = (props) => {
  const { post, votedId, checkVote, handleVoteSubmit, handleReVote, hasLogin, voteHasFinished } = props;

  return (
    <React.Fragment>
      <h1 className="post-title">{post.title}</h1>
      <p className="post-meta">
        <i className="far fa-user"></i> {post.author.name}&nbsp;&nbsp;|&nbsp;&nbsp;<i className="far fa-clock"></i> {getLocalTime(post.createdAt)}
      </p>
      <hr></hr>

      <ReactMarkdown className="post-content" source={post.body.replace(/\n/g, "  \n")} />

      {/* 진행중인 투표의 경우 */}
      {post.vote !== null && votedId.length === 0 && !voteHasFinished && (
        <div className="post-vote">
          <h4>투표</h4>
          {voteHasFinished ? 
            <p>투표가 마감되었습니다.</p> :
            <p>투표 마감 : </p>
          }
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
        </div>
      )}

      {/* 이미 투표를 했거나 종료된 투표의 경우 */}
      {post.vote !== null && ((votedId.length !== 0) || (voteHasFinished)) && (
        <div className="container-fluid post-vote">
          <h4>투표</h4>
          {voteHasFinished ? 
            <p>투표가 마감되었습니다.</p> :
            <p>투표 마감 : </p>
          }
          {post.vote.options.map((option: { id:number, text:string, votersCount:number, voters: { loginID: string }[] }) => {
            const { totalVotersCount } = post.vote;
            const selectRatio = totalVotersCount > 0 ? option.votersCount / totalVotersCount : 0;
            return (
              <div className="row vote-row" key={option.id}>
                <div className={window.innerWidth < 768 ? `vote-col-text col-6` : `vote-col-text col-3` }>
                  {(votedId.indexOf(option.id) !== -1) ? (<i className="fas fa-check-circle voted" />) : null}
                  {" " + option.text}
                </div>
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