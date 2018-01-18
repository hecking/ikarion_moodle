<?php
/**
 * Created by PhpStorm.
 * User: hecking
 * Date: 18.01.2018
 * Time: 16:35
 */
namespace XREmitter\Events;

defined('MOODLE_INTERNAL') || die();

class ForumPostCreated extends Event {
    /**
     * Reads data for an event.
     * @param [String => Mixed] $opts
     * @return [String => Mixed]
     * @override Event
     */
    public function read(array $opts) {
        return array_merge_recursive(parent::read($opts), [
            'verb' => [
                'id' => 'http://id.tincanapi.com/verb/replied',
                'display' => $this->read_verb_display($opts),
            ],
            'object' => $this->read_post($opts, 'post', $opts['post_type']),
            'context' => [
                'contextActivities' => [
                    'grouping' => [
                        $this->read_course($opts, 'course', 'http://adlnet.gov/expapi/activities/course'),
                        $this->read_module($opts),
                    ],
                ],
            ],
        ]);
    }
}