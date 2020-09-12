$.ajaxPrefilter(function (options) {
    //注意;每次使用$.get $.post $.ajax的时候  会先调用ajaxPrefilter这个函数
    //在这个函数里，可以拿到我们写的值
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url);
})