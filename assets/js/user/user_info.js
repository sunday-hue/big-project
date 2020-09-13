$(function () {
    //获取表单属性
    var form = layui.form
    var layer = layui.layer
    // 给表单设置自定义的规则
    form.verify({
        nickname: function (value) {
            if (value > 6 || value <= 0) {
                return '用户昵称请在1-6位之间'
            }
        }
    })
    //获取用户信息
    getUserInfo();


    // 获取用户信息
    function getUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) return layer.msg("获取用户信息失败")
                // console.log(res);
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置用户信息
    $("#btnReset").on("click", function (e) {
        //先阻止默认重置事件
        e.preventDefault()
        // 重新回复之前的登陆时的信息
        getUserInfo()
    })
    // 当点击提交修改的时候，用户的头像和名字会发生变化
    $(".layui-form").submit(function (e) {
        //1;组织表单默认提交
        e.preventDefault()
        // 2:更新后台的数据信息
        // console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            //快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg("更新用户信息失败");
                layer.msg("更新用户信息成功");

                //调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserMsg();
            }
        })
    })
})