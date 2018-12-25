import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { PostListContainer, BoardContainer, PostContainer } from '../../containers';
import { PostForm } from '../';
import { PostFormType } from './PostForm/PostForm';
import './Board.scss';
import {NotFound} from "../NotFound/NotFound";

export namespace Board {
  export type Props = {
    boards: Array<BoardContainer.BoardInfo>,
    boardID: number,
    randomNumber: number, // 게시판목록을 통해 이동할 때, 현재 게시판으로 이동해도 re-mount 하기 위해 사용되는 변수
    setBoardID: (id: number) => void
    subscribeBoard: () => void,
    unsubscribeBoard: () => void,
    hasLogin: boolean
  }
}

export const Board: React.SFC<Board.Props> = (props) => {
  const { boards, randomNumber } = props;

  return (
    <div className="row">
      <div className="board-nav col-sm-12 col-md-2">
        <div className="board-list list-group mobile-invisible">
          {boards.map((board: BoardContainer.BoardInfo) => {
            return (
              <Link to={`/board/${board.urlPath}`}
                    className="board-item list-group-item list-group-item-action"
                    onClick={() => {props.setBoardID(board.id);}}
                    key={board.id}>
                {board.name}
              </Link>
            )
          })}
        </div>
      </div>
      <div className="col-sm-12 col-md-10">
        <div className="card board-content">
          <Switch>
            {boards.map((board: BoardContainer.BoardInfo, idx: number) => {
            const randomNumberSeq = randomNumber + idx;
              return (
                <Route exact path={`/board/${board.urlPath}`}
                     render={(_props) => (<PostListContainer {..._props} type={board.urlPath} typeId={board.id} name={board.name}
                                                  writePermission={board.writePermission}
                                                  isSubscribed={board.isSubscribed}
                                                  subscribeBoard={props.subscribeBoard}
                                                  unsubscribeBoard={props.unsubscribeBoard}
                                                  hasLogin={props.hasLogin}
                        />
                      )}
                     key={board.id}
              />
            )
          })}
          <Route exact path="/posts/:postId"
                 render={(props) => { return <PostContainer {...props} /> }}
          />
          <Route exact path="/posts/new/:boardID"
                 render={(props) => { return <PostForm {...props} type={PostFormType.new} /> }}
          />
          <Route exact path="/posts/:postID/edit"
                 render={(props) => { return <PostForm {...props} type={PostFormType.edit} /> }}
          />

            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </div>
  );
};