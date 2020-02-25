var element
var fileClicked;
var fileType
$(document).ready(function(){

    $(".explorer").on("click", ".clickable", function(event){
        fileClicked = $(this).parent().parent().children(".fileName").text()
        fileType = $(this).parent().parent().children(".file").attr("value")
        element = $(this)
    })

    $(".explorer").on("contextmenu", ".clickable", function(event) {
        fileClicked = $(this).parent().parent().children(".fileName").text()
        fileType = $(this).parent().parent().children(".file").attr("value")
        element = $(this)
        $(".clickable").parent().parent().css({"filter":""})
        $(".clickable").parent().parent().children(".fileName").children().css({'overflow':"hidden"});

        event.preventDefault();
        event.stopImmediatePropagation()
        if( $('#contextMenu2').css('display') == 'block' ) {
            $(".contextMenu2").hide(50).
        css({
            top: event.pageY + "px",
            left: event.pageX+1 + "px"
        }).finish().slideDown(200);
        $(".confirmDelete").text("Delete")
        $(".confirmDelete").css({"color":""})
        $(".confirmDelete").addClass("delete")
        $(".confirmDelete").removeClass("confirmDelete")
        } 
        else{
            $(".contextMenu").hide(50)
            $(".contextMenu2").finish().slideDown(200).
        css({
            top: event.pageY + "px",
            left: event.pageX+1 + "px"
        });
        $(".confirmDelete").text("Delete")
        $(".confirmDelete").css({"color":""})
        $(".confirmDelete").addClass("delete")
        $(".confirmDelete").removeClass("confirmDelete")
        }
    });

    $(document).on("contextmenu", function(event) {
        event.preventDefault();
        $(".clickable").parent().parent().css({"filter":""})
        $(".clickable").parent().parent().children(".fileName").children().css({'overflow':"hidden"});
        if( $('#contextMenu').css('display') == 'block' ) {
            $(".contextMenu").hide(50).
        css({
            top: event.pageY + "px",
            left: event.pageX+1 + "px"
        }).finish().slideDown(200);
        $(".confirmDelete").text("Delete")
        $(".confirmDelete").css({"color":""})
        $(".confirmDelete").addClass("delete")
        $(".confirmDelete").removeClass("confirmDelete")
        } 
        else{
            $(".contextMenu2").hide(50)
            $(".contextMenu").finish().slideDown(200).

        css({
            top: event.pageY + "px",
            left: event.pageX+1 + "px"
        });
        $(".confirmDelete").text("Delete")
        $(".confirmDelete").css({"color":""})
        $(".confirmDelete").addClass("delete")
        $(".confirmDelete").removeClass("confirmDelete")
        }
    });

    $(document).on("click", function(event){
        $(".contextMenu2").slideUp(150)
        $(".contextMenu").slideUp(150)
    });



    $(document).on('click', "#rename",function (event) {
        element.parent().parent().children(".fileName").children().attr('contentEditable', true);
        element.parent().parent().children(".fileName").children().css({"overflow":"visible"});
        element.parent().parent().children(".fileName").children().css({'-webkit-line-clamp':"none"});
        element.parent().parent().children(".fileName").children().css({"color":"#e95420"})
        element.parent().parent().children(".fileName").children().focus()
        element.parent().parent().children(".fileName").children().select()
        var newName
        var attr = element.parent().parent().children(".fileName").children().attr('contentEditable');
        var w = 1
        $(document).on("mousedown", function(event){
            if ( $(event.target).closest(element.parent().parent().children(".fileName").children()).length === 0) {
                rename();
            }   
        });
        $(".fileName").keydown(function(event) {
            if (event.key == "Enter") {
                event.preventDefault();
                rename();
            }
        });
        function rename () {
            var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            if (w == 1) {
                w = 0;
                element.parent().parent().children(".fileName").children().attr('contentEditable', false);
                element.parent().parent().children(".fileName").children().css({'overflow':"hidden"});
                element.parent().parent().children(".fileName").children().css({'-webkit-line-clamp':"2"});
                element.parent().parent().children(".fileName").children().css({"color":""})
                newName = (element.parent().parent().children(".fileName").text()).trim()
                var check = /^(^[a-zA-Z0-9_]([a-zA-Z0-9_.]{0,99}))$/.test(newName);
                if (newName == fileClicked) {
                    element.parent().parent().children(".fileName").children().text(fileClicked)
                }
                else if (check == false) {
                    element.parent().parent().css({"color":""}).effect( "highlight", {color:"rgb(255,0,0)"}, 300 );
                    element.parent().parent().children(".fileName").children().text(fileClicked)
                }
                else {
                    $.ajax({
                        credentials: 'same-origin', // <-- includes cookies in the request
                        headers: {
                            'CSRF-Token': token // <-- is the csrf token as a header
                        },
                        type: 'POST',
                        url: '/rename',
                        data: {pwd: pwd, file: fileClicked, newName: newName},
                        success: function (data) {
                            if (data=="Invalid session") {
                                location.reload(true);
                            }
                            else if (data=="Renamed") {
                                directories();
                            }
                            else if (data=="Already exists") {
                                element.parent().parent().css({"color":""}).effect( "highlight", {color:"rgb(255,0,0)"}, 300 );
                                element.parent().parent().children(".fileName").children().text(fileClicked)
                            }
                        },
                        error: function () {
                            alert("Unable to reach server")
                        }
                    });
                }
            }
        }
    }); 

    $(document).on('click', "#delete",function (event) {
        event.stopPropagation()
        $(this).text("Confirm?")
        $(this).removeClass("delete")
        $(this).addClass("confirmDelete")
        $(this).css({"color":"#E60000"})
    }); 

    var overlaps = (function () {
        function getPositions( elem ) {
            var pos, width, height;
            pos = $( elem ).position();
            width = $( elem ).width();
            height = $( elem ).height();
            return [ [ pos.left , pos.left + width ], [ pos.top, pos.top + height ] ];
        }

        function comparePositions( p1, p2 ) {
            var r1, r2;
            r1 = p1[0] < p2[0] ? p1 : p2;
            r2 = p1[0] < p2[0] ? p2 : p1;
            return r1[1] > r2[0] || r1[0] === r2[0];
        }
        return function ( a, b, c) {
            var pos1 = getPositions(a),
                pos2 = getPositions(b);
                pos3 = c
            pos2[0][0] = pos2[0][0] + pos3
            pos2[0][1] = pos2[0][1] + pos3
            if(comparePositions( pos1[0], pos2[0]) && comparePositions( pos1[1], pos2[1] )){
                console.log(pos1, pos2)
                return true;
            }
        };
    })();

    $(document).on('click', ".confirmDelete",function (event) {
        if (pacman == 1) {
            var animation = true
            var position = (element.parent().parent().children(".file")).position();
            var correction = $("#leftBar").width()
            $("body").append('<div class="pacman"><div class="pacman-top"></div><div class="pacman-bottom"></div>')
            $(".pacman").css({"top": position.top})
            $(".contextMenu2").slideUp(150)
            $(".contextMenu").slideUp(150)
            $(".pacman").animate({left: "101%"}, {easing: "linear", duration: 6000, step: function(){
                if (overlaps(".pacman", element.parent().parent().children(".file"), correction)) {
                    element.parent().parent().remove()
                    animation = false
                    deleteFile()
                }
            }}, function(){
                $(".pacman").remove()
            })
            $(this).text("Delete")
            $(this).removeClass("confirmDelete")
            $(this).addClass("delete")
            $(this).css({"color":""})
            $(document).on("click", function(event){
                $(".contextMenu2").slideUp(150)
                $(".contextMenu").slideUp(150)
                $(".confirmDelete").text("Delete")
                $(".confirmDelete").css({"color":""})
                $(".confirmDelete").addClass("delete")
                $(".confirmDelete").removeClass("confirmDelete")
            });
        }
        else {
            element.parent().parent().remove()
            $(".contextMenu2").slideUp(150)
            $(".contextMenu").slideUp(150)
            $(this).text("Delete")
            $(this).removeClass("confirmDelete")
            $(this).addClass("delete")
            $(this).css({"color":""})
            deleteFile()
            $(document).on("click", function(event){
            $(".contextMenu2").slideUp(150)
            $(".contextMenu").slideUp(150)
            $(".confirmDelete").text("Delete")
            $(".confirmDelete").css({"color":""})
            $(".confirmDelete").addClass("delete")
            $(".confirmDelete").removeClass("confirmDelete")
            });
        }
        function deleteFile() {
            $.ajax({
                credentials: 'same-origin', // <-- includes cookies in the request
                headers: {
                    'CSRF-Token': token // <-- is the csrf token as a header
                },
                type: 'POST',
                url: '/delete',
                data: {file: fileClicked, fileType: fileType},
                success: function (data) {
                    if (data=="Invalid session") {
                        location.reload(true);
                    }
                    else if (data=="Removed") {
                        directories();
                    }
                    if (data=="Error") {
                        alert("Error")
                    }
                },
                error: function () {
                    alert("Unable to reach server")
                }
            });
        }
    });
    
    $(document).on('click', ".info",function (event) {
        $(".contextMenu2").slideUp(150)
        $(".contextMenu").slideUp(150)
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        $.ajax({
            credentials: 'same-origin', // <-- includes cookies in the request
            headers: {
                'CSRF-Token': token // <-- is the csrf token as a header
            },
            type: 'POST',
            url: '/info',
            data: {pwd: pwd, file: fileClicked, fileType: fileType},
            success: function (data) {
                if (data=="Invalid session") {
                    location.reload(true);
                }
                else if (data=="Success") {
                    alert(1)
                }
                else if (data=="Error") {
                    alert("Error")
                }
            },
            error: function () {
                alert("Unable to reach server")
            }
        });
    });

    $(document).on('click', "#download",function (event) {
        $(".contextMenu2").slideUp(150)
        $(".contextMenu").slideUp(150)
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        $.ajax({
            credentials: 'same-origin', // <-- includes cookies in the request
            headers: {
                'CSRF-Token': token // <-- is the csrf token as a header
            },
            type: "POST",
            url: "/download",
            data: {file: fileClicked, fileType: fileType},
            xhrFields: {
                responseType : 'blob'
            },
            success: function (res) {
                if (res=="Invalid session") {
                    location.reload(true);
                }
                else {
                    const a = document.createElement('a');
                    a.style = 'display: none';
                    document.body.appendChild(a);
                    const blob = new Blob([res]);
                    const url = URL.createObjectURL(blob);
                    a.href = url;
                    a.download = fileClicked;
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                }
            },
            error: function (err) {
                alert("Unable to reach server")
            }
        });
    });

    $(document).on('click', ".newFolder",function (event) {
        $("#explorer").append('<div class="fileWrapper"><div class="file"><img src="folder.png" class="clickable"></div><div class="fileName"><span disabled="false" class="clickable" id="createFolder" contenteditable="true">New_folder</span></div></div>')
        $("#createFolder").css({"overflow":"visible"});
        $("#createFolder").css({"color":"#e95420"})
        $("#createFolder").focus()
        $("#createFolder").select()
        var w = 1
        $(document).on("mousedown", function(event){
            if ( $(event.target).closest($(event.target).parent().parent().children(".fileName").children("#createFolder")).length === 0) {
                newFolder();
            }   
        });
        $("#createFolder").keydown(function(event) {
            if (event.key == "Enter") {
                event.preventDefault();
                newFolder();
            }
        });
        function newFolder() {
            var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            if (w == 1) {
                w = 0;
                var folderName = $("#createFolder").text().trim()
                var check = /^(^[a-zA-Z0-9_]([a-zA-Z0-9_.]{0,99}))$/.test(folderName);
                if (check == false || folderName == "") {
                    $("#createFolder").parent().parent().remove()
                    alert("Invalid characters used.\nYou may only use these characters\n[a-z], [0-9], [ _ ], [ - ], [ . ]")
                    directories();
                }
                else {
                    $.ajax({
                        credentials: 'same-origin', // <-- includes cookies in the request
                        headers: {
                            'CSRF-Token': token // <-- is the csrf token as a header
                        },
                        type: 'POST',
                        url: '/newfolder',
                        data: {folderName: folderName},
                        success: function (data) {
                            if (data=="Invalid session") {
                                location.reload(true);
                            }
                            else if (data=="Folder created") {
                                directories();
                            }
                            else if (data=="Already exists") {
                               $("#createFolder").parent().parent().remove()
                               alert("Folder already exists")
                                directories(); 
                            }
                            else {
                                $("#createFolder").parent().parent().remove()
                                alert("An error occured while creating the folder.\nIf the error persist, please contact the administrator.")
                            }
                        },
                        error: function () {
                            alert("Unable to reach server")
                        }
                    });
                }
            }
        }   
    });

    $(document).on('click', ".newFile",function (event) {
        $("#explorer").append('<div class="fileWrapper"><div class="file"><img src="unknown.png" class="clickable"></div><div class="fileName"><span disabled="false" class="clickable" id="createFile" contenteditable="true">New_file</span></div></div>')
        $("#createFile").css({"overflow":"visible"});
        $("#createFile").css({"color":"#e95420"})
        $("#createFile").focus()
        $("#createFile").select()
        var w = 1
        $(document).on("mousedown", function(event){
            if ( $(event.target).closest($(event.target).parent().parent().children(".fileName").children("#createFile")).length === 0) {
                newFile();
            }   
        });
        $("#createFile").keydown(function(event) {
            if (event.key == "Enter") {
                event.preventDefault();
                newFile();
            }
        });
        function newFile() {
            var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            if (w == 1) {
                w = 0;
                var fileName = $("#createFile").text().trim()
                var check = /^(^[a-zA-Z0-9_]([a-zA-Z0-9_.]{0,99}))$/.test(fileName);
                if (check == false || fileName == "") {
                    $("#createFile").parent().parent().remove()
                    directories();
                }
                else {
                    $.ajax({
                        credentials: 'same-origin', // <-- includes cookies in the request
                        headers: {
                            'CSRF-Token': token // <-- is the csrf token as a header
                        },
                        type: 'POST',
                        url: '/newfile',
                        data: {pwd: pwd, fileName: fileName},
                        success: function (data) {
                            if (data=="Invalid session") {
                                location.reload(true);
                            }
                            else if (data=="File created") {
                                directories();
                            }
                            else if (data=="Already exists") {
                               $("#createFile").parent().parent().remove()
                                directories(); 
                            }
                            else {
                                $("#createFile").parent().parent().remove()
                                alert("An error occured while creating the file.\nIf the error persist, please contact the administrator.")
                            }
                        },
                        error: function () {
                            alert("Unable to reach server")
                        }
                    });
                }
            }
        }   
    });

    $(document).on('click', "#uploadButton" ,function (event) {
        $("#uploadInput").trigger("click")
    });
    $("#uploadInput").on("change", function(event) {
        $("#uploadSubmit").trigger("click");
    });
    $(document).on('submit', "#uploadForm" ,function (event) {
        var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        event.preventDefault();
        var verify = 0
        var files = document.getElementById("uploadInput").files
        var filesData = new FormData();
        $.each(files, function (i, file) {
            var check = /^(^[a-zA-Z0-9_]([a-zA-Z0-9_.]{0,99}))$/.test(files[i].name);
            if (files[i].size > 20971520 || check == false) {
                verify = 1
            }
            else {
                filesData.append("file" + i, file);
            }
        });
        if (verify == 1) {
            alert("Error: files with not allowed characters were selected")
        }
        else {
            $.ajax({
                credentials: 'same-origin', // <-- includes cookies in the request
                headers: {
                    'CSRF-Token': token // <-- is the csrf token as a header
                },
                type: 'POST',
                url: '/upload',
                data: filesData,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data=="Invalid session") {
                        location.reload(true);
                    }
                    else if (data=="Uploaded") {
                        directories();
                    }
                    else {
                        alert("An error occured while uploading the file.\nIf the error persist, please contact the administrator.")
                    }
                },
                error: function () {
                    alert("Unable to reach server")
                }
            });
        }
    });  

});

