/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	point.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Point
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2012, 2013  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		03/02/13  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.Point
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Point = cute.Point = function(x, y) {
        this._x = (x ? cute.toInt(x) : 0);
        this._y = (y ? cute.toInt(y) : 0);

        return this;
    }

    Point.prototype.x = function(v0) { if (v0 === undefined) return this._x; this._x = v0; return this; };
    Point.prototype.y = function(v0) { if (v0 === undefined) return this._y; this._y = v0; return this; };

    Point.prototype.toString = function() {
        var pt = this;
        var c = ", ";

        return 'Point(' + pt._x + c + pt._y + ')';
    }

    Point.prototype.equal = function(p) {
        return this._x === p._x && this._y === p._y;
    }

    Point.prototype.copy = function(p) {
        if (p) {
            this._x = p._x;
            this._y = p._y;
            return this;
        }
        return new Point(this._x, this._y);
    }

    Point.prototype.set = function(x, y) {
        if (x) this._x = cute.toInt(x);
        if (y) this._y = cute.toInt(y);

        return this;
    }

    Point.prototype.offset = function(x, y) {
        this._x += cute.toInt(x);
        this._y += cute.toInt(y);

        return this;
    }

    Point.prototype.difference = function(p) {
        return new Point(this._x - p._x, this._y - p._y);
    }

    Point.prototype.distance = function(p) {
        return geo.distance(this._x, this._y, p._x, p._y);
    }

    Point.prototype.mid_point = function(p) {
        return new Point(cute.toInt((this._x+p._x+1)/2),
                              cute.toInt((this._y+p._y+1)/2));
    }

    Point.prototype.plus = function(p) {
        this._x += p._x;
        this._y += p._y;
    }

    Point.prototype.minus = function(p) {
        this._x -= p._x;
        this._y -= p._y;
    }

    Point.prototype.mirror = function(p) {
        var mx = 0, my = 0;

        if (p !== undefined)
            mx = p._x, my = p._y;

        this._x = mx - p._x;
        this._y = my - p._y;

        return this;
    }
}).call(this);
