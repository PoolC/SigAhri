import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { PostListContainer, BoardContainer, PostContainer } from '../../containers';
import { PostForm } from '../';
import './Board.scss';

export namespace Board {
  export interface Props {
    boards: Array<BoardContainer.BoardInfo>,
    boardID: number,
    boardName: string,
    setBoardID: (id: number, name: string) => void
  }
}

export const Board: React.SFC<Board.Props> = (props) => {
  const { boards } = props;
  return (
    <div className="row">
      <div className="board-nav col-2">
        <div className="board-list list-group">
          {boards.map((board: BoardContainer.BoardInfo) => {
            return (
              <Link to={`/board/${board.urlPath}`}
                    className="board-item list-group-item list-group-item-action"
                    onClick={() => {props.setBoardID(board.id, board.name);}}
                    key={board.id}>
                {board.name}
              </Link>
            )
          })}
        </div>
      </div>
      <div className="board-content col">
        <Switch>
          {boards.map((board: BoardContainer.BoardInfo) => {
            return (
              <Route exact path={`/board/${board.urlPath}`}
                     render={(props) => (
                       <PostListContainer {...props} type={board.urlPath} typeId={board.id} name={board.name}
                                          writePermission={board.writePermission}
                       />
                     )}
                     key={board.id}
              />
            )
          })}
          <Route exact path="/posts/:postId"
                 render={(prop) => (<PostContainer {...prop} boardID={props.boardID} boardName={props.boardName} />)}
          />
          <Route exact path="/posts/new/:boardID"
                 render={(props) => {
                   return <PostForm {...props}
                   />
                 }}
          />
        </Switch>
      </div>
    </div>
  );
};
