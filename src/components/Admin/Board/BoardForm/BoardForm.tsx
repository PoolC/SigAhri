import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import './BoardForm.scss';
import history from '../../../../history/history';
import myGraphQLAxios from "../../../../utils/ApiRequest";

export enum BoardFormType {
  new = 'NEW',
  edit= 'EDIT'
}

namespace BoardForm {
  export interface Props extends RouteComponentProps<MatchParams> {
    type: BoardFormType
  }

  interface MatchParams {
    boardID?: string
  }

  export interface State {
    name: string,
    urlPath: string,
    readPermission: string,
    writePermission: string
  }
}

export class BoardForm extends React.Component<BoardForm.Props, BoardForm.State> {
  constructor(props: BoardForm.Props) {
    super(props);

    this.state = {
      name: "",
      urlPath: "",
      readPermission: "PUBLIC",
      writePermission: "MEMBER"
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextState: any = {};
    nextState[event.target.name] = event.target.value;

    this.setState(nextState);
  }

  handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextState: any = {};
    nextState[event.target.name] = event.target.value;

    this.setState(nextState);
  }

  handleSubmit() {
    const data = this.props.type === BoardFormType.new ?
      `mutation {
        createBoard(BoardInput: {
          name: "${this.state.name}",
          urlPath: "${this.state.urlPath}",
          readPermission: "${this.state.readPermission}",
          writePermission: "${this.state.writePermission}"
        }) {
          id
        }
      }`:
      `mutation {
        updateBoard(boardID: ${this.props.match.params.boardID}, BoardInput: {
          name: "${this.state.name}",
          urlPath: "${this.state.urlPath}",
          readPermission: "${this.state.readPermission}",
          writePermission: "${this.state.writePermission}"
        }) {
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

      alert("저장되었습니다.");
      history.push('/admin/boards');
    }).catch((msg) => {
      console.log("board API error");
      console.log(msg);
    });
  }

  componentDidMount() {
    if(this.props.type === BoardFormType.new)
      return;

    const data = `query {
      board(boardID: ${this.props.match.params.boardID}) {
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
      const data = msg.data;
      this.setState(data.data.board);
    }).catch((msg) => {
      console.log("me API error");
      console.log(msg);
    });
  }

  render() {
    return (
      <div>
        <div className="admin-board-list-head">
          <h2 className="admin-board-list-name">게시판 관리</h2>
        </div>
        <div className="admin-board-form-block">
          <h5>이름</h5>
          <input
            className="admin-board-form-input"
            name="name"
            value={this.state.name}
            onChange={this.handleInputChange}
            placeholder="공지사항"
          />
        </div>
        <div className="admin-board-form-block">
          <h5>URL</h5>
          <input
            className="admin-board-form-input"
            name="urlPath"
            value={this.state.urlPath}
            onChange={this.handleInputChange}
            placeholder="notice"
          />
        </div>
        <div className="admin-board-form-block">
          <h5>읽기 권한</h5>
          <select
            className="admin-board-form-input"
            name="readPermission"
            value={this.state.readPermission}
            onChange={this.handleSelectChange}>
            <option value="PUBLIC">PUBLIC</option>
            <option value="MEMBER">MEMBER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <div className="admin-board-form-block">
          <h5>쓰기 권한</h5>
          <select
            className="admin-board-form-input"
            name="writePermission"
            value={this.state.writePermission}
            onChange={this.handleSelectChange}>
            <option value="MEMBER">MEMBER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <div className="admin-board-form-button-container">
          <button className="btn btn-primary" onClick={() => this.handleSubmit()}>저장</button>
        </div>
      </div>
    )
  }
}