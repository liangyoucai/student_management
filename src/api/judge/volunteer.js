import request from '@/utils/request';

export default {
  /**
   * 发送查看所有学生志愿服务时长列表请求
   * @param {*} param
   * @returns
   */
  getList(param) {
    //   返回请求
    return request({
      url: '/api/volunteer/selectListAll',
      method: 'post',
      data: param,
    });
  },

  /**
   * 发送志愿服务时长打分请求
   * @param {*} param
   * @returns
   */
  updateScore(param) {
    const { stuNum, score } = param; // 提取 stuNum 和 score 属性
    // 返回请求
    return request({
      url: `/api/volunteer/update-score`,
      method: 'post',
      data: { stuNum, score }, // 传递 stuNum 和 score 属性
    });
  },
};
