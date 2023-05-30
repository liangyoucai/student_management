import request from '@/utils/request'

export default {

    /**
   * 发送已/未测评学生请求
   * @param {*} param 
   * @returns 
   */
 getList(param) {
    //   返回请求 
      return request({
        url: '/api/summary/selectList',
        method: 'post',
        data: param
      })
    },
}
