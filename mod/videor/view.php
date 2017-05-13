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
 * Prints a particular instance of videor
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


require_once(dirname(dirname(dirname(__FILE__))).'/config.php');
require_once(dirname(__FILE__).'/lib.php');
require_once(dirname(__FILE__).'/sharedlib.php');

require_once ($CFG->libdir.'/formslib.php');
require_once($CFG->dirroot.'/lib/formslib.php');
require_once $CFG->dirroot . '/comment/lib.php';
require_once $CFG->dirroot . '/rating/lib.php';

//$path = '/libs/ZendGdata-1.12.0/library';
//set_include_path(get_include_path() . PATH_SEPARATOR . $path);

include_once 'libs/Zend/Loader.php'; // the Zend dir must be in your include_path
Zend_Loader::loadClass('Zend_Gdata_YouTube', '/mod/videor/libs');

global $CFG;
global $iid;

comment::init();

$videos_database ="videos";
$videor_activity_database ="videor";
$video_bookmarks_database ="video_bookmarks";
$video_tags_database ="videor_tags";
$videocenter_database ="videocenter";

$id = optional_param('id', 0, PARAM_INT); // course_module ID, or
$n  = optional_param('v', 0, PARAM_INT);  // videor instance ID - it should be named as the first character of the module
$tid = optional_param('tid', 0, PARAM_INT);
$bid = optional_param('bid', 0, PARAM_INT);
$delete = optional_param('delete', 0, PARAM_INT);

if ($id) {
    $cm         = get_coursemodule_from_id($videor_activity_database, $id, 0, false, MUST_EXIST);
    $course     = $DB->get_record('course', array('id' => $cm->course), '*', MUST_EXIST);
    $video  = $DB->get_record($videor_activity_database, array('id' => $cm->instance), '*', MUST_EXIST);

    $vid = $cm->instance;
} elseif ($n) {
    $video  = $DB->get_record($videor_activity_database, array('id' => $n), '*', MUST_EXIST);
    $course     = $DB->get_record('course', array('id' => $videor->course), '*', MUST_EXIST);
    $cm         = get_coursemodule_from_instance($videor_activity_database, $videor->id, $course->id, false, MUST_EXIST);
    $vid = $n;
} else {
    error('You must specify a course_module ID or an instance ID');
}

require_login($course, true, $cm);
$context = context_module::instance($cm->id);//deprecated: get_context_instance(CONTEXT_MODULE, $cm->id);

// Hecking: Deprecated add_to_log replaced by Event API call
//add_to_log($course->id, $videor_activity_database, 'view', "view.php?id={$cm->id}", $video->name, $cm->id);
$event = \mod_videor\event\course_module_viewed::create(array(
    'objectid' => $video->id,
    'context' => $context
));
$event->add_record_snapshot('course', $PAGE->course);
// In the next line you can use $PAGE->activityrecord if you have set it, or skip this line if you don't have a record.
$event->add_record_snapshot($PAGE->cm->modname, $video);
$event->trigger();

/// Print the page header
$PAGE->set_url('/mod/videor/view.php', array('id' => $cm->id));
$PAGE->set_title(format_string($video->name));
$PAGE->set_heading(format_string($course->fullname));
$PAGE->set_context($context);
 $PAGE->requires->css('/mod/videor/jquery-ui-1.9.2.custom.min.css');
    $PAGE->requires->css('/mod/videor/mycss.css');
    $PAGE->requires->css('/mod/videor/skin/minimalist.css');

    $PAGE->requires->js('/mod/videor/configJS.js');
    $PAGE->requires->js('/mod/videor/jit.js');
    $PAGE->requires->js('/mod/videor/excanvas.js');
    $PAGE->requires->js('/mod/videor/jquery-1.8.3.js');
    $PAGE->requires->js('/mod/videor/jquery-ui-1.9.2.custom.min.js');
    $PAGE->requires->js('/mod/videor/flowplayer.min.js');
    $PAGE->requires->js('/mod/videor/functions.js');

//Check if Video exists
if($DB->record_exists($videos_database,array('id' => $video->videoid))){

   

    $videor = $DB->get_record($videos_database, array('id' => $video->videoid), '*', MUST_EXIST);



    //Check if we need to delete Tags
    if($tid){
       
            
      if(($DB->record_exists($video_tags_database, array('id'=>$tid,'courseid'=>$course->id)) != 0) && ($DB->get_record($video_tags_database,array('id'=>$tid,'courseid'=>$course->id))->userid == $USER->id || has_capability('mod/videor:deletetag', $context))){

        $DB->delete_records($video_tags_database, array('id'=> $tid,'courseid'=>$course->id)); 
         } 
    }
    //Check if we need to delete Bookmarks

    if($bid){
      
      
      if(($DB->record_exists($video_bookmarks_database, array('id'=>$bid,'courseid'=>$course->id)) != 0) && ($DB->get_record($video_bookmarks_database,array('id'=>$bid,'courseid'=>$course->id))->userid == $USER->id || has_capability('mod/videor:deletejumplink', $context))){

        $DB->delete_records($video_bookmarks_database, array('id'=> $bid,'courseid'=>$course->id)); 
         } 
    }
    //Check if we need to delete Video
    if($delete){
        if($videor->uploaderid == $USER->id || has_capability('mod/videor:deletevideo', $context)){
            if($videor->type == 1){
                $DB->delete_records($video_bookmarks_database, array('instanceid'=> $videor->id,'courseid'=>$course->id)); 
                $DB->delete_records($video_tags_database, array('instanceid'=> $videor->id,'courseid'=>$course->id));
                
                $DB->delete_records($videos_database, array('id'=> $videor->id,'courseid'=>$course->id));

            redirect(new moodle_url('/mod/videor/view.php', array('id' => $cm->id)));

            }else{
                $DB->delete_records($video_bookmarks_database, array('instanceid'=> $videor->id,'courseid'=>$course->id)); 
                $DB->delete_records($video_tags_database, array('instanceid'=> $videor->id,'courseid'=>$course->id)); 
                

                $count = $DB->count_records_sql('SELECT COUNT(*) FROM {videos} WHERE url = ?', array($videor->url));


          if($count == 1){
                    delete_video($videor->id);
                }
          $DB->delete_records($videos_database, array('id'=> $videor->id,'courseid'=>$course->id));


          redirect(new moodle_url('/mod/videor/view.php', array('id' => $cm->id)));
                

            }
        }
    }

    // Output starts here
    echo $OUTPUT->header();



    $havevideocenter = false;
    if($DB->record_exists($videocenter_database,array('course' => $course->id)) != 0){
        $vcenters = $DB->get_records($videocenter_database,array('course' => $course->id));
        $vcentersR =reset(($vcenters));
        $videocentercm = get_coursemodule_from_instance($videocenter_database, $vcentersR->id, $course->id, false, MUST_EXIST);
        $havevideocenter = true;
    }



    $url = $videor->url;
    if($videor->type ==1){
        list ($pre, $post) = explode('=', $url);
        //obsolete: add_to_log($course->id, "videor", "view youtube",'view.php?id=330', $videor->title, '', $USER->id);

        echo '
        <div id="first-row" >
        <div id="video-player-d"></div>
        <script>
        var tag = document.createElement(\'script\');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName(\'script\')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        var done = false;
        
        function onYouTubeIframeAPIReady() {
            player = new YT.Player(\'video-player-d\', {
              height: \'375\',
              width: \'630\',
              videoId: \''.$post.'\'      
            });
        }

        function timey(){
          return player.getCurrentTime();
        }
        function goToSecs(secs){
          player.seekTo(secs, true);
        }  
        </script>';

        $yt = new Zend_Gdata_YouTube();
        $videoEntry = $yt->getVideoEntry($post);
    }else {
        //obsolete: add_to_log($course->id, "videor", "view flowplayer",'view.php?id=330', $videor->title, '', $USER->id);

        echo'<div id="first-row" >
        <div id="video-player-d" class="flowplayer color-light" data-swf="flowplayer.swf">
              <video>
                 <source type="video/webm" src="'.$url.'.webm"/>
                 <source type="video/mp4" src="'.$url.'.mp4"/>
              </video>
           </div>
           <script>
            function goToSecs(secs){
            var api = flowplayer();
            api.seek(secs);
            }   
            </script>';

      }  


    //Get current tags and similar videos
    $result = $DB->get_records($video_tags_database,array('instanceid'=>$videor->id,'courseid'=>$course->id));

    $video_object = get_initial_JSON($result,$course->id,$videor,$cm->id,1);


    list($context, $course, $cm) = get_context_info_array($PAGE->context->id);

    //Create Bookmarks function
    echo '
    <div id="dialog-form" title="Create new Jumplink">
        <form>
        <fieldset>
        <label>Seconds: </label><label id="cursecs"></label><br>
        <label>Current Time: </label><label id="curtime"></label><br>

        <label for="name">Jumplink name</label>
        <input type="text" name="name" id="name" class="text ui-widget-content ui-corner-all" />
        </fieldset>
        </form>
    </div>';

    if(has_capability('mod/videor:addjumplink', $context)){
        if($videor->type ==1){
        echo '<button style="margin-left: 100px;margin-bottom: 5px;" class="bookmarkbuttons" data-mode="'.$videor->type.'" data-uid="'.$USER->id.'" data-courseid="'.$course->id.'" data-vid="'.$videor->id.'" id="create-youtubeb">'.get_string('addbookmark', 'mod_videor').'</button>';
        }else{
        echo '<button style="margin-left: 100px;margin-bottom: 5px;" class="bookmarkbuttons" data-mode="'.$videor->type.'" data-uid="'.$USER->id.'" data-courseid="'.$course->id.'" data-vid="'.$videor->id.'" id="create-flowb">'.get_string('addbookmark', 'mod_videor').'</button>';
           
        }

    }

    echo '<div id="tabs" style="text-align:center;width: 300px;height: 345px;">';

    //echo '<div id="video-bookmark" style="text-align:center;width: 300px;height: 385px;">';
    echo'<ul>
                  <li><a href="#tabs-1">Public</a></li>
                  <li><a href="#tabs-2">Private</a></li>

                  </ul>
                  <div id="tabs-1">';


    /*
    if(has_capability('mod/videor:addbookmark', $context)){
        echo '<button style="margin: 5px;" class="bookmarkbuttons" data-mode="'.$videor->type.'" data-uid="'.$USER->id.'" data-courseid="'.$course->id.'" data-vid="'.$videor->id.'" id="create-youtubeb">'.get_string('addbookmark', 'mod_videor').'</button>';
    }*/

        $bookmarks = $DB->get_records($video_bookmarks_database,array('instanceid'=>$videor->id,'courseid'=>$course->id, 'type' =>0),'time');
        echo '<div style="overflow: auto;height: 300px;width: 299px;"><table>';
            foreach ($bookmarks as $value) {
                echo '<tr>
                     <td>'.format_time_b($value->time).'--'.$value->title.'</td>
                     <td class="tagholder"><a class="tags" onclick="goToSecs('.$value->time.');" href="#">GOTO</a>';
                    
                   
                    if($USER->id == $value->userid || has_capability('mod/videor:deletetag', $context)){
                        echo '<a class="tagsdelete" href="Javascript:popupBookmark('.$value->id.','.$cm->id.')">X</a>';

                    }
                    echo '</td></tr>';

                    
                   
            }

    echo '</table>';
    echo '</div>';

    //close first tab
    echo '</div>';

    echo '<div id="tabs-2">';
         $bookmarks = $DB->get_records($video_bookmarks_database,array('instanceid'=>$videor->id,'courseid'=>$course->id, 'type' =>1,'userid'=>$USER->id),'time');
        echo '<div style="overflow: auto;height: 300px;width: 299px;"><table>';
            foreach ($bookmarks as $value) {
                echo '<tr>
                     <td>'.format_time_b($value->time).'--'.$value->title.'</td>
                     <td class="tagholder"><a class="tags" onclick="goToSecs('.$value->time.');" href="#">GOTO</a>';
                    
                   
                    if($USER->id == $value->userid || has_capability('mod/videor:deletetag', $context)){
                        echo '<a class="tagsdelete" href="Javascript:popupBookmark('.$value->id.','.$cm->id.')">X</a>';

                    }
                    echo '</td></tr>';

                    
                   
            }

    echo '</table>';
    echo '</div>';

    //close second tab
    echo '</div>';
    //closing video-bookmark
    echo '</div>';


    echo '</div>';

    //Create Video Information
    $userinfo = $DB-> get_record('user', array('id' => $videor->uploaderid));
    $user_picture=new user_picture($userinfo);
    $src=$user_picture->get_url($PAGE);

    $opturl = new moodle_url('/mod/videor/view.php', array('id' => $cm->id,'delete'=>1));

    $pic_url = $CFG->wwwroot . '/user/view.php?id=' . $userinfo->id . '&course='.$COURSE->id;
    echo '<div id="video-information">
        <a href="'.$pic_url.'"><img src="'.$src.'" alt="Profile Picture" width="40 px" height="40 px" id="profile-picture"></a>
        <div style="float:left;">
        <span style="font-size: 15px;font-weight:bold;">'.$video->name.'</span>';
       
    echo '<br><span>by '.$userinfo->firstname.' '.$userinfo->lastname.' on '.gmdate("M d Y",$video->timecreated).'</span><br>';
        if($videor->type ==1){
        echo '<span><b>'.get_string('yuploader', 'mod_videor').'</b> '.$videoEntry->author[0]->name->text.',<b> '.get_string('ytitle', 'mod_videor').'</b> '.$videoEntry->getVideoTitle() .'</span>';
        }
        
    echo '</div>';
     //Add Delete Button
        if(has_capability('mod/videor:deletevideo', $context) || $USER->id == $videor->uploaderid){
            echo '<a id="delete_video" href="'.$opturl.'">Delete Video</a>';
        }
    echo '<div style="clear:both;margin-left:10px;"><span>'.strip_tags($videor->description).'</span><br>
     </div>
        </div>';
     
    //Create JIT Graph

    $PAGE->requires->js('/mod/videor/visualisation.js');
    $PAGE->requires->js_init_call('init', array(json_encode($video_object),$video_object->id,$video_object->data->course));

    echo '<div id="video-visual"><div id="vis-container">
            <div id="vis-center-container">
                <div id="infovis">
                    <a id="log"></a>
                </div>
            </div>
            <div id="right-container">
                <div id="inner-details"></div>
            </div>
        </div></div>';


    $iid = $PAGE->context->instanceid;




    //get Uploader

    $userinfo = $DB-> get_record('user', array('id' => $videor->uploaderid));

    ///Create TAGS
    echo '<div id="video-tags" >';
    $context = context_module::instance($cm->id);

    if(has_capability('mod/videor:addtag', $context)){
        //$mform->display();

        echo'
        <div class="ui-widget" style="padding-bottom: 10px;padding-top: 10px;">
        <label>Tags: </label>
        <input id="tags" />
        <input type="button" name="Add Tag(s)" value="Add Tag(s)" id="addtagsbutton" data-uid="'.$USER->id.'" data-courseid="'.$course->id.'" data-vid="'.$videor->id.'" >
        </div>';
    }

    foreach ($result as $value) {

     echo '<div class="tagholder">';
            if($havevideocenter){
            echo '<a class ="tags" href ="'.new moodle_url('/mod/videocenter/view.php', array('id' =>  $videocentercm->id, 'tag' => $value->content)).'">'.$value->content.'</a>';
            }else{
            echo '<span class="tags">'.$value->content.'</span>';
             
             }
            
            if($USER->id == $value->userid|| has_capability('mod/videor:deletetag', $context)){
            echo '<a class="tagsdelete" href="Javascript:popupTag('.$value->id.','.$cm->id.')">X</a>';
            }
            echo '</div>';
    }


    echo '</div>';


    //Add Comments
    echo '<div id="comment-container">';
        
    $cmtoptions = new stdClass();
    $cmtoptions->component = 'mod_videor';
    $cmtoptions->area = 'vidoer_test';
    $cmtoptions->context = $context;
    $cmtoptions->itemid = $videor->id;
    $cmtoptions->autostart = true;
    $cmtoptions->notoggle = true;
    $cmtoptions->displaycancel = true;
    $cmtoptions->showcount = true;


    $comment  = new comment($cmtoptions);

    $comments = $comment->output(true);
    echo $comments;
    echo '</div>';

    echo $OUTPUT->footer('Footer');
}else{
    echo $OUTPUT->header('Header');
    echo $OUTPUT->heading(get_string('novideo', 'mod_videor'));

    echo $OUTPUT->footer('Footer');

}