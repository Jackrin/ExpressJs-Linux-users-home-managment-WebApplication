function fileTypes (data) {
	for (i = 0; i < Object.keys(data[0].contents).length; i++) {
        if (data[0].contents[i].type == "directory") {
            $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="folder.png" class="clickable action1"></div><div class="fileName"><span disabled="true" class="clickable action1" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
        }
        //Text Format
        else if (((data[0].contents[i].type).includes("ASCII text")) == true) {
            if (((data[0].contents[i].type).includes("HTML")) == true) {
                $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="html.png" class="clickable action2"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
            }
            else {
                $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="text.png" class="clickable action2"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
            }
        }
        // Image Format
        else if (((data[0].contents[i].type).includes("image data")) == true) {
            if (((data[0].contents[i].type).includes("PNG ")) == true) {
                $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="png.png" class="clickable action2"  style="height:3.25em;"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
            }
            else if (((data[0].contents[i].type).includes("JPEG ")) == true) {
                $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="jpeg.png" class="clickable action2"  style="height:3.25em;"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
            }
            else if (((data[0].contents[i].type).includes("SVG ")) == true) {
                $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="svg.png" class="clickable action2"  style="height:3.25em;"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
            }
            else if (((data[0].contents[i].type).includes("GIF ")) == true) {
                $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="gif.png" class="clickable action2"  style="height:3.25em;"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
            }
            else {
                $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="image.png" class="clickable action2"  style="height:3.25em;"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
            }
        }
        else if (((data[0].contents[i].type).includes("executable")) == true) {
            $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="executable.png" class="clickable action2"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
        }
        //Audio Format
        else if (((data[0].contents[i].type).includes("Audio file with ID3")) == true) {
            $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="mp3.png" class="clickable action2" style="width:2.6em; height:3.13em; padding-top:0.1em;"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
        }
        else if (((data[0].contents[i].type).includes("WAVE audio")) == true) {
            $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="wav.png" class="clickable action2" style="width:2.6em; height:3.13em; padding-top:0.1em;"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
        }
        else if (((data[0].contents[i].type).includes("FLAC audio")) == true) {
            $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="flac.png" class="clickable action2" style="width:2.6em; height:3.13em; padding-top:0.1em;"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
        }
        else if (((data[0].contents[i].type).includes("AAC,")) == true) {
            $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="aac.png" class="clickable action2" style="width:2.6em; height:3.13em; padding-top:0.1em;"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
        }
        else if (((data[0].contents[i].type).includes(".M4A")) == true) {
            $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="m4a.png" class="clickable action2" style="width:2.6em; height:3.13em; padding-top:0.1em;"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
        }
        //Video Format
        else if (((data[0].contents[i].type).includes("Matroska data")) == true) {
            $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="mkv.png" class="clickable action2"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
        }
        else if (((data[0].contents[i].type).includes("RIFF ")) == true) {
            $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="avi.png" class="clickable action2"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
        }
        else if (((data[0].contents[i].type).includes("MP4 ")) == true) {
            $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="mp4.png" class="clickable action2"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
        }
        else if (((data[0].contents[i].type).includes(".MOV")) == true) {
            $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="mov.png" class="clickable action2"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
        }
        //Archive Format
        else if (((data[0].contents[i].type).includes("archive")) == true) {
            if (((data[0].contents[i].type).includes("Zip archive data")) == true) {
                $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="zip.png" class="clickable action2" style="height:3.25em;"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
            }
            else if (((data[0].contents[i].type).includes("tar archive")) == true) {
                $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="tar.png" class="clickable action2" style="height:3.25em;"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
            }
            else {
                $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="unknownArchive.png" class="clickable action2"></div><div class="fileName"><span disabled="true" class="clickable action2" id="fileName" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')                          
            }
        }
        //Unknown format
        else {
            $("#explorer").append('<div class="fileWrapper"><div class="file" value="'+data[0].contents[i].type+'"><img src="unknown.png" class="clickable action2"></div><div class="fileName"><span disabled="true" class="clickable action2" contenteditable="false">'+data[0].contents[i].name+'</span></div></div>')
        }
    }
}