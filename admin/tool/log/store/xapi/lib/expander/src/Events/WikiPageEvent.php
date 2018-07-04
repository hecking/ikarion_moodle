<?php
/**
 * Created by PhpStorm.
 * User: hecking
 * Date: 09.01.2018
 * Time: 14:03
 */

namespace LogExpander\Events;

defined('MOODLE_INTERNAL') || die();

class WikiPageEvent extends Event {
    /**
     * Reads data for an event.
     * @param [String => Mixed] $opts
     * @return [String => Mixed]
     * @override Event
     */
    public function read(array $opts) {

        return array_merge(parent::read($opts), [
           'page' => $this->repo->read_wiki_page($opts['objectid'])
        ]);
    }
}