import * as React from 'react';
import { Board } from '../../components'
import axios from 'axios';

export namespace BoardContainer {
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

export class BoardContainer extends React.Component<BoardContainer.Props, BoardContainer.State> {
  constructor(props: BoardContainer.Props) {
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
      const data = msg.data.data.boards;
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