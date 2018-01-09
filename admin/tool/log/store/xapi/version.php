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
 * External xapi log store plugin
 *
 * @package    logstore_xapi
 * @copyright  2017 Jerrett Fowler <jfowler@charitylearning.org>
 *                  Ryan Smith <ryan.smith@ht2.co.uk>
 *                  David Pesce <david.pesce@exputo.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();
$plugin->component = 'logstore_xapi';
$plugin->version = 2017103001;
$plugin->release = 'v2.2.2';
$plugin->requires = 2014111000;
$plugin->maturity = MATURITY_STABLE;
