<?php


function xmldb_etherpad_upgrade($oldversion = 0) {
    global $DB;

    $dbman = $DB->get_manager();

    if ($oldversion < 2015030400) {

        // Define table etherpad_user to be created.
        $table = new xmldb_table('etherpad_user');

        // Adding fields to table etherpad_user.
        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('uid', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null);
        $table->add_field('etherid', XMLDB_TYPE_CHAR, '100', null, XMLDB_NOTNULL, null, null);
        $table->add_field('ethertoken', XMLDB_TYPE_CHAR, '100', null, XMLDB_NOTNULL, null, null);
        $table->add_field('token_expire', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '0');

        // Adding keys to table etherpad_user.
        $table->add_key('primary', XMLDB_KEY_PRIMARY, array('id'));

        // Conditionally launch create table for etherpad_user.
        if (!$dbman->table_exists($table)) {
            $dbman->create_table($table);
        }

        // Etherpad savepoint reached.
        upgrade_mod_savepoint(true, 2015030400, 'etherpad');
    }
    if ($oldversion < 2015031500) {

         // Define field activitymodule to be added to etherpad.
        $table = new xmldb_table('etherpad');
        $field = new xmldb_field('activitymodule', XMLDB_TYPE_INTEGER, '10', null, null, null, null, 'timemodified');

        // Conditionally launch add field activitymodule.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // Etherpad savepoint reached.
        upgrade_mod_savepoint(true, 2015031500, 'etherpad');    
    }
    return true;
}


