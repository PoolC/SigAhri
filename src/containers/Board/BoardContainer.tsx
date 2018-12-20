import * as React from 'react';
import { Board } from '../../components'
import axios from 'axios';
import { RootState } from '../../reducers';
import { returntypeof } from 'react-redux-typescript';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from "react-router";
import history from '../../history/history';
import * as queryString from 'query-string';

const mapStateToProps = (state: RootState) => ({
  isLogin: state.authentication.status.isLogin,
  isAdmin: state.authentication.status.isAdmin
});

const statePropTypes = returntypeof(mapStateToProps);

export namespace BoardContainer {
  export type Props = typeof statePropTypes & SubProps & {
    type: string
  }

  interface SubProps extends RouteComponentProps {}

  export interface State {
    boards: Array<BoardInfo>,
    boardID: number,
    userPermissions: string
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

    if(props.location.pathname === '/board') {
      history.push('/board/notice');
    } else if(props.location.pathname.indexOf('/article/view') != -1) {
      const id = queryString.parse(props.location.search).id;
      if(typeof id !== 'string') {
        history.push('/404');
      } else {
        history.push(`/posts/${id}`);
      }
    }

    this.state = {
      boards: null,
      boardID: 0,
      userPermissions: "PUBLIC"
    };
    this.handleGetBoard = this.handleGetBoard.bind(this);
    this.setBoardID = this.setBoardID.bind(this);
  }

  componentDidMount() {
    this.setUserPermissions();
    this.handleGetBoard();
  }

  componentDidUpdate(prevProps: BoardContainer.Props) {
    // redux를 통해 props가 업데이트 되는경우 새로 Mount하지 않고 update만 하게 되는데, 이때는 componentDidMount가 불리지 않으므로
    // 직접 props가 변경되었는지 확인하여 새로 게시판 목록을 불러온다.
    if(this.props.isLogin !== prevProps.isLogin || this.props.isAdmin !== prevProps.isAdmin) {
      this.setUserPermissions();
      this.handleGetBoard();
    }
  }

  setUserPermissions = () => {
    this.setState({
      userPermissions: this.props.isAdmin ? "ADMIN" : (this.props.isLogin ? "MEMBER" : "PUBLIC")
    })
  };

  setBoardID(id:number, name:string) {
    this.setState({
      boardID: id,
    });
  }

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
      const { userPermissions } = this.state;

      const data = msg.data.data.boards.filter((board: BoardContainer.BoardResponseInfo) => {
        return permissions[userPermissions].indexOf(board.readPermission) >= 0;
      });

      const boards = data.map((boardResponseInfo: BoardContainer.BoardResponseInfo) => ({
        ...boardResponseInfo,
        writePermission: permissions[userPermissions].indexOf(boardResponseInfo.writePermission) >= 0
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
    if(this.state.boards === null)
      return null;
    return (
      <Board boards={this.state.boards} boardID={this.state.boardID}
             setBoardID={this.setBoardID}
      />
    );
  }
}

export const BoardContainer = compose(connect(mapStateToProps))(BoardContainerClass);
