<?php
// DB Functions

//Handle the Request and call functions accordingly

//require_once('../../config.php');

if(isset($_POST['action'])){
    $action = $_POST['action'];

    switch ($action){
        case 'readResource': ccm_read_resource($_POST['cid'], $_POST['gid']); break;
        case 'resourceExists': ccm_resource_exists($_POST['cid'], $_POST['gid']); break;
        case 'createResource': ccm_create_resource($_POST['resource'],$_POST['cid'], $_POST['gid']); break;
        case 'listResourceMetaDatas': ccm_list_resource_metadatas(); break;
        case 'addAction': ccm_add_action($_POST['gid'],$_POST['cid'],$_POST['activity']); break;
    }
}

if(isset($_POST['submit'])){
	require_once('../../config.php');
	global $DB;

	$comment = $_POST['submit'];
	$cid = $_POST['cid'];
	$gid = $_POST['gid'];

	$record = new stdClass();
	$record->gid = $gid;
	$record->cid = $cid;
	$record->comment = $comment;


	$result = $DB->record_exists('ccm_conceptmaps', array('cid'=>$cid,'gid'=>$gid));

	//if exists: update_record, else insert
	if($result){
		$id = $DB->get_field('ccm_conceptmaps','id',array('cid'=>$cid,'gid'=>$gid), MUST_EXIST);
		$record->id = $id;
		$DB->update_record('ccm_conceptmaps', $record, false);
	}else{
		$DB->insert_record('ccm_conceptmaps', $record, false);
	}
}



function ccm_read_resource($cid, $gid){
	error_reporting(0);
	//header('Content-Type: application/json');
    require_once('../../config.php');
	global $DB;

	$result = $DB->record_exists('ccm_conceptmaps', array('cid'=>$cid, 'gid'=>$gid));

	if($result){
		$returnObj = $DB->get_record('ccm_conceptmaps', array('cid'=>$cid, 'gid'=>$gid), '*', MUST_EXIST);
		//http_response_code(200);
		echo $returnObj->map;
	}else{
		//http_response_code(404);
		echo "The requested resource doesn't exist.";
	}
}

function ccm_resource_exists($cid, $gid){
	error_reporting(0);
	require_once('../../config.php');
	global $DB;
	$result = $DB->record_exists('ccm_conceptmaps', array('cid'=>$cid, 'gid'=>$gid));

	echo $result;

}

function ccm_create_resource($resource,$cid,$gid){
	error_reporting(0);
	//required to access $DB, since we call this function from outside the instance
	echo $resource;
	require_once('../../config.php');
	global $DB;

	$record = new stdClass();
	$record->gid = $gid;
	$record->cid = $cid;
	$record->map = $resource;


	$result = $DB->record_exists('ccm_conceptmaps', array('cid'=>$cid,'gid'=>$gid));

	//if exists: update_record, else insert
	if($result){
		$id = $DB->get_field('ccm_conceptmaps','id',array('cid'=>$cid,'gid'=>$gid), MUST_EXIST);
		$record->id = $id;
		$DB->update_record('ccm_conceptmaps', $record, false);
	}else{
		$DB->insert_record('ccm_conceptmaps', $record, false);
	}
}

function ccm_add_action($gid, $cid, $action){
	error_reporting(0);
	require_once('../../config.php');
	global $DB;

	$record = new stdClass();
	$record->gid = $gid;
	$record->cid = $cid;
	$record->action = $action;

	$DB->insert_record('ccm_actions', $record, false);

	echo $action;
	
	unset($action);
	unset($record);
}

function ccm_print_protocol($cid,$gid){
	require_once('../../config.php');
	require_once('/forms.php');
	global $DB;

	$records = $DB->get_records('ccm_actions', array('cid'=>$cid,'gid'=>$gid), $sort='', $fields='action', $limitfrom=0, $limitnum=0);
	if(isset($records)){
		echo "<pre style=\"height: 30pc; overflow-y: scroll;\">";
		foreach($records as $record){
			$obj = json_decode($record->action);
			$action = new stdClass();
			$action->type = $obj->verb;
			$action->time = $obj->published;
			$action->name = $obj->actor->name;
			$action->groupId = $obj->actor->groupId;
			$action->action = $obj->object;

			
			print_r($action);
			echo "<br>";

			// $actionsArray[] = $action;
		}
		echo "</pre>";
		// if(isset($actionsArray)){
		// 	echo "<pre style=\"height: 30pc; overflow-y: scroll;\">";
		// 	print_r($actionsArray);
		// 	echo "</pre>";
		// }
	}


	// $mform = new ccm_comment_form(null, array('currentComment'=>$currentComment,'role'=>$role,'cid'=>$cid,'gid'=>$gid));
	// $mform->display();
}

function ccm_print_iframe($id,$userId,$groupId,$timeclose,$canEdit,$role,$name){
	echo "
	<div id=\"container\">
		<iframe width=\"100%\" height=\"1000\" 
		style=\"overflow:hidden;overflow-x:hidden;overflow-y:hidden;\" 
		src=\"mapper/conceptmap/src/main/webapp/conceptmapper_v1.html?storageServer=moodle
		&instance=$id
		&userId=$userId
		&groupId=$groupId
		&timeclose=$timeclose
		&canEdit=$canEdit
		&role=$role
		&name=$name
		\"
		>
			<p>Your browser doesn't support inline frames.</p>
		</iframe>
	</div>
	";
}

function ccm_print_comment($cid,$gid,$role){
	require_once('../../config.php');
	require_once('/forms.php');
	global $DB;

	$currentComment = $DB->get_field('ccm_conceptmaps','comment',array('cid'=>$cid,'gid'=>$gid), IGNORE_MISSING);
		
	if(!$currentComment){
		$currentComment = get_string('nocomment','ccm');
	}

	$mform = new ccm_comment_form(null, array('currentComment'=>$currentComment,'role'=>$role,'cid'=>$cid,'gid'=>$gid));
	
	if($data = $mform->get_data()) {
		//creates new record if none exists (blank Map but updated comment), updates comment otherwise
		$record = new stdClass();
		$record->gid = $gid;
		$record->cid = $cid;
		$record->comment = $data->comment;

		$result = $DB->record_exists('ccm_conceptmaps', array('cid'=>$cid,'gid'=>$gid));

		if($result){
			$id = $DB->get_field('ccm_conceptmaps','id',array('cid'=>$cid,'gid'=>$gid), MUST_EXIST);
			$record->id = $id;
			$DB->update_record('ccm_conceptmaps', $record, false);
		}else{
			$DB->insert_record('ccm_conceptmaps', $record, false);
		}
		$mform->display();
	}else{
	  	$mform->display();
	}
}

function ccm_print_group_header($groupId,$id){
	$gmembers = groups_get_members($groupId, $fields='u.lastname, u.firstname', $sort='lastname ASC');

	echo "<br><a href=\"selection.php?cid=$id\">Back to selection</a><br>";
	echo "Group ID: ";
	echo $groupId;
	echo " Group Members: ";
	foreach($gmembers as $member){
		echo $member->firstname . " " . $member->lastname . "; ";
	}
}

function ccm_add_instance($ccm){
	global $DB;
	$ccm->timemodified = time();
	$ccm->ccmid = $ccm->coursemodule;
	$ccm->id = $DB->insert_record("ccm",$ccm);
	return $ccm->id;
}
function ccm_update_instance($ccm){
	global $DB;
	$ccm->timemodified = time();
	$ccm->id = $ccm->instance;
	$returnid = $DB->update_record("ccm",$ccm);
	return $returnid;
}
function ccm_delete_instance($id){
	// require_once('../../config.php');
	global $DB;
	// $ccm = $DB->get_record('ccm',array('id'=>$id));
	// $ccm->id += 1;
	// $DB->insert_record('ccm', $ccm, false, false);
	if(!$ccm = $DB->get_record('ccm',array('id'=>$id))){
		return false;
	}

	$result = true;

	if(! $DB->delete_records('ccm', array('id'=>$ccm->id))){
		$result = false;
	}

	$DB->delete_records('ccm_conceptmaps', array('cid'=>$ccm->ccmid));
	$DB->delete_records('ccm_actions', array('cid'=>$ccm->ccmid));

	return $result;
}

?>