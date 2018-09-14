<?php
/**
 * Created by PhpStorm.
 * User: Yassin
 * Date: 14.09.2018
 * Time: 14:44
 */
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

class GroupCreated extends Event {
    /**
     * Reads data for an event.
     * @param [String => Mixed] $opts
     * @return [String => Mixed]
     * @override Event
     */
    public function read(array $opts) {
        global $DB;

        // Read group table record. Why does xapi replicate Moodle DB Api????????
        $group = $this->repo->read_object($opts['objectid'], 'groups');
        $group_member_table = 'groups_members';
        $group_member_condition = array('groupid' => $group->id);
        $group_members = $DB->get_records($group_member_table, $group_member_condition);
        // TODO Put in Keys necessary for the translator.
        return array_merge(parent::read($opts), [
            'group' => $group,
            'group_members' => $group_members
        ]);
    }
}