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

namespace MXTranslator\Events;

defined('MOODLE_INTERNAL') || die();

/**
 * Class CourseCompleted
 * @package MXTranslator\Events
 */
class CourseCompleted extends CourseViewed {
    /**
     * overides CourseViewed recipe.
     * @param array $opts
     * @return array
     */
    public function read(array $opts) {
        return [array_merge(parent::read($opts)[0], [
            'recipe' => 'course_completed',
            'user_id' => $opts['relateduser']->id,
            'user_url' => $opts['relateduser']->url,
            'user_name' => $opts['relateduser']->fullname,
            'user_email' => $opts['relateduser']->email,
        ])];
    }
}
