$(function () {
    var form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同';
            }
        },
        rePwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return '两次密码不一致';
            }

        }
    })
    var data = {
        oldPwd: $("[name=oldPwd]").val(),
        newPwd: $("[name=newPwd]").val()
    }
    // console.log($('.layui-form').serialize());
    // 在后台修改密码
    $(".layui-form").on("submit", function (e) {
        e.preventDefault()
        // console.log($(this).serialize());
        $.ajax({
            url: '/my/updatepwd',
            method: 'POST',
            data: data,
            // data: $('.layui-form').serialize(),
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg('更新密码失败')
                layui.layer.msg('更新密码成功')
                // 重置表单是原生js方法
                $('.layui-form')[0].reset()
            }
        })
    })
})