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
 * The main videocenter configuration form
 *
 * It uses the standard core Moodle formslib. For more info about them, please
 * visit: http://docs.moodle.org/en/Development:lib/formslib.php
 *
 * The boilerplate code comes from this project:
 * @see https://github.com/moodlehq/moodle-mod_newmodule
 *
 *
 * @package    mod
 * @subpackage videocenter
 * @copyright  2013 Emmanuel Meinike
 * @author     Emmanuel Meinike <emmanuel.meinike@stud.uni-due.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot.'/course/moodleform_mod.php');

class mod_videocenter_mod_form extends moodleform_mod {

	public function definition() {


	  	$mform = $this->_form;
	  	$mform->addElement('text', 'name','Name', array('size'=>'64'));
        $mform->setType('name', PARAM_TEXT);
		$mform->setDefault('name', "Videocenter");
	    $this->add_intro_editor();

        $this->standard_coursemodule_elements();

        $this->add_action_buttons();



}
}