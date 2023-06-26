import request from '@/utils/request'

export default {
  /**
   * 获取验证码
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