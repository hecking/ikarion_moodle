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
 * Library of interface functions and constants for module videor
 *
 * All the core Moodle functions, neeeded to allow the module to work
 * integrated in Moodle should be placed here.
 * All the videor specific functions, needed to implement all the module
 * logic, should go to locallib.php. This will help to save some memory when
 * Moodle is performing actions across all modules.
 *
 *
 * @package    mod
 * @subpackage videor
 * @copyright  2013 Emmanuel Meinike
 * @author     Emmanuel Meinike <emmanuel.meinike@stud.uni-due.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

include_once 'libs/Zend/Loader.php'; // the Zend dir must be in your include_path
Zend_Loader::loadClass('Zend_Gdata_YouTube', "/mod/videor/libs");

$tokenarray;

function videor_supports($feature) {
    switch($feature) {
        //case FEATURE_MOD_ARCHETYPE:     return MOD_ARCHETYPE_RESOURCE;
        //case FEATURE_MOD_INTRO:         return false;

        default: return null;
    }
}

function videor_add_instance(stdClass $videor, mod_videor_mod_form $mform = null) {
    global $DB;
    global $USER;
    global $CFG;
    $cid;

   
    
    if($videor->resource_type == 0){


        $videor->timecreated = time();
        $videor->userid = $USER->id;

        //Working youtube upload
        $parsedurl = parse_url($videor->url);
        $query = $parsedurl['query'];
        parse_str($query,$queryarray);
          
        $videor->description = $videor->intro;
        //$videor->introformat = 0;
        $yt = new Zend_Gdata_YouTube();
        //remove extra youtube url info
        
        $videor->url = $parsedurl['scheme'].'://'.$parsedurl['host'].$parsedurl['path'].'?v='.$queryarray['v'];
        
        $videoEntry = $yt->getVideoEntry($queryarray['v']);
        $videor->title = $videor->name;
        //$videor->title = $videoEntry->getVideoTitle();
        $videoThumbnails = $videoEntry->getVideoThumbnails();
        $videor->thumb_small = $videoThumbnails[2]['url'];
        $videor->thumb_big= $videoThumbnails[0]['url'];
        $videor->type = 1;
        $videor->uploaderid = $USER->id;
        $videor->courseid =$videor->course;
        
        $vid = $DB->insert_record('videos', $videor,true);

        

        if($videor->tags){
            $currenttags = explode(',', $videor->tags);
            $tag = new stdClass();
            $tag->userid = $USER->id;
            $tag->instanceid =$vid;            
            $tag->courseid =$videor->course;
            $tag->timecreated =time();

             foreach ($currenttags as $value) {
                $tag->content = trim($value);
                //$temp = $DB->get_record_select('videor_tags',"content =".$tag->content);
                if(empty($temp) && $tag->content != " " && $tag->content != "" && !empty($tag->content)){
                $temp = $DB->get_records_sql('SELECT * FROM {videor_tags} WHERE content = ? AND instanceid = ? AND courseid= ?', array($tag->content,$tag->instanceid,$tag->courseid));
                    if(empty($temp)){
                        $DB->insert_record('videor_tags', $tag, $returnid=true, $bulk=false);

                        }
                }
            }
        
        }

       
       
       

        $videor->videoid = $vid;
        $cid = $DB->insert_record('videor', $videor,true);
        
    }elseif ($videor->resource_type == 1) {

       
        $fileid = $videor->userfile;

        $fs = get_file_storage();
      
        $userfile = $fs->get_area_files(get_context_instance(CONTEXT_USER, $USER->id)->id, 'user', 'draft', $fileid);

        $userfile2 = next($userfile);


        $trimmedfile = $userfile2->get_source();
        $explode1 = explode('"', $trimmedfile);
        $address = $explode1[sizeof($explode1) - 2];

        $filename = $userfile2->get_filename();

        $splitindex =strpos($filename, ".");
        $filename = substr($filename, 0,$splitindex);
        if(strpos($address, 'youtube') == 0){
            $bla =trim(str_replace('.webm', '', $address));
            $address = $bla;
        }

        $temp = $DB->get_records_sql('SELECT * FROM {videos} WHERE url = ?', array($address));
        $video = reset($temp);

        $videor->timecreated = time();
        $videor->userid = $USER->id;


        if($videor->course == $video->courseid){
            $DB->set_field('videos', 'submission', 0, array('id'=>$video->id));
            $videor->videoid = $video->id;
        }else{

            unset($video->id);
            $video->courseid = $videor->course;
            //$video->title = $videor->name;
            $vid = $DB->insert_record('videos', $video,true);
            $videor->videoid = $vid;
        }
        
        

        $cid = $DB->insert_record('videor', $videor,true);

        if($videor->tags){
            $currenttags = explode(',', $videor->tags);
            $tag = new stdClass();
            $tag->userid = $USER->id;
            $tag->instanceid =$videor->videoid;
            $tag->courseid =$videor->course;
            $tag->timecreated =time();


            foreach ($currenttags as $value) {
                $tag->content = trim($value);
                //$temp = $DB->get_record_select('videor_tags',"content =".$tag->content);
                if(empty($temp) && $tag->content != " " && $tag->content != "" && !empty($tag->content)){
                $temp = $DB->get_records_sql('SELECT * FROM {videor_tags} WHERE content = ? AND instanceid = ? AND courseid = ?', array($tag->content,$tag->instanceid,$tag->courseid));
                if(empty($temp)){
                    $DB->insert_record('videor_tags', $tag, $returnid=true, $bulk=false);

                }
            }
        }
        
        }

    
    }elseif($videor->resource_type == 2) {
      
      
        //$tempvideors = $DB->get_records_sql('SELECT * FROM {tempvideor} WHERE title = ? ', array($videor->name));

        //if(!empty($tempvideor)){
            //$tempvidoer =$DB->get_records('tempvideor', array('title' => $videor->name));
            //$tempvideor = reset($tempvideors);
            
                
            
            $videor->timecreated = time();
            $videor->title = $videor->name;
            $videor->description = $videor->intro;
            $videor->type = 2;
            $videor->uploaderid = $USER->id;
            $videor->courseid =$videor->course;

            //$videor->url = 'http://192.168.206.128/video/';
            //$vid = $DB->insert_record('videos', $videor,true);

            $arr = parse_ini_file("adressconfig.ini");
            $serverAdd = $arr['serveraddress'];
            $videor->url = 'http://'.$serverAdd.'/video/'.$videor->videoid.'_'.$videor->videotitle;
            $videor->thumb_small = 'http://'.$serverAdd.'/video/'.$videor->videoid.'_'.$videor->videotitle;
            $videor->thumb_big= 'http://'.$serverAdd.'/video/'.$videor->videoid.'_'.$videor->videotitle;

            $vid = $DB->insert_record('videos', $videor,true);
            //$DB->delete_records('tempvideor', array('id'=>$tempvideor->id)); 
            

            if($videor->tags){
                $currenttags = explode(',', $videor->tags);
                $tag = new stdClass();
                $tag->userid = $USER->id;
                $tag->instanceid =$vid;
                $tag->courseid =$videor->course;
                $tag->timecreated =time();


                foreach ($currenttags as $value) {
                    $tag->content = trim($value);
                    //$temp = $DB->get_record_select('videor_tags',"content =".$tag->content);
                    if(empty($temp) && $tag->content != " " && $tag->content != "" && !empty($tag->content)){
                    $temp = $DB->get_records_sql('SELECT * FROM {videor_tags} WHERE content = ? AND instanceid =? AND courseid =?', array($tag->content,$tag->instanceid,$tag->courseid));
                        
                        if(empty($temp)){
                        $DB->insert_record('videor_tags', $tag, $returnid=true, $bulk=false);

                        }
                    }
                }
        
        }
        
        


            $videor->videoid = $vid;
            $cid = $DB->insert_record('videor', $videor,true);
        //}else{
        //No Tempvideor found with that title
        //$cid =0;
        //}
        
    }
    
       
        return $cid;
}

function videor_update_instance(stdClass $videor, mod_videor_mod_form $mform = null) {
    global $DB;
    global $USER;

    $videor->timemodified = time();

    $temp = $DB->get_record('videor',array('id'=> $videor->instance));
    $videor->videoid = $temp->videoid;

    $videor->title = $videor->name;
    $videor->description = $videor->intro;


     if($videor->tags){
            $currenttags = explode(',', trim($videor->tags));
            $tag = new stdClass();
            $tag->userid = $USER->id;
            $tag->instanceid =$videor->videoid;
            $tag->courseid =$videor->course;
            $tag->timecreated =time();


            foreach ($currenttags as $value) {

                $tag->content = trim($value);
                //$temp = $DB->get_record_select('videor_tags',"content =".$tag->content);
                $temp = $DB->get_records_sql('SELECT * FROM {videor_tags} WHERE content = ? AND instanceid =?', array($tag->content,$tag->instanceid));
                if(empty($temp) && $tag->content != " " && $tag->content != "" && !empty($tag->content)){
                    $DB->insert_record('videor_tags', $tag, $returnid=true, $bulk=false);

                }
            }
        
    }
    
    $videor->id = $videor->videoid;
    $DB->update_record('videos', $videor);
    $videor->id = $videor->instance;

    return $DB->update_record('videor', $videor);
}

function videor_delete_instance($id) {
    global $DB;

    if (! $videor = $DB->get_record('videor', array('id' => $id))) {
        return false;
    }


    $DB->delete_records('videor', array('id' => $videor->id));

    return true;
}

function videor_get_extra_capabilities() {
    return array('moodle/comment:view', 'moodle/comment:post', 'moodle/comment:delete');
}


function videor_comment_permissions($comment_param) {
    return array('post'=>true, 'view'=>true);
}

function videor_comment_validate($comment_param) {
    
return true;
}

function videor_comment_display($comments, $args) {
    return $comments;
}

function format_time_b($time){

    $ftime;
    if($time >=3600){
        
        $ftime = floor($time/3600);
        
        
        if(floor(($time % 3600) / 60) < 10){
            $ftime.=':0'.floor(($time % 3600) / 60);
        }else{
            $ftime.=floor(($time % 3600) / 60);
        }

        if(floor(($time % 3600)%60) <10){
            $ftime.=':0'.(floor(($time % 3600)%60));
        }else{
            $ftime.=':'.(floor(($time % 3600)%60));
        }
    }else{



        if(($time % 60) < 10){
            $ftime = floor($time/60).':0'.($time % 60);
        }else{
            $ftime = floor($time/60).':'.($time % 60);
        }
    }
   return $ftime;
}

function format_time_backwards($time){
        $temp = explode(":", $time);
        $size = sizeof($temp);
        $temp2 =0;
        for ($i=0; $i < $size ; $i++) { 
            $temp2+= ($temp[$i] * pow(60, $size-($i+1)));
        }

    return $temp2;
}

