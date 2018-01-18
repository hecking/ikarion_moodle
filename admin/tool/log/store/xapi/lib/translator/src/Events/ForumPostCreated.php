<?php
/**
 * Created by PhpStorm.
 * User: hecking
 * Date: 18.01.2018
 * Time: 14:20
 */
namespace MXTranslator\Events;

defined('MOODLE_INTERNAL') || die();

class ForumPostCreated extends ModuleViewed {
    /**
     * Reads data for an event.
     * @param [String => Mixed] $opts
     * @return [String => Mixed]
     * @override ModuleViewed
     */
    public function read(array $opts) {
        return [array_merge(parent::read($opts)[0], [
            'recipe' => 'post_created',

            'post_url' => $opts['discussion']->url . '#' . $opts['post']->id,
            'post_discussion_name' => $opts['discussion']->name,
            'post_description' => 'A forum post in a Moodle course.',
            'post_type' => (($opts['post']->parent > 0) ? 'http://id.tincanapi.com/activitytype/forum-topic' : 'http://id.tincanapi.com/activitytype/forum-reply'),
            'post_ext' => $opts['post'],
            'discussion_ext_key' => 'http://inf.uni-due.de/define/extensions/moodle_forum_post'
        ])];
    }
}