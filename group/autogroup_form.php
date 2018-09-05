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
 * Auto group form
 *
 * @package    core_group
 * @copyright  2007 mattc-catalyst (http://moodle.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
if (!defined('MOODLE_INTERNAL')) {
    die('Direct access to this script is forbidden.');    ///  It must be included from a Moodle page
}

require_once($CFG->dirroot.'/lib/formslib.php');
require_once($CFG->dirroot.'/cohort/lib.php');
// New! CSV library for GroupAL.
require_once($CFG->libdir.'/csvlib.class.php');
// New!

/**
 * Auto group form class
 *
 * @package    core_group
 * @copyright  2007 mattc-catalyst (http://moodle.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class autogroup_form extends moodleform {

    /**
     * Form Definition
     */
    function definition() {
        global $CFG, $COURSE, $DB;

        $mform =& $this->_form;

        $mform->addElement('header', 'autogroup', get_string('general'));

        $mform->addElement('text', 'namingscheme', get_string('namingscheme', 'group'));
        $mform->addHelpButton('namingscheme', 'namingscheme', 'group');
        $mform->addRule('namingscheme', get_string('required'), 'required', null, 'client');
        $mform->setType('namingscheme', PARAM_TEXT);
        // There must not be duplicate group names in course.
        $template = get_string('grouptemplate', 'group');
        $gname = groups_parse_name($template, 0);
        if (!groups_get_group_by_name($COURSE->id, $gname)) {
            $mform->setDefault('namingscheme', $template);
        }

        $options = array('groups' => get_string('numgroups', 'group'),
                         'members' => get_string('nummembers', 'group'),
            // New!
            'groupal'   => get_string('groupal', 'group'));
            // New!);
        $mform->addElement('select', 'groupby', get_string('groupby', 'group'), $options);

        $mform->addElement('text', 'number', get_string('number', 'group'),'maxlength="4" size="4"');
        $mform->setType('number', PARAM_INT);
        $mform->addRule('number', null, 'numeric', null, 'client');
        $mform->addRule('number', get_string('required'), 'required', null, 'client');

        $mform->addElement('header', 'groupmembershdr', get_string('groupmembers', 'group'));
        $mform->setExpanded('groupmembershdr', true);

        $options = array(0=>get_string('all'));
        $options += $this->_customdata['roles'];
        $mform->addElement('select', 'roleid', get_string('selectfromrole', 'group'), $options);

        $student = get_archetype_roles('student');
        $student = reset($student);

        if ($student and array_key_exists($student->id, $options)) {
            $mform->setDefault('roleid', $student->id);
        }

        $coursecontext = context_course::instance($COURSE->id);
        if ($cohorts = cohort_get_available_cohorts($coursecontext, COHORT_WITH_ENROLLED_MEMBERS_ONLY, 0, 0)) {
            $options = array(0 => get_string('anycohort', 'cohort'));
            foreach ($cohorts as $c) {
                $options[$c->id] = format_string($c->name, true, context::instance_by_id($c->contextid));
            }
            $mform->addElement('select', 'cohortid', get_string('selectfromcohort', 'cohort'), $options);
            $mform->setDefault('cohortid', '0');
        } else {
            $mform->addElement('hidden','cohortid');
            $mform->setType('cohortid', PARAM_INT);
            $mform->setConstant('cohortid', '0');
        }

        if ($groupings = groups_get_all_groupings($COURSE->id)) {
            $options = array();
            $options[0] = get_string('none');
            foreach ($groupings as $grouping) {
                $options[$grouping->id] = format_string($grouping->name);
            }
            $mform->addElement('select', 'groupingid', get_string('selectfromgrouping', 'group'), $options);
            $mform->setDefault('groupingid', 0);
            $mform->disabledIf('groupingid', 'notingroup', 'checked');
        } else {
            $mform->addElement('hidden', 'groupingid');
            $mform->setType('groupingid', PARAM_INT);
            $mform->setConstant('groupingid', 0);
        }

        if ($groups = groups_get_all_groups($COURSE->id)) {
            $options = array();
            $options[0] = get_string('none');
            foreach ($groups as $group) {
                $options[$group->id] = format_string($group->name);
            }
            $mform->addElement('select', 'groupid', get_string('selectfromgroup', 'group'), $options);
            $mform->setDefault('groupid', 0);
            $mform->disabledIf('groupid', 'notingroup', 'checked');
        } else {
            $mform->addElement('hidden', 'groupid');
            $mform->setType('groupid', PARAM_INT);
            $mform->setConstant('groupid', 0);
        }

        $options = array('no'        => get_string('noallocation', 'group'),
                         'random'    => get_string('random', 'group'),
                         'firstname' => get_string('byfirstname', 'group'),
                         'lastname'  => get_string('bylastname', 'group'),
                         'idnumber'  => get_string('byidnumber', 'group'));
        $mform->addElement('select', 'allocateby', get_string('allocateby', 'group'), $options);
        $mform->setDefault('allocateby', 'random');

        $mform->addElement('checkbox', 'nosmallgroups', get_string('nosmallgroups', 'group'));
        $mform->disabledIf('nosmallgroups', 'groupby', 'noteq', 'members');

        $mform->addElement('checkbox', 'notingroup', get_string('notingroup', 'group'));
        $mform->disabledIf('notingroup', 'groupingid', 'neq', 0);
        $mform->disabledIf('notingroup', 'groupid', 'neq', 0);

        if (has_capability('moodle/course:viewsuspendedusers', $coursecontext)) {
            $mform->addElement('checkbox', 'includeonlyactiveenrol', get_string('includeonlyactiveenrol', 'group'), '');
            $mform->addHelpButton('includeonlyactiveenrol', 'includeonlyactiveenrol', 'group');
            $mform->setDefault('includeonlyactiveenrol', true);
        }

        // New!
        //GroupAL options
        $mform->addElement('hidden','path');
        $mform->setType('path', PARAM_RAW);

        $mform->addElement('hidden', '_delimiter');
        $mform->setType('_delimiter',PARAM_RAW);

        $mform->addElement('header', 'groupalhdr', get_string('groupal', 'group'));

        $options = array('disabled'     => get_string('disabled', 'group'),
            'heterogen'    => get_string('heterogen', 'group'),
            'homogen'      => get_string('homogen', 'group'));

        $attributes = array();
        $attributes[] =& $mform->createElement('select', 'lang', '', $options);
        $attributes[] =& $mform->createElement('text', 'lang_weight', '','maxlength="3" size="2"');
        $mform->addGroup($attributes, 'lang_attr', get_string('lang', 'group'), array(' '), false);

        $attributes = array();
        $attributes[] =& $mform->createElement('select', 'country', '', $options);
        $attributes[] =& $mform->createElement('text', 'country_weight', '','maxlength="3" size="2"');
        $mform->addGroup($attributes, 'country_attr', get_string('country', 'group'), array(' '), false);

        $attributes = array();
        $attributes[] =& $mform->createElement('select', 'grades', '', $options);
        $attributes[] =& $mform->createElement('text', 'grades_weight', '','maxlength="3" size="2"');
        $mform->addGroup($attributes, 'grades_attr', get_string('grades', 'group'), array(' '), false);

        $attributes = array();
        $attributes[] =& $mform->createElement('select', 'assignments', '', $options);
        $attributes[] =& $mform->createElement('text', 'assignments_weight', '','maxlength="3" size="2"');
        $mform->addGroup($attributes, 'assignments_attr', get_string('assignments', 'group'), array(' '), false);

        $attributes = array();
        $attributes[] =& $mform->createElement('select', 'forum', '', $options);
        $attributes[] =& $mform->createElement('text', 'forum_weight', '','maxlength="3" size="2"');
        $mform->addGroup($attributes, 'forum_attr', get_string('forum', 'group'), array(' '), false);

        $attributes = array();
        $attributes[] =& $mform->createElement('select', 'activity', '', $options);
        $attributes[] =& $mform->createElement('text', 'activity_weight', '','maxlength="3" size="2"');
        $mform->addGroup($attributes, 'activity_attr', get_string('activity', 'group'), array(' '), false);

        $mform->setType('lang_weight', PARAM_FLOAT);
        $mform->setDefault('lang_weight', '1.0');

        $mform->setType('country_weight', PARAM_FLOAT);
        $mform->setDefault('country_weight', '1.0');

        $mform->setType('grades_weight', PARAM_FLOAT);
        $mform->setDefault('grades_weight', '1.0');

        $mform->setType('assignments_weight', PARAM_FLOAT);
        $mform->setDefault('assignments_weight', '1.0');

        $mform->setType('forum_weight', PARAM_FLOAT);
        $mform->setDefault('forum_weight', '1.0');

        $mform->setType('activity_weight', PARAM_FLOAT);
        $mform->setDefault('activity_weight', '1.0');

        $mform->disabledIf('lang', 'allocateby', 'neq', 'groupal');
        $mform->disabledIf('country', 'allocateby', 'neq', 'groupal');
        $mform->disabledIf('grades', 'allocateby', 'neq', 'groupal');
        $mform->disabledIf('assignments', 'allocateby', 'neq', 'groupal');
        $mform->disabledIf('forum', 'allocateby', 'neq', 'groupal');
        $mform->disabledIf('activity', 'allocateby', 'neq', 'groupal');

        $mform->disabledIf('lang_weight', 'lang', 'eq', 'disabled');
        $mform->disabledIf('lang_weight', 'allocateby', 'neq', 'groupal');
        $mform->disabledIf('country_weight', 'country', 'eq', 'disabled');
        $mform->disabledIf('country_weight', 'allocateby', 'neq', 'groupal');
        $mform->disabledIf('grades_weight', 'grades', 'eq', 'disabled');
        $mform->disabledIf('grades_weight', 'allocateby', 'neq', 'groupal');
        $mform->disabledIf('assignments_weight', 'assignments', 'eq', 'disabled');
        $mform->disabledIf('assignments_weight', 'allocateby', 'neq', 'groupal');
        $mform->disabledIf('forum_weight', 'forum', 'eq', 'disabled');
        $mform->disabledIf('forum_weight', 'allocateby', 'neq', 'groupal');
        $mform->disabledIf('activity_weight', 'activity', 'eq', 'disabled');
        $mform->disabledIf('activity_weight', 'allocateby', 'neq', 'groupal');

        //CSV import options
        if(empty($this->_customdata['csv_attributes'])){
            $mform->addElement('filepicker', 'userfile', get_string('file', 'group'), null,
                array('maxbytes' => 1024, 'accepted_types' => '*'));
            $mform->disabledIf('userfile', 'allocateby', 'neq', 'groupal');

            $delimiters = csv_import_reader::get_delimiter_list();

            $mform->addElement('select', 'delimiter', get_string('delimiter','group'), $delimiters);
            $mform->addElement('submit', '_continue', get_string('continue', 'group'));

            $mform->disabledIf('delimiter', 'allocateby', 'neq', 'groupal');
            $mform->disabledIf('_continue', 'allocateby', 'neq', 'groupal');
        }else{

            $mform->setDefault('allocateby','groupal');
            $mform->setExpanded('groupalhdr', true);
            $csv_attributes = $this->_customdata['csv_attributes'];
            foreach($csv_attributes as $csv_attribute){
                $name = 'csv_'.$csv_attribute;
                $weight = $name.'_weight';
                $attributes = array();
                $attributes[] =& $mform->createElement('select', $name, '', $options);
                $attributes[] =& $mform->createElement('text', $weight, '','maxlength="3" size="2"');
                $mform->addGroup($attributes, $csv_attribute.'_attr', $csv_attribute, array(' '), false);

                $mform->setType($weight, PARAM_FLOAT);
                $mform->setDefault($weight, '1.0');
                $mform->disabledIf($name, 'allocateby', 'neq', 'groupal');
                $mform->disabledIf($weight, $name, 'eq', 'disabled');
                $mform->disabledIf($weight, 'allocateby', 'neq', 'groupal');
            }

            $mform->setDefault('namingscheme',$this->_customdata['namingscheme']);
            $mform->setDefault('groupby',$this->_customdata['groupby']);
            $mform->setDefault('number',$this->_customdata['groupmembercount']);
        }

        $mform->addElement('text', 'optimization', get_string('optimization', 'group'),'maxlength="2" size="2"');
        $mform->setType('optimization', PARAM_INT);
        $mform->addRule('optimization', null, 'numeric', null, 'client');
        $mform->setDefault('optimization', 0);
        $mform->disabledIf('optimization', 'allocateby', 'neq', 'groupal');
        $mform->disabledIf('nosmallgroups', 'allocateby', 'neq', 'groupal');
        // New!

        $mform->addElement('header', 'groupinghdr', get_string('grouping', 'group'));

        $options = array('0' => get_string('nogrouping', 'group'),
                         '-1'=> get_string('newgrouping', 'group'));
        if ($groupings = groups_get_all_groupings($COURSE->id)) {
            foreach ($groupings as $grouping) {
                $options[$grouping->id] = strip_tags(format_string($grouping->name));
            }
        }
        $mform->addElement('select', 'grouping', get_string('createingrouping', 'group'), $options);
        if ($groupings) {
            $mform->setDefault('grouping', '-1');
        }

        $mform->addElement('text', 'groupingname', get_string('groupingname', 'group'), $options);
        $mform->setType('groupingname', PARAM_TEXT);
        $mform->disabledIf('groupingname', 'grouping', 'noteq', '-1');

        $mform->addElement('hidden','courseid');
        $mform->setType('courseid', PARAM_INT);

        $mform->addElement('hidden','seed');
        $mform->setType('seed', PARAM_INT);

        // task Form Here
        $mform->addElement('header', 'grouptaskhdr', get_string('grouptaskhdr', 'group'));
        $mform->setExpanded('grouptaskhdr', true);

//        $table = 'assign';
//        $conditions = array('course' => $COURSE->id);
//        $assignmentRecords = $DB->get_records($table, $conditions, $sort='', $fields='*', $limitfrom=0, $limitnum=0);
//        $assignmentNames = array();
//        foreach ($assignmentRecords as $am){
//            // print_object($am);
//            $assignmentNames[$am->id] = $am->name;
//            // $assignmentNames[] = $am->name;
//        }

        // name of task
        $mform->addElement('text', 'taskname', get_string('taskname', 'group'));
        $mform->setType('taskname', PARAM_TEXT);
        // start and end date
        $name = get_string('startdate', 'group');
        $options = array('optional'=>false);
        $mform->addElement('date_time_selector', 'startdate', $name, $options);

        $name = get_string('enddate', 'group');
        $mform->addElement('date_time_selector', 'enddate', $name, array('optional'=>false));
        $tasktypelist = get_string('tasktypelist', 'group');
        $mform->addElement('select', 'tasktype', get_string('tasktype', 'group'), $tasktypelist);

        // multiple select form for activities

        // get info for modules in course
        $modinfo = get_fast_modinfo($COURSE->id);
        $activitylist = array();
        foreach($modinfo->get_cms() as $cm) {
            if($this->_instance != $cm->instance) {
                $activitylist[$cm->id] = $cm->get_formatted_name();
            }
        }


        $select = $mform->addElement('select', 'activities', get_string('activities', 'group'), $activitylist);
        $select->setMultiple(true);


        // task Form ENd

        $buttonarray = array();
        $buttonarray[] = &$mform->createElement('submit', 'preview', get_string('preview'));
        $buttonarray[] = &$mform->createElement('submit', 'submitbutton', get_string('submit'));
        $buttonarray[] = &$mform->createElement('cancel');
        $mform->addGroup($buttonarray, 'buttonar', '', array(' '), false);
        $mform->closeHeaderBefore('buttonar');


    }

    /**
     * Performs validation of the form information
     *
     * @param array $data
     * @param array $files
     * @return array $errors An array of $errors
     */
    function validation($data, $files) {
        global $CFG, $COURSE;
        $errors = parent::validation($data, $files);

        if ($data['allocateby'] != 'no') {
            $source = array();
            if ($data['cohortid']) {
                $source['cohortid'] = $data['cohortid'];
            }
            if ($data['groupingid']) {
                $source['groupingid'] = $data['groupingid'];
            }
            if ($data['groupid']) {
                $source['groupid'] = $data['groupid'];
            }
            if (!$users = groups_get_potential_members($data['courseid'], $data['roleid'], $source)) {
                $errors['roleid'] = get_string('nousersinrole', 'group');
            }

           /// Check the number entered is sane
            if ($data['groupby'] == 'groups') {
                $usercnt = count($users);

                if ($data['number'] > $usercnt || $data['number'] < 1) {
                    $errors['number'] = get_string('toomanygroups', 'group', $usercnt);
                }
            }
        }

        //try to detect group name duplicates
        $name = groups_parse_name(trim($data['namingscheme']), 0);
        if (groups_get_group_by_name($COURSE->id, $name)) {
            $errors['namingscheme'] = get_string('groupnameexists', 'group', $name);
        }

        // check grouping name duplicates
        if ( isset($data['grouping']) && $data['grouping'] == '-1') {
            $name = trim($data['groupingname']);
            if (empty($name)) {
                $errors['groupingname'] = get_string('required');
            } else if (groups_get_grouping_by_name($COURSE->id, $name)) {
                $errors['groupingname'] = get_string('groupingnameexists', 'group', $name);
            }
        }

       /// Check the naming scheme
        if ($data['groupby'] == 'groups' and $data['number'] == 1) {
            // we can use the name as is because there will be only one group max
        } else {
            $matchcnt = preg_match_all('/[#@]{1,1}/', $data['namingscheme'], $matches);
            if ($matchcnt != 1) {
                $errors['namingscheme'] = get_string('badnamingscheme', 'group');
            }
        }

        return $errors;
    }
}
