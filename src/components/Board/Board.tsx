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
    <div>
      <div className="board-nav">
        <ul>
          {props.boards.map((board: BoardContainer.BoardInfo) => {
            return (
              <li key={board.id}><Link to={`/board/${board.urlPath}`}>{board.name}</Link></li>
            )
          })}
        </ul>
      </div>
      <div className="board-content">
        <Switch>
          <Route exact path="/board"
                 render={()=>(<PostList type="notice" typeId={1}/>)}
          />
          {props.boards.map((board: BoardContainer.BoardInfo) => {
            return (
              <Route exact path={`/board/${board.urlPath}`}
                     render={()=>(<PostList type={board.urlPath} typeId={board.id}/>)}
                     key={board.id}
              />
            )
          })}
        </Switch>
      </div>
    </div>
  );
};
