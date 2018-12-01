export interface AuthenticationModel {
  login: {
    status: string
  },
  status: {
    isLogin: boolean,
    isAdmin: boolean
  },
  userInfo: {
    id: string,
    pw: string
  }
}