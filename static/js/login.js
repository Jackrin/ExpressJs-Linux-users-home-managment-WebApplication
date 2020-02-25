var username;
$(document).ready(function() {
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    $.ajax({
        credentials: 'same-origin', // <-- includes cookies in the request
        headers: {
            'X-CSRF-Token': token // <-- is the csrf token as a header
        },
        type: 'POST',
        url: '/session',
        success: function (data) {
            if (data[1].response=="Valid session") {
                username = data[0].user
                $("#searchBar").val("")
                $('#registerFormDiv').css({"visibility": "hidden"})
                $("#backgroundDiv").slideUp("slow");
                interface(username);
            }
            else {
                return;
            }
        },
        error: function () {
            return;
        }
    });

    $("#username").focus(function(){
        $("#username").keydown(function(event) {
            if (event.key == "ArrowDown") {
                event.preventDefault();
                $("#username").focusout()
                $("#password").focus()
            }
        });
    }); 

    $("#password").focus(function(){
        $("#password").keydown(function(event) {
            if (event.key == "ArrowUp") {
                event.preventDefault();
                $("#password").focusout()
                $("#username").focus()
            }
        });
    });

    $("#registerUsername").focus(function(){
        $("#registerUsername").keydown(function(event) {
            if (event.key == "ArrowDown") {
                event.preventDefault();
                $("#registerUsername").focusout()
                $("#registerPassword").focus()
            }
        });
    }); 

    $("#registerPassword").focus(function(){
        $("#registerPassword").keydown(function(event) {
            if (event.key == "ArrowUp") {
                event.preventDefault();
                $("#registerPassword").focusout()
                $("#registerUsername").focus()
            }
        });
    });

    $("#registerPassword").focus(function(){
        $("#registerPassword").keydown(function(event) {
            if (event.key == "ArrowDown") {
                event.preventDefault();
                $("#registerPassword").focusout()
                $("#confirmPassword").focus()
            }
        });
    });

    $("#confirmPassword").focus(function(){
        $("#confirmPassword").keydown(function(event) {
            if (event.key == "ArrowUp") {
                event.preventDefault();
                $("#confirmPassword").focusout()
                $("#registerPassword").focus()
            }
        });
    });


   $("#loginForm").submit(function (e) {
        username = $("#username").val()
        var password = $("#password").val()
        var csrf = $("#csrf").val()
        e.preventDefault();
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

        $.ajax({
            credentials: 'same-origin', // <-- includes cookies in the request
            headers: {
                'X-CSRF-Token': token // <-- is the csrf token as a header
            },
            type: 'POST',
            url: '/login',
            data: {username: username, password: password},
            success: function (data) {
                if (data=="Authentication failed") {
                    $('#backgroundDiv').effect( "highlight", {color:"rgb(255,0,0)"}, 300 );
                }
                if (data=="Successful authentication") {
                    $('#backgroundDiv').effect("highlight", {color:"green"}, 300 );
                    $('#registerFormDiv').css({"visibility": "hidden"})
                    $("#backgroundDiv").slideUp("slow");
                    interface();
                    $("#password").val("")
                    $("#username").val("")
                }
            },
            error: function () {
                alert("Unable to reach server")
            }
        });
   });

   $("#switchRegister").click(function (e) {
        $("#loginFormDiv").animate({top: "120%"}, {duration: 300, queue: false});
        $("#registerFormDiv").animate({top: "50%"}, {duration: 300, queue: false});
        $("#switchRegister").animate({top: "-10%"}, {duration: 100, queue: false});
        $("#switchLogin").animate({right: "-6.6%"}, {duration: 300, queue: false});
   });

   $("#switchLogin").click(function (e) {
        $("#registerFormDiv").animate({top: "-20%"}, {duration: 300, queue: false});
        $("#loginFormDiv").animate({top: "0%"}, {duration: 300, queue: false});
        $("#switchLogin").animate({right: "-25%"}, {duration: 80, queue: false});
        $("#switchRegister").animate({top: "2%"}, {duration: 300, queue: false});
   });

   $("#registerForm").submit(function (e) {
        e.preventDefault();
        var registerUsername = $("#registerUsername").val().trim()
        var registerPassword = $("#registerPassword").val().trim()
        var confirmPassword = $("#confirmPassword").val().trim()
        registerUsername = (registerUsername).trim()
        var check = /^(^[a-z_]([a-z0-9_-]{0,31}))$/.test(registerUsername);
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        if (confirmPassword != registerPassword || registerPassword == "" || registerUsername == "" || check == false || registerPassword.length <= 8) {
            $('#backgroundDiv').effect( "highlight", {color:"rgb(255,0,0)"}, 300 );
            $("#registerPassword").val("")
            $("#confirmPassword").val("")        }
        else {
            $.ajax({
                credentials: 'same-origin', // <-- includes cookies in the request
                headers: {
                    'X-CSRF-Token': token // <-- is the csrf token as a header
                },
                type: 'POST',
                url: '/register',
                data: {username: registerUsername, password:registerPassword},
                success: function (data) {
                    if (data=="User already exists") {
                        $('#backgroundDiv').effect( "highlight", {color:"red"}, 300 );
                        alert("exists")
                    }
                    if (data=="Successful registration") {
                        $('#backgroundDiv').effect( "highlight", {color:"green"}, 300 );
                        $("#registerPassword").val("")
                        $("#confirmPassword").val("")
                        $("#registerUsername").val("")
                        alert("success") 
                    }
                    if (data=="Error") {
                        $('#backgroundDiv').effect( "highlight", {color:"red"}, 300 );
                        $("#registerPassword").val("")
                        $("#confirmPassword").val("")
                        $("#registerUsername").val("")
                        alert("error")
                    }
                },
                error: function () {
                    alert("Unable to reach server")
                }
            });
        }
   });

});