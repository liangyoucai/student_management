import request from '@/utils/request'

export default {

    /**
   * 发送已/未测评学生请求
   * @param {*} param 
   * @returns 
   */
    getList(param) { 
      return request({
        url: '/api/summary/selectList',
        method: 'post',
        data: param
      })
    },
    
    /**
     * 删除所选学生测评信息
     * @param {*} param 
     * @returns 
     */
    deleteSummary(param){
      return request({
        url: '/api/summary/deleteSummary',
        method: 'post',
        data: param
      })
    }
}
