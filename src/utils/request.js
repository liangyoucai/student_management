import axios from 'axios';

const service = axios.create({
  baseURL: 'http://localhost:28080/api/',
  timeout: 5000000,
});

service.interceptors.request.use(
  // 函数
  (config) => {},
  (error) => {
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
