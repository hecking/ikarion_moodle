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
 * Get tree Visualisation Data from Server as JSON String.
 * Used when Video is clicked
 *
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
$tid = $_GET['id'];
$cid =  $_GET['c'];

//Get tag info for current tag id
$tag = $DB->get_record('videor_tags', array('id' => $tid));
$avideos = array();

//get video ids with tag 'film'
$sql = 'SELECT instanceid from {videor_tags} WHERE '.$DB->sql_compare_text('content', 32).' =? AND courseid = ?';
$tagsvideos= $DB->get_records_sql($sql,array($tag->content,$cid));



foreach ($tagsvideos as $value) {
	//video and videor for given ids
	$videor = $DB->get_record('videos', array('id' => $value->instanceid));
	$video = $DB->get_records('videor', array('videoid' => $value->instanceid,'course' => 3));
	$video =reset($video);
	$cm = get_coursemodule_from_instance('videor', $video->id, $video->course, false, MUST_EXIST);

	$data = new stdClass();
	$data->course = $cid;
	$data->type = 'video';
	$data->vid = $cm->id;
	$data->description =  $videor->description;
	if($videor->type ==2){
	    $data->url = $videor->thumb_small.'.png';

	}else{
	    $data->url = $videor->thumb_small;

	}

	$videoinfo = new stdClass();
    $videoinfo->id = $value->instanceid;
    $videoinfo->name = $video->name;
    $videoinfo->data = $data;

    $moretags =array();

	//get tags for ids, excluding root tag ('film')
	$sql2 = 'SELECT * from {videor_tags} WHERE '.$DB->sql_compare_text('content', 32).' <>? AND courseid = ? AND instanceid =?';
	$subtags = $DB->get_records_sql($sql2,array($tag->content,3,$value->instanceid));

	foreach ($subtags as  $value) {
		$data = new stdClass();
		$data->course = $cid;
    	$data->type = 'tag';
    	$taginfo = new stdClass();
    	$taginfo->id = $value->id;
	    $taginfo->name = $value->content;
	    $taginfo->data = $data;
	    $taginfo->children = array();

	    $moretags[] = $taginfo;
	}


	$videoinfo->children = $moretags;
	$avideos[] = $videoinfo;
	
}

$data = new stdClass();
$data->course = $cid;
$data->type = 'tag';
$data->tid= $tid;
$tag_object = new stdClass();
$tag_object->id = $tag->id;
$tag_object->data = $data;
$tag_object->name = $tag->content;
$tag_object->children = $avideos;




echo json_encode($tag_object);







