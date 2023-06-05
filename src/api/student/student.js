import request from '@/utils/request';

export default {
  /**
   * 提交学生表单
   */
  import(param, data) {
    //   返回请求
    return request({
      url: `/api/${param}/import`,
      method: 'post',
      data: data,
      headers: {
        'Content-Type': 'application/json;',
      },
    });
  },
};
