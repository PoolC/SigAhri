import * as React from 'react';
import { Link } from 'react-router-dom';
import './Board.scss';
import myGraphQLAxios from "../../../utils/ApiRequest";

export namespace Board {
  export interface Props {

  }
  export interface State {
    boards: Array<BoardInfo>
  }
  export interface BoardInfo {
    id: number,
    name: string,
    urlPath: string,
    readPermission: string,
    writePermission: string,
    isSubscribed: boolean
  }
}

export class Board extends React.Component<Board.Props, Board.State> {
  constructor(props: Board.Props) {
    super(props);

    this.state = {
      boards: []
    };

    this.handleBoardDelete = this.handleBoardDelete.bind(this);
  }

  handleBoardDelete(id: number, name: string) {
    if(confirm(`${name}을 삭제하시겠습니까?`)) {
      const data = `mutation {
        deleteBoard(boardID: ${id}) {
          id
        }
      }`;

      myGraphQLAxios(data, {
        authorization: true
      }).then((msg) => {
        const data = msg.data;
        if('errors' in data) {
          const message = data.errors[0].message;
          if(message === 'ERR401' || message === 'ERR403') {
            alert("권한이 없습니다.");
          } else {
            alert("알 수 없는 에러가 발생하였습니다. 담당자에게 문의 부탁드립니다.");
            console.log("me API error");
            console.log(msg);
          }
          return;
        }

        alert("삭제되었습니다.");
        this.handleLoadBoards();
      }).catch((msg) => {
        console.log("board delete API error");
        console.log(msg);
      });
    }
  }

  componentDidMount() {
    this.handleLoadBoards();
  }

  handleLoadBoards() {
    const data = `query {
      boards {
        id,
        name,
        urlPath,
        readPermission,
        writePermission,
        isSubscribed
      }
    }`;

    myGraphQLAxios(data, {
      authorization: true
    }).then((msg) => {
      const data = msg.data.data.boards;
      this.setState({
        boards: data
      });
    }).catch((msg) => {
      console.log("me API error");
      console.log(msg);
    });
  }

  render() {
    return (
      <div className="admin-board-container">
        <div className="admin-board-list-head">
          <h2 className="admin-board-list-name">게시판 관리</h2>
        </div>
        <table className="table admin-board-table">
          <thead>
          <tr>
            <th scope="col">이름</th>
            <th scope="col">URL</th>
            <th scope="col">읽기권한</th>
            <th scope="col">쓰기권한</th>
            <th scope="col">동작</th>
          </tr>
          </thead>
          <tbody>
          {this.state.boards.map((board: Board.BoardInfo) => (
            <tr key={board.id}>
              <td>{board.name}</td>
              <td>{board.urlPath}</td>
              <td>{board.readPermission}</td>
              <td>{board.writePermission}</td>
              <td>
                <Link to={"/admin/boards/edit/"+board.id}>편집</Link> /
                <Link to="#" onClick={()=>this.handleBoardDelete(board.id, board.name)}>삭제</Link>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        <Link to="/admin/boards/new">
          <button className="admin-board-add-button btn btn-primary">추가</button>
        </Link>
      </div>
    );
  }
}