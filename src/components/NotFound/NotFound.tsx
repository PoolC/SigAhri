import * as React from 'react';
import {Link, Redirect, RouteComponentProps} from 'react-router-dom';
import './NotFound.scss';

interface Props extends RouteComponentProps {

}

export const NotFound: React.SFC<Props> = (props) => {
  if(props.location.pathname != '/404') {
    return (<Redirect to="/404" />)
  }
  
  return (
    <div className="not-found">
      <i className="fas fa-exclamation-triangle" /> < br/>
      해당 페이지에 접근할 수 없습니다. <br />
      <Link to="/"><button className="btn">메인으로</button></Link>
    </div>
  );
};
