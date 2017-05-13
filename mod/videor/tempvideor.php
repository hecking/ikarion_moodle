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
 * Insert Uploaded Video File Information for Later use in lib.php
 *
 *
 * @package    mod
 * @subpackage videor
 * @copyright  2013 Emmanuel Meinike
 * @author     Emmanuel Meinike <emmanuel.meinike@stud.uni-due.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(dirname(dirname(dirname(__FILE__))).'/config.php');
require_once(dirname(__FILE__).'/lib.php');


$title = $_GET['title'];
$vid = $_GET['vid'];
$token = $_GET['token'];

$tempvideor = new stdClass();
$tempvideor->vid = $vid;
$tempvideor->title= $title;
$tempvideor->token = $token;

if($USER->id != 0){
	$DB->insert_record('tempvideor', $tempvideor, true, false);
}




