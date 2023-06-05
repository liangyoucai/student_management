import request from '@/utils/request';

export default {
    /**
     * 评委查看所有summary列表
     */
    getSummary() {
        return request({
            url: 'api/summary/selectAllList',
            method: 'get',
        });
    },

    /**
     * 评委查看所有学生填写的${param}表
     */
    getSheet(param) {
        return request({
            url: `api/${param}/getAllList`,
            method: 'get',
        });
    },

    /**
     * 评委上传成绩
     */
    importScore(data) {
        return request({
            url: '/api/summary/import',
            method: 'post',
            data: data,
            headers: {
                'Content-Type': 'application/json;',
            },
        });
    },
};