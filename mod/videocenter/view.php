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
 * Prints a particular instance of videocenter
 *
 * The boilerplate code comes from this project:
 * @see https://github.com/moodlehq/moodle-mod_newmodule
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

$id = optional_param('id', 0, PARAM_INT); // course_module ID, or
$n  = optional_param('n', 0, PARAM_INT);  // videocenter instance ID - it should be named as the first character of the module
$tagid = optional_param('tag', 0, PARAM_TEXT);
$keyword =optional_param('keyword', 0, PARAM_TEXT);
$user = optional_param('user', 0, PARAM_INT);
$show = optional_param('show', 10, PARAM_INT);
$page = optional_param('page', 1, PARAM_INT);
$sort = optional_param('sort', 1, PARAM_INT);
$order = optional_param('order', 1, PARAM_INT);


$videos_database ="videos";
$videor_activity_database ="videor";
$video_tags_database ="videor_tags";


if ($id) {
    $cm         = get_coursemodule_from_id('videocenter', $id, 0, false, MUST_EXIST);
    $course     = $DB->get_record('course', array('id' => $cm->course), '*', MUST_EXIST);
    $videocenter  = $DB->get_record('videocenter', array('id' => $cm->instance), '*', MUST_EXIST);
} elseif ($n) {
    $videocenter  = $DB->get_record('videocenter', array('id' => $n), '*', MUST_EXIST);
    $course     = $DB->get_record('course', array('id' => $videocenter->course), '*', MUST_EXIST);
    $cm         = get_coursemodule_from_instance('videocenter', $videocenter->id, $course->id, false, MUST_EXIST);
} else {
    error('You must specify a course_module ID or an instance ID');
}

require_login($course, true, $cm);
$context = get_context_instance(CONTEXT_MODULE, $cm->id);

add_to_log($course->id, 'videocenter', 'view', "view.php?id={$cm->id}", $videocenter->name, $cm->id);

/// Print the page header
$PAGE->set_url('/mod/videocenter/view.php', array('id' => $cm->id));
$PAGE->set_title(format_string($videocenter->name));
$PAGE->set_heading(format_string($course->fullname));
$PAGE->set_context($context);

$PAGE->requires->css('/mod/videocenter/styles.css');
$PAGE->requires->js('/mod/videor/jquery-1.8.3.js');
$PAGE->requires->js('/mod/videor/jquery-ui-1.9.2.custom.min.js');
$PAGE->requires->js('/mod/videocenter/script.js');

// Output starts here
echo $OUTPUT->header();

if ($videocenter->intro) { // Conditions to show the intro can change to look for own settings or whatever
    echo $OUTPUT->box(format_module_intro('videocenter', $videocenter, $cm->id), 'generalbox mod_introbox', 'videocenterintro');
}

$torder =0;
if($sort ==1 && $order ==1){
	$torder =2;

}else if($sort ==1 && $order ==2){
	$torder =1;

}else if($sort ==2 && $order ==1){
	$torder =2;

}else if($sort ==2 && $order ==2){
	$torder =1;

}

//Searchbox and sort options
echo '<form id="page-changer" name="input" action="'.new moodle_url('/mod/videocenter/view.php').'" method="get">
<input type="hidden" name="id" value="'.$cm->id.'">
'.get_string('keywordsearch', 'mod_videocenter').': <input type="text" name="keyword">
<input type="submit" value="'.get_string('search', 'mod_videocenter').'">
<input type="reset" value="'.get_string('clear', 'mod_videocenter').'">
<input type="button"  onclick="window.location=\''.new moodle_url('/mod/videocenter/view.php', array('id' =>$cm->id)).'\'" value="'.get_string('reset', 'mod_videocenter').'">
 <select>
        <option value="">'.get_string('sortby', 'mod_videocenter').'</option>
        <option value="'.new moodle_url('/mod/videocenter/view.php', array('id' =>$cm->id,'sort' => 1,'page'=> $page, 'show' => $show, 'order'=>$torder, 'tag' => $tagid, 'keyword'=>$keyword,'user'=>$user)).'">'.get_string('title', 'mod_videocenter').'</option>
        <option value="'.new moodle_url('/mod/videocenter/view.php', array('id' =>$cm->id,'sort' => 2,'page'=> $page, 'show' => $show, 'order'=>$torder, 'tag' => $tagid, 'keyword'=>$keyword,'user'=>$user)).'">'.get_string('date', 'mod_videocenter').'</option>
    </select>
</form>';



if($tagid){

	$tags_single = explode(",", $tagid);
	if(sizeof($tags_single) > 1){
		$paramters = $tags_single;
		$paramters[]= $course->id;
		$paramters[]= sizeof($tags_single);
		
		$sql_set='(';
		for ($i=0; $i < sizeof($tags_single) ; $i++) { 
			$sql_set.='?,';
		}
		$sql_set = substr_replace($sql_set ,"",-1);
		$sql_set.=')';
		
		// Get video ids for videos with all tags
		$sql ='SELECT * FROM {'.$video_tags_database.'} WHERE  content IN '.$sql_set.' AND courseid = ? GROUP BY instanceid HAVING COUNT(DISTINCT content) = ?';
		$videoids = $DB->get_records_sql($sql,$paramters);
	}else{
		$videoids = $DB->get_records_sql('SELECT instanceid FROM {'.$video_tags_database.'} WHERE content = ? AND courseid = ?', array($tagid,$course->id));
	}

	$vidys = array();

	$tags = array();
	$tags_instanceid = array();
	$sql_set='(';
	foreach ($videoids as $value) {
			$temp =$DB->get_records('videos', array('id'=> $value->instanceid, 'courseid' => $course->id, 'submission'=>0 ));
			//use reset to not show duplicate videos from repo
			foreach ($temp as $value) {
						$vidys[] = $value;
						$tags_instanceid[] = $value->id;
						$sql_set.='?,';
				}
	}
	$sql_set = substr_replace($sql_set ,"",-1);
	$sql_set.=')';
	

	$omit_tags = array();
	$sql_set2 ='(';
	for ($i=0; $i < sizeof($tags_single) ; $i++) { 
		$sql_set2.='?,';
		$omit_tags[] = $tags_single[$i];
	}
	$sql_set2 = substr_replace($sql_set2 ,"",-1);
	$sql_set2.=')';
	$allvideoscount =sizeof($vidys);

	$tags_instanceid[] = $course->id;
	$full_parameters = array_merge($omit_tags,$tags_instanceid);

	//Get remaining tags, excluding already selected
	$sql ='SELECT DISTINCT content FROM {'.$video_tags_database.'} WHERE content NOT IN '.$sql_set2.' AND instanceid IN '.$sql_set.' AND courseid =? ';



	$tagname = $DB->get_records_sql($sql,$full_parameters);


	
	
	$allvideoResources = $vidys;

	echo '<div >';
	for ($i=0; $i < sizeof($tags_single) ; $i++) { 
		echo '<div class="tagholder">';
		echo '<p class ="tags">'.$tags_single[$i].'</p>';
		echo '</div>';
	}
	echo '</div>';


	if(sizeof($tagname) > 0){
	echo '<div class="tag-header" style="clear:both"><a id="more_tags" href="#">'.get_string('moretags', 'mod_videocenter').'</a>';
	echo '<div class="tag-content">';
	foreach ($tagname as $value) {

		echo '<div class="tagholder">';
		echo '<a class ="tags" href ="'.new moodle_url('/mod/videocenter/view.php', array('id' => $cm->id, 'tag' => $tagid.','.$value->content)).'">'.$value->content.'</a>';
		echo '</div>';

	}
	echo '</div>';
	echo '</div>';
	}
	

}else if($keyword){
	//Show search results for Query
	//$testing =$DB->get_records_sql('SELECT * FROM {videor} WHERE '.$DB->sql_like('name', ':idnum').' AND '.$DB->sql_like('name', ':idnum2').'AND course = :courseid', array( 'idnum' => '%wtf%','idnum2' => '%far%', 'courseid' => $course->id));
	


	$sql = 'SELECT * FROM {'.$videos_database.'} WHERE ';
	$sqlarray = array();
	$temp = explode(' ', $keyword);
	$counter =1;
	foreach ($temp as $value) {
		$sql.= $DB->sql_like('title', ':idnum'.$counter,false).' AND ';
		$sqlarray['idnum'.$counter] ="%".$value."%";
		$counter++;
	}
	$sql.='courseid = :courseid AND submission = 0';
	$sqlarray['courseid']= $course->id;

	//$allvideoResources = $DB->get_records_sql($sql, $sqlarray,0,0);

	$allvideoscount = sizeof($DB->get_records_sql($sql, $sqlarray));


	$sorttype ="";
	
	if($sort == 1 && $order == 1){
		$sorttype = "title ASC";
	}else if($sort == 1 && $order == 2){
		$sorttype = "title DESC";

	}else if($sort == 2 && $order == 1){
		$sorttype = "timecreated ASC";
	}else if($sort == 2 && $order == 2){
		$sorttype = "timecreated DESC";
	}

	$sql.= ' ORDER BY '.$sorttype;

	$allvideoResources = $DB->get_records_sql($sql, $sqlarray,(($page * $show) -$show),$show);
	

	if(sizeof($allvideoResources) > 0){
		echo get_string('results', 'mod_videocenter').' \''.$keyword.'\'';

	}else{
		echo '<p>'.get_string('noresults', 'mod_videocenter').' \''.$keyword.'\'</p>';
	}

}else if($user){
		
	$sorttype ="";
	
	if($sort == 1 && $order == 1){
		$sorttype = "title ASC";
	}else if($sort == 1 && $order == 2){
		$sorttype = "title DESC";

	}else if($sort == 2 && $order == 1){
		$sorttype = "timecreated ASC";
	}else if($sort == 2 && $order == 2){
		$sorttype = "timecreated DESC";
	}

	

	$allvideoscount = $DB->count_records('videos', array('courseid' => $course->id, 'uploaderid' => $user,'submission' => 0)); 

	$allvideoResources =$DB->get_records('videos',array('courseid' => $course->id, 'uploaderid' => $user,'submission' => 0),$sorttype,'*',(($page * $show) -$show),$show);

	$userinfo = $DB-> get_record('user', array('id' => $user));
	if(sizeof($allvideoResources) > 0){
		echo '<p>'.get_string('userhasvideo', 'mod_videocenter').' \''.$userinfo->firstname.' '.$userinfo->lastname.'\'<p>';

	}else{
		echo '<p>'.get_string('user', 'mod_videocenter').' \''.$userinfo->firstname.' '.$userinfo->lastname.'\' '.get_string('userhasnovideo', 'mod_videocenter').'</p>';
	}

}else{

	$allusers = $DB->get_records_sql("SELECT DISTINCT uploaderid FROM {".$videos_database."} WHERE  courseid =? AND submission =?",array('courseid' => $course->id,'submission' => 0) );
	$allvideoscount = $DB->count_records('videos', array('courseid' => $course->id,'submission' => 0)); 
	
		$sorttype ="";
		
		if($sort == 1 && $order == 1){
			$sorttype = "title ASC";
		}else if($sort == 1 && $order == 2){
			$sorttype = "title DESC";

		}else if($sort == 2 && $order == 1){
			$sorttype = "timecreated ASC";
		}else if($sort == 2 && $order == 2){
			$sorttype = "timecreated DESC";
		}

		
		
		$allvideoResources =$DB->get_records('videos',array('courseid' => $course->id,'submission' => 0),$sorttype,'*',(($page * $show) -$show),$show);

	


	
	$sqltags = 'SELECT * FROM {'.$video_tags_database.'} WHERE courseid =? GROUP BY content';
	$allcoursetags = $DB->get_records_sql($sqltags,array($course->id));


	echo '<form id="user-changer">'.get_string('selectuser','mod_videocenter').'<select>';
	echo '<option value="">---</option>';
	foreach ($allusers as  $value) {
		$userinfo = $DB-> get_record('user', array('id' => $value->uploaderid));
		echo  '<option value="'.new moodle_url('/mod/videocenter/view.php', array('id' =>$cm->id,'user' => $value->uploaderid)).'">'.$userinfo->firstname.' '.$userinfo->lastname.'</option>';
	}
        
    echo '</select></form>';
	echo '<div class="tag-header"><a id="show_tags" href="#">'.get_string('showtags', 'mod_videocenter').'</a>';
	
	echo '<div class="tag-content">';
	foreach ($allcoursetags as $value) {

		echo '<div class="tagholder">';
		echo '<a class ="tags" href ="'.new moodle_url('/mod/videocenter/view.php', array('id' => $cm->id, 'tag' => $value->content)).'">'.$value->content.'</a>';
		echo '</div>';

		
	}
	echo '</div>';
	echo '</div>';




}



	//Gridview
	echo '<div style="clear: both;width:100%;">';
	$tempid = array();
	foreach ($allvideoResources as $value) {

		if($DB->record_exists('videor', array('videoid' => $value->id,'course'=> $value->courseid)) >0){
			$videor = $DB->get_records('videor', array('videoid' => $value->id,'course'=> $value->courseid));
			$videor1 = reset($videor);
			$iid = get_coursemodule_from_instance($videor_activity_database, $videor1->id, $videor1->course, false, MUST_EXIST)->id;
			$opturl = new moodle_url('/mod/videor/view.php', array('id' => $iid));
		}else{
			$opturl = new moodle_url('/mod/videocenter/viewvideo.php', array('id'=>$cm->id,'vid' => $value->id));

		}
		
		
		$tempnamearr =str_split($value->title, 32);
		echo '<div style="float: left; width: 200px;margin:10px;">
				<a style="text-decoration: none;" href="'.$opturl.'">
				<img class ="imagedropshadow" src="'.$value->thumb_big.'" height="170" width="200" title="'. strip_tags($value->description).'">
				<p id="imagetext" style ="text-align: center;">'.$tempnamearr[0].'</p>
				</a>
			</div>';
	
		
		
	}

	//Pagination
	if($allvideoscount > $show){
		if (($allvideoscount % $show)==0){
			$numpages = ($allvideoscount / $show);
			}else{
			$numpages = ((int)($allvideoscount /$show))+1;
			} 

		$extratag="";
		if($keyword){
			$extratag ='&keyword='.$keyword;		
		}else if($tagid) {
			$extratag ='&tag='.$tagid;
		}else if($user){
			$extratag ='&user='.$user;
		}

				echo'
				<ul id="pagination" style="float:left;width:100%;margin:0 auto;">';


				if($page ==1){
					if($numpages >=10){
						echo '<li class="previous">'.get_string('first', 'mod_videocenter').'</li>';
					}
					echo '<li class="previous">«'.get_string('previous', 'mod_videocenter').'</li>';
				}else{
					if($numpages >=10){
					echo '<li><a href="?id='.$cm->id.'&page=1&show='.$show.'&sort='.$sort.'&order='.$order.$extratag.'">'.get_string('first', 'mod_videocenter').'</a></li>';
					}
					echo '<li><a href="?id='.$cm->id.'&page='.($page-1).'&show='.$show.'&sort='.$sort.'&order='.$order.$extratag.'">«'.get_string('previous', 'mod_videocenter').'</a></li>';
				}

				

				//10 pages at most, minimal behavior
				if($numpages < 10){
					for ($i=1; $i < $numpages+1 ; $i++) { 
						if($i == $page){
							echo'<li class="current-page">'.$i.'</li>';
						}else{
							echo'<li><a href="?id='.$cm->id.'&page='.$i.'&show='.$show.'&sort='.$sort.'&order='.$order.$extratag.'">'.$i.'</a></li>';

						}
					}

				}else{
					if($page <=5){
						for ($i=1; $i < 10 ; $i++) { 
							if($i == $page){
								echo'<li class="current-page">'.$i.'</li>';
							}else{
								echo'<li><a href="?id='.$cm->id.'&page='.$i.'&show='.$show.'&sort='.$sort.'&order='.$order.$extratag.'">'.$i.'</a></li>';

							}
						}
					}else if($page >= $numpages-4){
						for ($i=$numpages-8; $i <= $numpages; $i++) { 
							if($i == $page){
								echo'<li class="current-page">'.$i.'</li>';
							}else{
								echo'<li><a href="?id='.$cm->id.'&page='.$i.'&show='.$show.'&sort='.$sort.'&order='.$order.$extratag.'">'.$i.'</a></li>';

							}
						}
						
					}else{
						for ($i=4; $i > 0 ; $i--) { 
							echo'<li><a href="?id='.$cm->id.'&page='.($page-$i).'&show='.$show.'&sort='.$sort.'&order='.$order.$extratag.'">'.($page-$i).'</a></li>';					
						}
						echo'<li class="current-page">'.$page.'</li>';
						for ($i=1; $i < 5 ; $i++) { 
							echo'<li><a href="?id='.$cm->id.'&page='.($page+$i).'&show='.$show.'&sort='.$sort.'&order='.$order.$extratag.'">'.($page+$i).'</a></li>';					
						}
					}
				}


				
				if($page ==$numpages){
					echo '<li class="next">'.get_string('next', 'mod_videocenter').' »</li>';
					if($numpages >=10){
						echo '<li class="next">'.get_string('last', 'mod_videocenter').' ('.$numpages.')</li>';
					}
					
				}else{
					echo '<li><a href="?id='.$cm->id.'&page='.($page+1).'&show='.$show.'&sort='.$sort.'&order='.$order.$extratag.'">'.get_string('next', 'mod_videocenter').' »</a></li>';
					if($numpages >=10){
						echo '<li><a href="?id='.$cm->id.'&page='.$numpages.'&show='.$show.'&sort='.$sort.'&order='.$order.$extratag.'">'.get_string('last', 'mod_videocenter').' ('.$numpages.')</a></li>';
					}
				}

				echo'</ul>';

		
	}

	echo '</div>';



echo $OUTPUT->footer();


