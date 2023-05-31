import axios from 'axios';
import {getAccessToken} from '@/utils/token'
import { Message } from 'element-ui';
const service = axios.create({
  baseURL: 'http://localhost:18080/',
  timeout: 5000000,
});

// 添加请求拦截器
service.interceptors.request.use(
    // 函数
  config => {
    // 在请求发送之前对请求数据进行处理
    // 携带token
    if (getAccessToken() ) {
      config.headers['Authorization'] = 'Bearer ' + getAccessToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
    
  },
  error => {
    // 对请求错误做些什么
    console.log(error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么 
    if (error.response) {
      // 服务器返回了错误状态码
      Message.error({
        message: `Error ${error.response.status}: ${error.response.data.message || error.message}`,
        duration: 3000,
      });
    } else {
      // 其他错误，如网络错误等
      let message = error.message
      if (!message) {
        message = '系统发生未知错误'
      }else if (message === 'Network Error') {
        message = '后端接口连接异常'
      } else if (message.includes('timeout')) {
        message = '系统接口请求超时'
      } else if (message.includes('Request failed with status code')) {
        message = '系统接口' + message.substring(message.length - 3) + '异常'
      }
      Message.error({ 
        message: `Error: ${message}`,
        duration: 3000,
      });
    }

    // 返回一个被拒绝的 Promise，以便在调用方进行错误处理
    return Promise.reject(error);
  }
);


export default service;
