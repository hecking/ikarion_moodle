<?php
defined('MOODLE_INTERNAL') || die();

class block_annotations_renderer extends plugin_renderer_base {
	private $tree_cnt = 0;	
	private $courseid = 0;
	private $context_id = 0;
	private $tagtype_bgcolor = '#FF7C80';
	private $tag_bgcolor     = '#CCFFCC';
	private $context_bgcolor = '#FFFF99';
	private $tagtype_fgcolor = '';
	private $tag_fgcolor     = '';
	private $context_fgcolor = '#0000FF';
	
	/**
	 * 
	 * @param unknown $contextid
	 * @param unknown $cid
	 * @return string[]|unknown[]|number[]|string|unknown|number|NULL
	 */
	public function createGraphModul($contextid,$cid) {
		$this->courseid = $cid;
		
		$return_graph[] = $this->contextTab($contextid, 0);
		$parent_id = $this->tree_cnt;
		foreach ($this->hashtagTab($contextid, $parent_id) as $hashRec)
		{
			$return_graph[] = $hashRec;
		}
		
		return $return_graph;
	}
	
	/**
	 * 
	 * @param unknown $hashtag
	 * @param unknown $cid
	 * @return number[]|string[]|number[][]|string[][]|unknown[][]
	 */
	public function createAdminGraphModul($hashtag,$cid,$types_of_tag) {
		global $DB;
		
		$this->courseid = $cid;
		
		$sql = 'SELECT contextid FROM mdl_annotations WHERE hashtag = :hashtag AND tagtype = :tagtype AND courseid = :courseid';

		foreach($types_of_tag as $myTagtype => $value)
		{
			$this->tree_cnt++;
			$return_graph[] = array('id'=> $this->tree_cnt,
					'parent' => 0,
					'name' => get_string($myTagtype, 'block_annotations'),
					'link' => '',
					'fgcolor' => $this->tagtype_fgcolor,
					'bgcolor' => $this->tagtype_bgcolor,
					'url-img' => '');
			
			$params['hashtag'] = $hashtag;
			$params['tagtype'] = $myTagtype;
			$params['courseid'] = $cid;
			
			$records = array();
			$records = $DB->get_records_sql($sql,$params);
			
			if(count($records) > 0){
				$return_graph[] = array('id'=> $this->tree_cnt+1,
						'parent' => $this->tree_cnt,
						'name' => $hashtag,
						'link' => '',
						'fgcolor' => $this->tag_fgcolor,
						'bgcolor' => $this->tag_bgcolor,
						'url-img' => '');
				$this->tree_cnt++;
			}
			
			$parentid = $this->tree_cnt;
			foreach ($records as $rec)
			{
				$return_graph[] = $this->contextTab($rec->contextid, $parentid);
			}
		}

	
		return $return_graph;
	}
	
	/**
	 * 
	 * @param unknown $hashtag
	 * @param unknown $parentid
	 * @param unknown $contextid
	 * @return string[]|unknown[]|number[]
	 */
	private function getContextByHashtag($hashtag, $parentid,$contextid)
	{
		global $DB;
		
		$sql = 'SELECT contextid FROM {annotations} WHERE hashtag = :hashtag AND contextid <> :cid';
		$params['hashtag'] = $hashtag;
		$params['cid'] = $contextid;
		
		$records = array();
		$records = $DB->get_records_sql($sql,$params);
		
		foreach ($records as $rec)
		{
			$return_graph[] = $this->contextTab($rec->contextid, $parentid);
		}
		
		return $return_graph;
	}
	
	/**
	 * 
	 * @param unknown $contextid
	 * @param unknown $treeparent
	 * @return string[]|unknown[]|number[]|string[][]|unknown[][]|number[][]|NULL[]
	 */
	private function hashtagTab($contextid, $treeparent){
		global $DB;
		$sql = 'SELECT hashtag FROM mdl_annotations	WHERE contextid = :contextid AND NOT (tagtype = :typeexcl) GROUP BY hashtag';
		$params['contextid'] = $contextid;
		$params['typeexcl'] = 'anot_privat';
		
		$records = array();
		$records = $DB->get_records_sql($sql,$params);
		
		foreach ($records as $rec)
		{
			$this->tree_cnt++;
			$father = $this->tree_cnt;
			$return_graph[] = array('id'=> $this->tree_cnt,
					'parent' => $treeparent,
					'name' => $rec->hashtag,
					'link' => '',
					'fgcolor' => $this->tag_fgcolor,
					'bgcolor' => $this->tag_bgcolor,
					'url-img' => '');
			$contextarray = $this->getContextByHashtag($rec->hashtag, $father,$contextid);
			foreach ($contextarray as $contextrec)
			{
				$return_graph[] = $contextrec;
			}
			
		}
		
		return $return_graph;
		
	}	
	
	/**
	 * 
	 * @param unknown $contextid
	 * @param unknown $treeparent
	 * @return string[]|unknown[]|number[]
	 */
	private function contextTab($contextid, $treeparent) {
	
		$cmd = context::instance_by_id($this->courseid);
		$modinfo = get_fast_modinfo($cmd->instanceid);
		$context = context::instance_by_id($contextid);
		$this->tree_cnt++;
	
		foreach ($modinfo->cms as $mod)
		{
			if( $mod->context->id == $contextid )
			{
				$return_graph = array('id'=> $this->tree_cnt,
						'parent' => $treeparent,
						'name' => $mod->get_formatted_name(),
						'link' => $context->get_url()->__toString(),
						'fgcolor' => $this->context_fgcolor,
						'bgcolor' => $this->context_bgcolor,
						'url-img' => $mod->get_icon_url()->__toString());
				break;
			}
		}
	
		if(!isset($return_graph))
		{
			$return_graph = array('id'=> $this->tree_cnt,
					'parent' => $treeparent,
					'name' => 'Missing Course! id:' . $contextid,
					'link' => '',
					'fgcolor' => '',
					'bgcolor' => '#FF0000',
					'url-img' => '');
		}
		return $return_graph;
	}	
	
	/**
	 * 
	 * @param unknown $records
	 * @param unknown $users
	 */
	public function render_comments($records, $users)
	{
		
		global $DB, $PAGE, $OUTPUT, $CFG, $USER;
		
		$resultset = html_writer::empty_tag('hr');
		
		foreach($records as $record)
		{
			$userobj;
			foreach ($users as $myuser)
			{
				if($myuser->id == $record->userid){
					$userobj = $myuser;
					break;
				}
			}
			$url = new moodle_url('/user/view.php', array('id'=> $userobj->id, 'course'=>$PAGE->course->id));
			$avatar = $OUTPUT->user_picture($userobj, array('size'=>18));
			$tf = get_string('strftimerecentfull', 'langconfig');
			$usertime = userdate($record->timecreated, $tf);
			$resultset .= html_writer::tag('span', $avatar, array('class' => 'picture'));
			$resultset .= html_writer::tag('span', '<a href="' . $url . '">'. fullname($userobj) . '</a>', array('class' => 'user')) . ' - ';
			$resultset .= html_writer::tag('span', $usertime, array('class' => 'time'));
			$resultset .= html_writer::empty_tag('br');
			$resultset .= html_writer::tag('p',$record->comment);	
			$resultset .= html_writer::empty_tag('hr');
		}
		
		echo $resultset;
		
	}
	
	/**
	 * 
	 * @param unknown $records
	 * @param unknown $users
	 */
	public function render_student($records, $users, $cmid)
	{
		global $DB, $PAGE, $OUTPUT, $CFG, $USER, $COURSE;
		
		$resultset = '<ul class="anot_open" id="anot_open_start">';																											
		$tagstruct = array('anot_general' => array(), 'anot_technical' => array(), 'anot_understand' => array(), 'anot_privat' => array());
		$img_url_expanded = $CFG->wwwroot . "/pix/t/expanded.png";
		$img_url_collaps = $CFG->wwwroot . "/pix/t/collapsed.png";
		$img_url_delete = $CFG->wwwroot . "/pix/t/delete.png";
		$img_url_collaps_empty = $CFG->wwwroot . "/pix/t/collapsed_empty.png";
		$img_url_feedback_add = $CFG->wwwroot . "/pix/t/feedback_add.gif";
		$img_url_feedback = $CFG->wwwroot . "/pix/t/feedback.gif";
		$img_url_edit = $CFG->wwwroot . "/pix/t/editstring.png";
		
		foreach ($records as $record)
		{
			if(!is_array($tagstruct[$record->ctagtype]))
			{
				$tagstruct[$record->ctagtype] = array();
			}
			
			if(!is_array($tagstruct[$record->ctagtype][$record->chashtag]))
			{
				$tagstruct[$record->ctagtype][$record->chashtag] = array();
			}
			
			$tagstruct[$record->ctagtype][$record->chashtag][] = $record;
			
		}
		
		foreach ($tagstruct as $t_key => $t_value)
		{
			$resultset .= html_writer::start_tag('li', array('id' => $t_key));																		
			if( count($t_value) == 0)
			{
				$resultset .= html_writer::start_tag('a', array('onclick' => 'annotations_toggle("' . $t_key . '","' . $img_url_collaps_empty.'","'.$img_url_collaps_empty.'");'));
				$resultset .= html_writer::empty_tag('img', array('src' => $img_url_collaps_empty, 'id' => 'img_' . $t_key, 'border' => '0'));
			}else{
				$resultset .= html_writer::start_tag('a', array('onclick' => 'annotations_toggle("' . $t_key . '","' . $img_url_collaps.'","'.$img_url_expanded.'");'));
			$resultset .= html_writer::empty_tag('img', array('src' => $img_url_collaps, 'id' => 'img_' . $t_key, 'border' => '0'));
			}
			$resultset .= html_writer::end_tag('a');
			$resultset .= get_string($t_key,'block_annotations');
			$resultset .= html_writer::start_tag('ul', array('id' => 'ul_' . $t_key, 'class' => 'anot_closed'));									
			foreach($t_value as $h_key => $h_value)
			{
			
				$resultset .= html_writer::start_tag('li', array('id' => $t_key . '_' . $h_key));													
				$resultset .= html_writer::start_tag('a', array('onclick' => 'annotations_toggle("'. $t_key . '_' . $h_key .'","' . $img_url_collaps.'","'.$img_url_expanded.'");') );
				$resultset .= html_writer::empty_tag('img', array('src' => $img_url_collaps, 'id' => 'img_' . $t_key. '_' . $h_key, 'border' => '0'));
				$resultset .= html_writer::end_tag('a');
				$resultset .= $h_key;
				$resultset .= html_writer::start_tag('ul', array('id' => 'ul_' . $t_key. '_' . $h_key, 'class' => 'anot_closed'));					
				
				$resultset .= html_writer::start_tag('li', array('id' => 'tb_' . $t_key. '_' . $h_key));											
				$resultset .= html_writer::start_tag('table', array('id' => 'tab_' . $t_key. '_' . $h_key, 'border' => '0', 'class' => 'anot_open_name', 'width' => '100%')); 
				
				foreach ($h_value as $rec)
				{
					$userobj;
					$resultset .= html_writer::start_tag('tbody', array('id' => 'annot-id-' . $rec->cid));
					$resultset .= html_writer::start_tag('tr');
					foreach ($users as $myuser)
					{
						if($myuser->id == $rec->cuserid){
							$userobj = $myuser;
							break;
						}
					}
					
					$url = new moodle_url('/user/view.php', array('id'=> $userobj->id, 'course'=>$PAGE->course->id));
					$avatar = $OUTPUT->user_picture($userobj, array('size'=>18));
					$tf = get_string('strftimerecentfull', 'langconfig');
					$usertime = userdate($rec->ctimecreated, $tf);
					$resultset .= html_writer::start_tag('td', array('width' => '90%'));
					$resultset .= html_writer::tag('span', $avatar, array('class' => 'picture'));
					$resultset .= html_writer::tag('span', '<a href="' . $url . '">'. fullname($userobj) . '</a>', array('class' => 'user')) . ' - ';
					$resultset .= html_writer::tag('span', $usertime, array('class' => 'time'));
					$resultset .= html_writer::end_tag('td');
					
					$resultset .= html_writer::start_tag('td', array('width' => '10%'));
					
					if($USER->id == $rec->cuserid || is_siteadmin(null) || has_capability('blocks/annotations:delete', context_module::instance($cmid)))
					{
						$resultset .= html_writer::empty_tag('img', array('class' => 'smallicon', 'alt' => get_string('delete', 'block_annotations'), 'src' => $img_url_delete, 'onclick' => 'annotations_annotationRemove(' . $rec->cid .',"'. sesskey() . '","'. $CFG->wwwroot .'","' . $t_key . '","' . $h_key . '","'. $img_url_collaps_empty .'");'));
						$resultset .= html_writer::empty_tag('img', array('class' => 'smallicon', 'alt' => get_string('edit', 'block_annotations'), 'src' => $img_url_edit, 'onclick' => 'annotations_annotationEdit(' . $rec->cid .',"' . $t_key . '","' . $h_key . '","' . $rec->cannotation . '");'));
						
					}else{
						$resultset .= "&nbsp;";
					}
					
					$resultset .= html_writer::end_tag('td');
					$resultset .= html_writer::end_tag('tr');
						
					$formatoptions = array('overflowdiv' => true);
					$textcont = format_text($rec->cannotation, FORMAT_MOODLE, $formatoptions);
					
					
					$resultset .= html_writer::start_tag('tr');
					$resultset .= html_writer::start_tag('td', array('width' => '90%', 'id' => 'text_annotation'));
					$resultset .= html_writer::tag('div', $textcont, array('class' => 'text'));
					$resultset .= html_writer::end_tag('td');
					$resultset .= html_writer::start_tag('td', array('width' => '10%'));
					if(!$this->has_comments($rec->cid))
					{
						$resultset .= html_writer::empty_tag('img', array('class' => 'smallicon', 'alt' => get_string('delete', 'block_annotations'), 'src' => $img_url_feedback_add,  'onclick' => 'annotations_open_comments('. $rec->cid .',' . $USER->id . ',"'. sesskey() . '","'. $CFG->wwwroot . '");'));
					}else{
						$resultset .= html_writer::empty_tag('img', array('class' => 'smallicon', 'alt' => get_string('delete', 'block_annotations'), 'src' => $img_url_feedback,  'onclick' => 'annotations_open_comments('. $rec->cid .',' . $USER->id . ',"'. sesskey() . '","'. $CFG->wwwroot . '");'));
					}
					$resultset .= html_writer::end_tag('td');
					$resultset .= html_writer::end_tag('tr');
					
					
					$resultset .= html_writer::end_tag('tbody');
				}
				$resultset .= html_writer::end_tag('table');																						 
				$resultset .= html_writer::end_tag('li');																							
				$resultset .= html_writer::end_tag('ul');																							
				$resultset .= html_writer::end_tag('li');																							
			}
			$resultset .= html_writer::end_tag('ul');																								
			$resultset .= html_writer::end_tag('li');																								
				
		}
		
		$resultset .= html_writer::end_tag('ul');																									
		echo $resultset;
	}
	
	/**
	 * 
	 * @param unknown $id
	 */
	private function has_comments($id)
	{
		global $DB;
		
		$sql = 'SELECT count(id) as menge FROM {annotations_comments} where annotid = :annotid';
		$params['annotid'] = $id;
		
		$entry = array();
		$entry = $DB->get_records_sql($sql,$params);
		
		foreach($entry as $rec)
		{
			if($rec->menge == 0)
				return false;
			else
				return true;
		}
		
		return false;
	}
}
?>