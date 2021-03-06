<?php
/**
 * Created by PhpStorm.
 * User: hecking
 * Date: 09.01.2018
 * Time: 14:03
 */

namespace LogExpander\Events;

defined('MOODLE_INTERNAL') || die();

class ForumPostEvent extends Event {
    /**
     * Reads data for an event.
     * @param [String => Mixed] $opts
     * @return [String => Mixed]
     * @override Event
     */
    public function read(array $opts) {
        $post = $this->repo->read_forum_post($opts['objectid']);
        $discussion = $this->repo->read_discussion($post->discussion);
        return array_merge(parent::read($opts), [
            'post' => $post,
            'discussion' => $discussion,
            'module' => $this->repo->read_module($discussion->forum, 'forum')
        ]);
    }
}
