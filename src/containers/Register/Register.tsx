import * as React from 'react';
import { Authentication } from '../../components';

export namespace Register {
  export interface Props {

  }
}

export class Register extends React.Component<Register.Props> {
  public render(): JSX.Element {
    return (
      <Authentication mode={false} />
    );
  }
}
