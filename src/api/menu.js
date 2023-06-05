import request from '@/utils/request';

export default {
  /**
   * 获得菜单
   * @returns
   */
  getMenuList() {
    //   返回请求
    return request({
      url: '/api/menu',
      method: 'get',
    });
  },
};
