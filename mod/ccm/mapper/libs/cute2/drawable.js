/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	drawable.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Drawable
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2014  University of Twente
 *  
 *  Historh	16/05/14  (Created)
 *  		16/05/14  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Graphical
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;
    var c = ', ';

    var Drawable = cute.Drawable = function(x, y, w, h) {
        var dr = this;

        cute.Graphical.call(dr, x, y, w, h);

        dr._parts = [];
        dr._closed = false;

        return this;
    };

    ist.extend(Drawable, cute.Graphical);

    Drawable.prototype.toString = function() {
        return "drawable(" + this._id + c + this._name + ")";
    };

    Drawable.prototype.clear_parts = function() {
        this._parts = [];
        this._closed = false;

        return this;
    }

    Drawable.prototype.add_lineTo = function(x, y) {
        var dr = this;
        var last = dr.last_point();

        if (last)
            dr._parts.push(new geo.Line(last, new geo.Point(x,y)));

        return dr;
    }

    Drawable.prototype.add_moveTo = function(x, y) {
        var dr = this;

        dr._parts.push(new geo.Line(geo.Point(x,y), new geo.Point(x,y)));

        return dr;
    }

    Drawable.prototype.add_line = function(x1, y1, x2, y2) {
        var dr = this;

        dr._parts.push(new geo.Line(x1, y1, x2, y2));

        return dr;
    }

    Drawable.prototype.add_arc = function(x, y, r, sa, ea) {
        var dr = this;

        dr._parts.push(new geo.Arc(x, y, r, sa, ea));

        return dr;
    }

    Drawable.prototype.last_point = function() {
        var dr = this;
        var parts = dr._parts;
        var len = parts.length;

        if (len === 0)
            return null;
        return parts[len-1].end();
    }

    Drawable.prototype.close_parts = function() {
        var dr = this;

        if (dr._closed)
            return true;

        var parts = dr._parts;
        var len = parts.length;

        dr._closed = true;

        if (len === 0)
            return dr;

        var first = parts[0];
        var last = parts[len-1];
        var start = first.start();
        var end = last.end();

        parts.push(new geo.Line(start, end));

        return dr;
    }

    Drawable.prototype.in_event_area = function(x, y) {
        var dr = this;
        var hits = 0;
        var ln = new geo.Ray(x, y, x+10000, y);

//        printf('Drawable.in_event_area ' + x + c + y);
        dr.close_parts();
        for (var g, i=0; g=dr._parts[i], i<dr._parts.length; i++) {
            var rval = g.intersection(ln);

            if (rval) {
                if (rval instanceof Array)
                    hits += rval.length;
                else
                    hits++;
            }
        }

        if ((hits % 2) === 1) {
//            printf('  INSIDE ');
            return true;
        }
//        printf('  OUTSIDE  ');
        return false;
    };

    Drawable.prototype.event = function(ev, x, y) {
//        printf('Drawable.event ' + ev + c + x + y);
        return cute.Graphical.prototype.event.call(this, ev, x, y);
    };

}).call(this);
