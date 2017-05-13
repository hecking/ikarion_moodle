/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	constraint_move_gesture.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class ConstraintMoveGesture
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	06/08/12  (Created)
 *  		06/08/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.ConstraintMoveGesture
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var ConstraintMoveGesture = cute.ConstraintMoveGesture = function(direction) {
        var g = this;

        cute.MoveGesture.call(g);
        g._direction = (direction === undefined ? 'horizontal' : direction);

        return g;
    }

    ist.extend(ConstraintMoveGesture, cute.ConstraintMoveGesture);

    ConstraintMoveGesture.prototype.toString = function() {
        var g = this;
        return "constraint_move_gesture(" + g._offset._x + " " + g._offset._y + ")";
    }

    ConstraintMoveGesture.prototype.drag = function(ev) {
        var g = this;
        var abs_xy = g._receiver.absolute_xy(g._device);
        var x = ev._x - abs_xy.x - g._offset._x;
        var y = ev._y - abs_xy.y - g._offset._y;

        switch (g._direction) {
        case 'horizontal':
            g._receiver.relative_move_xy(x, 0);
            break;
        case 'vertical':
            g._receiver.relative_move_xy(0, y);
        }
        ev._device.modified();

        return true;
    }
}).call(this);
