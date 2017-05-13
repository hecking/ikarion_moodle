<?php
defined('MOODLE_INTERNAL') || die();

$capabilities = array(

    'blocks/annotations:addinstance' => array(
        'riskbitmask' => RISK_XSS,
        'captype' => 'write',
        'contextlevel' => CONTEXT_COURSE,
        'archetypes' => array(
            'editingteacher' => CAP_ALLOW,
            'manager' => CAP_ALLOW

        )

    ),
		
	'blocks/annotations:viewadmin' => array(
				'riskbitmask' => RISK_XSS,
				'captype' => 'view',
				'contextlevel' => CONTEXT_BLOCK,
				'archetypes' => array(
			             'teacher'        => CAP_ALLOW,
			             'editingteacher' => CAP_ALLOW,
			             'manager'        => CAP_ALLOW
		
				)
		
		),
		
		
	'blocks/annotations:delete' => array(
				'riskbitmask' => RISK_XSS,
				'captype' => 'write',
				'contextlevel' => CONTEXT_BLOCK,
				'archetypes' => array(
						'editingteacher' => CAP_ALLOW,
						'manager'        => CAP_ALLOW
		
				)
		
		),
		

    'blocks/annotations:view' => array(
        'riskbitmask'  => RISK_PERSONAL,
        'captype'      => 'read',
        'contextlevel' => CONTEXT_BLOCK,
        'archetypes'   => array(
            'student'        => CAP_ALLOW,
            'teacher'        => CAP_ALLOW,
            'editingteacher' => CAP_ALLOW,
            'manager'        => CAP_ALLOW
        )
    ),

    'blocks/annotations:write' => array(
        'riskbitmask'  => RISK_SPAM,
        'captype'      => 'write',
        'contextlevel' => CONTEXT_BLOCK,
        'archetypes'   => array(
            'student'        => CAP_ALLOW,
            'teacher'        => CAP_ALLOW,
            'editingteacher' => CAP_ALLOW,
            'manager'        => CAP_ALLOW
        )
    )

);