import * as React from 'react';

export namespace Home {
  export interface Props {

  }
}

export const Home: React.SFC<Home.Props> = (props) => {
  return (
    <div>
      여기는 메인페이지
    </div>
  );
};