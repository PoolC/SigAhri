import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { PostList, BoardContainer } from '../../containers';
import './Board.scss';

export namespace Board {
  export interface Props {
    boards: Array<BoardContainer.BoardInfo>
  }
}

export const Board: React.SFC<Board.Props> = (props) => {
  return (
    <div className="row">
      <div className="board-nav col-2">
        <div className="board-list list-group">
          {props.boards.map((board: BoardContainer.BoardInfo) => {
            return (
              <Link to={`/board/${board.urlPath}`}
                    className="board-item list-group-item list-group-item-action"
                    key={board.id}>{board.name}
              </Link>
            )
          })}
        </div>
      </div>
      <div className="board-content col">
        <Switch>
          <Route exact path="/board"
                 render={()=>(<PostList type="notice" typeId={1}/>)}
          />
          {props.boards.map((board: BoardContainer.BoardInfo) => {
            return (
              <Route exact path={`/board/${board.urlPath}`}
                     render={()=>(
                       <div>
                         <h2 className="board-name">{board.name}</h2>
                         <PostList type={board.urlPath} typeId={board.id}/>
                       </div>
                     )}
                     key={board.id}
              />
            )
          })}
        </Switch>
      </div>
    </div>
  );
};
