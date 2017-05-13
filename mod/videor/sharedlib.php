<?php
function delete_video($vid){
    global $DB;

    $video = $DB->get_record('videos', array('id' => $vid));

    $url = $video->url;
    $path = parse_url($url);
    list($s,$v,$t)  = explode("/", $path['path'],3);
    $list = explode("_", $t,2);


    $token = mt_rand(1000, 100000);
    $tokeninfo = new stdClass();
    $tokeninfo->token = $token;
    $tokeninfo->vid =$list[0];
    $tokeninfo->combo =$list[0]+$token;
    
    
    $DB->insert_record('tokenmanagement', $tokeninfo);

    $arr = parse_ini_file("adressconfig.ini");
    $serverAdd = $arr['serveraddress'];
    $moodleaddress =$arr['moodleaddress'];


    $upload_url = 'http://'.$serverAdd.'/delete-video';
    $params = array(
        'video_title'=>$list[1],
        'token'=>$tokeninfo->token,
        'video_id'=>$list[0],
        'portal_add'=>$moodleaddress.':80'        
        );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_VERBOSE, 1);
    curl_setopt($ch, CURLOPT_URL, $upload_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    $response = curl_exec($ch);
    $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    //echo $response;
    //echo '<br>';
    //echo $http_status;
    



}

function get_initial_JSON($result,$courseid,$videor,$cmid,$mode){
    global $DB,$CFG;
    
    $videos_database ="videos";
    $videor_activity_database ="videor";
    $video_bookmarks_database ="video_bookmarks";
    $video_tags_database ="videor_tags";
    $videocenter_database ="videocenter";

    $atags = array();
    //echo "TAGS:";
    foreach ($result as $value) {
        $data = new stdClass();
        $data->type = 'tag';
        $data->course = $courseid;
        $taginfo = new stdClass();
        $taginfo->id = $value->id;
        $taginfo->name = $value->content;
        $taginfo->data = $data;
        $similar_videos = array();

        $similar = $DB->get_records_sql('SELECT instanceid FROM {'.$video_tags_database.'} WHERE content = ? AND courseid = ? AND instanceid <> ?', array($value->content,$value->courseid,$videor->id));
        
           
        foreach ($similar as $value2) {
            $cvideoT = $DB->get_records($videor_activity_database, array('videoid' => $value2->instanceid,'course' =>$value->courseid));
            $cvideo = reset($cvideoT);
            if($cvideo->course == $courseid){
                $tvideo = $DB->get_record($videos_database, array('id' => $value2->instanceid), '*', MUST_EXIST);

                $data = new stdClass();
                $data->type = 'video';
                $data->description =  $tvideo->description;

                if($tvideo->type ==2){
                $data->url = $tvideo->thumb_small.'.png';

                }else{
                $data->url = $tvideo->thumb_small;

                }
                $data->course = $courseid;
                if($mode ==1){
                    $cm = get_coursemodule_from_instance($videor_activity_database, $cvideo->id, $cvideo->course, false, MUST_EXIST);
                    $data->urla = $CFG->wwwroot.'/mod/videor/view.php?id='.$cm->id;
                    $data->vid = $cmid;

                }else if($mode ==2){
                     $data->urla = $CFG->wwwroot.'/mod/videocenter/viewvideo.php?id='.$cmid.'&vid='.$cvideo->id;
                     $data->vid = $cmid;
                }
               
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
    $data->vid=$cmid;
    $data->description =  $videor->description;

    if($videor->type ==2){
        $data->url = $videor->thumb_small.'.png';

    }else{
        $data->url = $videor->thumb_small;

    }

    $video_object = new stdClass();
    $video_object->id = $videor->id;
    $video_object->data = $data;
    $video_object->name = $videor->title;
    $video_object->children = $atags;

    return $video_object;
}