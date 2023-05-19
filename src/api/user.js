import request from '@/utils/request'

export default {
  /**
   * 1.登录
   * @param {*} param 
   * @returns 
   */
 login(param) {
  //   返回请求 
    return request({
      url: '/auth/login',
      method: 'post',
      data: param
    })
  },

  /**
   * 2.注册
   * @param {*} param 
   * @returns 
   */
  register(param) {
    return request({
      url: '/auth/register',
      method: 'post',
      data: param
    })
  },

  /**
   * 找回密码
   * @param {*} param 
   * @returns 
   */
  findPassword(param) {
    return request({
      url: '/auth/findPassword',
      method: 'post',
      data: param
    })
  },
  /**
   * 获取信息
   * @returns 
   */
  getInfo() {
    return request({
      url: 'user/profile/get',
      method: 'get'
    })
  },
  
  /**
   * 修改密码
   * @param {*} param 
   * @returns 
   */
  resetPassword(param){
    return request({
      url: 'user/profile/reset',
      method: 'post',
      data: param
    })
  },

  /**
   * 修改个人信息
   * @param {*} param 
   * @returns 
   */
  resetInfo(param){
    return request(
      {
        url: 'user/profile/modify',
        method: 'post',
        data: param
      }
    )
  }
  
}