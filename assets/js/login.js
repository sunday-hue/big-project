$(function () {
    // 在登陆界面点击“去注册”就去注册界面
    $("#register_in").on('click', function () {
        $('.link_reg').show();
        $(".link_login").hide();
    })
    // 在注册界面点击“去登录”就去登陆界面
    $("#login_in").on('click', function () {
        $('.link_reg').hide();
        $(".link_login").show();
    })

    // 表单验证
    // verify
    var form = layui.form;
    var layer = layui.layer;
    //注意：中间没有=
    form.verify({
        pwds: [/^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // value能够获取调用改名的表单的内容
        // repwd是获取密码和确认密码框的内容一样，所以需要获取密码框里的值
        repwds: function (value) {
            //获取密码框里的输入值
            //通过表单属性获取name为pwd的密码框里的值
            var pwdnew = $(".link_reg [name = pwd]").val();
            if (pwdnew !== value) return '两次密码输入不一致'
        }
    })

    // 注册监听事件
    $('#form_reg').on("submit", function (e) {
        // 1:阻止默认事件
        e.preventDefault()
        // 2:发起Ajax的post请求
        var data = {
            username: $("#form_reg [name=uname]").val(), password: $("#form_reg [name=pwd]").val()
        };
        $.post("/api/reguser", data, function (res) {
            // console.log(res);
            if (res.status !== 0) { return layer.msg(res.message) }
            layer.msg('注册成功')
            //当注册成功的时候，模拟人的点击行为，自动跳转到登陆界面

            $('#login_in').click();
        })
    })

    $('#form_login').submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        var data = {
            username: $("#form_login [name=uname]").val(), password: $("#form_login [name=pwd]").val()
        };
        $.ajax({
            url: '/api/login', data,
            method: 'POST',
            // 快速获取表单中的数据

            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = "../../index.html"
            }
        })
    })
})