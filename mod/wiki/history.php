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
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle. If not, see <http://www.gnu.org/licenses/>.

/**
 * This file contains all necessary code to view the history page
 *
 * @package mod_wiki
 * @copyright 2009 Marc Alier, Jordi Piguillem marc.alier@upc.edu
 * @copyright 2009 Universitat Politecnica de Catalunya http://www.upc.edu
 *
 * @author Jordi Piguillem
 * @author Marc Alier
 * @author David Jimenez
 * @author Josep Arus
 * @author Kenneth Riba
 *
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
require_once('../../config.php');

require_once($CFG->dirroot . '/mod/wiki/lib.php');
require_once($CFG->dirroot . '/mod/wiki/locallib.php');
require_once($CFG->dirroot . '/mod/wiki/pagelib.php');

$pageid = required_param('pageid', PARAM_TEXT);
$paging = optional_param('page', 0, PARAM_INT);
$allversion = optional_param('allversion', 0, PARAM_INT);

if (!$page = wiki_get_page($pageid)) {
    print_error('incorrectpageid', 'wiki');
}

if (!$subwiki = wiki_get_subwiki($page->subwikiid)) {
    print_error('incorrectsubwikiid', 'wiki');
}

if (!$wiki = wiki_get_wiki($subwiki->wikiid)) {
    print_error('incorrectwikiid', 'wiki');
}

if (!$cm = get_coursemodule_from_instance('wiki', $wiki->id)) {
    print_error('invalidcoursemodule');
}

$course = $DB->get_record('course', array('id' => $cm->course), '*', MUST_EXIST);

require_login($course, true, $cm);

if (!wiki_user_can_view($subwiki, $wiki)) {
    print_error('cannotviewpage', 'wiki');
}

// Trigger history viewed event.
$context = context_module::instance($cm->id);
$event = \mod_wiki\event\page_history_viewed::create(
        array(
            'context' => $context,
            'objectid' => $pageid
            ));
$event->add_record_snapshot('wiki_pages', $page);
$event->add_record_snapshot('wiki', $wiki);
$event->add_record_snapshot('wiki_subwikis', $subwiki);
$event->trigger();



$conceptnetworks = mod_wiki_get_versions_conceptnetwork($pageid);

$supergraph = json_encode(mod_wiki_create_supergraph($conceptnetworks), JSON_UNESCAPED_UNICODE);

$conceptnetworks = json_encode($conceptnetworks, JSON_UNESCAPED_UNICODE);

$strings = [
    "conceptnetwork" => get_string('conceptnetwork', 'wiki'),
    "animation_duration" => get_string('animation_duration', 'wiki'),
    "nextrevision" => get_string('nextrevision', 'wiki'),
    "previousrevision" => get_string('previousrevision', 'wiki'),
    "revision" => get_string('revision', 'wiki'),
];

$strings = json_encode($strings, JSON_UNESCAPED_UNICODE);

//switch the PHP-variable $concepts to an Javascript-variable.
echo ("<script type=\"text/javascript\">var supernetwork = $supergraph, concepts = $conceptnetworks, strings = $strings;</script> ");

/// Print the page header
$wikipage = new page_wiki_history($wiki, $subwiki, $cm);

//TODO expand the history with supergraph animation.

$PAGE->requires->css(new moodle_url('/mod/wiki/supergraph.css'));
$PAGE->requires->css(new moodle_url('/lib/jquery/ui-1.12.1/jquery-ui.css'));
$PAGE->requires->js(new moodle_url('/mod/wiki/supergraph.js'));

$wikipage->set_page($page);
$wikipage->set_paging($paging);
$wikipage->set_allversion($allversion);

$wikipage->print_header();
$wikipage->print_content();

$wikipage->print_footer();