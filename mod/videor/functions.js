 $(function() {
$( "#dialog-form" ).dialog({
autoOpen: false,
height: 300,
width: 350,
modal: true,
buttons: {
 	"Create Bookmark": function() {
     $.get("addbookmark.php",
     {vid : $(".bookmarkbuttons").data('vid'), courseid : $(".bookmarkbuttons").data('courseid'), uid: $(".bookmarkbuttons").data('uid'), time: $("#cursecs").text(), title: $("#name").val(), type: $('#tabs').tabs().tabs('option', 'selected')},
     function(data){
     	location.reload(true);
		},"json");

    $( this ).dialog( "close" );

	},
	Cancel: function() {
	$( this ).dialog( "close" );
	}
},

close: function() {
	if($(".bookmarkbuttons").data('mode') ==1){
		if(player.getPlayerState() != 5){
			player.playVideo();
		}
	}else if($(".bookmarkbuttons").data('mode') ==2){
		flowplayer().play();

	}
}
});


$( "#create-flowb" ).button().click(function() {
	
	flowplayer().pause();
	var time = Math.round(flowplayer().video.time);
   
	document.getElementById("cursecs").innerHTML =time;
	if((time % 60) < 10){
			document.getElementById("curtime").innerHTML = Math.floor(time/60)+":0"+(time % 60);
		}else{
			document.getElementById("curtime").innerHTML =Math.floor(time/60)+":"+(time % 60);

		}

	$( "#dialog-form" ).dialog( "open" );
});

$( "#create-youtubeb" ).button().click(function() {
	player.pauseVideo();
	var time = Math.round(player.getCurrentTime());
	document.getElementById("cursecs").innerHTML =time;
	if((time % 60) < 10){
			document.getElementById("curtime").innerHTML = Math.floor(time/60)+":0"+(time % 60);
		}else{
			document.getElementById("curtime").innerHTML =Math.floor(time/60)+":"+(time % 60);

		}

	$( "#dialog-form" ).dialog( "open" );

});


function split( val ) {
return val.split( /,\s*/ );
}
function extractLast( term ) {
return split( term ).pop();
}

 $( "#tags" )
// don't navigate away from the field on tab when selecting an item
.bind( "keydown", function( event ) {
if ( event.keyCode === $.ui.keyCode.TAB &&
$( this ).data( "autocomplete" ).menu.active ) {
event.preventDefault();
}
})
.autocomplete({
minLength: 0,
/*
source: function( request, response ) {

// delegate back to autocomplete, but extract the last term
response( $.ui.autocomplete.filter(
"http://192.168.2.108/mod/videor/gettagnames.php", extractLast( request.term ) ) );
},
*/
source: function( request, response ) {

$.getJSON( "gettagnames.php", {

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

$("#addtagsbutton").click(function() {
	 $.get("addtags.php",
     {vid : $("#addtagsbutton").data('vid'), courseid : $("#addtagsbutton").data('courseid'), uid: $("#addtagsbutton").data('uid'), content: $("#tags").val()},
     function(data){
     	location.reload(true);
		},"json");
});


});

$(function() {
$( "#accordion" ).accordion();
});
$(function() {
$( "#tabs" ).tabs();
});
function popupTag(tagid,videoid) {

	var r = confirm("Are you sure you want to delete the Tag?");
	
	if (r==true){
 	window.location = 'http://'+configjs.address+'/mod/videor/view.php?id='+videoid+'&tid='+tagid;

  }


}

function popupBookmark(bookmarkid,videoid) {

	var r = confirm("Are you sure you want to delete the Bookmark?");
	
	if (r==true){
 	window.location = 'http://'+configjs.address+'/mod/videor/view.php?id='+videoid+'&bid='+bookmarkid;

  }


}