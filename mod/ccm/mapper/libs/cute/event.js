/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	event.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Handling mouse and touch events
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	14/07/12  (Created)
 *  		14/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Events
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Event = cute.Event = function(ev, type, device, x, y, time) {
        var ev = this;

        ev._ev = ev;
        ev._type = type;
        ev._device = device;
        ev._x = x;
        ev._y = y;
        ev._gesture = null;

        return ev;
    }


    Event.prototype.toString = function() {
        var ev = this;
        var c = ", ";

        return "event(" + ev._type + c + ev._x + c + ev._y + ")";
    }


    Event.prototype.gesture = function(g) {
        var ev = this;

        if (g) {
            ev._gesture = g;
            return ev;
        }
        return ev._gesture;
    }

    Event.prototype.xy_figure = function(gr) { // TBD -- used?
        var ev = this;
        var xy = gr.offset_figure();
        var x = ev._x - xy.x;
        var y = ev._y - xy.y;

        return {x: x, y: y};
    }
}).call(this);
