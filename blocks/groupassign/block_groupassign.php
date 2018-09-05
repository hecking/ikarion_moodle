<?php
/**
 * Created by PhpStorm.
 * User: Yassin
 * Date: 14.08.2018
 * Time: 15:15
 */

class block_groupassign extends block_base
{
    public function init()
    {
        $this->title = get_string('groupassign', 'block_groupassign');
    }
    // The PHP tag and the curly bracket for the class definition
    // will only be closed after there is another function added in the next section.

    public function get_content()
    {
        if ($this->content !== null) {
            return $this->content;
        }

        $this->content = new stdClass;
        $this->content->text = 'The content of our Group Assign block!';
        $this->content->footer = 'Footer here...';

        return $this->content;
    }
}