import { constantRoutes } from '@/router';
import menu from '@/api/menu';
import Layout from '@/layout/index';

const permission = {
  state: {
    routes: [],
    addRoutes: [],
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    },
    RESET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = routes;
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise((resolve) => {
        // 向后端请求路由数据（菜单）
        menu.getMenuList().then((res) => {
          const rewriteRoutes = [];
          res.forEach((menu) => {
            const route = {
              path: '/',
              component: Layout,
              children: [
                {
                  path: menu.path,
                  name: menu.name,
                  component: () => import(`@/views/${menu.component}.vue`),
                },
              ],
            };
            rewriteRoutes.push(route);
          });
          // const rewriteRoutes = filterAsyncRouter(rdata, false, true);
          rewriteRoutes.push({ path: '*', redirect: '/404' });
          // console.log(rewriteRoutes);
          commit('SET_ROUTES', rewriteRoutes);
          resolve(rewriteRoutes);
        });
      });
    },
    // 删除路由
    DeleteRoutes({ commit }) {
      return new Promise((resolve) => {
        commit('RESET_ROUTES', []);
        resolve();
      });
    },
  },
};

export default permission;
