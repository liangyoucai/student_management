import request from '@/utils/request';

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
      data: param,
    });
  },

  /**
   * 发送GPA打分请求
   * @param {*} param
   * @returns
   */
  updateScore(param) {
    const { stuNum, score } = param; // 提取 stuNum 和 score 属性
    // 返回请求
    return request({
      url: `/api/grade/update-score`,
      method: 'post',
      data: { stuNum, score }, // 传递 stuNum 和 score 属性
    });
  },
};
