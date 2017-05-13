<?php

define('AJAX_SCRIPT', true);

require_once(dirname(dirname(dirname(dirname(__FILE__)))).'/config.php');
require_once(dirname(dirname(__FILE__)).'/lib.php');


header('Content-Type: text/html; charset=utf-8'); // otherwise the response would be send in JSON-Type

if (!isloggedin()) {
	echo "ERROR: User not loggedin";
	die();
}

if (!confirm_sesskey()) {
	echo 'ERROR(sesskey)';
	die();
}



// AJAX-Querys, 'fnc' tells which kind of query it was.
if ($fnc = required_param('fnc', PARAM_ALPHA)) {
	switch($fnc) {
		case 'commentInsert':
			$annotid = required_param('a', PARAM_INT);
			$userid = required_param('u', PARAM_INT);
			$comment = required_param('c', PARAM_TEXT);
			$timecreated = time();
			
			$entry = new stdClass();
			$entry->annotid = $annotid;
			$entry->userid = $userid;
			$entry->comment = $comment;
			$entry->timecreated = $timecreated;
			$comid = $DB->insert_record('annotations_comments', $entry, true);
			break;
			
		case 'annotationRefreshComments':

			$sort = 'timecreated DESC';
			$annotid = required_param('a', PARAM_INT);

			$sql = 'SELECT id, userid, comment, timecreated FROM {annotations_comments} WHERE annotid = :annotid ORDER BY timecreated DESC';
			$params['annotid'] = $annotid;
				
			$entry = array();
			$entry = $DB->get_records_sql($sql,$params);
			
			$ufields = user_picture::fields('u');
			
			$sql2 = "SELECT $ufields
			FROM  {user} u
			WHERE  u.id in (SELECT DISTINCT userid FROM {annotations_comments} WHERE annotid = :annotid)";
			
			$params['annotid'] = $annotid;
			$entry2 = array();
			$entry2 = $DB->get_records_sql($sql2, $params);
			
			$rend = $PAGE->get_renderer('block_annotations');
			echo $rend->render_comments($entry, $entry2);
			break;
			
		case 'postUpdate':
			$annotation = required_param('a', PARAM_TEXT);
			$annotid = required_param('i', PARAM_INT);
			$timenow = time();
			
			$updateannot = new stdClass();
			$updateannot->id = $annotid;
			$updateannot->annotation = $annotation;
			$updateannot->timemodified = $timenow;
			$DB->update_record('annotations', $updateannot);
			
			break;
			
		case 'postInsert':
			
			$courseid = required_param('p', PARAM_INT);  // Those three params are used in every action.
			$contextid = required_param('c', PARAM_INT);  // Those three params are used in every action.
			$userid = required_param('u', PARAM_INT);
			

			if (!$courseboard = $DB->get_record('context', array('id' => $contextid), '*', MUST_EXIST)) {
				echo 'ERROR(contextid)';
				die();
			}

			$type = required_param('t', PARAM_TEXT);
			$hashtag = required_param('h', PARAM_TEXT);
			$annotation = required_param('a', PARAM_TEXT);
			$timecreated = time();

			$entry = new stdClass();
			$entry->courseid = $courseid;
			$entry->contextid = $contextid;
			$entry->hashtag = $hashtag;
			$entry->tagtype = $type;
			$entry->annotation = $annotation;
			$entry->userid = $userid;
			$entry->timecreated = $timecreated;
			$entry->timemodified = $timecreated;
			$annoid = $DB->insert_record('annotations', $entry, true);
			
			$testpara[] = array('key1' => 'value1', 'key2' => 'value2');
			
			break;

		case 'annotationRefresh':

			$sort = 'timecreated DESC';

			$contextid = required_param('c', PARAM_INT);  // Those three params are used in every action.
			$userid = required_param('u', PARAM_INT);
			$cmid = required_param('cm', PARAM_INT);
				
			if (!$courseboard = $DB->get_record('context', array('id' => $contextid), '*', MUST_EXIST)) {
				echo 'ERROR(contextid)';
				die();
			}
			
			$ufields = user_picture::fields('u');
			$sql = "SELECT  c.id AS cid, c.contextid AS ccontextid, c.hashtag AS chashtag,c.tagtype AS ctagtype, c.annotation AS cannotation, c.userid AS cuserid, c.timemodified AS ctimecreated
			FROM {annotations} c
			WHERE c.contextid = :contextid AND NOT (c.userid <> :userid AND c.tagtype = :typeexcl)
			ORDER BY c.timecreated DESC";
			$params['contextid'] = $contextid;
			$params['userid'] = $userid;
			$params['typeexcl'] = "anot_privat";
			
			$entry = array();
			$entry = $DB->get_records_sql($sql,$params);
			
			$userids = array();
			foreach($entry as $record)
			{
				array_push($userids, $record->cuserid);
			}
				
			$sql2 = "SELECT $ufields
			FROM  {user} u 
			WHERE  u.id in (SELECT DISTINCT userid FROM {annotations} )";

			$entry2 = array();
			$entry2 = $DB->get_records_sql($sql2);

			$rend = $PAGE->get_renderer('block_annotations');
			echo $rend->render_student($entry, $entry2, $cmid);
			break;

		case 'annotationRemove':
			$recid = required_param('r', PARAM_INT);  // Those three params are used in every action.
			$DB->delete_records('annotations',array('id' => $recid));
			$DB->delete_records('annotations_comments',array('annotid' =>$recid));
			break;
		case 'graphUpdate':
			$contextid = required_param('c', PARAM_INT);  // Those three params are used in every action.
			$courseid = required_param('b', PARAM_INT);  // Those three params are used in every action.
			$rend = $PAGE->get_renderer('block_annotations');

 			$return_graph = $rend->createGraphModul($contextid,$courseid);
			echo json_encode($return_graph);
			break;
		case 'tagsPreload':
			
			$course_id = required_param('c', PARAM_INT);  // Those three params are used in every action.
			$sql = 'SELECT hashtag FROM mdl_annotations	WHERE courseid = :courseid AND NOT (tagtype = :typeexcl) GROUP BY hashtag ORDER BY hashtag';
			$params['courseid'] = $course_id;
			$params['typeexcl'] = 'anot_privat';
			$records = array();
			$records = $DB->get_records_sql($sql,$params);
			
			foreach($records as $rec)
			{
				$rettest[] = array('tag' => $rec->hashtag);
			}
			echo json_encode($rettest);
			break;
		case 'adminGraphUpdate':
			$hashtag = required_param('t', PARAM_TEXT);  // Those three params are used in every action.
			$courseid = required_param('b', PARAM_INT);  // Those three params are used in every action.
			$checked_general = required_param('g',PARAM_BOOL);
			$checked_technical = required_param('te',PARAM_BOOL);
			$checked_understand = required_param('u',PARAM_BOOL);
			$rend = $PAGE->get_renderer('block_annotations');
			$types_of_tag = array();
			
			
			if($checked_general == true){
				$type_of_tag['anot_general'] = $checked_general;
			}
			
			if($checked_technical == true){
				$type_of_tag['anot_technical'] = $checked_technical;
			}
			
			if($checked_understand == true){
				$type_of_tag['anot_understand'] = $checked_understand;
			}
			
			$return_graph = $rend->createAdminGraphModul($hashtag,$courseid,$type_of_tag);
			echo json_encode($return_graph);
			break;
			
		default:
			break;
	}
}
