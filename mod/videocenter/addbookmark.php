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
 * Inserts new Bookmark into Database
 * 
 *
 *
 * @package    mod
 * @subpackage videocenter
 * @copyright  2013 Emmanuel Meinike
 * @author     Emmanuel Meinike <emmanuel.meinike@stud.uni-due.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(dirname(dirname(dirname(__FILE__))).'/config.php');
require_once(dirname(__FILE__).'/lib.php');
$courseid = $_GET['courseid'];
$instanceid = $_GET['vid'];
$userid = $_GET['uid'];
$time = $_GET['time'];
$title = $_GET['title'];
$type = $_GET['type'];

$context = get_context_instance(CONTEXT_COURSE, $courseid);

if($userid == $USER->id){

$bookmark = new stdClass();
$bookmark->instanceid = $instanceid;
$bookmark->courseid = $courseid;
$bookmark->userid = $userid;
$bookmark->time = $time;
$bookmark->title = $title;
$bookmark->type = $type;
	
add_to_log($courseid, "videor", "add Bookmark",'view.php?id=330', $bookmark->title, '', $userid);

$DB->insert_record('video_bookmarks', $bookmark);



echo json_encode($bookmark);

}