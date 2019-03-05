import * as React from 'react';
import './Upload.scss';
import axios from 'axios';
import history from '../../history/history';

export namespace Upload {
  export interface Props {

  }
}

export default class Upload extends React.Component<Upload.Props> {
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
    const extension = file.name.slice(file.name.length-3, file.name.length);
    if(extension !== 'png' && extension !== 'jpg' && extension !== 'pdf') {
      alert("png, jpg, pdf파일만 업로드 해주세요.");
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
    (document.getElementById('upload-file-name') as HTMLInputElement).value = filename;
  }

  render() {
    return (
      <div className="upload-container">
        <h1 className="upload-title">파일 업로드</h1>

        <div className="form-group">
          <label>업로드 할 파일</label>
          <div className="custom-file">
            <input className="custom-file-input" type="file" name="file" id="file" onChange={() => this.handleChangeFile()}/>
            <label className="custom-file-label" htmlFor="file">파일 선택</label>
            <small className="form-text text-muted">최대 5MB까지 업로드 가능합니다.</small>
          </div>
        </div>

        <div className="form-group">
          <label>파일명</label>
          <input type="text" id="upload-file-name" className="form-control" placeholder="서버에 업로드 될 파일 이름"/>
          <small className="form-text text-muted">이곳에 입력된 파일명으로 URL이 생성됩니다.</small>
        </div>

        <button className="btn btn-primary btn-block btn-lg" onClick={() => this.handleUpload()}>업로드</button>
      </div>
    );
  }
}
