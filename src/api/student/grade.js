import request from '@/utils/request'

export default {

    /**
   * 获取当前登录学生成绩
   * @param {*} param 
   * @returns 
   */
    getList(param) {
    //   返回请求 
      return request({
        url: '/api/grade/get-grade-info',
        method: 'get',
        data: param
      })
    },
}