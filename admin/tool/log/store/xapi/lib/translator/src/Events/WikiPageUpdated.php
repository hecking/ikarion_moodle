<?php
/**
 * Created by PhpStorm.
 * User: hecking
 * Date: 18.01.2018
 * Time: 14:20
 */
namespace MXTranslator\Events;

defined('MOODLE_INTERNAL') || die();

class WikiPageUpdated extends ModuleViewed {
    /**
     * Reads data for an event.
     * @param [String => Mixed] $opts
     * @return [String => Mixed]
     * @override ModuleViewed
     */
    public function read(array $opts) {

        return [array_merge(parent::read($opts)[0], [
            'recipe' => 'page_updated',

            'page_url' => $opts['page']->url,
            'page_name' =>  $opts['page']->title,
            'page_description' => "Test description",
            'page_type' => 'http://collide.info/moodle_wiki_page',
            'page_ext' => [
                'content_raw' => $opts['page']->cachedcontent,
                'content_clean' => strip_tags($opts['page']->cachedcontnet)
            ],
            'page_ext_key' => 'http://collide.info/moodle_wiki_update'
        ])];
    }
}