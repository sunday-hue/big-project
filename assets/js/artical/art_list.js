$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    // 定义补零函数
    function addZero(n) {
        return n < 10 ? "0" + n : n;
    }
    //定义美化时间过滤器
    template.defaults.imports.formDatea = function (data) {
        var dt = new Date(data);

        var y = addZero(dt.getFullYear());
        var m = addZero(dt.getMonth());
        var d = addZero(dt.getDate());

        var hh = addZero(dt.getHours());
        var mm = addZero(dt.getMinutes());
        var ss = addZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };
    var q = {
        pagenum: 1,  //默认刚打开页面是的页码值是1
        pagesize: 2,  //默认每个页面显示的数据是2条
        cate_id: '',  //默认文章的id是空
        state: ''  //默认文章的发布状态是空
    };

    initList();
    initSort();
    //初始化，渲染列表数据
    function initList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                // if (res.status !== 0) return layer.msg("获取图书列表失败")
                // layer.msg("获取图书列表成功")
                // 当获取成功的时候，就把数据渲染到页面
                var htmlStr = template("tpl-table", res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    //获取文章类别中的数据，把数据渲染到下拉列表的所有跟类上面
    //获取的是获取文章分类管理的数据
    function initSort() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                //可以获取成功
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg("获取信息失败")
                }
                //调用模板引擎，把数据渲染到下拉列表上
                var htmlSort = template("tpl-sort", res)
                // console.log(htmlSort);
                $("[name=cate_id]").html(htmlSort)
                //需要调用layui的render方法，才能在下拉列表上获取数据
                form.render();
            }
        })
    }
    //给表单筛选按钮绑定事件
    $("#form_select").on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val()
        var state = $("[name=state]").val()
        //把获取到的值重新给q赋值
        q.cate_id = cate_id;
        q.state = state;
        //重新渲染列表
        initList()
    })

    //分页列表渲染
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox', //ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize,  //每页显示的条数
            curr: q.pagenum, //打开页面时的默认页码
            //里面的数据必选顺序写，否则渲染到页面上的顺序就会变
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip',],
            limits: [2, 3, 5, 10],

            //触发jump的两个事件
            // 1:当调用laypage.render()的时候触发
            // 2:当点击页码（页码跳转）的时候会触发
            jump: function (obj, first) {
                //得到当前页
                // console.log(obj.curr);
                //把点击地当前页的值给q
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    initList()
                }
            }
        })
    }
    //删除按钮事件
    $('tbody').on("click", '#btnDel', function () {
        var id = $(this).attr("data-id")
        // console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除数据失败")
                    }

                    //do something


                    initList()
                }
            })
            layer.close(index);
        });

    })
})