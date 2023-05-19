import axios from 'axios';
import {getAccessToken} from '@/utils/token'
const service = axios.create({
  baseURL: 'http://localhost:28080/',
  timeout: 5000000,
});

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

service.interceptors.response.use(
  (response) => {
    // 对响应数据进行处理
    // ...
    
    return response.data;
  },
  (error) => {
    // 对响应错误做些什么
    console.log(error);
    return Promise.reject(error);
  }
);

export const saveExcelData = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/grade/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('保存 Excel 文件失败');
  }
};

export default service;
