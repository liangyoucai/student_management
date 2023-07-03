import request from '@/utils/request'

export default {

    /**
   * 获取当前登录学生志愿服务时长
   */
    getList() {
    //   返回请求 
      return request({
        url: '/api/volunteer/get-volunteer-info',
        method: 'get',
      })
    },
}