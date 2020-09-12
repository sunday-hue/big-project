$.ajaxPrefilter(function (options) {
    //注意;每次使用$.get $.post $.ajax的时候  会先调用ajaxPrefilter这个函数
    //在这个函数里，可以拿到我们写的值
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    // console.log(options.url);


    // 为所有有权限的请求加请求头headers   先判断是否是由先前的请求
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ''
        }
    };

    options.complete = function (res) {
        // console.log('执行了complate回调函数');
        // console.log(res);

        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1:强制清空token
            localStorage.removeItem("token")
            // 2:强制跳转到登陆界面
            location.href = '../../login.html'
        }
    }
})