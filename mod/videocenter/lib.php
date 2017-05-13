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
 * Library of interface functions and constants for module videocenter
 *
 * All the core Moodle functions, neeeded to allow the module to work
 * integrated in Moodle should be placed here.
 * All the videocenter specific functions, needed to implement all the module
 * logic, should go to locallib.php. This will help to save some memory when
 * Moodle is performing actions across all modules.
 *
 *
 * @package    mod
 * @subpackage videocenter
 * @copyright  2013 Emmanuel Meinike
 * @author     Emmanuel Meinike <emmanuel.meinike@stud.uni-due.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
function videocenter_add_instance(stdClass $videocenter, mod_videocenter_mod_form $mform = null) {
    global $DB;

    $videocenter->timecreated = time();

    # You may have to add extra stuff in here #

    return $DB->insert_record('videocenter', $videocenter);
}

function videocenter_update_instance(stdClass $videocenter, mod_videocenter_mod_form $mform = null) {
    global $DB;

    $videocenter->timemodified = time();
    $videocenter->id = $videocenter->instance;

    # You may have to add extra stuff in here #

    return $DB->update_record('videocenter', $videocenter);
}

function videocenter_delete_instance($id) {
    global $DB;

    if (! $videocenter = $DB->get_record('videocenter', array('id' => $id))) {
        return false;
    }

    # Delete any dependent records here #

    $DB->delete_records('videocenter', array('id' => $videocenter->id));

    return true;
}

function sortRdate($a, $b){
    if($a->timecreated < $b->timecreated){
        return 1;
    }else if($a->timecreated > $b->timecreated){
        return -1;
    }else{
         return 0;
    }
  
}

function sortdate($a, $b){
    if($a->timecreated < $b->timecreated){
        return -1;
    }else if($a->timecreated > $b->timecreated){
        return 1;
    }else{
         return 0;
    }
  
}

function sortRnames($a, $b){
    if(strcmp($a->name, $b->name) <0){
        return -1;
    }else if(strcmp($a->name, $b->name) > 0){
        return 1;
    }else{
         return 0;
    }
  
}

function sortnames($a, $b){
    if(strcmp($a->name, $b->name) <0){
        return 1;
    }else if(strcmp($a->name, $b->name) > 0){
        return -1;
    }else{
         return 0;
    }
  
}
