import * as React from 'react';
import {Link} from "react-router-dom";

export namespace Seminar {
  export interface Props {

  }
}

export default class Seminar extends React.Component<Seminar.Props, null> {

  render() {
    return (
      <div className="row">
        <div className="board-nav col-sm-12 col-md-2">
          <div className="board-list list-group mobile-invisible">
            <Link to="/seminar"
                  className="board-item list-group-item list-group-item-action"
                  onClick={() => {console.log("asd");}}
                  key="123">
              2019년
            </Link>
          </div>
        </div>
        <div className="col-sm-12 col-md-10">
          <div className="card board-content">

          </div>
        </div>
      </div>
    )
  }
}