<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.


/**
 * Create and allocate users to groups
 *
 * @package    core_group
 * @copyright  Matt Clarkson mattc@catalyst.net.nz
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once('../config.php');
require_once('lib.php');
require_once('autogroup_form.php');
// New! CSV library is needed for groupAL Plugin.
require_once($CFG->libdir.'/csvlib.class.php');
require_once('groupal.php');
//!New

if (!defined('AUTOGROUP_MIN_RATIO')) {
    define('AUTOGROUP_MIN_RATIO', 0.7); // means minimum member count is 70% in the smallest group
}

$courseid = required_param('courseid', PARAM_INT);

// New! GroupAL Plugin
$path = optional_param('path', null, PARAM_RAW);
$namingscheme = optional_param('namingscheme', null, PARAM_RAW);
$groupby = optional_param('groupby', null, PARAM_RAW);
$groupmembercount = optional_param('groupmembercount', null, PARAM_INT);
$delimiter = optional_param('delimiter', null, PARAM_RAW);
//!New

$PAGE->set_url('/group/autogroup.php', array('courseid' => $courseid));

if (!$course = $DB->get_record('course', array('id'=>$courseid))) {
    print_error('invalidcourseid');
}

// Make sure that the user has permissions to manage groups.
require_login($course);

$context       = context_course::instance($courseid);
require_capability('moodle/course:managegroups', $context);

$returnurl = $CFG->wwwroot.'/group/index.php?id='.$course->id;

$strgroups           = get_string('groups');
$strparticipants     = get_string('participants');
$strautocreategroups = get_string('autocreategroups', 'group');

$PAGE->set_title($strgroups);
$PAGE->set_heading($course->fullname. ': '.$strgroups);
$PAGE->set_pagelayout('admin');
navigation_node::override_active_url(new moodle_url('/group/index.php', array('id' => $courseid)));

// Print the page and form
$preview = '';
$error = '';

/// Get applicable roles - used in menus etc later on
$rolenames = role_fix_names(get_profile_roles($context), $context, ROLENAME_ALIAS, true);

//New! GroupAL plugin.
$csv_attributes = array();

if(!empty($path)){
    $content = file_get_contents($path);
    if(!empty($content)){
        $iid = csv_import_reader::get_new_iid('groupal');
        $cir = new csv_import_reader($iid, 'groupal');
        $readcount = $cir->load_csv_content($content, 'utf-8', $delimiter);
        $filecolumns = $cir->get_columns();
        foreach($filecolumns as $column){
            if($column != 'id'){
                array_push($csv_attributes, $column);
            }
        }
    }
}

/// Create the form
$editform = new autogroup_form(null, array('roles' => $rolenames, 'csv_attributes' => $csv_attributes, 'namingscheme' => $namingscheme, 'groupby' => $groupby, 'groupmembercount' => $groupmembercount, '_delimiter' => $delimiter));
$editform->set_data(array('courseid' => $courseid, 'seed' => time(), 'path' => $path));
//!New

/// Handle form submission
if ($editform->is_cancelled()) {
    redirect($returnurl);

} elseif ($data = $editform->get_data()) {

    /// Allocate members from the selected role to groups
    switch ($data->allocateby) {
        case 'no':
        case 'random':
        case 'lastname':
            $orderby = 'lastname, firstname'; break;
        case 'firstname':
            $orderby = 'firstname, lastname'; break;
        case 'idnumber':
            $orderby = 'idnumber'; break;
        default:
            print_error('unknoworder');
    }
    $source = array();
    if ($data->cohortid) {
        $source['cohortid'] = $data->cohortid;
    }
    if ($data->groupingid) {
        $source['groupingid'] = $data->groupingid;
    }
    if ($data->groupid) {
        $source['groupid'] = $data->groupid;
    }

    // Display only active users if the option was selected or they do not have the capability to view suspended users.
    $onlyactive = !empty($data->includeonlyactiveenrol) || !has_capability('moodle/course:viewsuspendedusers', $context);

    $users = groups_get_potential_members($data->courseid, $data->roleid, $source, $orderby, !empty($data->notingroup),
        $onlyactive);

    // New! GroupAL
    // Get users with specified attributes.
    $attributes = array();
    $weights = array();

    if ($data->allocateby == 'groupal'){

        $attributes['lang'] = $data->lang;
        $attributes['country'] = $data->country;
        $attributes['grades'] = $data->grades;
        $attributes['assignments'] = $data->assignments;
        $attributes['forum'] = $data->forum;
        $attributes['activity'] = $data->activity;

        foreach($attributes as $key => $value){
            if($value != 'disabled'){
                $weight = $key . '_weight';
                $weights[$key] = $data->$weight;
            }
        }

        $tmpUsers = array();
        while(!empty($users)){
            $user = array_shift($users);
            $tmpUser = groups_get_attributes($user->id, $courseid, $attributes);
            array_push($tmpUsers, $tmpUser);
        }
        $users = $tmpUsers;

        // Get users from CSV

        if(empty($content)){
            $name = $editform->get_new_filename('userfile');
            if(!empty($name)){
                $path = $_SERVER['DOCUMENT_ROOT'].'/groupal.csv';
                $editform->save_file('userfile', $path, true);
            }
        }else{
            $cir->init();

            while ($line = $cir->next()) {

                foreach($users as $user){
                    $existing = false;
                    foreach ($line as $keynum => $value) {
                        $key = $filecolumns[$keynum];
                        if($key == 'id' and $value == $user->id){
                            $existing = true;
                        }
                        elseif($existing == true){
                            $user->$key = $value;
                        }
                    }
                }
            }

            foreach($filecolumns as $column){
                if($column != 'id'){
                    $tmp = 'csv_'.$column;
                    $attributes[$column] = $data->$tmp;
                    $tmp .= '_weight';
                    $weights[$column] = $data->$tmp;
                }
            }
        }
    }
    // !New

    $usercnt = count($users);

    if ($data->allocateby == 'random') {
        srand($data->seed);
        shuffle($users);
    }

    $groups = array();

    // Plan the allocation
    if ($data->groupby == 'groups') {
        $numgrps    = $data->number;
        $userpergrp = floor($usercnt/$numgrps);

    } else { // members
        $numgrps    = ceil($usercnt/$data->number);
        $userpergrp = $data->number;

        if (!empty($data->nosmallgroups) and $usercnt % $data->number != 0) {
            // If there would be one group with a small number of member reduce the number of groups
            $missing = $userpergrp * $numgrps - $usercnt;
            if ($missing > $userpergrp * (1-AUTOGROUP_MIN_RATIO)) {
                // spread the users from the last small group
                $numgrps--;
                $userpergrp = floor($usercnt/$numgrps);
            }
        }
    }

    // New!
    //GroupAL algorithm
    if ($data->allocateby == 'groupal'){

        $max_values = get_max_values($users, $attributes);

        $participants = array();

        foreach($users as $user){
            $participant = new participant($user, $max_values, $attributes, $weights);
            array_push($participants, $participant);
        }

        $groups = array();

        for($i = 0; $i < $numgrps; $i++){
            $group = new stdClass();
            $group->participants = array();
            $group->members_max_size = $userpergrp;
            array_push($groups, $group);
        }

        $cohort = new stdClass();
        $cohort = do_one_formation($participants, $groups);

        $optimization = $data->optimization;

        for($i = 0; $i < $optimization; $i++){
            optimize_cohort($cohort);
        }

    }

    // Moved from below
    $groups = array();
    // !New

    // allocate the users - all groups equal count first
    for ($i=0; $i<$numgrps; $i++) {
        $groups[$i] = array();
        $groups[$i]['name']    = groups_parse_name(trim($data->namingscheme), $i);
        $groups[$i]['members'] = array();
        if ($data->allocateby == 'no') {
            continue; // do not allocate users
        } elseif($data->allocateby == 'groupal') { // New! GroupAL
            $participants = $cohort->groups[$i]->participants;
            foreach ($participants as $participant) {
                $user = groups_get_user($participant->id, $courseid);
                $groups[$i]['members'][$user->id] = $user;
            }
        } else { // New!

            for ($j = 0; $j < $userpergrp; $j++) {
                if (empty($users)) {
                    break 2;
                }
                $user = array_shift($users);
                $groups[$i]['members'][$user->id] = $user;
            }
        }
    }
    // now distribute the rest
    if ($data->allocateby != 'no' /*New! GroupAl */ and $data->allocateby != 'groupal' /*New!*/) {
        for ($i=0; $i<$numgrps; $i++) {
            if (empty($users)) {
                break 1;
            }
            $user = array_shift($users);
            $groups[$i]['members'][$user->id] = $user;
        }
    }

    // New! GroupAl
    if (isset($data->_continue)){
        $namingscheme = $data->namingscheme;
        $groupby = $data->groupby;
        $groupmembercount = $data->number;
        $delimiter = $data->delimiter;
        redirect(new moodle_url('/group/autogroup.php', array('courseid' => $courseid, 'path' => $path, 'namingscheme' => $namingscheme, 'groupby' => $groupby, 'groupmembercount' => $groupmembercount, 'delimiter' => $delimiter)));
    } else if (isset($data->preview)) { //New!
        $table = new html_table();
        if ($data->allocateby == 'no') {
            $table->head  = array(get_string('groupscount', 'group', $numgrps));
            $table->size  = array('100%');
            $table->align = array('left');
            $table->width = '40%';
        } else {
            $table->head  = array(get_string('groupscount', 'group', $numgrps), get_string('groupmembers', 'group'), get_string('usercounttotal', 'group', $usercnt));
            $table->size  = array('20%', '70%', '10%');
            $table->align = array('left', 'left', 'center');
            $table->width = '90%';
        }
        $table->data  = array();

        foreach ($groups as $group) {
            $line = array();
            if (groups_get_group_by_name($courseid, $group['name'])) {
                $line[] = '<span class="notifyproblem">'.get_string('groupnameexists', 'group', $group['name']).'</span>';
                $error = get_string('groupnameexists', 'group', $group['name']);
            } else {
                $line[] = $group['name'];
            }
            if ($data->allocateby != 'no') {
                $unames = array();
                foreach ($group['members'] as $user) {
                    $unames[] = fullname($user, true);
                }
                $line[] = implode(', ', $unames);
                $line[] = count($group['members']);
            }
            $table->data[] = $line;
        }

        $preview .= html_writer::table($table);

    } else {
        $grouping = null;
        $createdgrouping = null;
        $createdgroups = array();
        $failed = false;

        // prepare grouping
        if (!empty($data->grouping)) {
            if ($data->grouping < 0) {
                $grouping = new stdClass();
                $grouping->courseid = $COURSE->id;
                $grouping->name     = trim($data->groupingname);
                $grouping->id = groups_create_grouping($grouping);
                $createdgrouping = $grouping->id;
            } else {
                $grouping = groups_get_grouping($data->grouping);
            }
        }

        // Save the groups data
        foreach ($groups as $key=>$group) {
            if (groups_get_group_by_name($courseid, $group['name'])) {
                $error = get_string('groupnameexists', 'group', $group['name']);
                $failed = true;
                break;
            }
            $newgroup = new stdClass();
            $newgroup->courseid = $data->courseid;
            $newgroup->name     = $group['name'];
            $groupid = groups_create_group($newgroup);
            $createdgroups[] = $groupid;
            foreach($group['members'] as $user) {
                groups_add_member($groupid, $user->id);
            }
            if ($grouping) {
                // Ask this function not to invalidate the cache, we'll do that manually once at the end.
                groups_assign_grouping($grouping->id, $groupid, null, false);
            }
        }

        // Invalidate the course groups cache seeing as we've changed it.
        cache_helper::invalidate_by_definition('core', 'groupdata', array(), array($courseid));

        if ($failed) {
            foreach ($createdgroups as $groupid) {
                groups_delete_group($groupid);
            }
            if ($createdgrouping) {
                groups_delete_grouping($createdgrouping);
            }
        } else {
            redirect($returnurl);
        }
    }
}

$PAGE->navbar->add($strparticipants, new moodle_url('/user/index.php', array('id'=>$courseid)));
$PAGE->navbar->add($strgroups, new moodle_url('/group/index.php', array('id'=>$courseid)));
$PAGE->navbar->add($strautocreategroups);

echo $OUTPUT->header();
echo $OUTPUT->heading($strautocreategroups);

if ($error != '') {
    echo $OUTPUT->notification($error);
}

/// Display the form
$editform->display();

if($preview !== '') {
    echo $OUTPUT->heading(get_string('groupspreview', 'group'));

    echo $preview;
}

echo $OUTPUT->footer();
