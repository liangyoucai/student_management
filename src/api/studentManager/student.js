import request from '@/utils/request'

export default {

    /**
   * 获取所有学生基本信息
   * @param {*} param 
   * @returns 
   */
    getList(param) {
    //   返回请求 
      return request({
        url: '/api/stu/selectall',
        method: 'post',
        data: param
      })
    },
}
