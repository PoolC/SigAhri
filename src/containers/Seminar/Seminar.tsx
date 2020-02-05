import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import {RouteComponentProps} from "react-router";
import {compose} from 'redux';
import {connect} from 'react-redux';
import {RootState} from "../../reducers";
import {returntypeof} from "react-redux-typescript";
import myGraphQLAxios from "../../utils/ApiRequest";

const mapStateToProps = (state: RootState) => ({
  isLogin: state.authentication.status.isLogin,
  isAdmin: state.authentication.status.isAdmin,
  id: state.authentication.userInfo.id
});

const statePropTypes = returntypeof(mapStateToProps);

export namespace Seminar {
  export type Props = typeof statePropTypes & SubProps

  export type seminar = {
    id: number,
    name: string,
    createdAt: string,
    startedAt: string,
    endedAt: string,
    plan: number,
    leader: any,
  }

  interface SubProps extends RouteComponentProps {

  }

  export interface State {
    seminarList: {[year: number]: seminar[]};
    current: number;
  }

}

class SeminarClass extends React.Component<Seminar.Props, Seminar.State> {
  constructor(props : Seminar.Props) {
    super(props);

    const currentYear = (new Date()).getFullYear();
    let seminarList: any = {};
    for(let year = 2020; year <= currentYear; year++) {
      seminarList[year] = [];
    }

    this.state = {
      seminarList: seminarList,
      current: currentYear,
    }
  }

  componentDidMount() {
    this.getSeminarList();
  }

  getSeminarList = () => {
    const data = `
    query {
      seminar {
        ???
      }
    }
    `;

    /*
    myGraphQLAxios(data, {
      authorization: true,
    }).then((msg) => {

    }).catch((err) => {
      console.error("get error");
      console.error(err);
    });
    */

    const seminarList: {[year: number]: Seminar.seminar[]} = {
      2020: [
        {
          id: 0,
          name: '웹',
          createdAt: '2019-09-30T17:30:05.628698Z',
          startedAt: '2019-10-16T17:30:05.628698Z',
          endedAt: '2019-10-30T17:30:05.628698Z',
          plan: 1049,
          leader: '신석주',
        },
        {
          id: 1,
          name: 'asdf',
          createdAt: '2019-09-30T17:30:05.628698Z',
          startedAt: '2019-09-30T17:30:05.628698Z',
          endedAt: '2019-09-30T17:30:05.628698Z',
          plan: 1094,
          leader: '송재우',
        },
        {
          id: 2,
          name: 'asdf',
          createdAt: '2019-09-30T17:30:05.628698Z',
          startedAt: '2019-09-30T17:30:05.628698Z',
          endedAt: '2019-09-30T17:30:05.628698Z',
          plan: 1088,
          leader: '김지현',
        },
      ],
      2021: [
        {
          id: 3,
          name: '웹',
          createdAt: '2019-09-30T17:30:05.628698Z',
          startedAt: '2019-09-30T17:30:05.628698Z',
          endedAt: '2019-09-30T17:30:05.628698Z',
          plan: 1066,
          leader: '도회린',
        },
        {
          id: 4,
          name: '유니티',
          createdAt: '2019-09-30T17:30:05.628698Z',
          startedAt: '2019-09-30T17:30:05.628698Z',
          endedAt: '2019-09-30T17:30:05.628698Z',
          plan: 1063,
          leader: '양정일',
        },
      ],
    };

    this.setState({
      seminarList: seminarList,
    });
  }

  render() {
    const { seminarList } = this.state;
    const seminars = seminarList[this.state.current];

    return (
      <div className="row">
        <div className="board-nav col-sm-12 col-md-2">
          <div className="board-list list-group mobile-invisible">
            {Object.keys(seminarList).reverse().map((val, key, arr) => {
              return(
                <Link to={`/seminar?year=${val}`}
                      className="board-item list-group-item list-group-item-action"
                      onClick={() => { this.setState({ ...this.state, current: parseInt(val) }) }}
                      key={val}
                >
                  {val}년
                </Link>
              )
            })}
          </div>
        </div>
        <div className="col-sm-12 col-md-10">
          <div className="card board-content">
            <Switch>
              {seminars.map((seminar: Seminar.seminar) => {
                return (
                  <Route exact path={`/seminar/`}>

                  </Route>
                );
              })}
            </Switch>
            table or card view
          </div>
        </div>
      </div>
    )
  }
}

export const Seminar = compose(connect(mapStateToProps))(SeminarClass);
