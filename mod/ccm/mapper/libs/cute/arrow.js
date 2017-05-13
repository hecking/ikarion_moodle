/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	arrow.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Arrow
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2012, 2013, 2014  University of Twente
 *  
 *  History	10/07/12  (Created)
 *  		20/01/14  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.Arrow
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    if (this.geo === undefined)
        throw "cute.Arrow: requires ../geometry.js";

    var Arrow = cute.Arrow = function (length, wing, style, fill) {
        var arrow = this;

        cute.Graphical.call(arrow, 0, 0, 1, 1);

        arrow._length = length || 10;
        arrow._wing = wing || 7;
        arrow._style = style || "closed";
        arrow._fill_pattern = fill || "black";

        arrow._tip = new cute.Point(10, 10);
        arrow._reference = new cute.Point(0, 0);
        arrow._left = new cute.Point(0, 0);
        arrow._right = new cute.Point(0, 0);

        return arrow;
    }

    ist.extend(Arrow, cute.Graphical);

    Arrow.prototype.geometry = function(x, y) {
        var arrow = this;

        if (x || y) {
            var dx, dy;

            if (arrow._request_compute)
                arrow.compute();
            dx = (x === undefined ? 0 : (x - arrow._area._x));
            dy = (y === undefined ? 0 : (y - arrow._area._y));

            arrow.points(arrow._tip._x + dx,
                         arrow._tip._y + dy,
                         arrow._reference._x + dx,
                         arrow._reference._y + dy);
        }

        return arrow;
    }

    Arrow.prototype.points = function(tx, ty, rx, ry) {
        var arrow = this;
        var tip = arrow._tip;
        var ref = arrow._reference;

        tx = tx || tip._x;
        ty = ty || tip._y;
        rx = rx || ref._x;
        ry = ry || ref._y;

        if (tx != tip._x || ty != tip._y || rx != ref._x || ry != ref._y) {
            tip._x = tx;
            tip._y = ty;
            ref._x = rx;
            ref._y = ry;
        }
        arrow.request_compute(true);

        return arrow;
    }

    Arrow.prototype.tip = function(p) {
        return this.points(p._x, p._y);
    }

    Arrow.prototype.reference = function(p) {
        return this.points(undefined, undefined, p._x, p._y);
    }

    Arrow.prototype.style = function(style) {
        var arrow = this;

        if (style === undefined)
            return arrow._style;

        if (style != arrow._style) {
            arrow._style = style;
        }

        return arrow;
    }

    Arrow.prototype.length = function(length) {
        var arrow = this;

        if (length) {
            if (length != arrow._length) {
                arrow._length = length;
                arrow.request_compute(true);
            }
            return this;
        }
        return arrow._length;
    }

    Arrow.prototype.wing = function(wing) {
        var arrow = this;

        if (wing) {
            if (wing != arrow._wing) {
                arrow._wing = wing;
                arrow.request_compute(true);
            }
            return arrow;
        }
        return arrow._wing;
    }


    Arrow.prototype.compute = function() {
        var arrow = this;

        if (arrow._request_compute) {
            var x1, y1, x2, y2;
            var x, y, w, h;
            var sx, sy, rx, ry;
            var xdiff, ydiff;
            var cdl1, sdl1, cl2, sl2;
            var l1, l2, d;
            var sin_theta, cos_theta;

            x1 = arrow._reference._x;
            y1 = arrow._reference._y;
            x2 = arrow._tip._x;
            y2 = arrow._tip._y;

            l1 = arrow._length;
            l2 = arrow._wing / 2;

            xdiff = x2 - x1;
            ydiff = y2 - y1;

            d = Math.sqrt((xdiff*xdiff + ydiff*ydiff));

            if (d < 0.0000001) {
                cos_theta = 1.0;
                sin_theta = 0.0;
            } else {
                cos_theta = xdiff / d;
                sin_theta = ydiff / d;
            }

            cdl1 = cute.toInt(cos_theta * (d-l1));
            sdl1 = cute.toInt(sin_theta * (d-l1));
            cl2 = cute.toInt(cos_theta * l2);
            sl2 = cute.toInt(sin_theta * l2);

            sx = x1 + cdl1 - sl2;
            sy = y1 + sdl1 + cl2;
            rx = x1 + cdl1 + sl2;
            ry = y1 + sdl1 - cl2;

            arrow._left._x = cute.toInt(sx);
            arrow._left._y = cute.toInt(sy);
            arrow._right._x = cute.toInt(rx);
            arrow._right._y = cute.toInt(ry);

            //  Needed?
            x = Math.min(x2, Math.min(sx, rx));
            y = Math.min(y2, Math.min(sy, ry));
            w = Math.max(x2, Math.max(sx, rx)) - x + 1;
            h = Math.max(y2, Math.max(sy, ry)) - y + 1;

            arrow._area.set(x, y, w, h);
            arrow._request_compute = false;
        }
        return arrow;
    }


    /*------------------------------------------------------------
     *  Render
     *------------------------------------------------------------*/

    Arrow.prototype.render_canvas = function(ctx) {
        var arrow = this;

        arrow.compute();

        var x1 = arrow._left._x;
        var y1 = arrow._left._y;
        var x2 = arrow._tip._x;
        var y2 = arrow._tip._y;
        var x3 = arrow._right._x;
        var y3 = arrow._right._y;
        var fill = arrow._fill_pattern;
        var pen = arrow._pen;
        var style = arrow._style;

        if (fill) {
            ctx.fillStyle(fill);
            ctx.fillPolygon([x1, y1, x2, y2, x3, y3]);
        }

        if (pen > 0) {
            ctx.lineWidth(pen);
            ctx.line(x1, y1, x2, y2);
            ctx.line(x2, y2, x3, y3);
            if (style === "closed")
                ctx.line(x3, y3, x1, y1);
        }
    }
}).call(this);
