<?php
/**
 * Created by PhpStorm.
 * User: Yassin
 * Date: 02.10.2018
 * Time: 10:23
 */

require_once($CFG->dirroot . '/lib/formslib.php');
require_once($CFG->dirroot . '/cohort/lib.php');

class group_task_select_form extends moodleform
{
    function definition()
    {
        global $CFG, $COURSE, $DB;

        $mform =& $this->_form;
        $courseid = $this->_customdata["courseid"];
        // Needed Strings
        $group_task_str = get_string('grouptask', 'group');

        $group_task_table = "group_task";
        $group_task_conditions = array("course" => $COURSE->id);

        $group_task_records = $DB->get_records($group_task_table, $group_task_conditions);

        $group_task_options = array();
        foreach($group_task_records as $record){
            $group_task_options[$record->id] = $record->taskname;
        }

        $mform->addElement("hidden", "form_courseid", $courseid);
        $mform->setType("form_courseid", PARAM_INT);
        $mform->addElement('select', 'group_task_id', $group_task_str, $group_task_options);

        $buttonarray = array();
        $buttonarray[] = &$mform->createElement('submit', 'submitbutton', get_string('submit'));
        $mform->addGroup($buttonarray, 'buttonar', '', array(' '), false);

//        $this->add_action_buttons($submitlabel="select");

    }
}