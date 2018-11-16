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
  if(window.location.pathname === "/board") {
    window.location.pathname = "/board/notice";
  }
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
          <Route path="/board/notice"
                 render={()=>(<PostList type="notice" typeId={1} typeName="공지사항"/>)}
          />
          {props.boards.map((board: BoardContainer.BoardInfo) => {
            console.log(board);
            return (
              <Route exact path={`/board/${board.urlPath}`}
                     render={()=>(
                       <div>
                         <PostList type={board.urlPath} typeId={board.id} typeName={board.name}/>
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
