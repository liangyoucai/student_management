import request from '@/utils/request'

export default {

    /**
   * 获取当前登录学生志愿服务时长
   * @param {*} param 
   * @returns 
   */
    getList(param) {
    //   返回请求 
      return request({
        url: '/api/volunteer/get-volunteer-info',
        method: 'get',
        data: param
      })
    },
}