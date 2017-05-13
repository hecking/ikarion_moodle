<?php //$Id,v 1.0 2012/03/28 12:00:00 Serafim Panov Exp $ 

if (!defined('MOODLE_INTERNAL')) {
    die('Direct access to this script is forbidden.');  
}

require_once($CFG->dirroot . '/course/moodleform_mod.php');

class mod_etherpad_mod_form extends moodleform_mod {
    function definition() {
        global $COURSE, $CFG, $_GET, $DB, $PAGE;

        $mform    =& $this->_form;
        
//-------------------------------------------------------------------------------
    /// Adding the "general" fieldset, where all the common settings are showed
        $mform->addElement('header', 'general', get_string('general', 'form'));
    /// Adding the standard "name" field
        $mform->addElement('text', 'name', get_string('etherpadname', 'etherpad'), array('size'=>'64'));
        $mform->setType('name', PARAM_TEXT);
        $mform->addRule('name', null, 'required', null, 'client');
    /// Adding the optional "intro" and "introformat" pair of fields
        $this->add_intro_editor(true, get_string('etherpadquestion', 'etherpad'));

        $modinfo = get_fast_modinfo($COURSE->id);
        $mform->addElement('header', 'switchactivity', get_string('switchactivity', 'etherpad'));
        $this->build_activity_list($modinfo);


        // add standard elements, common to all modules
        $this->standard_coursemodule_elements();
//-------------------------------------------------------------------------------
        // add standard buttons, common to all modules
        $this->add_action_buttons();

    }

    function build_activity_list($modinfo) {
        global $DB;
        $mform =& $this->_form;
        $options = array(0 => get_string('none'));
        foreach($modinfo->get_cms() as $cm) {
            if($this->_instance != $cm->instance) {
                $options[$cm->id] = $cm->get_formatted_name();
            }
        }
        $select = $mform->addElement('select', 'activitymodule', get_string('activitymodule', 'etherpad'), $options);
        if(isset($this->_cm)) {
            $etherpad = $DB->get_record('etherpad',array("id" => $this->_cm->id));
            if($etherpad && $etherpad->activitymodule != NULL) {
                $select->setSelected($etherpad->activitymodule); // TODO: check if module still exists
            }
        }
        $mform->addHelpButton('activitymodule', 'activitymodule', 'etherpad');
    }
}


