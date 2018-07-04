<?php
// This file is part of Moodle - http://moodle.org/
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

namespace LogExpander;

defined('MOODLE_INTERNAL') || die();

use \stdClass as PhpObj;

class Controller extends PhpObj {
    protected $repo;
    public static $routes = [
        '\core\event\course_viewed' => 'Event',
        '\mod_page\event\course_module_viewed' => 'ModuleEvent',
        '\mod_quiz\event\course_module_viewed' => 'ModuleEvent',
        '\mod_url\event\course_module_viewed' => 'ModuleEvent',
        '\mod_folder\event\course_module_viewed' => 'ModuleEvent',
        '\mod_forum\event\course_module_viewed' => 'ModuleEvent',
        '\mod_forum\event\discussion_viewed' => 'DiscussionEvent',
        '\mod_forum\event\user_report_viewed' => 'ModuleEvent',
        '\mod_forum\event\post_created' => 'ForumPostEvent', // New event T.H.
        '\mod_book\event\course_module_viewed' => 'ModuleEvent',
        '\mod_scorm\event\course_module_viewed' => 'ModuleEvent',
        '\mod_resource\event\course_module_viewed' => 'ModuleEvent',
        '\mod_choice\event\course_module_viewed' => 'ModuleEvent',
        '\mod_data\event\course_module_viewed' => 'ModuleEvent',
        '\mod_feedback\event\course_module_viewed' => 'ModuleEvent',
        '\mod_lesson\event\course_module_viewed' => 'ModuleEvent',
        '\mod_lti\event\course_module_viewed' => 'ModuleEvent',
        '\mod_wiki\event\course_module_viewed' => 'ModuleEvent',
        '\mod_wiki\event\page_updated' => 'WikiPageEvent',
        '\mod_workshop\event\course_module_viewed' => 'ModuleEvent',
        '\mod_chat\event\course_module_viewed' => 'ModuleEvent',
        '\mod_glossary\event\course_module_viewed' => 'ModuleEvent',
        '\mod_imscp\event\course_module_viewed' => 'ModuleEvent',
        '\mod_survey\event\course_module_viewed' => 'ModuleEvent',
        '\mod_facetoface\event\course_module_viewed' => 'ModuleEvent',
        '\mod_quiz\event\attempt_abandoned' => 'AttemptEvent',
        '\mod_quiz\event\attempt_preview_started' => 'AttemptEvent',
        '\mod_quiz\event\attempt_reviewed' => 'AttemptEvent',
        '\mod_quiz\event\attempt_viewed' => 'AttemptEvent',
        '\core\event\user_loggedin' => 'Event',
        '\core\event\user_loggedout' => 'Event',
        '\mod_assign\event\submission_graded' => 'AssignmentGraded',
        '\mod_assign\event\assessable_submitted' => 'AssignmentSubmitted',
        '\core\event\user_created' => 'Event',
        '\core\event\user_enrolment_created' => 'Event',
        '\mod_scorm\event\sco_launched' => 'ScormLaunched',
        '\mod_feedback\event\response_submitted' => 'FeedbackSubmitted',
        '\mod_facetoface\event\signup_success' => 'FacetofaceEvent',
        '\mod_facetoface\event\cancel_booking' => 'FacetofaceEvent',
        '\mod_facetoface\event\take_attendance' => 'FacetofaceAttended',
        '\core\event\course_completed' => 'CourseCompleted',
        '\mod_scorm\event\scoreraw_submitted' => 'ScormSubmitted',
        '\mod_scorm\event\status_submitted' => 'ScormSubmitted',
    ];

    /**
     * Constructs a new Controller.
     * @param Repository $repo
     */
    public function __construct(Repository $repo) {
        $this->repo = $repo;
    }

    /**
     * Creates new events.
     * @param [String => Mixed] $events
     * @return [String => Mixed]
     */
    public function create_events(array $events) {
        $results = [];

        foreach ($events as $index => $opts) {

            $route = isset($opts['eventname']) ? $opts['eventname'] : '';
            if (isset(static::$routes[$route]) && ($opts['userid'] > 0 || $opts['relateduserid'] > 0)) {
                try {
                    $event = '\LogExpander\Events\\'.static::$routes[$route];
                    array_push($results , (new $event($this->repo))->read($opts));
                } catch (\Exception $e) { // @codingStandardsIgnoreLine
                    // Error processing event; skip it.
                }
            }
        }
        return $results;
    }
}
