export default{

    dateFormat(time) {
        //将13位时间戳转换成时间格式 输出为2018-10-09
        let date = new Date(time);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        var myDate = ''
        myDate = year + '-' + month + '-' + day;
        return myDate
        },
}
