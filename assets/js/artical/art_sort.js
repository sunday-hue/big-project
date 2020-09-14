$(function () {
    var layer = layui.layer
    var form = layui.form
    initSortData();

    // 获取后台数据
    function initSortData() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmltpl = template("tpl-html", res);
                $("tbody").html(htmltpl)
            }
        })
    }
    //添加图书
    var indexadd = null;
    $('body').on("submit", '#add-form', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("添加图书信息失败")
                }
                // 渲染添加图书之后的页面
                initSortData()
                layer.msg("添加图书信息成功")
                // 根据索引值关闭增加图书的弹出框
                layer.close(indexadd)
            }
        })
    })
    //给添加类别按钮绑定事件
    $("#btnAddSort").on("click", function () {
        // alert("ok"layer.open({
        indexadd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#add-dialog").html()
        })
    })


    var indexedit = null;
    //使用代理事件，给修改类别按钮绑定事件
    $("body").on("click", '#btn-edit', function () {
        // alert("ok")
        indexedit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#edit-dialog").html()
        })
        var id = $(this).attr("data-id")
        // 获取对应的id值
        // console.log(id);
        // 当点击的时候，把原有的数据快速给edit-form

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            // url: '/my/article/updatecate',
            success: function (res) {
                // 把原有的数据快速给edit-form
                form.val("form-edit", res.data)
            }
        })
    })
    $('body').on("submit", '#edit-form', function (e) {
        e.preventDefault();
        //获取表单数据成功
        // console.log($('#edit-form').serialize());
        console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("修改图书信息失败")
                }
                // 渲染修改图书之后的页面
                initSortData()
                layer.msg("修改图书信息成功")
                // 根据索引值关闭增加图书的弹出框
                layer.close(indexedit)
            }
        })
    })
})
