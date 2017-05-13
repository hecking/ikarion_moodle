<?PHP  // $Id: lib.php,v 1.0 2012/03/28 18:30:00 Serafim Panov Exp $ 

require_once($CFG->libdir . '/grouplib.php');
defined('MOODLE_INTERNAL') || die();

$etherpadcfg = get_config('etherpad');

if (!isset($etherpadcfg->etherpad_apikey))
  set_config('etherpad_apikey', 'EtherpadFTW', 'etherpad');
if (!isset($etherpadcfg->etherpad_baseurl))
  set_config('etherpad_baseurl', 'http://beta.etherpad.org:9001', 'etherpad');

function etherpad_get_group_pad_for_user($courseModuleId, $courseId) {

    global $DB, $USER;

    $userGroups = groups_get_all_groups($courseId, $USER->id, null, 'g.id');

    if (!$userGroups) {

        error("The activity is in group mode but the user is in no group.");
    }

    $gIds = array();
    foreach ($userGroups as $group) {
        array_push($gIds, $group->id);
    }
    $sqlSelect = "ep_module = " . $courseModuleId . " and groupid in (" . implode(",", $gIds) . ")";

    $groupPad = $DB->get_record_select("etherpad_grouppad", $sqlSelect);
    //$userGroup = groups_get_most_recent_user_group($USER->id, $courseId);
    //$groupPad = $DB->get_record("etherpad_grouppad", array("ep_module" => $courseModuleId, "groupid" => $userGroup));

    return $groupPad;
}

// New function enabling separate group pads.
function etherpad_add_new_group_pad($courseModuleId, $courseId) {

    global $DB, $USER;

    $groupPad = new stdClass();
    $userGroup = groups_get_most_recent_user_group($USER->id, $courseId);

    if (! $userGroup) {

        error("The activity is in group mode but the user is in no group.");
    }
    $padname = $courseModuleId . "_" . $userGroup;

    $groupPad->groupid = $userGroup;
    $groupPad->ep_module = $courseModuleId;
    $groupPad->gpadname = $padname;

    $DB->insert_record("etherpad_grouppad", $groupPad);


    $params = array('module_id'=>$courseModuleId);

    $sql = "SELECT intro FROM mdl_etherpad where id = :module_id";
    $record = $DB->get_record_sql($sql, $params);
    $intro = $record->intro;

    $etherpadcfg = get_config('etherpad');

    require_once("etherpad-lite-client.php");

    $epad = new EtherpadLiteClient($etherpadcfg->etherpad_apikey,$etherpadcfg->etherpad_baseurl.'/api');
    $epad->createPad($padname, strip_tags(get_string('intro', 'etherpad')));

    return $groupPad;
}

function etherpad_add_instance($etherpad) {
    global $CFG, $USER, $DB;

    $etherpad->timemodified = time();
    $etherpad->padname = etherpad_padname();
    
    $id = $DB->insert_record("etherpad", $etherpad);

    // Not necessary anymore since there will be separate pads for each group/individual.
//    $etherpadcfg = get_config('etherpad');
//
//    require_once("etherpad-lite-client.php");
//
//    $epad = new EtherpadLiteClient($etherpadcfg->etherpad_apikey,$etherpadcfg->etherpad_baseurl.'/api');
//    $epad->createPad($etherpad->padname, strip_tags($etherpad->intro));

    return $id;
}


function etherpad_update_instance($etherpad) {
    global $CFG, $USER, $DB;
    
    $etherpad->timemodified = time();
    $etherpad->id = $etherpad->instance;
    
    return $DB->update_record("etherpad", $etherpad);
}


function etherpad_delete_instance($id) {
    global $CFG, $USER, $DB;
    
    if (! $etherpad = $DB->get_record("etherpad", array("id" => $id))) {
        return false;
    }

    $result = true;

    if (! $DB->delete_records("etherpad", array("id" => $etherpad->id))) {
        $result = false;
    }
    
    $etherpadcfg = get_config('etherpad');

    require_once("etherpad-lite-client.php");
    
    $epad = new EtherpadLiteClient($etherpadcfg->etherpad_apikey,$etherpadcfg->etherpad_baseurl.'/api');
    $epad->deletePad($etherpad->padname);

    return $result;
}

function etherpad_user_outline($course, $user, $mod, $etherpad) {
    return $return;
}

function etherpad_user_complete($course, $user, $mod, $etherpad) {
    return true;
}

function etherpad_print_recent_activity($course, $isteacher, $timestart) {
    global $CFG;

    return false;  //  True if anything was printed, otherwise false 
}

function etherpad_cron () {
    global $CFG;

    return true;
}

function etherpad_grades($etherpadid) {
   return NULL;
}

function etherpad_get_participants($etherpadid) {
    return false;
}

function etherpad_scale_used ($etherpadid,$scaleid) {
    $return = false;

    return $return;
}


function etherpad_supports($feature) {
    switch($feature) {
        case FEATURE_GROUPS:                  return true;
        case FEATURE_GROUPINGS:               return true;
        case FEATURE_GROUPMEMBERSONLY:        return true;
        case FEATURE_MOD_INTRO:               return true;
        case FEATURE_BACKUP_MOODLE2:          return true;
        case FEATURE_SHOW_DESCRIPTION:        return true;
        case FEATURE_COMPLETION_TRACKS_VIEWS:  return true;

        default: return null;
    }
}


function etherpad_activate_session(){
    global $USER, $DB;
    
    require_once("etherpad-lite-client.php");
    
    $etherpadcfg = get_config('etherpad');
  
    $epad = new EtherpadLiteClient($etherpadcfg->etherpad_apikey,$etherpadcfg->etherpad_baseurl.'/api');

    
    $authorID = "";
    // == Save token and authorid for persistent users ==
    $token_expire = time() + (60 * 60 * 24 * 30 * 2); // +2 months
    $moodle_user = $DB->get_record('etherpad_user',array('uid'=>$USER->id));
    if(!$moodle_user) {
        // User is using etherpad for the first time
        try {
          // Let etherpad generate an author by using our token later on

          //$author = $epad->createAuthorIfNotExistsFor($USER->id, $USER->firstname.' '.$USER->lastname);
          //$authorID = $author->authorID;

          $record = new stdClass();
          $record->uid = $USER->id;
          $record->etherid = "";
          //$record->token_expire = $token_expire; // Default is 0, shouldn't expire
          //if(isset($_COOKIE['token'])) {
          //    $record->ethertoken = $_COOKIE['token'];
          //} else {
          $record->ethertoken = etherpad_gentoken();
          setcookie("token", $record->ethertoken, $token_expire, '/');
          //}
          $DB->insert_record("etherpad_user", $record, false);
        } catch (Exception $e) {print_r($e);}
    } else {
        $authorID = $moodle_user->etherid;

        // User already used etherpad, check for possible different token
        //if(isset($_COOKIE['token'])) {
        //    if($_COOKIE['token'] != $moodle_user->ethertoken) {
        //        setcookie("token", $moodle_user->ethertoken, $token_expire,'/');
        //    }
        //} else {
        setcookie("token", $moodle_user->ethertoken, $token_expire,'/');
        //}
    }
    /*try {
      $mappedGroup = $epad->createGroupIfNotExistsFor($USER->id);
      $groupID = $mappedGroup->groupID;
    } catch (Exception $e) {print_r($e);}

    $validUntil = mktime(0, 0, 0, date("m"), date("d")+1, date("y"));
    $sessionID = $epad->createSession($groupID, $authorID, $validUntil);
    $sessionID = $sessionID->sessionID;
    setcookie("sessionID",$sessionID);*/


}

function etherpad_padname ($length = 8){
    $password = "";
    $possible = "2346789bcdfghjkmnpqrtvwxyzBCDFGHJKLMNPQRTVWXYZ";
    $maxlength = strlen($possible);
    if ($length > $maxlength) {
      $length = $maxlength;
    }
    $i = 0; 
    while ($i < $length) { 
      $char = substr($possible, mt_rand(0, $maxlength-1), 1);
      if (!strstr($password, $char)) { 
        $password .= $char;
        $i++;
      }
    }
    return $password;
}
// Taken from etherpads pad.js
function etherpad_gentoken ($length = 20) {
    $alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    $token = '';
    for($i=0; $i<min($length,20); $i++) {
        $char = substr($alphabet, mt_rand(0, strlen($alphabet)), 1);
        $token .= $char;
    }
    return "t.".$token;
}
