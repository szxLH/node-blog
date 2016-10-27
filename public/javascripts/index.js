var timeout = 1000
var begin = new Date()

$(function(){
    // requestData()

    insertPost()

})

function requestData () {
    $.ajax({
        url: $('#filterForm')[0].action,
        type: $('#filterForm')[0].method,
        data: $('#filterForm').serialize(),
        success: function (res) {
            var end = new Date()
            if (end - begin > timeout) {
                addPage($("#PageIndex").val(), res);
            } else {
                var delay = begin - (end - begin)
                setTimeout(function () {
                    addPage($("#PageIndex").val(), res);
                }, delay)
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
            console.log(res)
        }
    })
}

function addPage () {
    str = '<div uid="why-mobile-web-apps-are-slow" class="blog-item ">    '
    + '    <h4>'
    + '        <a title="" target="_blank" href=""><i class="fa fa-link"></i> </a>'
    + '    </h4>'
    + '    <span title=""><i class="fa fa-map-signs"></i><a href="/blog/other" target="_blank"></a></span>'
    + '    <span title="" class="margin-left-20"><i class="fa fa-clock-o"></i>2016-04-04</span>'
    + '    <a title="" target="_blank" href="" class="pull-right margin-left-20 hidden-xs"><i class="fa fa-globe"></i></a>'
    + '    <div class="clearfix"></div>'
    + '    <p></p>'
    + '</div>'
}