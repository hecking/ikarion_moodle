<?PHP  // $Id: view.php,v 1.0 2012/03/28 18:30:00 Serafim Panov Exp $ 

/// This page prints a particular instance of etherpad
/// (Replace etherpad with the name of your module)

    require_once("../../config.php");
    require_once("lib.php");
    require_once("etherpad-lite-client.php");
    require_once($CFG->libdir . '/grouplib.php');

    $id = optional_param('id', 0, PARAM_INT);    // Course Module ID
    $a  = optional_param('a', NULL, PARAM_TEXT);     // etherpad ID


    $groupPadName = "";

    if ($id) {
        if (! $cm = $DB->get_record("course_modules", array("id" => $id))) {
            error("Course Module ID was incorrect");
        }
    
        if (! $course = $DB->get_record("course", array("id" => $cm->course))) {
            error("Course is misconfigured");
        }
    
        if (! $etherpad = $DB->get_record("etherpad", array("id" => $cm->instance))) {
            error("Course module is incorrect");
        }

        $groupmode = groups_get_activity_groupmode($cm, $course);
        if (($groupmode == SEPARATEGROUPS) || ($groupmode == VISIBLEGROUPS)) {

            if (! $groupPad = etherpad_get_group_pad_for_user($cm->instance, $course->id)) {

                $groupPad = etherpad_add_new_group_pad($cm->instance, $course->id);
            }
            $groupPadName = $groupPad->gpadname;
        } else {

            $groupPadName = $etherpad->padname;
        }

    } else {
        if (! $etherpad = $DB->get_record("etherpad", array("id" => $a))) {
            error("Course module is incorrect");
        }
        if (! $course = $DB->get_record("course", array("id" => $etherpad->course))) {
            error("Course is misconfigured");
        }
        if (! $cm = get_coursemodule_from_instance("etherpad", $etherpad->id, $course->id)) {
            error("Course Module ID was incorrect");
        }

        $groupmode = groups_get_activity_groupmode($cm, $course);
        if (($groupmode == SEPARATEGROUPS) || ($groupmode == VISIBLEGROUPS)) {

            if (! $groupPad = etherpad_get_group_pad_for_user($cm->instance, $course->id)) {

                $groupPad = etherpad_add_new_group_pad($cm->instance, $course->id);
            }
            $groupPadName = $groupPad->gpadname;
        } else {

            $groupPadName = $etherpad->padname;
        }
    }

    require_login($course->id);
    
    $context = context_module::instance($cm->id);
    if(isset($etherpad->activitymodule) && $etherpad->activitymodule > 0) {

        $modinfo = get_fast_modinfo($course->id);
        $am = $modinfo->get_cm($etherpad->activitymodule);
    }

    // Indicate view completion.
    $completion = new completion_info($course);
    $completion->set_module_viewed($cm);
/// Print the page header

// Hecking: Logging through Event API
$event = \mod_etherpad\event\course_module_viewed::create(array(
    'objectid' => $etherpad->id,
    'context' => $context
));
$event->add_record_snapshot('course', $PAGE->course);
$event->trigger();
    //add_to_log($course->id, "etherpad", "view", "view.php?id=$id", "$cm->instance");
    
// Activate epad user
    etherpad_activate_session();

// Initialize $PAGE, compute blocks
    
    $PAGE->set_url('/mod/etherpad/view.php', array('id' => $id));
    
    $PAGE->requires->js('/mod/etherpad/js/jquery.min.js', true);
    $PAGE->requires->js('/mod/etherpad/js/etherpad.js', true);
    
    $title = $course->shortname . ': ' . format_string($etherpad->name);
    $PAGE->set_title($title);
    $PAGE->set_heading($course->fullname);

    echo $OUTPUT->header();
    
/// Print the main part of the page
    
    echo $OUTPUT->box_start('generalbox');
    // Activity module switching
    if(isset($am)) {
        echo '<div id="etherpad_activityframe" style="display:none">';
        echo '<iframe id="etherpad_iframe" src="'.$am->url.'" onload="frame_loaded(this)" style="width: 100%; height:100%;"></iframe>';
        echo '<a href="javascript:hideFrame()"><div id="etherpad_closeframe">'.get_string('closeframe','etherpad').'</div></a>';
        echo '</div>';
    }
    echo "<div align=center>".$etherpad->intro."</div>";
    if(isset($am)) {
        echo '<div id="etherpad_showframe"><a href="javascript:showFrame()">'.$am->get_formatted_name().'</a></div>';
    }
    
    echo $OUTPUT->box_end();

    echo $OUTPUT->box_start('generalbox');
    
    echo "<div align=center>";
    
    echo "<script type=\"text/javascript\">
    jQuery(document).ready(function() {
        jQuery('#ePad').pad({'host': '{$etherpadcfg->etherpad_baseurl}', 'padId':'{$groupPadName}', 'baseUrl': '/p/', 'showChat': false, 'userName': '{$USER->firstname} {$USER->lastname}','showControls': true,'showLineNumbers': true, 'height': 500});
    });
    </script>";
    
    echo '<div id="ePad"></div>';
    
    echo "</div>";
    
    echo $OUTPUT->box_end();

/// Finish the page
    echo $OUTPUT->footer();

