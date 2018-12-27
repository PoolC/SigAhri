export interface AuthenticationModel {
  login: {
    status: string
  },
  status: {
    isLogin: boolean,
    isAdmin: boolean,
    init: boolean
  },
  userInfo: {
    id: string,
    pw: string
  }
}