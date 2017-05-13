/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	main.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Define kernel
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012, 2013, 2014  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		18/02/14  (Last modified)
 */

/*------------------------------------------------------------
 *  Cute
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function () {
    var cute = this.cute = {
        version: "May 16 2014" + ' ' + "14:42:28",
        author: 'Anjo Anjewierden',
        email: 'a.a.anjewierden@utwente.nl',

        ctx: null,
        add_ons: {},

        toInt: function(n) {
            return Math.round(n);
        }
    };
}).call(this);
