<?php
global $CFG;
require_once($CFG->dirroot.'/lib/formslib.php');

class ccm_selection_form extends moodleform {

    function definition() {
        global $CFG;
        $cid = $this->_customdata['cid'];
        $mform =& $this->_form;

        if(empty($this->_customdata['groups'])){
            $mform->addElement('static', 'description', null,get_string('nomaps', 'ccm'));
            $mform->addElement('submit', 'cancel', get_string('backButton', 'ccm'));
        }else{
            $select = $mform->addElement('select', 'groups',get_string('selectNotice', 'ccm') , $this->_customdata['groups'], $attributes);
            $this->add_action_buttons($cancel = true, get_string('selectButton', 'ccm'));
        }
        
        $mform->addElement('hidden', 'cid', $cid);
        $mform->setType('cid', PARAM_INT);
    }                           
}

class ccm_comment_form extends moodleform {

    function definition() {
        global $CFG;
        $role = $this->_customdata['role'];
        $currentComment = $this->_customdata['currentComment'];
        $cid = $this->_customdata['cid'];
        $gid = $this->_customdata['gid'];
        $mform =& $this->_form;

        if($role==="student"){
            $mform->addElement('static', 'description', null,$currentComment);
        }else{
            $mform->addElement('textarea', 'comment', null, 'wrap="virtual" rows="10" cols="100"');
            $mform->setDefault('comment', $currentComment);
            $mform->addElement('submit', 'save', get_string('saveButton','ccm'));

            $mform->addElement('hidden', 'id', $cid);
            $mform->setType('id', PARAM_INT);

            $mform->addElement('hidden', 'gid', $gid);
            $mform->setType('gid', PARAM_INT);

            $mform->addElement('hidden', 'selected', true);
            $mform->setType('selected', PARAM_BOOL);
        }
    }                           
}          

class ccm_protocol_form extends moodleform {

    function definition() {
        global $CFG;
        $role = $this->_customdata['role'];
        $currentComment = $this->_customdata['currentComment'];
        $cid = $this->_customdata['cid'];
        $gid = $this->_customdata['gid'];
        $mform =& $this->_form;
    }                   
}                        

?>