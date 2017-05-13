<?php
// This file is an extension of Moodle - http://moodle.org/
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
 * The main videor configuration form
 *
 * It uses the standard core Moodle formslib. For more info about them, please
 * visit: http://docs.moodle.org/en/Development:lib/formslib.php
 *
 * The boilerplate code comes from this project:
 * @see https://github.com/moodlehq/moodle-mod_newmodule
 *
 *
 * @package    mod
 * @subpackage videor
 * @copyright  2013 Emmanuel Meinike
 * @author     Emmanuel Meinike <emmanuel.meinike@stud.uni-due.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


if (!defined('MOODLE_INTERNAL')) {
    die('Direct access to this script is forbidden.');    ///  It must be included from a Moodle page
}
 
require_once($CFG->dirroot.'/course/moodleform_mod.php');
require_once($CFG->dirroot.'/mod/videor/lib.php');
 
class mod_videor_mod_form extends moodleform_mod {
 
    

    public function definition() {
        global $CFG, $DB, $OUTPUT,$isupdate,$PAGE;
        
        $PAGE->requires->js('/mod/videor/jquery-1.8.3.js');
        $PAGE->requires->js('/mod/videor/jquery-ui-1.9.2.custom.min.js');
        $PAGE->requires->js('/mod/videor/upload.js');
        $PAGE->requires->js('/mod/videor/toggle.js');

        $PAGE->requires->js('/mod/videor/configJS.js');


        $url = new moodle_url('/course/modedit.php');
        $url2 = $url.'?'.$_SERVER['QUERY_STRING'];
        $isupdate = $id = optional_param('update', 0, PARAM_INT);

   

        $mform = $this->_form;
        
        //General

        $mform->addElement('text', 'name', get_string('name', 'mod_videor'), array('size'=>'64'));
        $mform->setType('name', PARAM_TEXT);
        $mform->addRule('name', get_string('errorname', 'mod_videor'), 'required', null, 'server');
        $this->add_intro_editor();

       

        $mform->addElement('html','<div class="ui-widget">');
        $mform->addElement('text', 'tags', get_string('tags', 'mod_videor'), array('size'=>'64'));
        $mform->setType('name', PARAM_TEXT);
        $mform->addElement('html','</div>');
        $mform->addHelpButton('tags', 'tags', 'videor');



        if(!$isupdate){
        $mform->addElement('select', 'resource_type', get_string('resourcetype', 'mod_videor'), array('URL', 'Repository', get_string('file', 'mod_videor')), null);
        $mform->setType('resource_type', PARAM_INT);
        $mform->addHelpButton('resource_type', 'resource_type', 'videor');

        $mform->addElement('advcheckbox', 'allowsharing', get_string('allowsharing', 'videor'), null, null, array(0, 1));
        $mform->setDefault('allowsharing', 1);
        $mform->addHelpButton('allowsharing', 'allowsharing', 'videor');

        }
       

        //URL Resource
        if(!$isupdate){
        $mform->addElement('header', 'header3', 'Youtube Resource');
        $mform->addElement('text', 'url', 'URL', array('size'=>'64'));
        $mform->setType('url', PARAM_TEXT);

        $mform->disabledIf('url', 'resource_type','neq',0);

       

        //Repository Resource
        $mform->addElement('header', 'header2', 'Repository Resource');
        $mform->addElement('filepicker', 'userfile', get_string('file'), null, array('maxbytes' => 900000000, 'accepted_types' => '*'));

        $mform->disabledIf('userfile', 'resource_type','neq',1);

       

        //FileUpload
        
        $mform->addElement('header', 'header3', 'File Resource');
       
        $mform->addElement('html','<div style="margin-left:16%;width:80%">');
        $mform->addElement('html','<input type="file" name="myfile2" id="myfile2" DISABLED>');
        $mform->addElement('html','<input type="button" value="'.get_string('uploadtoserver', 'mod_videor').'" onclick="uploadf()" id="filebutton" DISABLED><p id="console">Output 1</p><p id="deleteconsole">Output 2</p>');
        $mform->addElement('html','</div>');
        $mform->addElement('hidden', 'videoid', '');
        $mform->addElement('hidden', 'videotitle', '');

        }

        $this->standard_coursemodule_elements();
 
        $this->add_action_buttons();
    }

    function validation($data, $files) {
         global $isupdate;
        $errors= array();
        if($isupdate== 0 && $data['resource_type'] == 0){


            $url =$data['url'];
            if(!(strpos($url, 'http')== 0) || !(strpos($url, 'https')==0) ){
                $url ='http://'.$url;
            }
            $parsedurl = parse_url($url);
            if(array_key_exists('host', $parsedurl) && array_key_exists('path', $parsedurl)){
                if(($parsedurl['host'] !='youtube.com' && $parsedurl['path'] !='/watch')){

                    $errors['url']= 'Not a valid Youtube url.Url has to have form: http://www.youtube.com/watch?v=xxxxxxxxx';

                }else{
                     parse_str($parsedurl['query'],$queryarray);
                  
                    if(!array_key_exists('v',$queryarray)){
                    $errors['url']= 'Not a valid Youtube url. No Video ID.Url has to have form: http://www.youtube.com/watch?v=xxxxxxxxx';

                    }
                   
                    
                }
            }else{
                $errors['url']= 'Not a valid Youtube url.Url has to have form: http://www.youtube.com/watch?v=xxxxxxxxx';
            }
        }
          
         return $errors;     
    }

     

}