var pacman = 0
var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
var pwd;
var back
var directoryName;
var sort = 0;
var username
var filter = ""
function interface () { 
	$(document).ready(function() {
		first = 1;
        path = "/home/"+username;
        directories();
        update();
    });
}
function directories () {
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    $.ajax({
        credentials: 'same-origin', // <-- includes cookies in the request
        headers: {
            'CSRF-Token': token // <-- is the csrf token as a header
        },
        type: 'POST',
        url: '/directories',
        data: {directoryName: directoryName, sort: sort, back: back, filter: filter},
        success: function (data) {
            if (data=="Invalid session") {
                location.reload(true);
            }
            else {
                first = 0;
                if (back == 1){back=0}
                pwd = data[1].currentPath
                $(".fileWrapper").remove()
                $(".pwd").remove()
                fileTypes(data);
                $("#explorer").append('<span class="pwd" id="pwd">'+pwd+'</span>')
            }
        },
        error: function () {
            alert("Unable to reach server")
        }
    });
    directoryName = ""
}

function update () {
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    setTimeout(function() {
        $.ajax({
            credentials: 'same-origin', // <-- includes cookies in the request
            headers: {
                'CSRF-Token': token // <-- is the csrf token as a header
            },
            type: 'POST',
            url: '/update',
            success: function (data) {
                if (data=="Invalid session") {
                    location.reload(true);
                }
                else if (data=="Changed") {
                    directories();
                    update();
                }
                else if (data=="Not changed") {
                    update();
                }
            },
            error: function () {
                alert("Unable to reach server")
            }
        });
    }, 5000);
}

function visualizer () {
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    $.ajax({
        credentials: 'same-origin', // <-- includes cookies in the request
        headers: {
            'CSRF-Token': token // <-- is the csrf token as a header
        },
        type: 'POST',
        url: '/visualizer',
        data: {path: path, file: fileClicked},
        success: function (data) {
            if (data=="Invalid session") {
                location.reload(true);
            }
            else if (data=="Not viewable") {
                alert("File not viewable")
            }
            else {
                $("#visualizerSpan").text(path+"/"+fileClicked)
                $("#visualizerText").text(data)
                $("#visualizer").slideDown(300)

            }
        },
        error: function () {
            alert("Unable to reach server")
        }
    });
}

$(document).ready(function() {
    $(document).on('dblclick', ".action1",function (event) {
        if ($(event).parent().parent().children(".fileName").children("#createFolder")) {
            event.stopPropagation();
        }
        directoryName = $(this).parent().parent().children(".fileName").text()
        filter = ""
        $("#searchBar").val("")
        directories();
    });

    $(document).on('dblclick', ".action2",function (event) {
        if ($(event).parent().parent().children(".fileName").children("#createFile")) {
            event.stopPropagation();
        }
        visualizer();
    });

    $(document).on('click', ".back",function (event) {
        back = 1
        directories();
    });

    $(document).on("click", function(event){
        $(document).on('click', "#rename",function (event) {
            event.stopImmediatePropagation();
            $(".contextMenu2").slideUp(150)
            $(".contextMenu").slideUp(150)
            $(this).parent().parent().children(".file").addClass("fileSelected")
            $(this).parent().parent().children(".fileName").addClass("fileSelected")
            $(this).parent().parent().children(".fileName").children().css({'overflow':"visible"});
            $(this).parent().parent().children(".fileName").children().css({'-webkit-line-clamp':"none"});
        });
        $(document).on('click', ".clickable",function (event) {
            event.stopPropagation();
            $(".clickable").parent().parent().children(".file").removeClass("fileSelected")
            $(".clickable").parent().parent().children(".fileName").removeClass("fileSelected")
            $(".clickable").parent().parent().children(".fileName").children().css({'overflow':"hidden"});
            $(".clickable").parent().parent().children(".fileName").children().css({'-webkit-line-clamp':"2"});
            $(this).parent().parent().children(".file").addClass("fileSelected")
            $(this).parent().parent().children(".fileName").addClass("fileSelected")
            $(this).parent().parent().children(".fileName").children().css({'overflow':"visible"});
            $(this).parent().parent().children(".fileName").children().css({'-webkit-line-clamp':"none"});
        });
        $(".clickable").parent().parent().children(".file").removeClass("fileSelected")
        $(".clickable").parent().parent().children(".fileName").removeClass("fileSelected")
        $(".clickable").parent().parent().children(".fileName").children().css({'overflow':"hidden"});  
        $(".clickable").parent().parent().children(".fileName").children().css({'-webkit-line-clamp':"2"});
    });

    $("#sort").on("click", function(event){
        if ($("#sortMenu").is(':hidden')) {
            $("#sortMenu").slideDown(300)
            event.stopPropagation()
        }
        $(document).on("click", "#sortMenu",function(event){
            event.stopImmediatePropagation()
        });
        $(document).on("click", function(event){
            event.stopPropagation()
            $("#sortMenu").slideUp(300)
        });
    });

    $(".sortCheck").on("click", function(event){
        if ($('#sort0:checked').length > 0) {
            sort = 0
            directories();
        }
        else if ($('#sort1:checked').length > 0) {
            sort = 1
            directories();
        }
        else if ($('#sort2:checked').length > 0) {
            sort = 2
            directories();
        }
        else if ($('#sort3:checked').length > 0) {
            sort = 3
            directories();
        }
        else if ($('#sort4:checked').length > 0) {
            sort = 4
            directories();
        }
    })

    $("#visualizerClose").on("click", function(event){
        $(this).parent().slideUp(300)
        $(this).siblings("#visualizerText").text("")
    })

    $("#searchBar").on("input", function(event) {
        var check = /[^\w.-]/gi.test($("#searchBar").val())
        if (check == true){
            filter = ""
        }
        else {
            filter = $("#searchBar").val()
        }
        directories();
    });

    $("#logout").on("click", function(event){
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        $.ajax({
            credentials: 'same-origin', // <-- includes cookies in the request
            headers: {
                'CSRF-Token': token // <-- is the csrf token as a header
            },
            type: 'POST',
            url: '/logout',
            success: function (data) {
                if (data=="success") {
                    $(".fileWrapper").remove()
                    $(".pwd").remove()
                    $('#registerFormDiv').css({"visibility": "visible"})
                    $("#backgroundDiv").slideDown("slow");
                    location.reload(true);
                }
                else {
                    alert("Error")
                    location.reload(true);
                }
            },
            error: function () {
                alert("Unable to reach server")
                location.reload(true);
            }
        });
    })

});

