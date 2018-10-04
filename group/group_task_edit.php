<?php
/**
 * Created by PhpStorm.
 * User: Yassin
 * Date: 11.09.2018
 * Time: 09:34
 */

require_once('../config.php');
require_once('lib.php');
require_once('group_task_edit_form.php');


$courseid = optional_param('courseid', false, PARAM_INT);
$group_task_id = optional_param("group_task_id", false, PARAM_INT);
//$data = $editform->get_data();
//if(!$courseid) {
//    $courseid = $data->form_courseid;
//}

if (isset($_POST["form_courseid"])){
    $courseid = $_POST["form_courseid"];
}

if (isset($_POST["form_taskid"])){
    $group_task_id = $_POST["form_taskid"];
}

$PAGE->set_url('/group/group_task_edit.php', array('courseid' => $courseid));

$course = $DB->get_record('course', array('id'=>$courseid), '*', MUST_EXIST);

if (!$course) {
    print_error('invalidcourseid');
}

require_login($course);
$context       = context_course::instance($courseid);
require_capability('moodle/course:managegroups', $context);
$returnurl = $CFG->wwwroot.'/group/index.php?id='.$course->id;

// str values for page
$strgroups           = get_string('groups');
$group_task_str = get_string('grouptask', 'group');
$edit_group_tasks_str = get_string('editgrouptasks', 'group');


$editform = new group_task_edit_form(null,
    array('courseid' => $courseid,
        'group_task_id' => $group_task_id) );

// Redirect
if ($editform->is_cancelled()) {
    redirect($returnurl);

} elseif ($data = $editform->get_data()) {

    // dbdata
    $grouptasktable = 'group_task';
    $grouptasktogroupmappingtable = 'group_task_mapping';
    $taskmodulemappingtable = 'task_module_mapping';
    // taskdata
    $taskname = $data->taskname;
    $startdate = $data->startdate;
    $enddate = $data->enddate;
    $tasktype = $data->tasktype;

    $taskrecord = new stdClass();
    $taskrecord->taskname = $data->taskname;
    $taskrecord->startdate = $data->startdate;
    $taskrecord->enddate = $data->enddate;
    $taskrecord->tasktype = $data->tasktype;
    $taskrecord->course = $courseid;

    $taskid = $group_task_id;
    $taskrecord->id = $taskid;

    $DB->update_record($grouptasktable, $taskrecord);
    $DB->delete_records($taskmodulemappingtable, array("taskid" => $taskid));
    // task module mapping (like forum, pdf, video)
    $taskmodulemapping = $data->activities;
    foreach ($taskmodulemapping as $moduleid) {
        $taskmodulerecord = new stdClass();
        $taskmodulerecord->taskid = $taskid;
        $taskmodulerecord->moduleid = $moduleid;
        $DB->insert_record($taskmodulemappingtable, $taskmodulerecord);


    }
    redirect($returnurl);
}

//Print Page and Form

$PAGE->set_title($edit_group_tasks_str);
$PAGE->set_heading($course->fullname. ': '.$edit_group_tasks_str);
$PAGE->set_pagelayout('admin');
navigation_node::override_active_url(new moodle_url('/group/index.php', array('id' => $courseid)));

$PAGE->navbar->add($edit_group_tasks_str);

echo $OUTPUT->header();
echo $OUTPUT->heading($edit_group_tasks_str);

$editform->display();


echo $OUTPUT->footer();
