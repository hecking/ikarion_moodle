<?php



class annotation
{

	/**
	 * Construct function of annotation class, initialise
	 * class members
	 *
	 * @param stdClass $options {
	 * }
	 */
	private $context_id = 0;
	private $user_id = 0;
	private $skey = "";
	private $session_key = "";
	private $courseid = 0;
	private $cm = 0;
	
	public function __construct(stdClass $options) {
		global $PAGE, $USER;
		
		
		if(!isset($options->contextid))
		{
			$this->context_id = $PAGE->context->id;
		}else{
			$this->context_id = $options->contextid;
		}
		
		if(!isset($options->userid))
		{
			$this->user_id = $USER->id;
		}else{
			$this->user_id = $options->userid;
		}
		
		if(!isset($options->courseid))
		{
			$this->courseid = $PAGE->context->get_course_context(false)->id;;
		}else{
			$this->courseid = $options->courseid;
		}
		$this->skey = '"' . $options->sesskey . '"';
		$this->session_key = $options->sesskey;
		$this->cm = $options->cm;
	}

	public function get_statistic_view($param = null)
	{
		global $DB, $CFG, $COURSE,$OUTPUT;

		$img_url_graph = $CFG->wwwroot . "/pix/i/withsubcat.png";
		
		$modinfo = get_fast_modinfo($COURSE);
		
		$html .= html_writer::start_tag('b');
		$html .= html_writer::tag('p',get_string('anot_statistic','block_annotations'));
		$html .= html_writer::end_tag('b');
	
		$html .= html_writer::start_tag('anot_open_start', array('class' => 'anot_open'));																								
		$img_url_expanded = $CFG->wwwroot . "/pix/t/expanded.png";
		$img_url_collaps = $CFG->wwwroot . "/pix/t/collapsed.png";
		$img_url_collaps_empty = $CFG->wwwroot . "/pix/t/collapsed_empty.png";
		$typelist = array('anot_general' => array(), 'anot_technical' => array(), 'anot_understand' => array());
		$statistics = array('anot_general' => 0, 'anot_technical' => 0, 'anot_understand' => 0);
		$stat_times = array('anot_general' => array('basic' => 0, 'mod' => array()),
							'anot_technical' => array('basic' => 0, 'mod' => array()), 
							'anot_understand' => array('basic' => 0, 'mod' => array()));
		
		$sql = "SELECT  mdl_annotations.id, contextid, tagtype, hashtag,timemodified
			FROM {annotations} INNER JOIN {context} ON mdl_annotations.contextid = mdl_context.id 
			WHERE courseid = :courseid AND NOT ( tagtype = :typeexcl )
			ORDER BY timemodified DESC";
		
		$params['courseid'] = $this->courseid;
		$params['typeexcl'] = "anot_privat";
			
		$entries = array();
		$entries = $DB->get_records_sql($sql,$params);
		$html .= html_writer::start_div('anot_input_table', array('id' => 'anot_input_table'));
		$html .= html_writer::empty_tag('input', array('type' => 'hidden', 'value' => $this->courseid, 'id' => 'anot_courseid'));
		$html .= html_writer::empty_tag('input', array('type' => 'hidden', 'value' => $this->session_key, 'id' => 'anot_sesskey'));
		$html .= html_writer::empty_tag('input', array('type' => 'hidden', 'value' => $CFG->wwwroot, 'id' => 'anot_wwwroot'));
		
		foreach ($entries as $entry)
		{
			$typelist[$entry->tagtype][$entry->contextid] = $entry;
			
			$statistics[$entry->tagtype]++;
			if($stat_times[$entry->tagtype]['basic'] < $entry->timemodified)
				$stat_times[$entry->tagtype]['basic'] = $entry->timemodified;
			
			if(isset($stat_times[$entry->tagtype]['mod'][$entry->contextid])){
				if($stat_times[$entry->tagtype]['mod'][$entry->contextid] < $entry->timemodified){
					$stat_times[$entry->tagtype]['mod'][$entry->contextid] = $entry->timemodified;
				}
		    }else{
		    	$stat_times[$entry->tagtype]['mod'][$entry->contextid] = $entry->timemodified;
		    }  
		}
		
		foreach ($typelist as $t_key => $t_value)
		{
			$html .= html_writer::start_tag('li', array('id' => $t_key));																			
			if( $statistics[$t_key] == 0)
			{
				$html .= html_writer::start_tag('a', array('onclick' => 'annotations_toggle("' . $t_key . '","' . $img_url_collaps_empty.'","'.$img_url_collaps_empty.'");'));
				$html .= html_writer::empty_tag('img', array('src' => $img_url_collaps_empty, 'id' => 'img_' . $t_key, 'border' => '0'));
			}else{
				$html .= html_writer::start_tag('a', array('onclick' => 'annotations_toggle("' . $t_key . '","' . $img_url_collaps.'","'.$img_url_expanded.'");'));
				$html .= html_writer::empty_tag('img', array('src' => $img_url_collaps, 'id' => 'img_' . $t_key, 'border' => '0'));
			}
			$html .= html_writer::end_tag('a');
			$html .= $statistics[$t_key];
			$html .= ' ' . get_string($t_key,'block_annotations');
			$html .= '<br>';
			$html .= html_writer::start_div('div_info_' . $t_key . '_' . $c_key, array('id' => 'statistic_info'));
			$html .= $this->timeToNow($stat_times[$t_key]['basic']);
			$html .= html_writer::end_div();
			$html .= html_writer::start_tag('ul', array('id' => 'ul_' . $t_key, 'class' => 'anot_closed'));											
			
			foreach($t_value as $c_key => $c_value)
			{
				$context = context::instance_by_id($c_key);
				$html .= html_writer::start_tag('li', array('id' => $t_key . '_' . $c_key));													
				$html .= html_writer::start_div('div_url_' . $t_key . '_' . $c_key);
				$html .= html_writer::start_tag('a', array('href' => $context->get_url()));
				foreach ($modinfo->cms as $mod)
				{
					if( $mod->context->id == $c_key )
					{
						$html .= html_writer::empty_tag('img', array('src' => $mod->get_icon_url(),
						'class' => 'icon', 'alt' => ' ')); 
						$html .= $mod->get_formatted_name();
					}
				}
				$html .= html_writer::end_tag('a');
				$html .= html_writer::end_div();
				$html .= html_writer::start_div('div_info_' . $t_key . '_' . $c_key, array('id' => 'statistic_info'));
				
				$html .= $this->timeToNow($stat_times[$t_key]['mod'][$c_key]);
				$html .= html_writer::end_div();
				$html .= html_writer::end_tag('li');																							
					
			}
			$html .= html_writer::end_tag('ul');																									
					
			$html .= html_writer::end_tag('li');																									
		}
		$html .= html_writer::end_div('anot_input_table');
		
		
		$html .= html_writer::end_tag('ul');																										
		$html .= html_writer::div('', 'anot-view-area-div', array('id' => 'anot-view-area'));
		
		$html .= $this->create_graph_div_admin();
		$html .= html_writer::tag('hr');
		$html .= html_writer::empty_tag('img', array('src' => $img_url_graph,'title' => get_string('anot_overview','block_annotations'),'alt' => get_string('anot_overview','block_annotations'), 'onclick' => 'annotations_open_admin_graph(' . $this->courseid . ',' . $this->skey . ',"' . $CFG->wwwroot . '")'));
		
		return $html;
		
	}
	
	private function timeToNow($in_time){
		$html = html_writer::tag('b');
		$result_time = get_string('anot_changed', 'block_annotations');
		$act_time = time();
		$dif_in_sec = $act_time - $in_time;
		
		if($in_time == 0)
		{
			$result_time = get_string('anot_notchanged', 'block_annotations');
			return $result_time;				
		}
		
		$years = intval($dif_in_sec / (3600 * 24 * 365)); 
		if($years > 0){
			$dif_in_sec = $dif_in_sec - ($years * (3600 * 24 * 365));
			$result_time .= $years . get_string('anot_year','block_annotations');
		}
		
		$months = intval($dif_in_sec / (3600 * 24 * 30));
		if($months > 0){
			$dif_in_sec = $dif_in_sec - ($months * (3600 * 24 * 30));
			$result_time .= $months . get_string('anot_month','block_annotations');
		}
		
		$days = intval($dif_in_sec / (3600 * 24));
		if($days > 0){
			$dif_in_sec = $dif_in_sec - ($days * (3600 * 24));
			$result_time .= $days . get_string('anot_day','block_annotations');
		}
		
		$hours = intval($dif_in_sec / (3600));
		if($hours > 0 && $years == 0){
			$dif_in_sec = $dif_in_sec - ($hours * (3600));
			$result_time .= $hours . get_string('anot_hour','block_annotations');
		}
		
		$minutes = intval($dif_in_sec / (60));
		if($minutes > 0 && $years == 0 && $months == 0){
			$dif_in_sec = $dif_in_sec - ($minutes * (60));
			$result_time .= $minutes . get_string('anot_minute','block_annotations');
		}
		if($dif_in_sec > 0 && $years == 0 && $months == 0 && $days == 0){
			$result_time .= $dif_in_sec . get_string('anot_second','block_annotations');
		}
		
		return $result_time;
	}
	
	/**
	 * Function to Load the Input Form for Students
	 * 
	 */
	public function get_user_form($param = null) {
		global $DB, $CFG, $PAGE;
		$html = "";
		$img_url_graph = $CFG->wwwroot . "/pix/i/withsubcat.png";
		
        $html .= html_writer::start_div('anot_input_table');

        
        $mytable = new html_table();
        $mytable->size = array('20px','80px');
        $mytable->data= array();
        $mytable->id = 'anot_input_table';

        /**
         *  Header definition
         */
        $mytable->head = array(get_string('anot_writetitle','block_annotations'));
        $mytable->headspan = array(2);
		
        /**
         * Selection Radio Menu
         */
        $row1 = new html_table_row();
        $row1->cells[] = new html_table_cell(get_string('anot_type','block_annotations'));
        $radios = html_writer::start_tag('fieldset', array('id' => 'radiogroup'));
        $radios .= html_writer::empty_tag('input', array('type' => 'radio', 'id' => 'anot_general', 'name' => 'anot_type', 'value' => 'anot_general', 'checked' => 'checked' )) . get_string('anot_general','block_annotations') . "<br/>";
        $radios .= html_writer::empty_tag('input', array('type' => 'radio', 'id' => 'anot_technical', 'name' => 'anot_type', 'value' => 'anot_technical' )) . get_string('anot_technical','block_annotations') . "<br/>";
        $radios .= html_writer::empty_tag('input', array('type' => 'radio', 'id' => 'anot_understand', 'name' => 'anot_type', 'value' => 'anot_understand' )) . get_string('anot_understand','block_annotations') . "<br/>";
        $radios .= html_writer::empty_tag('input', array('type' => 'radio', 'id' => 'anot_privat', 'name' => 'anot_type', 'value' => 'anot_privat' )) . get_string('anot_privat','block_annotations') ;
	    $row1->cells[] = new html_table_cell($radios);
	    $row1->cells[0]->style='width:15%;text-align:right;border:0;background-color: transparent;vertical-align: top';
	    $row1->cells[1]->style='width:85%;text-align:left;border:0;border:0;background-color: transparent;vertical-align: top';
        $mytable->data[] = $row1;
        
        /**
         * Inputfield for Hashtags
         */

        $row2 = new html_table_row();
        $row2->cells[] = new html_table_cell(get_string('anot_hashtag','block_annotations'));
        
        $inputtag = html_writer::empty_tag('input', array('type' => 'text', 'id' => 'hashtag', 'placeholder' => get_string('anot_hashtag_help','block_annotations'), 'size' => '20'));
        $row2->cells[] = new html_table_cell($inputtag);
		$row2->cells[0]->style='width:15%;text-align:right;border:0;vertical-align: top';
	    $row2->cells[1]->style='width:85%;text-align:left;border:0;vertical-align: top';
		$mytable->data[] = $row2;
        
        /**
         * 
         * Textarea
         */
        $row3 = new html_table_row();
        $inputarea = html_writer::start_tag('textarea', array('id' => 'annotation', 'placeholder' => get_string('anot_annotation_help','block_annotations'), 'cols' => '30', 'rows' => '2'));
        $inputarea .= html_writer::end_tag('textarea');
        $inputarea .= html_writer::empty_tag('input', array('type' => 'hidden', 'value' => '-1', 'id' => 'annotid'));
        $row3->cells[] = new html_table_cell($inputarea);
        $row3->cells[0]->colspan = 2;
        $row3->cells[0]->style='width:15%;text-align:right;border:0;background-color: transparent;vertical-align: top';
        $mytable->data[] = $row3;
        
        /**
         *
         * Submit
         */
        $row4 = new html_table_row();
        $cell = html_writer::empty_tag('input',
        		array('type' => 'button',
        				'value' => get_string('reset'),
        				'id' => 'reset_button',
        				'disabled'=> '',
        				'onclick' => 'annotations_resetInput();'));
        $cell .= html_writer::empty_tag('input', 
        		array('type' => 'submit',
        			  'value' => get_string('submit'), 
        				'onclick' => 'annotations_postInsert(' . $this->courseid . ',' . $this->context_id . ',' . $this->user_id . ',' . $this->skey .  ',"' . $CFG->wwwroot . '");'));
        $cell .= html_writer::empty_tag('input', array('type' => 'hidden', 'value' => $this->context_id, 'id' => 'anot_contextid'));
        $cell .= html_writer::empty_tag('input', array('type' => 'hidden', 'value' => $this->courseid, 'id' => 'anot_courseid'));
        $cell .= html_writer::empty_tag('input', array('type' => 'hidden', 'value' => $this->user_id, 'id' => 'anot_userid'));
        $cell .= html_writer::empty_tag('input', array('type' => 'hidden', 'value' => $this->session_key, 'id' => 'anot_sesskey'));
        $cell .= html_writer::empty_tag('input', array('type' => 'hidden', 'value' => $CFG->wwwroot, 'id' => 'anot_wwwroot'));
        $cell .= html_writer::empty_tag('input', array('type' => 'hidden', 'value' => $this->cm, 'id' => 'anot_cm'));
        $row4->cells[] = new html_table_cell($cell);
        $row4->cells[0]->colspan = 2;
        $row4->cells[0]->style='width:100%;text-align:right;border:0;vertical-align: bottom';
        $mytable->data[] = $row4;
        $html .= html_writer::table($mytable);
		$html .= html_writer::end_div();
		$html .= html_writer::tag('hr');
		
		$html .= html_writer::start_tag('b');
		$html .= html_writer::tag('p', get_string('anot_view','block_annotations'));
		$html .= html_writer::end_tag('b');
		
		$html .= html_writer::start_div('anot-wait-area-div', array('id' => 'anot-wait-area', 'style' => 'display:none'));
        $html .= html_writer::start_tag('b');
        $html .= get_string('anot_load', 'block_annotations');
        $html .= html_writer::end_tag('b');
		$html .= html_writer::end_div();
	
        $html .= html_writer::start_div('anot-view-area-div', array('id' => 'anot-view-area'));
		$html .= html_writer::end_div();
		$html .= html_writer::tag('hr');
		$html .= $this->create_comment_div();
		$html .= $this->create_graph_div();
		$html .= html_writer::empty_tag('img', array('src' => $img_url_graph,'title' => get_string('anot_overview','block_annotations'),'alt' => get_string('anot_overview','block_annotations'), 'onclick' => 'annotations_update_graph('. $this->courseid .','. $this->context_id . ',"'. $CFG->wwwroot .'","'. sesskey() . '", true)'));
	
        return $html;
	}

	
	private function create_comment_div()
	{
		global $CFG;
		$img_url_close = $CFG->wwwroot . "/pix/t/delete.png";
		
		$html = "";
		
		$html .= html_writer::start_div('anot-view-comment-div', array('id' => 'anot-view-comment', 'style' => 'display:none')); 
		$html .= html_writer::start_tag('table',array('id' => 'tab_' . $t_key. '_' . $h_key, 'border' => '0', 'class' => 'anot_comment_tab', 'width' => '100%'));
		
		$html .= html_writer::start_tag('tr');
		$html .= html_writer::start_tag('td', array('align' => 'right'));
		$html .= html_writer::empty_tag('img', array('src' => $img_url_close, 'onclick' => 'annotations_close_comments()'));
		$html .= html_writer::end_tag('td');
		$html .= html_writer::end_tag('tr');
		$html .= html_writer::start_tag('tr');
		$html .= html_writer::start_tag('td');
		$html .= html_writer::tag('textarea','', array('id' => 'anot_comment_text', 'placeholder' => get_string('anot_comment_help','block_annotations'), 'cols' => '70', 'rows' => '4'));
		$html .= html_writer::empty_tag('input',
				array('type' => 'submit',
						'value' => get_string('submit'),
						'onclick' => 'annotations_commentInsert(' . $this->skey .  ',"' . $CFG->wwwroot . '");'));
				
		$html .= html_writer::empty_tag('input', array('type' => 'hidden', 'value' => '', 'id' => 'annotid'));
		$html .= html_writer::empty_tag('input', array('type' => 'hidden', 'value' => '', 'id' => 'userid'));
		$html .= html_writer::end_tag('td');
		$html .= html_writer::end_tag('tr');
		$html .= html_writer::start_tag('tr');
		$html .= html_writer::start_tag('td');
		$html .= html_writer::start_div('anot_comment_out', array('id' => 'anot_comment_out', 'style' => 'display:none'));  
		$html .= html_writer::end_div();
		
		
		$html .= html_writer::end_tag('td');
		$html .= html_writer::end_tag('tr');
		$html .= html_writer::end_tag('table');
		$html .= html_writer::end_div();
		
		return $html;
		
	}
	

	
	private function create_graph_div()
	{
		global $CFG;
	
		$html = "";
	
		$html .= html_writer::start_div('anot_view_graph_div', array('id' => 'anot_view_graph', 'style' => 'display:none')); 
		$html .= html_writer::tag('canvas','', array('id'=> 'c_nodes')); 
		$html .= html_writer::end_div();
	
				return $html;
	
	}
	
	private function create_graph_div_admin()
	{
		global $CFG, $DB;
		$last_char = '';
		$akt_char = '';
		$selected = true;
		
		$sql = 'SELECT hashtag FROM mdl_annotations	WHERE courseid = :courseid AND NOT (tagtype = :typeexcl) GROUP BY hashtag ORDER BY hashtag';
		$params['courseid'] = $this->courseid;
		$params['typeexcl'] = 'anot_privat';
		
		$records = array();
		$records = $DB->get_records_sql($sql,$params);
		
		$html = "";
	
		$html .= html_writer::start_div('anot_view_graph_div', array('id' => 'anot_view_graph', 'style' => 'display:none')); 
		$html .= html_writer::start_tag('table',array('id' => 'tab_graph', 'border' => '0', 'class' => 'anot_graph_tab', 'width' => '100%'));
		$html .= html_writer::start_tag('tr');
		$html .= html_writer::start_tag('td', array('align' => 'left', 'colspan' => '3'));
		$html .= html_writer::tag('h1', get_string('anot_over', 'block_annotations'));
		$html .= html_writer::end_tag('td');
		$html .= html_writer::end_tag('tr');
		$html .= html_writer::start_tag('tr');
		$html .= html_writer::start_tag('td', array('width' => '200', 'align' => 'right'));
		$html .= html_writer::tag('p', get_string('anot_label','block_annotations'));
		$html .= html_writer::end_tag('td');
		$html .= html_writer::start_tag('td', array('width' => '400','align' => 'left'));
		$html .= html_writer::start_div('ui-front', array('id' => 'anot_graph_select')); 

		$html .= html_writer::empty_tag('input', array('id' => 'anot_hashtaglist', 'type' => 'text'));
		$html .= html_writer::empty_tag('input',
				array('type' => 'button',
						'value' => get_string('anot_update','block_annotations'),
						'id' => 'update_button',
						'onclick' => 'annotations_update_admin_graph(' . $this->courseid . ',' . $this->skey . ',"' . $CFG->wwwroot . '");'));
		
		$html .= html_writer::end_div();
		
		$html .= html_writer::end_tag('td');
		
		$html .= html_writer::start_tag('td',array('align' => 'left'));
		$html .= html_writer::empty_tag('input', array('id' => 'chbx_anot_general','checked' => '','value' => 'anot_general', 'type' => 'checkbox','onchange' => 'annotations_pre_update_admin_graph(' . $this->courseid . ',' . $this->skey . ',"' . $CFG->wwwroot . '")'));
		$html .= get_string('anot_general','block_annotations') . '<br>';
		$html .= html_writer::empty_tag('input', array('id' => 'chbx_anot_technical','checked' => '','value' => 'anot_technical', 'type' => 'checkbox','onchange' => 'annotations_pre_update_admin_graph(' . $this->courseid . ',' . $this->skey . ',"' . $CFG->wwwroot . '")'));
		$html .= get_string('anot_technical','block_annotations') . '<br>';
		$html .= html_writer::empty_tag('input', array('id' => 'chbx_anot_understand','checked' => '','value' => 'anot_understand', 'type' => 'checkbox','onchange' => 'annotations_pre_update_admin_graph(' . $this->courseid . ',' . $this->skey . ',"' . $CFG->wwwroot . '")'));
		$html .= get_string('anot_understand','block_annotations');
		$html .= html_writer::end_tag('td');
		$html .= html_writer::end_tag('tr');
		$html .= html_writer::start_tag('tr');
		$html .= html_writer::start_tag('td', array('colspan' => '3'));
		$html .= html_writer::start_div('anot_graph_out', array('id' => 'anot_graph_out')); 
		$html .= html_writer::tag('canvas','', array('id'=> 'c_nodes')); 
		$html .= html_writer::end_div();

		$html .= html_writer::end_tag('td');
		$html .= html_writer::end_tag('tr');
		$html .= html_writer::end_tag('table');
		$html .= html_writer::end_div();
	
		return $html;
	
	}
	
}

?>