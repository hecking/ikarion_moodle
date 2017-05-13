/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	resize_gesture.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class ResizeGesture
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2013  University of Twente
 *  
 *  History	20/09/13  (Created)
 *  		20/09/13  (Last modified)
 */


/*------------------------------------------------------------
 *  Class cute.ResizeGesture
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var ResizeGesture = cute.ResizeGesture = function() {
        var g = this;

        cute.Gesture.call(g);
        g._offset = new cute.Point(0,0);
        g._event = null;
        g._receiver = null;

        return g;
    }

    ist.extend(ResizeGesture, cute.Gesture);


    ResizeGesture.prototype.toString = function() {
        var g = this;
        return "cute.ResizeGesture(" + g._offset._x + ", " + g._offset._y + ")";
    }


    ResizeGesture.prototype.event = function(ev, gr) {
        var g = this;

        g._receiver = gr;
        if (g.initiate(ev)) {
            ev._gesture = g;
            return true;
        }
        return false;
    }


    ResizeGesture.prototype.initiate = function(ev) {
        var g = this;
        var gr = ev._receiver;

        if (ev._type === 'mouse_down' && g.modifiers_match(ev)) {
            g._offset._x = ev._x;
            g._offset._y = ev._y;
            g._initial_x = gr._area._x;
            g._initial_y = gr._area._y;
            g._bottom_y = gr._area._y + gr._area._h;
            g._bottom_x = gr._area._x + gr._area._w / 2;

            return true;
        }

        return false;
    }

    ResizeGesture.prototype.verify = function(ev) {
        return true;
    }

    ResizeGesture.prototype.drag = function(ev) {
        var g = this;
        var dx = ev._x - g._offset._x;
        var dy = ev._y - g._offset._y;
        var gr = g._receiver;

        if (gr instanceof cute.Circle) {
            gr.radius(gr.radius() + (dx+dy)/2);
            gr.center(new cute.Point(g._bottom_x,g._bottom_y-gr.radius()));
        } else {
            gr.relative_size_wh(dx, dy);
        }

        gr.request_compute();
        g._offset._x = ev._x;
        g._offset._y = ev._y;
        ev._device.modified();

        return true;
    }

    ResizeGesture.prototype.terminate = function(ev) {
        return this;
    }

}).call(this);
