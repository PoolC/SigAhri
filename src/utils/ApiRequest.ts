import axios from 'axios';

const myGraphQLAxios = (data: string, options?: {[key:string]: any}) => {
  /******************************
   *
   * Description: api for GraphQL
   * Parameters:
   *     - data: `mutation {
   *       createAccessToken(LoginInput: {loginID: "user_id", password: "user_pw"}) {
   *         key
   *       }
   *     }`
   *     - options: {
   *       authorization: true | false
   *     }
   * Return: (AxiosPromise)
   *
   */
  const headers: {[key:string]: string} = {
    'Content-Type': 'application/graphql'
  };

  if(options && options.authorization) {
    const token = localStorage.getItem('accessToken');
    headers.Authorization = `Bearer ${token}`
  }

  return axios({
    url: apiUrl,
    method: 'post',
    headers: headers,
    data: data
  })
};

export default myGraphQLAxios;