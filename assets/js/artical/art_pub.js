$(function () {
    var layer = layui.layer
    var form = layui.form
    initSort()
    // 初始化富文本编辑器
    initEditor()
    function initSort() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取信息失败")
                }
                //把数据通过模板引擎的方式渲染到页面
                var htmlStr = template("tpl-sort", res);
                $("[name=cate_id]").html(htmlStr)
                // 通过form的render方法再次渲染
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 当点击选择封面的时候，触发上传文件事件
    $("#chooseImg").on("click", function () {
        $("#fileCover").click()
    })

    //为fileCover提交文件表单绑定chenge事件，把上传的图片渲染到页面上
    $("#fileCover").on("change", function (e) {
        // 获取提交的文件
        var file = e.target.files[0]
        if (file.length === 0) {
            return
        }
        // 把图片转成url地址
        var newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

        // 获取表单中的数据
        // 监听表单的提交事件
        var pub_state = '已发布';
        // 当点击存为草稿按钮时再把状态改为存为草稿
        $("#btnServe2").on("click", function () {
            pub_state = "草稿"
        })
        $("#form-sub").on("submit", function (e) {
            // 1:阻止表单默认跳转事件
            e.preventDefault()
            // 2:获取表单里的值
            var fd = new FormData($(this)[0])
            // 3:获取status的值
            // 把status的值添加到form表单中
            fd.append('state', pub_state);
            // fd.forEach(function (k, v) {
            //     console.log(k, v);
            // })
            // 4: 获取封面
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    // 把图片加到form表单中
                    fd.append('cover_img', blob)
                    publishArt(fd)
                })

            function publishArt(fd) { // 发起Ajax请求
                $.ajax({
                    method: 'POST',
                    url: '/my/article/add',
                    data: fd,
                    // 当传送的数据时formData的数据时，就需要传送下面两个方法，否则会失败
                    contentType: false,
                    processData: false,
                    success: function (res) {
                        if (res.status !== 0) return layer.msg("发表数据失败")
                        layer.msg("发表数据成功")
                        // 发表成功后，跳转到文章列表页
                        location.href = '../../../artical/art_list.html'
                    }
                })
            }

        })
    })
})