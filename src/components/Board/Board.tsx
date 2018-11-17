import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import {PostList, BoardContainer, PostContainer} from '../../containers';
import './Board.scss';

export namespace Board {
  export interface Props {
    boards: Array<BoardContainer.BoardInfo>
  }

  export interface State {
    boardID: number,
    boardName: string
  }
}

export class Board extends React.Component<Board.Props, Board.State> {
  constructor(props:any) {
    super(props);

    if(window.location.pathname === "/board") {
      window.location.pathname = "/board/notice";
    }

    this.state = {
      boardID: 1,  // default as notice
      boardName: "notice"
    };
  }

  setBoardID = (id:number, name:string, event:React.MouseEvent<HTMLAnchorElement>) => {
    this.setState({
      boardID: id,
      boardName: name
    })
  };

  render() {
    const { boards } = this.props;
    return (
      <div className="row">
        <div className="board-nav col-2">
          <div className="board-list list-group">
            {boards.map((board: BoardContainer.BoardInfo) => {
              return (
                <Link to={`/board/${board.urlPath}`}
                      className="board-item list-group-item list-group-item-action"
                      onClick={this.setBoardID.bind(this, board.id, board.name)}
                      key={board.id}>
                  {board.name}
                </Link>
              )
            })}
          </div>
        </div>
        <div className="board-content col">
          <Switch>
            <Route exact path="/board"
                   render={() => (<PostList type="notice" typeId={1} name="공지사항"/>)}
            />
            {boards.map((board: BoardContainer.BoardInfo) => {
              return (
                <Route exact path={`/board/${board.urlPath}`}
                       render={() => (
                         <PostList type={board.urlPath} typeId={board.id} name={board.name}/>
                       )}
                       onClick={this.setBoardID.bind(this, board.id, board.name)}
                       key={board.id}
                />
              )
            })}
            <Route exact path="/posts/:postId"
                   render={(props) => {
                     return <PostContainer {...props}
                                           boardID={this.state.boardID}
                                           boardName={this.state.boardName}
                     />
                   }}
            />
          </Switch>
        </div>
      </div>
    );
  }
};
