var home_loading_timeout = 2000
var timeout = 2000
var begin = new Date()
var isLoading = false
var pageCount
var bSearchChange = false

$(function(){
    requestData()
    // insertPost()

    $('body').on({
        click: function () {
            $(this).remove()
            begin = new Date()
            $("#load-list").show()
            isLoading = true
            $("#PageIndex").val(parseInt($("#PageIndex").val()) + 1)
            requestData()
        }
    }, "#btn-load")

    $('.list-top-left').on('click', 'a', function () {
        if (!$(this).hasClass("current")) {
            $(this).addClass("current").siblings().removeClass("current")
            $(".list-wrap ol").html("")
            $("#btn-load").remove()
            $("#no-more").remove()
            begin = new Date()
            $("#load-list").show()
            $("#SortBy").val($(this).attr("sort"))
            $("#PageIndex").val(1)
            requestData()
        }
    })

    $('#btnFilter').click(function(){
        if (!bSearchChange) return
        bSearchChange = false
        $(".list-wrap ol").html("")
        $("#btn-load").remove()
        $("#no-more").remove()
        begin = new Date()
        $("#load-list").show()
        $("#PageIndex").val(1)
        requestData()
    })
    $("#filterForm").change(function(){
        bSearchChange = true
    })
})

function requestData () {
    $.ajax({
        url: $('#filterForm')[0].action,
        type: $('#filterForm')[0].method,
        data: $('#filterForm').serialize(),
        success: function (res) {
            var end = new Date()
            pageCount = res.pageCount
            posts = res.posts
            if (end - begin > timeout) {
                addPage($("#PageIndex").val(), posts);
            } else {
                var delay = timeout - (end - begin)
                var t = setTimeout('addPage($("#PageIndex").val(), posts)', delay)
            }
        }
    })
}

// 自定义插入博文方式
function insertPost () {
    $.ajax({
        url: '/blog/selfpost',
        type: 'post',
        success: function (res) {
            // console.log(res)
        }
    })
}

function addPage(index, data) {
    $("#load-list").hide();
    if (data.length > 0) {
        $(".list-wrap ol").append("<li id=\"page" + index + "\"></li>");
        $.each(data, function (key, value) {
            value.Title = value.Title.replace(/<\S*>/, '')
            var itemHtml;
            if (value.Source == "1") {
                itemHtml = "<div uid=\""
                    + value.Alias
                    + "\" class=\"blog-item " + ($(".home-loading").length > 0 ? "" : "animated fadeIn") + "\">"
                    + "    <h4>"
                    + "        <a title=\""
                    + value.Title
                    + "\" target=\"_blank\" href=\""
                    + value.Url
                    + "\">"
                    + "<i class=\"fa fa-link\"></i> " + value.Title
                    + "        <\/a>"
                    + "    <\/h4>"
                    + "    <span title=\"文章分类\">"
                    + "        <i class=\"fa fa-map-signs\">"
                    + "        <\/i>"
                    + "        "
                    + "<a href=\"/blog/" + value.CategoryAlias + "\" target=\"_blank\">" + value.CateName + "</a>"
                    + "    <\/span>"
                    + "    <span title=\"发布时间\" class=\"margin-left-20\">"
                    + "        <i class=\"fa fa-clock-o\">"
                    + "        <\/i>"
                    + "        "
                    + value.PublishDate
                    + "    <\/span>"
                    + "    <a title=\""
                    + value.Host
                    + "\" target=\"_blank\" href=\""
                    + value.Url.substring(0, value.Url.indexOf("://") + 3) + value.Host
                    + "\" class=\"pull-right margin-left-20 hidden-xs\">"
                    + "        "
                    + "<i class=\"fa fa-globe\"></i> " + value.Host
                    + "    <\/a>"
                    + "    <div class=\"clearfix\">"
                    + "    <\/div>"
                    + "    <p>"
                    + "        "
                    + value.Summary
                    + "    <\/p>"
                    + "<\/div>"
                    + "<div class=\"hr-line-dashed\"></div>";
            } else {
                itemHtml = "<div class=\"blog-item " + ($(".home-loading").length > 0 ? "" : "animated fadeIn") + "\" uid=\"" + value.Alias + "\"><a class=\"preview-link\" title=\"点击预览\"></a><h4><a href=\"/blog/"
                    + value.CategoryAlias + "/" + value.Alias + "\" target=\"_blank\" title=\"" + value.Title + "\">" + value.Title + "</a></h4><span title=\"文章分类\"><i class=\"fa fa-map-signs\"></i> " + "<a href=\"/blog/" + value.CategoryAlias + "\" target=\"_blank\">" + value.CateName + "</a>" + "</span> <span class=\"margin-left-20\" title=\"发布时间\"><i class=\"fa fa-clock-o\"></i> " + value.PublishDate + "</span><div class=\"clearfix\"></div><p>" + value.Summary + "</p></div><div class=\"hr-line-dashed\"></div>";
            }
            $("#page" + index).append(itemHtml);
        });
        $("body").append("<script id=\"cy_cmt_num\" src=\"http://changyan.sohu.com/upload/plugins/plugins.list.count.js?clientId=cyrUoGjWj\"><\/script>");
        var percent = 100 / index;
        // $("#page-nav li").css("height", percent + "%");
        // $("[data-toggle='tooltip']:visible").tooltip({
        //     container: "body"
        // });
        if ($("#PageIndex").val() == pageCount) {
            if (pageCount != 1) {
                $(".list-wrap").append("<div id=\"no-more\" class=\"text-muted text-center\">没有更多数据<\/div>");
            }
        } else {
            $(".list-wrap").append("<button id=\"btn-load\" class=\"btn btn-white btn-block\">下一页</button>");
        }
    } else {
        $(".list-wrap ol").append("<li id=\"page" + index + "\"></li>");
        $("#page" + index).append("<div class=\"text-center text-muted\">暂无数据</div>");
    }
    isLoading = false;
    if ($(".home-loading").length > 0) {
        var home_loading_end = new Date();
        $("[data-toggle='tooltip']").tooltip("hide");
        if (home_loading_end - home_loading_begin > home_loading_timeout) {
            $(".home-loading").remove();
            document.body.style.overflow = "auto";
        } else {
            var home_loading_timespan = home_loading_timeout - (home_loading_end - home_loading_begin);
            setTimeout(function () {
                $(".home-loading").remove();
                document.body.style.overflow = "auto";
            }, home_loading_timespan);
        }
    }
}