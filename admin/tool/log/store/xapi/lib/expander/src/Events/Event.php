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

namespace LogExpander\Events;

defined('MOODLE_INTERNAL') || die();

use \LogExpander\Repository as Repository;
use \stdClass as PhpObj;
use stdClass;

class Event extends PhpObj
{
    protected $repo;

    /**
     * Constructs a new Event.
     * @param repository $repo
     */
    public function __construct(Repository $repo)
    {
        $this->repo = $repo;
    }

    /**
     * Reads data for an event.
     * @param [String => Mixed] $opts
     * @return [String => Mixed]
     */
    public function read(array $opts)
    {
        $usergroups = groups_get_all_groups($opts['courseid'], $opts['userid']);
        $this->add_groups_tasks_context($usergroups);
        $blabla = array();
        return [
            'user' => $opts['userid'] < 1 ? null : $this->repo->read_user($opts['userid']),
            'relateduser' => $opts['relateduserid'] < 1 ? null : $this->repo->read_user($opts['relateduserid']),
            'usergroups' => $usergroups, // MODIFIED. Add information about the groups a users is in. T.H.
            'course' => $this->repo->read_course($opts['courseid']),
            'app' => $this->repo->read_site(),
            'info' => (object)[
                'https://moodle.org/' => $this->repo->read_release(),
            ],
            'event' => $opts,
        ];
    }

    public function add_groups_tasks_context(array $groups)
    {
        //Add context data
        global $DB;
        foreach ($groups as $groupid => $group) {
            $group_task_mapping_table = "group_task_mapping";
            $task_table = "group_task";
            $task_module_table = "task_module_mapping";
            $condition = array("groupid" => $groupid);
            // returns false if nothing found
            $group_task_mapping_record = $DB->get_record($group_task_mapping_table, $condition);
            // task object that is added to group for use in xapi
            $task_data = new stdClass();
            if ($group_task_mapping_record) {
                $taskid = $group_task_mapping_record->taskid;
                $task_condition = array("id" => $taskid);
                $task = $DB->get_record($task_table, $task_condition);
                $task_module_condition = array("taskid" => $taskid);
                $task_modules = $DB->get_records($task_module_table, $task_module_condition);
                $task_data->task_id = $taskid;
                $task_data->task_name = $task->taskname;
                $task_data->task_start = $task->startdate;
                $task_data->task_end = $task->enddate;
                $task_data->task_type = $task->tasktype;
                $resources = array();
                // Get mod ids to search for all task modules in course table
                // use course records to create urls.
                $modids = array();
                foreach ($task_modules as $mod) {
                    $modids[] = $mod->moduleid;
                }

                // check if group forum exists.
                // Single discussion in same forum created for each group
                // Look up groupid in discussion table
                $forum_discussion_table = "forum_discussions";
                $forum_discussion_condition = array("groupid" => $groupid);
                $group_forum_record = $DB->get_record($forum_discussion_table, $forum_discussion_condition);
                if($group_forum_record){
                    $module_data = $this->repo->read_module($group_forum_record->forum, "forum");
                    $resources[] = $module_data->url;
                }


                $course_module_table = "course_modules";
                $course_mod_record_list = $DB->get_records_list($course_module_table, "id", $modids);
                $module_type_table = "modules";
                foreach( $course_mod_record_list as $course_mod_record){
                    $mod_type = $course_mod_record->module;
                    $mod_constraint = array("id" => $mod_type);
                    $mod_type_record = $DB->get_record($module_type_table, $mod_constraint);
                    $module_data = $this->repo->read_module($course_mod_record->instance, $mod_type_record->name);
                    $resources[] = $module_data->url;
                }
                $task_data->task_resources = $resources;

                // groupmembers
                $group_memeber_table = "groups_members";
                $group_cond = array("groupid" => $groupid);
                $group_memeber_records = $DB->get_records($group_memeber_table, $group_cond);
                $userids = array();
                foreach($group_memeber_records as $group_memeber){
                    $userids[] = $group_memeber->userid;
                }
                $user_table = "user";
                $user_records = $DB->get_records_list($user_table, "id", $userids);
                $user_data_list = array();
                foreach($user_records as $user_record){
                    $full_name = $user_record->firstname." ".$user_record->lastname;
                    $user_data = array("username" =>$user_record->username ,
                        "email" => $user_record->email,
                        "fullname" => $full_name);
                    $user_data_list[] = $user_data;
                }
                $group->members = $user_data_list;
                $group->task = $task_data;







            }
        }

    }
}
