import request from '@/utils/request'

export default {
  resetPassword(param) {
    return request({
      url: 'user/profile/reset-password',
      method: 'post',
      data: param
    })
  },
  /**
   * 修改密码
   * @param {} param 
   * @returns 
   */
  changePassword(param) {
    return request({
      url: 'user/profile/change-password',
      method: 'post',
      data: param
    })
  },
  /**
   * 获取图片验证码
   * @returns 
   */
  getCaptcha() {
    return request({
      url: 'auth/captcha',
      method: 'get',
      data:null
    })
  },
  /**
   * 登录
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
   * 获取信息
   * @returns 
   */
  getInfo() {
    return request({
      url: 'user/profile/get',
      method: 'get',
      data:null
    })
  },
  
}