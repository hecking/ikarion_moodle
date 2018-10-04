<?php
/**
 * Created by PhpStorm.
 * User: Yassin
 * Date: 02.10.2018
 * Time: 12:51
 */

/**
 * Created by PhpStorm.
 * User: Yassin
 * Date: 02.10.2018
 * Time: 10:23
 */

require_once($CFG->dirroot . '/lib/formslib.php');
require_once($CFG->dirroot . '/cohort/lib.php');

class group_task_edit_form extends moodleform
{
    function definition()
    {
        global $CFG, $COURSE, $DB;

        $mform =& $this->_form;

        $group_task_id = $this->_customdata["group_task_id"];
        $courseid = $this->_customdata["courseid"];
        $mform->addElement("hidden", "form_courseid", $courseid);
        $mform->setType("form_courseid", PARAM_INT);

        $mform->addElement("hidden", "form_taskid", $group_task_id);
        $mform->setType("form_taskid", PARAM_INT);

        $task_options = array("id" => $group_task_id);
        $task_table = "group_task";
        $taskrecord = $DB->get_record($task_table, $task_options);
        $task_module_table = "task_module_mapping";
        $taskmodules = $DB->get_records($task_module_table, array("taskid" => $taskrecord->id));


        // task Form Here
        $mform->addElement('header', 'grouptaskhdr', get_string('grouptask', 'group'));
        $mform->setExpanded('grouptaskhdr', true);


        // name of task
        $taskname = $mform->addElement('text',
            'taskname',
            get_string('taskname', 'group'));
        $mform->setDefault("taskname", $taskrecord->taskname);
        $mform->setType('taskname', PARAM_TEXT);
        // start and end date
//            $start_date_object = $date = DateTime::createFromFormat('U', $taskrecord->startdate);
//            $end_date_object = $date = DateTime::createFromFormat('U', $taskrecord->enddate);
//            $start_date_default = array(
//                "startyear" => $start_date_object->format("Y"),
//                "startmonth" => $start_date_object->format("m"),
//                "startday" => $start_date_object->format("d"),
//                "starthour" => $start_date_object->format("H"),
//                "startminute" => $start_date_object->format("i"),
//            );
//
//            $end_date_default = array(
//                "stopyear" => $end_date_object->format("Y"),
//                "stopmonth" => $end_date_object->format("m"),
//                "stopday" => $end_date_object->format("d"),
//                "stophour" => $end_date_object->format("H"),
//                "stopminute" => $end_date_object->format("i"),
//            );


        $name = get_string('startdate', 'group');
        $options = array('optional' => false);
        $startdate = $mform->addElement('date_time_selector', 'startdate', $name, $options);
        $mform->setDefault("startdate", $taskrecord->startdate);

        $name = get_string('enddate', 'group');
        $mform->addElement('date_time_selector', 'enddate', $name, array('optional' => false));
        $mform->setDefault("enddate", $taskrecord->enddate);
        $tasktypelist = get_string('tasktypelist', 'group');
        $mform->addElement('select', 'tasktype', get_string('tasktype', 'group'), $tasktypelist);
        $mform->setDefault("tasktype", $taskrecord->tasktype);

        // multiple select form for activities

        // get info for modules in course
        $modinfo = get_fast_modinfo($COURSE->id);
        $activitylist = array();
        foreach ($modinfo->get_cms() as $cm) {
            if ($this->_instance != $cm->instance) {
                $activitylist[$cm->id] = $cm->get_formatted_name();
            }
        }

        $taskmodulesdefault = array();
        foreach ($taskmodules as $taskmodulerecord) {
            $taskmodulesdefault[] = (int)$taskmodulerecord->moduleid;
        }


        $select = $mform->addElement('select', 'activities', get_string('activities', 'group'), $activitylist);
        $select->setMultiple(true);
        $mform->getElement("activities")->setSelected($taskmodulesdefault);


        // task Form ENd
        $buttonarray = array();
        $buttonarray[] = &$mform->createElement('submit', 'submitbutton', get_string('submit'));
        $buttonarray[] = &$mform->createElement('cancel', 'cancelbutton', get_string('cancel'));
        $mform->addGroup($buttonarray, 'buttonar', '', array(' '), false);


    }
}