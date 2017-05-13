<?php
// This file is an extension of Moodle - http://moodle.org/
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
 * Recieves Authentication Request from Video Server and checks
 * if tokens are idetical.
 *
 * @package    mod
 * @subpackage videor
 * @copyright  2013 Emmanuel Meinike
 * @author     Emmanuel Meinike <emmanuel.meinike@stud.uni-due.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

require_once(dirname(dirname(dirname(__FILE__))).'/config.php');
require_once(dirname(__FILE__).'/lib.php');
global $DB;

$stringData = $_SERVER['REQUEST_URI'];
$fullurl = $_SERVER["HTTP_HOST"].$stringData;

list($pre,$post) = explode('?', $stringData);
$temp =explode('/', $pre);
$counter = sizeof($temp);

$id = trim($temp[($counter-1)]);
$token = trim($temp[($counter-2)]);

$success =1;

$mytoken = $DB->get_record('tokenmanagement', array('combo' => $id+$token));
$DB->delete_records('tokenmanagement', array('combo' => $id+$token));

if($id == $mytoken->vid  && $token == $mytoken->token ){
$success =2;
echo 'true';
}


/* $myFile = "result.txt";
$fh = fopen($myFile, 'w') or die("can't open file");
fwrite($fh, $fullurl);
fwrite($fh, 'ID:'.$id);
fwrite($fh, 'TOKEN:'.$token);
fwrite($fh, '#######');
fwrite($fh, 'DBTOKEN:'.$mytoken->token);
fwrite($fh, 'DBID:'.$mytoken->vid);
fwrite($fh, 'RESULT:'.$success);


fclose($fh); */



?>
