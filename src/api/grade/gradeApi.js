import axios from 'axios';

export function saveExcelData(data) {
  return axios.post('/api/grade/upload', data);
}
