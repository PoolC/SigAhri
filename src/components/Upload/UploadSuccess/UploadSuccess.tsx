import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import './UploadSuccess.scss';
import history from '../../../history/history';

export namespace UploadSuccess {
  export interface MatchParams {
    filename: string
  }

  export interface Props extends RouteComponentProps<MatchParams> {
  }
}

export const UploadSuccess: React.SFC<UploadSuccess.Props> = ((props) => {
  const fileName = props.match.params.filename;

  return (
    <div className="upload-success-container">
      <h1 className="upload-success-title">파일 업로드 완료</h1>
      <div className="upload-success-detail">
        <p>
          파일 업로드가 완료되었습니다. <br />
          게시판에 파일을 첨부하려는 경우, 아래와 같은 문법을 사용할 수 있습니다.
        </p>
        <div className="upload-success-description">
          <p>
            사진 파일의 경우: <br/>
            <code>![파일 설명]({uploadUrl}/{fileName})</code>
          </p>
          <p>
            첨부 파일의 경우: <br/>
            <code>&lt;{uploadUrl}/{fileName}&gt;</code>
          </p>
        </div>
      </div>
      <button className="btn btn-primary btn-block" onClick={() => {history.push('/upload')}}>다른 파일 업로드</button>
    </div>
  );
});
