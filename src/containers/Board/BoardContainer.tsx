import * as React from 'react';
import { Board } from '../../components'
import axios from 'axios';
import { RootState } from '../../reducers';
import { returntypeof } from 'react-redux-typescript';
import { compose } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state: RootState) => ({
  isLogin: state.authentication.status.isLogin,
  isAdmin: state.authentication.status.isAdmin,
  id: state.authentication.userInfo.id,
  writePermissions: state.authentication.userInfo.writePermissions,
  readPermissions: state.authentication.userInfo.readPermissions
});

const statePropTypes = returntypeof(mapStateToProps);

export namespace BoardContainer {
  export type Props = typeof statePropTypes & {
    type: string
  }

  export interface State {
    boards: Array<BoardInfo>,
    boardID: number,
    boardName: string
  }

  export interface BoardInfo {
    id: number,
    name: string,
    urlPath: string,
    readPermission: string,
    writePermission: boolean
  }

  export interface BoardResponseInfo {
    id: number,
    name: string,
    urlPath: string,
    readPermission: string,
    writePermission: string
  }
}

class BoardContainerClass extends React.Component<BoardContainer.Props, BoardContainer.State> {
  constructor(props: BoardContainer.Props) {
    super(props);

    if(window.location.pathname === "/board") {
      window.location.pathname = "/board/notice";
    }

    this.state = {
      boards: [],
      boardID: 0,
      boardName: ""
    };
    this.handleGetBoard = this.handleGetBoard.bind(this);
    this.setBoardID = this.setBoardID.bind(this);
  }

  setBoardID(id:number, name:string) {
    this.setState({
      boardID: id,
      boardName: name
    });
  }

  componentDidMount() {
    this.handleGetBoard();
  }

  componentDidUpdate(prevProps: BoardContainer.Props) {
    // redux를 통해 props가 업데이트 되는경우 새로 Mount하지 않고 update만 하게 되는데, 이때는 componentDidMount가 불리지 않으므로
    // 직접 props가 변경되었는지 확인하여 새로 게시판 목록을 불러온다.
    if(this.props.isLogin !== prevProps.isLogin || this.props.isAdmin !== prevProps.isAdmin) {
      this.handleGetBoard();
    }
  }

  hasReadPermissions : (targetPermissions: string) => boolean = (targetPermissions: string) => {
    const { readPermissions } = this.props;
    return permissions[readPermissions].indexOf(targetPermissions) >= 0
  };

  hasWritePermissions : (targetPermissions: string) => boolean = (targetPermissions: string) => {
    const { writePermissions } = this.props;
    return permissions[writePermissions].indexOf(targetPermissions) >= 0
  };

  handleGetBoard() {
    const headers: any = {
      'Content-Type': 'application/graphql'
    };

    if(localStorage.getItem('accessToken') !== null) {
      headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken');
    }

    axios({
      url: apiUrl,
      method: 'post',
      headers: headers,
      data: `query {
        boards {
          id,
          name,
          urlPath,
          readPermission,
          writePermission
        }
      }`
    }).then((msg) => {
      // TODO: data가 BoardInfo 의 Array인지 typing
      const { readPermissions, writePermissions } = this.props;
      const data = msg.data.data.boards.filter((board: BoardContainer.BoardResponseInfo) => {
        return this.hasReadPermissions(board.readPermission);  // 권한이 있을 경우
      });

      const boards = data.map((boardResponseInfo: BoardContainer.BoardResponseInfo) => ({
        ...boardResponseInfo,
        writePermission: this.hasWritePermissions(boardResponseInfo.writePermission)
      }));

      this.setState({
        boards: boards
      });
    }).catch((msg) => {
      console.log("boards API error");
      console.log(msg);
    });
  }

  render() {
    return (
      <Board boards={this.state.boards} boardID={this.state.boardID}
             boardName={this.state.boardName} setBoardID={this.setBoardID}
      />
    );
  }
}

export const BoardContainer = compose(connect(mapStateToProps))(BoardContainerClass);
