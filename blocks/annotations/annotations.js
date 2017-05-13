var HashTags = new Array();


$(document).ready(function() {
				annotations_annotationRefreshFromForm();
				var _result_set = document.getElementById('anot-view-area');
				var rect =  _result_set.getBoundingClientRect();
				var new_left = rect.right + "px";
				var new_top = rect.top + "px";
				var val_courseid = document.getElementById('anot_courseid').value;
				var val_sesskey  = document.getElementById('anot_sesskey').value;
				var wwwroot = document.getElementById('anot_wwwroot').value;
				
				if(document.getElementById('anot-view-comment')){
					document.getElementById('anot-view-comment').style.left=new_left;
					document.getElementById('anot-view-comment').style.top=new_top;
				}
				document.getElementById('anot_view_graph').style.left=new_left;
				document.getElementById('anot_view_graph').style.top=new_top;

				$.ajax({
			    	
			        url: wwwroot + '/blocks/annotations/ajax/management.php',
			        type:'POST',
			        timeout:5000,
			        data:{fnc : 'tagsPreload' , c:val_courseid, sesskey:val_sesskey },
			        beforeSend : function() {

			        },
			        success : function(data) {
			        	var json = JSON.parse(data);

			        	for(pos = 0; pos < json.length; pos++)
			    		{
			        		HashTags.push(json[pos]['tag']);
			    		}
			        	annotations_bindcontrols();
			        },
			        error: function(jqXHR, textStatus, errorThrown){
			        	console.log(textStatus, errorThrown);
			        }
			        
			    });
				
			}
);


/**
 * 
 * @param id
 */
function annotations_toggle(id, col, exp){
    
	if(id == null)
	{
		alert("Nullpointer!");
	}
	
	var ul = "ul_" + id;
    var img = "img_" + id;
    ulElement = document.getElementById(ul);
    imgElement = document.getElementById(img);
    if (ulElement){
	    if (ulElement.className == 'anot_closed'){
            ulElement.className = "anot_open";
            imgElement.src = exp;
        }else{
            ulElement.className = "anot_closed";
            imgElement.src = col;
        }
    }
}

/**
 * Prepare entered Tagginginformations
 * @param contextid
 * @param userid
 * @param skey
 * @param wwwroot
 */
function annotations_postInsert(courseid, contextid,userid,skey, wwwroot){
	/**
	 * Values of fields
	 */
	var annotation = $('#annotation').val();
	var anot_type = $("input[name=anot_type]:checked").val();
	var hashtag = $('#hashtag').val();
	var _cm  = document.getElementById('anot_cm').value;
	var annotid = document.getElementById('annotid').value;
	/**
	 * Fieldreferences
	 */
	var _hashtag = document.getElementById('hashtag');
	var _annotation = document.getElementById('annotation');
	var _view = document.getElementById('anot_view_graph');
	var _func = "";
	/**
	 * default backgroundColor setting
	 */
	_hashtag.style.backgroundColor = "white";
	_annotation.style.backgroundColor = "white";

	/**
	 * Allowed Character Sets for Tags
	 */
	var Ergebnis = hashtag.match("[A-Za-z0-9äüößÄÜÖ]*");

	if(hashtag != Ergebnis)
	{
		_hashtag.style.backgroundColor = "red";
		return;
	}
	if(annotid == -1){
		_func = 'postInsert';
	}else{
		_func = 'postUpdate';
	}
	
	/**
	 * Ajax Workset for filled Data 
	 */
	if( annotation.length != 0 && hashtag.length != 0 )
	{
	    $.ajax({
	
	        url: wwwroot + '/blocks/annotations/ajax/management.php',
	        type:'POST',
	        timeout:5000,
	        data:{fnc : _func , p:courseid, c:contextid, u:userid, t:anot_type, h:hashtag, a:annotation, sesskey:skey, i:annotid},
	        
	        beforeSend : function() {
	            $('#anot-view-area').hide();
	            $('#anot-wait-area').show();
	
	        },
	        success : function(data) {
	            annotations_annotationRefresh(contextid, userid, skey, wwwroot, _cm);
	            annotations_resetInput();
	            if (_view.style.display == ""){
	            	annotations_update_graph(courseid, contextid, wwwroot, skey, false);
	            }
	        },
	        error: function(jqXHR, textStatus, errorThrown){
	        	console.log(textStatus, errorThrown);
	        	alert("died! " + textStatus + ":" + errorThrown + " =>" + jqXHR.status + ":" + jqXHR.resonseText);
	        }
	        
	    });
	}
	
	/**
	 * Value Check if the fields are empty
	 */
	if( annotation.length == 0 )
	{
		_annotation.style.backgroundColor = "red";
	}
	if( hashtag.length == 0 )
	{
		_hashtag.style.backgroundColor = "red";
	}
	
}

function annotations_resetInput(){
	var tag_array = ['anot_general','anot_technical','anot_understand','anot_privat'];
	
	for(my_key in tag_array){
		document.getElementById(tag_array[my_key]).disabled = false;
	}
	
	document.getElementById('hashtag').readOnly = false;
	document.getElementById(tag_array[0]).checked = true;
	
	document.getElementById('hashtag').value = "";
	document.getElementById('annotation').value = "";
	document.getElementById('annotid').value = -1;
	document.getElementById('reset_button').disabled = true;
}

function annotations_annotationEdit(annotid,annottyp,hashtag,annotation){
	var _hashtag = document.getElementById('hashtag');
	var _annotation = document.getElementById('annotation');
	var _annotid = document.getElementById('annotid');
	
	var tag_array = ['anot_general','anot_technical','anot_understand','anot_privat'];
	
	for(my_key in tag_array){
		document.getElementById(tag_array[my_key]).disabled = true;
	}
	tag_array.readOnly = true;
	document.getElementById('hashtag').disabled = true;
	document.getElementById(annottyp).checked = true;
	document.getElementById('reset_button').disabled = false;
	
	_hashtag.value = hashtag;
	_annotation.value = annotation;
	_annotid.value = annotid;
	

}

function annotations_annotationRefreshFromForm(){
	if( null == document.getElementById('anot_contextid') || typeof(document.getElementById('anot_contextid')) == 'undefined')
		return;
	
	var _cid = document.getElementById('anot_contextid').value;
	var _uid = document.getElementById('anot_userid').value;
	var _root = document.getElementById('anot_wwwroot').value;
	var _sess = document.getElementById('anot_sesskey').value;
	var _cm  = document.getElementById('anot_cm').value;
	annotations_annotationRefresh(_cid,_uid,_sess, _root, _cm);
}


/**
 * Reload the annotation View Area at the website
 * @param contextid
 * @param userid
 * @param skey
 * @param wwwroot
 */
function annotations_annotationRefresh(contextid,userid,skey, wwwroot, cm){

	var _result_set = document.getElementById('anot-view-area');
	var _annotation = document.getElementById('annotation');
	var _hashtag    = document.getElementById('hashtag');
	$.ajax({
    	
        url: wwwroot + '/blocks/annotations/ajax/management.php',
        type:'POST',
        timeout:5000,
        data:{fnc : 'annotationRefresh' , c:contextid, u:userid, sesskey:skey, cm:cm },
        beforeSend : function() {

        },
        success : function(data) {
        	_result_set.innerHTML = data;
            $('#anot-wait-area').hide();
        	$('#anot-view-area').show();
        	_annotation.value = "";
        	_hashtag.value = "";
        	
        },
        error: function(jqXHR, textStatus, errorThrown){
        	console.log(textStatus, errorThrown);
        }
        
    });

}

function annotations_close_comments()
{
	var _view = document.getElementById('anot-view-comment');
	_view.style.display="none";
	return;
	
}

/**
 * Open the Division for Comment at the Screen.
 * After Open it will be refresh the comments.
 * @param annotid
 * @param userid
 */
function annotations_open_comments(annotid, userid, skey, wwwroot)
{
	var _view = document.getElementById('anot-view-comment');
	var _view2 = document.getElementById('anot_view_graph');

	var _graph = document.getElementById('anot_view_graph');
	var element = document.getElementById('anot-view-area');
	var rect = element.getBoundingClientRect();
	var elementLeft,elementTop; 
	var scrollTop = document.documentElement.scrollTop?
	                document.documentElement.scrollTop:document.body.scrollTop;
	var scrollLeft = document.documentElement.scrollLeft?                   
	                 document.documentElement.scrollLeft:document.body.scrollLeft;
	elementTop = rect.top+scrollTop;
	elementLeft = rect.left+scrollLeft;
	_view.style.top=elementTop + "px";

	
	if( _view.style.display == "none")
	{
		_view.style.display="";
		_view2.style.display="none";
	}
	document.getElementById('annotid').value = annotid;
	document.getElementById('userid').value = userid;
	document.getElementById('anot_comment_text').value = "";

    annotations_annotationRefreshDetails(annotid, skey, wwwroot);

}

/**
 * 
 */
function annotations_open_admin_graph(courseid,skey,wwwroot){
	var _view = document.getElementById('anot_view_graph');
	var element = document.getElementById('anot-view-area');
	var rect = element.getBoundingClientRect();
	var elementLeft,elementTop; 
	var scrollTop = document.documentElement.scrollTop?
	                document.documentElement.scrollTop:document.body.scrollTop;
	var scrollLeft = document.documentElement.scrollLeft?                   
	                 document.documentElement.scrollLeft:document.body.scrollLeft;
	elementTop = rect.top+scrollTop;
	elementLeft = rect.left+scrollLeft;
	
	_view.style.top=elementTop + "px";	
	
	if(_view.style.display == "none"){
		annotations_update_admin_graph(courseid,skey,wwwroot);
		 _view.style.display = "";
	}else{
		_view.style.display="none";
	}
}

/**
 * 
 */
function annotations_update_admin_graph(courseid, skey, wwwroot){
	
	var o = new orgChart();

	var _canvas_container = document.getElementById('anot_graph_out');
	var d = new Date();
	var n = d.getTime();
	var _canvas_name = "c_nodes_" + n;

	var _selhash = document.getElementById('anot_hashtaglist').value;

	var _checked_general = document.getElementById("chbx_anot_general").checked;
	var _checked_technical = document.getElementById("chbx_anot_technical").checked;
	var _checked_understand = document.getElementById("chbx_anot_understand").checked;
	
	$.ajax({
    	
        url: wwwroot + '/blocks/annotations/ajax/management.php',
        type:'POST',
        timeout:5000,
        data:{fnc : 'adminGraphUpdate' , t:_selhash, b:courseid, sesskey:skey, g:_checked_general,te:_checked_technical,u:_checked_understand},
        beforeSend : function() {
        	_canvas_container.innerHTML="";
        },
        success : function(data) {
        	var json = JSON.parse(data);
        	var urls = "";
        	for(pos = 0; pos < json.length; pos++)
    		{
        		var id = json[pos]['id'];	
        		var parent = json[pos]['parent'];	
        		var name = json[pos]['name'];	
        		var link = json[pos]['link'];	
        		var urlimg = json[pos]['url-img'];
        		var bgcolor = json[pos]['bgcolor'];
        		var fgcolor = json[pos]['fgcolor'];

        		if(link == "" && urlimg == "")
    			{
            		o.addNode(id, parent, 'u', name, 0, '','',bgcolor,fgcolor);
    			}else{
            		o.addNode(id, parent, 'u', name, 0, link,'',bgcolor,fgcolor,urlimg);
    			}
    		}
        	_canvas_container.innerHTML="<canvas id=\"" + _canvas_name + "\"></canvas>";
        	o.drawChart(_canvas_name,'c',true);
        
        },
        error: function(jqXHR, textStatus, errorThrown){
        	console.log(textStatus, errorThrown);
        }
    });
}

/**
 * 
 * @param skey
 * @param wwwroot
 */
function annotations_commentInsert(skey, wwwroot){
	var _annotid = document.getElementById('annotid').value;
	var _userid = document.getElementById('userid').value;
	var _comment = document.getElementById('anot_comment_text').value;
	
	/**
	 * Value Check if the fields are empty
	 */
	if( _comment.length == 0 )
	{
		document.getElementById('anot_comment_text').style.backgroundColor = "red";
		return;
	}else{
		document.getElementById('anot_comment_text').style.backgroundColor = "white";
	}
	
	document.getElementById('anot_comment_text').value = "";

	$.ajax({
    	
        url: wwwroot + '/blocks/annotations/ajax/management.php',
        type:'POST',
        timeout:5000,
        data:{fnc : 'commentInsert' , a:_annotid, c:_comment, u:_userid, sesskey:skey },
        
        beforeSend : function() {

        },
        success : function(data) {
            annotations_annotationRefreshDetails(_annotid, skey, wwwroot);
        },
        error: function(jqXHR, textStatus, errorThrown){
        	console.log(textStatus, errorThrown);
        	alert("died! " + textStatus + ":" + errorThrown + " =>" + jqXHR.status + ":" + jqXHR.resonseText);
        }
        
    });
	
}


/**
 * Reload the annotation View Area at the website
 * @param contextid
 * @param userid
 * @param skey
 * @param wwwroot
 */
function annotations_annotationRefreshDetails(annotid,skey, wwwroot){
	var _comment_out = document.getElementById('anot_comment_out');
	$.ajax({
    	
        url: wwwroot + '/blocks/annotations/ajax/management.php',
        type:'POST',
        timeout:5000,
        data:{fnc : 'annotationRefreshComments' , a:annotid, sesskey:skey },
	
        beforeSend : function() {
        	_comment_out.style.display="none";
        },
        success : function(data) {
        	_comment_out.innerHTML = data;
        	_comment_out.style.display="";
        },
        error: function(jqXHR, textStatus, errorThrown){
        	console.log(textStatus, errorThrown);
        }
        
    });

}

/**
 * 
 * @param rec_id
 * @param skey
 * @param wwwroot
 * @param anot_typ
 * @param anot_hash
 * @param emptyimg
 */
function annotations_annotationRemove(rec_id,skey, wwwroot, anot_typ, anot_hash, emptyimg){

	annotations_close_comments();
	
	var _contextid = document.getElementById('anot_contextid').value;
	var _courseid = document.getElementById('anot_courseid').value;
	var _view = document.getElementById('anot_view_graph');
	
	
	var element = document.getElementById("annot-id-" + rec_id);
	
	var groupelement = document.getElementById(anot_typ+'_'+anot_hash);
	
	var grouptabelement = document.getElementById('tab_' + anot_typ + '_' + anot_hash);
	
	var typeelement = document.getElementById('ul_' + anot_typ);
	var imgelement = document.getElementById('img_' + anot_typ);
	
	
	if(element == null || groupelement == null || grouptabelement == null || typeelement == null)
	{
		alert("Element is null!");
		return;
	}

	$.ajax({
    	
        url: wwwroot + '/blocks/annotations/ajax/management.php',
        type:'POST',
        timeout:5000,
        data:{fnc : 'annotationRemove', r:rec_id, sesskey:skey},
        beforeSend : function() {

        },
        success : function(data) {
        	
        	element.remove();
        	
        	
        	if(0 == grouptabelement.children.length)
    		{
        		groupelement.remove();
    		}

        	if("" == typeelement.innerHTML)
    		{
        		imgelement.src = emptyimg;
    		}
        	
        	if (_view.style.display == ""){
	            	annotations_update_graph(_courseid, _contextid, wwwroot, skey, false);
	            }
        	
        	
        },
        error: function(jqXHR, textStatus, errorThrown){
        	console.log(textStatus, errorThrown);
        }
        
    });
}


/**
 * 
 * @param courseid
 * @param contextid
 * @param wwwroot
 * @param skey
 * @param closing
 */
function annotations_update_graph(courseid, contextid, wwwroot, skey, closing){

	var o = new orgChart();
	var _view = document.getElementById('anot_view_graph');
	var _view2 = document.getElementById('anot-view-comment');
	
	if(_view.style.display == "" && closing == true)
	{
		_view.style.display = "none";
		return;
	}
	
	$.ajax({
    	
        url: wwwroot + '/blocks/annotations/ajax/management.php',
        type:'POST',
        timeout:5000,
        data:{fnc : 'graphUpdate' , c:contextid, b:courseid, sesskey:skey},
        beforeSend : function() {
        	_view2.style.display="none";
        },
        success : function(data) {

        	var json = JSON.parse(data);

        	for(pos = 0; pos < json.length; pos++)
    		{
        		var id = json[pos]['id'];	
        		var parent = json[pos]['parent'];	
        		var name = json[pos]['name'];	
        		var link = json[pos]['link'];	
        		var urlimg = json[pos]['url-img'];
        		var bgcolor = json[pos]['bgcolor'];
        		var fgcolor = json[pos]['fgcolor'];

        		if(link == "" && urlimg == "")
    			{
            		o.addNode(id, parent, 'u', name, 0, '','',bgcolor,fgcolor);
    			}else{
            		o.addNode(id, parent, 'u', name, 0, link,'',bgcolor,fgcolor,urlimg);
    			}
    		}

        	o.drawChart('c_nodes','c',true);
    		_view.style.display = "";
        },
        error: function(jqXHR, textStatus, errorThrown){
        	console.log(textStatus, errorThrown);
        }
    });

}

function annotations_pre_update_admin_graph(courseid, skey, wwwroot){
	
	var _checked_general = document.getElementById("chbx_anot_general").checked;
	var _checked_technical = document.getElementById("chbx_anot_technical").checked;
	var _checked_understand = document.getElementById("chbx_anot_understand").checked;
	
	if(_checked_general == false && _checked_technical == false && _checked_understand == false){
		document.getElementById("chbx_anot_general").checked = true;
	}
	
	annotations_update_admin_graph(courseid, skey, wwwroot);
}

function annotations_bindcontrols() {
	
    $('#anot_hashtaglist').autocomplete({
        source: HashTags,
        minLength: 0,
        scroll: true
    }).focus(function() {
        $(this).autocomplete("search", "");
    });
}



