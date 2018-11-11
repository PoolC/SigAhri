import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { PostList } from './PostList/PostList';
import './Board.scss';
import axios from 'axios';

export namespace Board {
  export interface Props {

  }

  export interface State {
    boards: Array<BoardInfo>
  }

  export interface BoardInfo {
    id: number,
    name: string,
    urlPath: string
  }
}

export class Board extends React.Component<Board.Props, Board.State> {
  constructor(props: Board.Props) {
    super(props);

    this.state = {
      boards: []
    };
  }
  componentDidMount() {
    axios({
      url: apiUrl,
      method: 'post',
      headers: {
        'Content-Type': 'application/graphql'
      },
      data: `query {
        boards {
          id,
          name,
          urlPath
        }
      }`
    }).then((msg) => {
      // TODO: data가 BoardInfo 의 Array인지 typing
        console.log(msg)
      const data = msg.data.data.boards;
      this.setState({
        boards: data
      })
    }).catch((msg) => {
    });
  }

  render() {
    return (
      <div>
        <div className="board-nav">
          <ul>
            {this.state.boards.map((board) => {
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
            {this.state.boards.map((board) => {
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
  }
};