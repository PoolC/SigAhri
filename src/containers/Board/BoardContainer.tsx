import * as React from 'react';
import { Board } from '../../components'
import axios from 'axios';
import { RootState } from '../../reducers';
import { returntypeof } from 'react-redux-typescript';
import { compose } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state: RootState) => ({
  isLogin: state.authentication.status.isLogin,
  isAdmin: state.authentication.status.isAdmin
});

const statePropTypes = returntypeof(mapStateToProps);

export namespace BoardContainer {
  export type Props = typeof statePropTypes & {}

  export interface State {
    boards: Array<BoardInfo>
  }

  export interface BoardInfo {
    id: number,
    name: string,
    urlPath: string,
    readPermission: string
  }
}

class BoardContainerClass extends React.Component<BoardContainer.Props, BoardContainer.State> {
  constructor(props: BoardContainer.Props) {
    super(props);

    this.state = {
      boards: []
    };
    this.handleGetBoard = this.handleGetBoard.bind(this);
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
          readPermission
        }
      }`
    }).then((msg) => {
      // TODO: data가 BoardInfo 의 Array인지 typing
      let data = msg.data.data.boards;
      if(!this.props.isAdmin) {
        data = data.filter((board: BoardContainer.BoardInfo) => {
          return (board.readPermission !== 'ADMIN');
        });
      }
      if(!this.props.isLogin) {
        data = data.filter((board: BoardContainer.BoardInfo) => {
          return (board.readPermission !== 'MEMBER');
        });
      }

      this.setState({
        boards: data
      })
    }).catch((msg) => {
      console.log("boards API error");
      console.log(msg);
    });
  }

  render() {
    return (
      <Board boards={this.state.boards}/>
    );
  }
}

export const BoardContainer = compose(connect(mapStateToProps))(BoardContainerClass);
