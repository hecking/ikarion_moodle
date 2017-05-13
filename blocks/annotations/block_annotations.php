<?php
require_once($CFG->dirroot . '/blocks/annotations/lib.php');

class block_annotations extends block_base {

	public function init() {
        $this->title = get_string('annotations', 'block_annotations');
    }

    public function get_content() {
    global $CFG, $PAGE, $COURSE, $USER, $DB;
    $PAGE->requires->jquery();
    $PAGE->requires->jquery_plugin('ui');
    $PAGE->requires->jquery_plugin('ui-css');
    $PAGE->requires->js(new moodle_url($CFG->wwwroot.'/blocks/annotations/annotations.js'));
    $PAGE->requires->js(new moodle_url($CFG->wwwroot.'/blocks/annotations/orgchart.js'));
    
  	$context = context_course::instance($COURSE->id);
 
  	$args = new stdClass;
	$args->contextid = $PAGE->context->id;
	$args->userid = $USER->id;
	$args->courseid = $PAGE->context->get_course_context(false)->id;
	$args->sesskey = sesskey();
	$args->cm = $PAGE->cm->id;
	
	$annotation = new annotation($args);
   	if(!isguestuser())
   	{
   		if( $PAGE->context->get_course_context(false)->id==$PAGE->context->id)
   		{
   			$_information_site.= $annotation->get_statistic_view();
   		}else{
   			$_information_site.= $annotation->get_user_form();
   		}
   	}
   		
    if ($this->content != null) {
    	$this->content->text = $_information_site . ' ' . $this->content->text;
      return $this->content;
    }
	 

    $this->content         =  new stdClass;
    $this->content->text   = $_information_site;
    
    $this->content->footer = '';

    
    if (! empty($this->config->text)) 
    {
	   	$this->content->text = $this->content->text . ' ' . $this->config->text;
    
 		return $this->content;
	}
  }
  
	
}
