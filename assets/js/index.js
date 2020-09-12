$(function () {
    getUserMsg()
    var layer = layui.layer
    // 退出按钮的功能
    $("#btnLoginOut").on('click', function () {
        layer.confirm('确认退出登录', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1: 清空本地存储的token
            localStorage.removeItem("token")
            // 2:跳转到登陆界面
            location.href = '../../login.html'
            layer.close(index);
        });
    })
})
// 从后台数据库获取用户名信息
function getUserMsg() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 获取用户登陆成功的产生的token值
        // headers: {
        //     Authorization: localStorage.getItem("token") || ''
        // },
        success: function (res) {
            // console.log(res.data);
            if (res.status !== 0) return layui.layer.msg("获取用户信息失败")
            //调用渲染用户头像的函数
            renderAvatar(res.data)
        },
        // 不管是否成功执行上面的代码，都会执行的函数
        // complete: function (res) {
        //     console.log('执行了complate回调函数');
        //     console.log(res);

        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1:强制清空token
        //         localStorage.removeItem("token")
        //         // 2:强制跳转到登陆界面
        //         location.href = '../../login.html'
        //     }
        // }
    })
}

//渲染用户头信息的函数
function renderAvatar(user) {
    // 3.1：获取用户名
    var name = user.nickname || user.username
    $("#welcome").html('welcome &nbsp;' + name)
    // 3.1:渲染图片头像
    // 如果有图片信息，首先渲染图片信息，如没有就渲染文字信息
    if (user.user_pic) {
        $(".layui-nav-img").attr('src', user.user_pic).show()
        $(".text-avatar").hide()
    } else {
        var first = name[0].toUpperCase()
        $(".layui-nav-img").hide();
        $(".text-avatar").html(first).show()
    }
}