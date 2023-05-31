import request from '@/utils/request'

export default {
  /**
   * 1.上传excel
   * @param {*} param 
   * @returns 
   */
 import(param,importName) {
  //   返回请求 
    return request({
      url: `/api/${importName}/import`,
      method: 'post',
      data: param
    })
  },
  
}