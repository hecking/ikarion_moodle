$(document).ready(function(){

	$('.tag-header').click(function(){
	    $('.tag-content').slideToggle('slow');
	});
    
    $("#submit").hide();

    $("#page-changer select").change(function() {
        window.location = $("#page-changer select option:selected").val();
    })
     $("#user-changer select").change(function() {
        window.location = $("#user-changer select option:selected").val();
    })

});

function popupTagvc(vcid,tagid,videoid) {

	var r = confirm("Are you sure you want to delete the Tag?");
	
	if (r==true){
 	window.location = 'http://'+configjs.adress+'/mod/videocenter/viewvideo.php?id='+vcid+'&tid='+tagid+'&vid='+videoid;

  }


}

function popupBookmarkvc(vcid,bookmarkid,videoid) {

	var r = confirm("Are you sure you want to delete the Bookmark?");
	
	if (r==true){
 	window.location = 'http://'+configjs.adress+'/mod/videocenter/viewvideo.php?id='+vcid+'&bid='+bookmarkid+'&vid='+videoid;

  }


}