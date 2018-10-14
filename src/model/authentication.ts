export interface AuthenticationModel {
  login: {
    status: string
  },
  status: {
    isLogin: boolean,
  }
}

export interface AuthenticationActionModel {
  id: string,
  pw: string
}