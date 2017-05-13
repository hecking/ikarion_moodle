<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Christian
 * Date: 25.09.13
 * Time: 12:24
 * To change this template use File | Settings | File Templates.
 */
require_once('../../config.php');
require_once('./lib.php');

//trigger enrol_selfcond_cron job
$selfcond = new enrol_selfcond_plugin();
$selfcond->cron();

?>