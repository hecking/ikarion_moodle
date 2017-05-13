/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	line.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of the class Line
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2012, 2013  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		20/01/14  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Line
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;
    var geo = this.geo;

    var Line = cute.Line = function(x1, y1, x2, y2, arrows) {
        cute.Joint.call(this, 0, 0, 0, 0, arrows);

        this._start_x = (x1 ? cute.toInt(x1) : 0);
        this._start_y = (y1 ? cute.toInt(y1) : 0);
        this._end_x = (x2 ? cute.toInt(x2) : 0);
        this._end_y = (y2 ? cute.toInt(y2) : 0);
        this._arrows = arrows;

        return this;
    }

    ist.extend(Line, cute.Joint);

    Line.prototype.toString = function() {
        var ln = this;
        var c = ", ";
        return "cute.Line(" + ln._start_x + c + ln._start_y + c + ln._end_x + c + ln._end_y + ")";
    }

    Line.prototype.start_x = function(x) {
        var ln = this;

        if (x === undefined)
            return ln._start_x;

        if (x !== ln._start_x) {
            ln._start_x = x;
            ln.request_compute();
        }

        return ln;
    }

    Line.prototype.start_y = function(y) {
        var ln = this;

        if (y === undefined)
            return ln._start_y;

        if (y !== ln._start_y) {
            ln._start_y = y;
            ln.request_compute();
        }

        return ln;
    }


    Line.prototype.end_x = function(x) {
        var ln = this;

        if (x === undefined)
            return ln._end_x;

        if (x !== ln._end_x) {
            ln._end_x = x;
            ln.request_compute();
        }

        return ln;
    }

    Line.prototype.end_y = function(y) {
        var ln = this;

        if (y === undefined)
            return ln._end_y;

        if (y !== ln._end_y) {
            ln._end_y = y;
            ln.request_compute();
        }

        return ln;
    }


    Line.prototype.points = function(sx, sy, ex, ey) {
        var ln = this;

        if (sx !== undefined) ln._start_x = sx;
        if (sy !== undefined) ln._start_y = sy;
        if (ex !== undefined) ln._end_x = ex;
        if (ey !== undefined) ln._end_y = ey;

        return ln.request_compute();
    }

    Line.prototype.adjust_first_arrow = function() {
        var ln = this;

        if (ln._first_arrow) {
            ln._first_arrow.points(ln._start_x, ln._start_y, ln._end_x, ln._end_y);
            ln._first_arrow._displayed = true;
            ln._first_arrow.Compute();
            return true;
        }
        return false;
    }

    Line.prototype.adjust_second_arrow = function() {
        var ln = this;

        if (ln._second_arrow) {
            ln._second_arrow.points(ln._end_x, ln._end_y, ln._start_x, ln._start_y);
            ln._second_arrow._displayed = true;
            ln._second_arrow.Compute();
            return true;
        }
        return false;
    }

    Line.prototype.copy = function(l2) {
        var l1 = this;

        cute.Joint.prototype.copy(l1, l2);
        l1._start_x = l2._start_x;
        l1._start_y = l2._start_y;
        l1._end_x = l2._end_x;
        l1._end_y = l2._end_y;

        return l1;
    }

    Line.prototype.compute = function() {
        var ln = this;

        if (ln._request_compute) {
            var x1 = ln._start_x;
            var x2 = ln._end_x;
            var y1 = ln._start_y;
            var y2 = ln._end_y;
            var pen = ln._pen;
            var x, y, w, h;
            var a = ln._area;

            if (x1 < x2)
                x = x1, w = x2-x1;
            else
                x = x2, w = x1-x2;
            if (y1 < y2)
                y = y1, h = y2-y1;
            else
                y = y2, h = y1-y2;

            if (pen === 1)
                w++, h++;
            else
                if (pen > 1) {
                    var ex = (h > 0 ? (pen*h)/(w+h) : 0); /* h=0: horizontal */
                    var ey = (w > 0 ? (pen*w)/(w+h) : 0); /* w=0: vertical */
                    var hx = ex/2;
                    var hy = ey/2;

                    x -= hx;
                    w += ex;
                    y -= hy;
                    h += ey;
                }

            a._x = x;
            a._y = y;
            a._w = w;
            a._h = h;

            if (ln.adjust_first_arrow())
                a.union_normalised(ln._first_arrow._area);
            if (ln.adjust_second_arrow())
                a.union_normalised(ln._second_arrow._area);

            ln._request_compute = false;
        }
        return ln;
    }

    Line.prototype.render_canvas = function(ctx, canvas) {
        var ln = this;
        var x1 = ln._start_x;
        var x2 = ln._end_x;
        var y1 = ln._start_y;
        var y2 = ln._end_y;
        var pen = ln._pen;
        var first = ln._first_arrow;
        var second = ln._second_arrow;

        if (pen > 0) {
            ctx.strokeStyle(ln._colour);
            ctx.lineWidth(pen);

            //  If arrows are present we only draw the part of the line
            //  that is not drawn by the arrow.  (We assume the arrow to
            //  be filled).
            if (first) {
                var pt1 = new geo.Point(x1,y1);
                var pt2 = new geo.Point(x2,y2);
                var line = new geo.Line(pt1, pt2);
                var d = first.length();
                var pt = line.point_at_distance(pt1, pt2, d);

                x1 = pt.x();
                y1 = pt.y();
            }

            if (second) {
                var pt1 = new geo.Point(x1,y1);
                var pt2 = new geo.Point(x2,y2);
                var line = new geo.Line(pt1, pt2);
                var d = second.length();
                var pt = line.point_at_distance(pt2, pt1, d);

                x2 = pt.x();
                y2 = pt.y();
            }

            ctx.line(x1, y1, x2, y2);
        }

        if (first)
            first.render_canvas(ctx, canvas);
        if (second)
            second.render_canvas(ctx, canvas);

        return ln;
    }
}).call(this);
