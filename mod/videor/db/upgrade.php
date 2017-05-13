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

/**
 * URL module upgrade code
 *
 * This file keeps track of upgrades to
 * the resource module
 *
 * Sometimes, changes between versions involve
 * alterations to database structures and other
 * major things that may break installations.
 *
 * The upgrade function in this file will attempt
 * to perform all the necessary actions to upgrade
 * your older installation to the current version.
 *
 * If there's something it cannot do itself, it
 * will tell you what you need to do.
 *
 * The commands in here will all be database-neutral,
 * using the methods of database_manager class
 *
 * Please do not forget to use upgrade_set_timeout()
 * before any action that may take longer time to finish.
 *
 * @package    mod
 * @subpackage url
 * @copyright  2013 Emmanuel Meinike
 * @author     Emmanuel Meinike <emmanuel.meinike@stud.uni-due.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die;

function xmldb_videor_upgrade($oldversion) {
    global $CFG, $DB;

    $dbman = $DB->get_manager();

    if ($oldversion < 2012120602) {

        // Define table videos to be created
        $table = new xmldb_table('videos');

        // Adding fields to table videos
        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('name', XMLDB_TYPE_TEXT, null, null, XMLDB_NOTNULL, null, null);
        $table->add_field('url', XMLDB_TYPE_TEXT, null, null, null, null, null);

        // Adding keys to table videos
        $table->add_key('primary', XMLDB_KEY_PRIMARY, array('id'));

        // Conditionally launch create table for videos
        if (!$dbman->table_exists($table)) {
            $dbman->create_table($table);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120602, 'videor');
    }

       if ($oldversion < 2012120603) {

        // Define field id to be dropped from videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('externalurl');

        // Conditionally launch drop field id
        if ($dbman->field_exists($table, $field)) {
            $dbman->drop_field($table, $field);
        }

    

        // Define field id to be dropped from videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('displayoptions');

        // Conditionally launch drop field id
        if ($dbman->field_exists($table, $field)) {
            $dbman->drop_field($table, $field);
        }

    

        // Define field id to be dropped from videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('display');

        // Conditionally launch drop field id
        if ($dbman->field_exists($table, $field)) {
            $dbman->drop_field($table, $field);
        }

 // Define field id to be dropped from videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('parameters');

        // Conditionally launch drop field id
        if ($dbman->field_exists($table, $field)) {
            $dbman->drop_field($table, $field);
        }




        // Define field timecreated to be added to videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('timecreated', XMLDB_TYPE_INTEGER, '10', null, null, null, null, 'introformat');

        // Conditionally launch add field timecreated
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120603, 'videor');
    }

    
    if ($oldversion < 2012120604) {

        // Define field url to be added to videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('url', XMLDB_TYPE_TEXT, null, null, XMLDB_NOTNULL, null, null, 'name');

        // Conditionally launch add field url
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120604, 'videor');
    }

      if ($oldversion < 2012120605) {

        // Define field tags to be added to videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('tags', XMLDB_TYPE_TEXT, null, null, null, null, null, 'url');

        // Conditionally launch add field tags
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120605, 'videor');
    }

    if ($oldversion < 2012120606) {

        // Define table videor_tags to be created
        $table = new xmldb_table('videor_tags');

        // Adding fields to table videor_tags
        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('userid', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null);
        $table->add_field('instanceid', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null);
        $table->add_field('content', XMLDB_TYPE_TEXT, null, null, XMLDB_NOTNULL, null, null);

        // Adding keys to table videor_tags
        $table->add_key('primary', XMLDB_KEY_PRIMARY, array('id'));

        // Conditionally launch create table for videor_tags
        if (!$dbman->table_exists($table)) {
            $dbman->create_table($table);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120606, 'videor');
    }

    if ($oldversion < 2012120607) {

        // Define field title to be added to videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('title', XMLDB_TYPE_TEXT, null, null, null, null, null, 'url');

        // Conditionally launch add field title
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }
 

        // Define field thumb_small to be added to videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('thumb_small', XMLDB_TYPE_TEXT, null, null, null, null, null, 'title');

        // Conditionally launch add field thumb_small
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // Define field thumb_big to be added to videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('thumb_big', XMLDB_TYPE_TEXT, null, null, null, null, null, 'thumb_small');

        // Conditionally launch add field thumb_big
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }
       
        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120607, 'videor');
    }
    if ($oldversion < 2012120608) {

        // Define field videoid to be added to videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('videoid', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null, 'course');

        // Conditionally launch add field videoid
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120608, 'videor');
    }
    if ($oldversion < 2012120609) {

        // Define field course to be dropped from videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('url');

        // Conditionally launch drop field course
        if ($dbman->field_exists($table, $field)) {
            $dbman->drop_field($table, $field);
        }
         // Define field course to be dropped from videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('title');

        // Conditionally launch drop field course
        if ($dbman->field_exists($table, $field)) {
            $dbman->drop_field($table, $field);
        }
         // Define field course to be dropped from videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('thumb_small');

        // Conditionally launch drop field course
        if ($dbman->field_exists($table, $field)) {
            $dbman->drop_field($table, $field);
        }
         // Define field course to be dropped from videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('thumb_big');

        // Conditionally launch drop field course
        if ($dbman->field_exists($table, $field)) {
            $dbman->drop_field($table, $field);
        }
         // Define field course to be dropped from videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('tags');

        // Conditionally launch drop field course
        if ($dbman->field_exists($table, $field)) {
            $dbman->drop_field($table, $field);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120609, 'videor');
    }
      
    if ($oldversion < 2012120612) {

        // Define table tokenmanagement to be created
        $table = new xmldb_table('tokenmanagement');

        // Adding fields to table tokenmanagement
        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('token', XMLDB_TYPE_INTEGER, '20', null, XMLDB_NOTNULL, null, null);
        $table->add_field('vid', XMLDB_TYPE_INTEGER, '10', null, null, null, null);
        $table->add_field('combo', XMLDB_TYPE_INTEGER, '20', null, null, null, null);

        // Adding keys to table tokenmanagement
        $table->add_key('primary', XMLDB_KEY_PRIMARY, array('id'));

        // Conditionally launch create table for tokenmanagement
        if (!$dbman->table_exists($table)) {
            $dbman->create_table($table);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120612, 'videor');
    }

    if ($oldversion < 2012120613) {

        // Define field courseid to be added to videor_tags
        $table = new xmldb_table('videor_tags');
        $field = new xmldb_field('courseid', XMLDB_TYPE_INTEGER, '10', null, null, null, null, 'content');

        // Conditionally launch add field courseid
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120613, 'videor');
    }

    if ($oldversion < 2012120614) {

        // Define table video_bookmarks to be created
        $table = new xmldb_table('video_bookmarks');

        // Adding fields to table video_bookmarks
        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('userid', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null);
        $table->add_field('instanceid', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null);
        $table->add_field('title', XMLDB_TYPE_TEXT, null, null, XMLDB_NOTNULL, null, null);
        $table->add_field('courseid', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null);
        $table->add_field('time', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null);

        // Adding keys to table video_bookmarks
        $table->add_key('primary', XMLDB_KEY_PRIMARY, array('id'));

        // Conditionally launch create table for video_bookmarks
        if (!$dbman->table_exists($table)) {
            $dbman->create_table($table);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120614, 'videor');
    }


    if ($oldversion < 2012120615) {

        // Define table tempvideor to be created
        $table = new xmldb_table('tempvideor');

        // Adding fields to table tempvideor
        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('title', XMLDB_TYPE_TEXT, null, null, XMLDB_NOTNULL, null, null);
        $table->add_field('vid', XMLDB_TYPE_INTEGER, '10', null, null, null, null);
        $table->add_field('token', XMLDB_TYPE_INTEGER, '10', null, null, null, null);

        // Adding keys to table tempvideor
        $table->add_key('primary', XMLDB_KEY_PRIMARY, array('id'));

        // Conditionally launch create table for tempvideor
        if (!$dbman->table_exists($table)) {
            $dbman->create_table($table);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120615, 'videor');
    }
    if ($oldversion < 2012120616) {

        // Define field timecreated to be added to videor_tags
        $table = new xmldb_table('videor_tags');
        $field = new xmldb_field('timecreated', XMLDB_TYPE_INTEGER, '10', null, null, null, null, 'courseid');

        // Conditionally launch add field timecreated
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120616, 'videor');
    }
    if ($oldversion < 2012120626) {

        // Define field type to be added to video_bookmarks
        $table = new xmldb_table('video_bookmarks');
        $field = new xmldb_field('type', XMLDB_TYPE_INTEGER, '2', null, null, null, null, 'time');

        // Conditionally launch add field type
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120626, 'videor');
    }
    
    if ($oldversion < 2012120627) {

        // Define field userid to be added to videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('userid', XMLDB_TYPE_INTEGER, '10', null, null, null, null, 'timemodified');

        // Conditionally launch add field userid
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120627, 'videor');
    }
    if ($oldversion < 2012120628) {

        // Define field allowsharing to be added to videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('allowsharing', XMLDB_TYPE_INTEGER, '2', null, null, null, null, 'userid');

        // Conditionally launch add field allowsharing
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120628, 'videor');
    }
    if ($oldversion < 2012120630) {

        // Define field userid to be dropped from videor
        $table = new xmldb_table('videor');
        $field = new xmldb_field('allowsharing');

        // Conditionally launch drop field userid
        if ($dbman->field_exists($table, $field)) {
            $dbman->drop_field($table, $field);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120630, 'videor');
    }
     if ($oldversion < 2012120636) {

        // Define table tempvideor to be dropped
        $table = new xmldb_table('tempvideor');

        // Conditionally launch drop table for tempvideor
        if ($dbman->table_exists($table)) {
            $dbman->drop_table($table);
        }

        // videor savepoint reached
        upgrade_mod_savepoint(true, 2012120636, 'videor');
    }



    // Moodle v2.2.0 release upgrade line
    // Put any upgrade step following this

    // Moodle v2.3.0 release upgrade line
    // Put any upgrade step following this


    return true;
}
