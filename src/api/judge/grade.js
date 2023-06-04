import request from '@/utils/request'

export default {

    /**
   * 发送查看所有学生GPA列表请求
   * @param {*} param 
   * @returns 
   */
    getList(param) {
    //   返回请求 
      return request({
        url: '/api/grade/selectListAll',
        method: 'post',
        data: param
      })
    },

     /**
   * 发送给学生GPA打分请求
   * @param {*} param 
   * @returns 
   */
    
      
}