<?php
require_once('../../config.php');
require_once('lib.php');
global $USER;

$id = required_param('id', PARAM_INT);    // Course Module ID
$groupId = optional_param('gid',0, PARAM_INT);
$selected = optional_param('selected', false, PARAM_BOOL);
 
if (!$cm = get_coursemodule_from_id('ccm', $id)) {
    print_error('Course Module ID was incorrect');
}
if (!$course = $DB->get_record('course', array('id'=> $cm->course))) {
    print_error('course is misconfigured');
}
if (!$certificate = $DB->get_record('ccm', array('id'=> $cm->instance))) {
    print_error('course module is incorrect');
}

$context = context_module::instance($cm->id);

require_login($course->id, true, $cm);


//Parameters for cases and Concept Mapper
$timeclose = $DB->get_field('ccm','timeclose',array('id'=>$cm->instance));
$userId = $USER->id;

$firstname = $USER->firstname;
$lastname = $USER->lastname;
$name = $firstname . " " . $lastname;

$inTime = true;
if($timeclose < time()){
	$inTime = false;
}
$deadline = date (DATE_RFC822,$timeclose);

$groupmode = groups_get_activity_groupmode($cm, $course=null);


//PAGE
$PAGE->set_url('/mod/ccm/view.php', array('id'=>$id));
$PAGE->set_title(format_string("Collaborative Concept Mapper"));

echo $OUTPUT->header();
echo "<br>Deadline: $deadline<br>";

/*
	Different Cases according to capabilities, $groupmode and $inTime
*/
if(has_capability('mod/ccm:accessmapper', $context)){
	$role = "student";

	if($groupmode){
		$sql = "SELECT groupId FROM mdl_groups_members WHERE userid='$userId'";      //user in multiple groups?
		$groupId = $DB->get_field_sql($sql,null, $strictness=IGNORE_MISSING);
	}else{
		$groupId = 0;
	}	

	if($inTime){
		$canEdit = "true";
	}else{
		$canEdit = "false";
		ccm_print_comment($id,$groupId,$role);
	}
	ccm_print_iframe($id,$userId,$groupId,$timeclose,$canEdit,$role,$name);

}else if(has_capability('mod/ccm:managemapper', $context)){
	$canEdit = "false";
	$role = "teacher";

	//only display selection when in groupmode
	if(!$groupmode){
		$groupId = 0;
		if(!$inTime){
			ccm_print_comment($id,$groupId,$role);
		}
		ccm_print_iframe($id,$userId,$groupId,$timeclose,$canEdit,$role,$name);
		ccm_print_protocol($id,$groupId);

	}else{
		//redirect to selection, also print iframe once selected
		if($selected){
			ccm_print_group_header($groupId,$id);
			if(!$inTime){
				ccm_print_comment($id,$groupId,$role,$group);
			}
			ccm_print_iframe($id,$userId,$groupId,$timeclose,$canEdit,$role,$name);
			ccm_print_protocol($id,$groupId);

		}else{
			redirect("selection.php?cid=$id");
		}
	}
}

unset($groupId);
unset($selected);

echo $OUTPUT->footer();
?>