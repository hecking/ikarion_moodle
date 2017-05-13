var token;
var titlex;
var datacopy;
var already_upload = false;
function uploadf(){
    
    
    if(already_upload == true){
        delete_upload();
    }else{
        uploadg();
    }
    

   


}

function uploadg(){
 $.get("http://"+configjs.address+"/mod/videor/upload.php", function(data){
        
        document.getElementById("console").innerHTML = data.token;
       

        uploadff(data);  


      },"json");
}




function delete_upload(){

    
   $.get("http://"+configjs.address+"/mod/videor/delete.php",{vid:datacopy.vid,token:datacopy.token, combo:datacopy.combo},function(data){
        
        document.getElementById("deleteconsole").innerHTML = "Deleting";
        var datar = new FormData();
        datar.append('video_title',titlex);
        datar.append('token',data.token);
        datar.append('video_id',data.vid);
        datar.append('portal_add',configjs.address+':80');


        var xhr = null;
        try {
            xhr = new XMLHttpRequest();
        } catch(e){
            try {
                //for IE6
                xmlHttp  = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(e) {
                xhr = null;
            }
        }
        if(xhr){
            xhr.onreadystatechange = function () {
             if (xhr.readyState == 1) {
                document.getElementById("deleteconsole").innerHTML = xhr.status + xhr.responseText;

            }else if(xhr.readyState == 2){
                document.getElementById("deleteconsole").innerHTML = "Previous video is being deleted";

            }else if(xhr.readyState == 3){
                 if(xhr.status == 528){
                    document.getElementById("deleteconsole").innerHTML = titlex+" was deleted successfully";
                }else if(xhr.status == 529){
                    document.getElementById("deleteconsole").innerHTML = xhr.status + xhr.responseText;
                }else{
                    document.getElementById("deleteconsole").innerHTML = xhr.status + xhr.responseText;
                }

            }else if(xhr.readyState == 4){
                 if(xhr.status == 528){
                    document.getElementById("deleteconsole").innerHTML = titlex+" was deleted successfully";
                }else if(xhr.status == 529){
                    document.getElementById("deleteconsole").innerHTML = xhr.status + xhr.responseText;
                }else{
                    document.getElementById("deleteconsole").innerHTML = xhr.status + xhr.responseText;
                }
               
                uploadg();

            }
            };
            xhr.open('POST', 'http://'+configjs.serverAddress+'/delete-video', true);
            xhr.send(datar);
            
        }
      },"json");

     
}



function uploadff(data){
        var fileInput = document.getElementById ("myfile2");
        var file = fileInput.files[0];

        var title = document.getElementById ("id_name").value;
        document.getElementById("console").innerHTML = "TITLE: "+title;

        titlex =title;
        datacopy = data;
        already_upload = true;


        
        var datar = new FormData();
        datar.append('file', file);
        datar.append('video_title',title);
        datar.append('token',data.token);
        datar.append('video_id',data.vid);
        datar.append('portal_add',configjs.address+':80');
        datar.append('return_url','?result=true');

        var xhr = null;
        try {
            xhr = new XMLHttpRequest();
        } catch(e){
            try {
                 //for IE6
                xmlHttp  = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(e) {
                xhr = null;
            }
        }
        if(xhr){
            //xhr.upload.addEventListener("progress", uploadProgress);
            xhr.onreadystatechange = function () {
            if (xhr.readyState == 1) {
                document.getElementById("console").innerHTML = xhr.status + xhr.responseText;

            }else if(xhr.readyState == 2){
                document.getElementById("console").innerHTML = "Video is being uploaded";

            }else if(xhr.readyState == 3){
                 if(xhr.status == 200){
                    document.getElementById("console").innerHTML = title+" was uploaded successfully";
                }else{
                    document.getElementById("console").innerHTML = xhr.status + xhr.responseText;
                }

            }else if(xhr.readyState == 4){
                //$.get("http://"+configjs.address+"/mod/videor/tempvideor.php",{title:title, vid:data.vid, token:data.token});
                $('input[name=videoid]').val(data.vid);
                $('input[name=videotitle]').val(title);
                if(xhr.status == 200){
                    document.getElementById("console").innerHTML = title+" was uploaded successfully";
                }else{
                    document.getElementById("console").innerHTML = xhr.status + xhr.responseText;
                }
                
            }
            };
            xhr.open('POST', 'http://'+configjs.serverAddress+'/upload-video', true);
            

            xhr.send(datar);

        }
        
}

/*
$('#id_resource_type').change(function() {
     $("#id_resource_type option:selected").each(function () {
        if($(this).val() == 2){
            $('#myfile2').attr("disabled", false);
            $('#filebutton').attr("disabled", false);
        }else{
            $('#myfile2').attr("disabled", true);
            $('#filebutton').attr("disabled", true);

        }
    });
});
*/
$(function(){

function split( val ) {
return val.split( /,\s*/ );
}
function extractLast( term ) {
return split( term ).pop();
}

 $("#id_tags").bind( "keydown", function( event ) {
if ( event.keyCode === $.ui.keyCode.TAB &&
$( this ).data( "autocomplete" ).menu.active ) {
event.preventDefault();
}
})
.autocomplete({
minLength: 0,

source: function( request, response ) {

$.getJSON( "http://"+configjs.address+"/mod/videor/gettagnames.php", {

term: extractLast( request.term )

}, response );

},
focus: function() {
// prevent value inserted on focus
return false;
},
select: function( event, ui ) {
var terms = split( this.value );
// remove the current input
terms.pop();
// add the selected item
terms.push( ui.item.value );
// add placeholder to get the comma-and-space at the end
terms.push( "" );
this.value = terms.join( ", " );
return false;
}
});
});