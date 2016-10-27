$(function(){
    requestData()
})

function requestData () {
    $.ajax({
        url: $('#filterForm')[0].action,
        type: $('#filterForm')[0].method,
        data: $('#filterForm').serialize(),
        success: function (res) {
            console.log(res)
        }
    })
}