<?php
require_once($CFG->dirroot.'/course/moodleform_mod.php');

class mod_ccm_mod_form extends moodleform_mod {
 
    function definition() {
        global $CFG, $DB, $OUTPUT;
 
        $mform =& $this->_form;

        $mform->addElement('header', 'general', get_string('general', 'form'));
 
        $mform->addElement('text', 'name', get_string('mappername', 'ccm'), array('size'=>'64'));
        $mform->setType('name', PARAM_TEXT);
        $mform->addRule('name', null, 'required', null, 'client');
        $mform->addRule('name', get_string('maximumchars', '', 255), 'maxlength', 255, 'client');

        $mform->addElement('header', 'timing', get_string('timing', 'ccm'));
        $mform->addElement('date_time_selector', 'timeclose', get_string('mapclose', 'ccm'));

        $this->standard_coursemodule_elements();
 
        $this->add_action_buttons();
    }
}
?>