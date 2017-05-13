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
 * @subpackage videocenter
 * @copyright  2013 Emmanuel Meinike
 * @author     Emmanuel Meinike <emmanuel.meinike@stud.uni-due.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


require_once(dirname(dirname(dirname(__FILE__))).'/config.php');
require_once(dirname(__FILE__).'/lib.php');

$courseid = $_GET['c'];
$videocenter = $_GET['vc'];
$vid = $_GET['id'];

$videor = $DB->get_record('videos', array('id' => $vid), '*', MUST_EXIST);

$videos = $DB->get_records('videor', array('videoid' => $vid));
$video = reset($videos);
$result = $DB->get_records('videor_tags',array('instanceid'=>$videor->id,'courseid'=>$courseid));
$atags = array();




foreach ($result as $value) {
    $data = new stdClass();
    $data->type = 'tag';
    $data->course = $courseid;
    $taginfo = new stdClass();
    $taginfo->id = $value->id;
    $taginfo->name = $value->content;
    $taginfo->data = $data;
    $similar_videos = array();

    $similar = $DB->get_records_sql('SELECT instanceid FROM {videor_tags} WHERE content = ? AND courseid =? AND instanceid <> ?', array($value->content,$courseid,$video->id));
    
    
    foreach ($similar as $value2) {
        $cvideoT = $DB->get_records('videor', array('videoid' => $value2->instanceid));
        $cvideo = reset($cvideoT);
         if($cvideo->course == $courseid){

        $tvideo = $DB->get_record('videos', array('id' => $value2->instanceid), '*', MUST_EXIST);

        $data = new stdClass();
        $data->type = 'video';
        $data->description =  $tvideo->description;

         if($tvideo->type ==2){
        $data->url = $tvideo->thumb_small.'.png';

        }else{
        $data->url = $tvideo->thumb_small;

        }

        

        $data->course = $courseid;
        $data->vid = $videocenter;
        $data->urla = $CFG->wwwroot.'/mod/videocenter/viewvideo.php?id='.$videocenter.'&vid='.$tvideo->id;
        $similarvideo = new stdClass();
        $similarvideo->id = $value2->instanceid;
        $similarvideo->name = $cvideo->name;
        $similarvideo->data = $data;
        $similarvideo->children = array();

        $similar_videos[] = $similarvideo;
    }
    }
    $taginfo->children = $similar_videos;
    $atags[]= $taginfo;


}

$data = new stdClass();
$data->course = $courseid;
$data->type = 'video';
$data->description =  $videor->description;

if($videor->type ==2){
    $data->url = $videor->thumb_small.'.png';

}else{
    $data->url = $videor->thumb_small;

}

$video_object = new stdClass();
$video_object->id = $videor->id;
$video_object->data = $data;
$video_object->name = $video->name;
$video_object->children = $atags;





echo json_encode($video_object);

