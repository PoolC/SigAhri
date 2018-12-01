import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { PostListContainer, BoardContainer, PostContainer } from '../../containers';
import { PostForm } from '../';
import { PostFormType } from './PostForm/PostForm';
import './Board.scss';

export namespace Board {
  export type Props = {
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
      <div className="board-nav">
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
                 render={(props) => {
                   return <PostContainer {...props} />
                 }}
          />
          <Route exact path="/posts/new/:boardID"
                  render={(props) => {
                    return <PostForm {...props} type={PostFormType.new}
                    />
                  }}
          />
          <Route exact path="/posts/:postID/edit"
                 render={(props) => {
                   return <PostForm {...props} type={PostFormType.edit}
                   />
                 }}
          />
        </Switch>
      </div>
    </div>
  );
};

Board.defaultProps = {

};