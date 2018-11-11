import * as React from 'react';

namespace PostList {
  export interface Props {
    type: string,
    typeInteger: number
  }
}

export class PostList extends React.Component<PostList.Props> {
  public render() {
    return (
      <div>
        뿌엥
        {this.props.type}
      </div>
    );
  }
}
