/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	gesture.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Gesture
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	14/07/12  (Created)
 *  		14/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Gesture
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    cute.Gesture = function() {
        var g = this;

        g._modifier = undefined;
        g._button = undefined;
        g._condition = null;
        g._active = true;
        g._status = 'inactive';
        g._cursor = undefined;

        return g;
    }


    cute.Gesture.prototype.modifier = function(mod) {
        var g = this;

        if (modifier === undefined)
            return g._modifier;

        if (typeof(modifier) == 'string')
            g._modifier = new cute.Modifier(modifier);
        else
            g._modifier = modifier;

        return g;
    }


    cute.Gesture.prototype.modifiers_match = function(ev) {
        return true;
    }

    cute.Gesture.prototype.event = function(ev) {
        return false;
    }


    /*  Called on proper finish of gesture (e.g., mouse_up).
     */
    cute.Gesture.prototype.terminate = function(ev) {
        return true;
    }


    /*  Called on unproper finish of gesture (e.g., mouse out of window).
     */
    cute.Gesture.prototype.cancel = function(ev) {
        return this.terminate(ev);
    }
}).call(this);
