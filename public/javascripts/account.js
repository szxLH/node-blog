$(function(){
    $("#txtUserName").focus()

    $("#btnLogin").on("click", function () {
        verify()
    })

    $(document).on({
        keypress: function (e) {
            if (e.which === 13 || e.which === 10) {
                verify()
            }
        }
    }, "#txtUserName, #txtPwd")
})

function verify() {
	var userName = $("#txtUserName").val()
    var password = $("#txtPwd").val()
    if (!userName) {
        $("#txtUserName").focus()
        return
    }
    if (!password) {
        $("#txtPwd").focus()
        return
    }
    password = md5(password)
    var $btn = $("#btnLogin")
    $btn.find("i").removeClass("fa-sign-in").addClass("fa-circle-o-notch fa-spin")
    $btn.attr("disabled", "disabled")
    $.ajax({
    	url: "/login",
    	type: "POST",
    	data: {
    		UserName: userName,
    		Password: password
    	},
    	success: function (data) {
    		if (data.valid === true) {
                window.location.href = data.returnTo
            } else {
                swal({
                    title: data.message,
                    type: "error",
                    showConfirmButton: false,
                    timer: 2000
                })
                $btn.find("i").removeClass("fa-circle-o-notch fa-spin").addClass("fa-sign-in")
                $btn.removeAttr("disabled")
            }
    	}
    })
}