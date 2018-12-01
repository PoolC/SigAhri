export interface AuthenticationModel {
  login: {
    status: string
  },
  status: {
    isLogin: boolean,
    isAdmin: boolean
  }
}

export interface AuthenticationActionModel {
  id: string,
  pw: string,
  readPermissions: string,
  writePermissions: string
}