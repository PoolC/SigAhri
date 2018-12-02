import * as React from 'react';
import './Upload.scss';
import axios from 'axios';
import history from '../../history/history';

export namespace Upload {
  export interface Props {

  }
}

export class Upload extends React.Component<Upload.Props> {
  constructor(props: Upload.Props) {
    super(props);

    this.handleUpload = this.handleUpload.bind(this);
    this.handleChangeFile = this.handleChangeFile.bind(this);
  }

  handleUpload() {
    let token = localStorage.getItem('accessToken');
    if (token === null) {
      alert("로그인 후 업로드 해주세요.");
      return;
    }

    token = 'Bearer ' + token;
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token
      }
    };

    const data = new FormData();
    const file = (document.getElementById('file') as HTMLInputElement).files[0];
    if(typeof file === 'undefined') {
      alert("파일을 선택해주세요.");
      return;
    }
    data.append('upload', file);

    const fileName = (document.getElementById('upload-file-name') as HTMLInputElement).value;
    if(fileName.length === 0) {
      alert("파일 이름을 입력해주세요");
      return;
    }
    if(file.size > 5 * 1024 * 1024) {
      alert("파일은 5MB 이하로 업로드 해주세요.");
      return;
    }

    axios.post(uploadUrl+'/'+fileName, data, config)
      .then((msg) => {
        history.push('/upload/success/' + fileName);
      }).catch((msg) => {
        console.log('upload Error');
        console.log(msg);
        alert("해당 파일명은 이미 사용중입니다.");
      })
  }


  handleChangeFile() {
    const filename = (document.getElementById('file') as HTMLInputElement).value.split('/').pop().split('\\').pop();
    (document.getElementById('upload-name') as HTMLInputElement).value = filename;
    (document.getElementById('upload-file-name') as HTMLInputElement).value = filename;
  }

  render() {
    return (
      <div className="upload-wrapper">
        <h1>파일 업로드</h1>
        <div className="upload-file-box">
          업로드 할 파일
          <br />
          <div className="upload-input-container">
            <input className="upload-name" id="upload-name" value="파일 선택" disabled={true} />

            <label htmlFor="file">파일 선택</label>
            <input type="file" name="file" id="file" onChange={() => this.handleChangeFile()}/>
          </div>
        </div>
        <div className="upload-file-box">
          파일명
          <br />
          <div className="upload-input-container">
            <input type="text" id="upload-file-name" className="upload-input" placeholder="서버에 업로드 될 파일 이름을 설정해주세요."/>
          </div>
        </div>
        <div className="upload-file-box">
          <button className="btn btn-primary btn-lg" onClick={() => this.handleUpload()}>업로드</button>
        </div>
      </div>
    );
  }
}