<?php

global $CFG;

require_once('../../config.php');
require_once('/forms.php');

$cid = required_param('cid', PARAM_INT);          
$selected = true;
$groups = array();

$cm = get_coursemodule_from_id('ccm', $cid);
$courseId = $cm->course;

//getting all group-ids for this instance
$records = $DB->get_records('ccm_conceptmaps', array('cid'=>$cid), $sort='', $fields='gid', $limitfrom=0, $limitnum=0);

foreach($records as $record){
	$groups[] = intval($record->gid);
}

$PAGE->set_url('/mod/ccm/selection.php', array('cid'=>$cid));
$PAGE->set_title(format_string("Concept Map Selection"));

echo $OUTPUT->header();
echo $OUTPUT->heading(get_string('groupmodeNotice', 'ccm'));

$mform = new ccm_selection_form(null, array('groups'=>$groups,'cid'=>$cid));
if($mform->is_cancelled()) {
    redirect("../../course/view.php?id=$courseId");
}else if($data = $mform->get_data()) {
	// $selectedEntry = $data->groups;
	// if (!empty($selectedEntry)) {
	// 	echo "...redirecting to selected Map.";
	// 	$selectedGroup = $groups[$selectedEntry];
	// 	redirect("view.php?id=$cid&gid=$selectedGroup&selected=$selected");
	// }
	if(!empty($data->cancel)){
		redirect("../../course/view.php?id=$courseId");
	}else{
		$selectedEntry = $data->groups;
		echo "...redirecting to selected Map.";
		$selectedGroup = $groups[$selectedEntry];
		redirect("view.php?id=$cid&gid=$selectedGroup&selected=$selected");
	}
}else{
  	$mform->display();
}
echo $OUTPUT->footer();
?>