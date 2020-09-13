$(function () {
    var layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 点击上传按钮模拟上传文件
    $("#btnChooseImg").on("click", function () {
        $('#file').click();
    })

    //监听上传文件的事件变化
    $("#file").on('change', function (e) {
        //    获取上传文件的长度
        var fileLists = e.target.files;
        if (fileLists.length === 0) {
            return layer.msg('请选择上传文件')
        }
        //1: 拿到用户选择的文件
        var file = e.target.files[0]
        // 2:根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

        $("#btnUpload").on("click", function () {
            //1:获取裁剪之后的图像
            var dataURL = $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 100,
                    height: 100
                })
                .toDataURL('image/png');
            // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // 把裁剪之后的图片上传到后台保存
            $.ajax({
                method: 'POST',
                url: '/my/update/avatar',
                data: { avatar: dataURL },
                success: function (res) {
                    if (res.status !== 0) return layer.msg("上传图片失败");
                    layer.msg("上传图片成功");
                    //把后他的数据头像渲染到页面
                    window.parent.getUserMsg();
                }

            })
        })

    })
})