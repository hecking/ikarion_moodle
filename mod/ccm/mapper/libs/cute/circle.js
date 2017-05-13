/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	circle.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Circle
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		10/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.Circle
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Circle = cute.Circle = function(r) {
        var c = this;

        cute.Graphical.call(c, 0,0,r*2,r*2);

        c._radius = r;

        return r;
    }

    ist.extend(Circle, cute.Graphical);

    Circle.prototype.render_canvas = function(ctx) {
        var c = this;
        var r, x, y;

        c._area.normalise();
        r = c._radius;
        x = c._area._x + r;
        y = c._area._y + r;

        if (c._fill_pattern) {
            ctx.fillStyle(c._fill_pattern);
        }
        if (c._pen > 0) {
            ctx.lineWidth(c._pen);
            ctx.strokeStyle(c._colour);
        }

        if (c._fill_pattern && c._pen > 0)
            ctx.circle(x, y, r);
        else if (c._fill_pattern)
            ctx.fillCircle(x, y, r);
        else if (c._pen > 0)
            ctx.strokeCircle(x, y, r);

        return c;
    }

    Circle.prototype.radius = function(r) {
        var c = this;

        if (r === undefined)
            return c._radius;
        if (r !== c._radius) {
            c._radius = r;
            c.set(undefined, undefined, 2*r, 2*r);
        }
        return c;
    }

    Circle.prototype.geometry = function(x, y, w, h) {
        var c = this;

        if (!w && !h)
            return cute.Graphical.prototype.geometry.call(c, x,y);
        if (w && h) {
            var r = c._radius = Math.max(w,h)/2;
            return cute.Graphical.prototype.geometry.call(c, x,y,r*2,r*2);
        }
        if (w) {
            c._radius = w/2;
            return cute.Graphical.prototype.geometry.call(c, x,y,w,w);
        }

        c._radius = h/2;
        return cute.Graphical.prototype.geometry.call(c, x,y,h,h);
    }

    Circle.prototype.toString = function() {
        var c = this;

        return "cute.Circle(" + c._radius + ")";
    }


    /*------------------------------------------------------------
     *  RadialCircle
     *------------------------------------------------------------*/

    var RadialCircle = cute.RadialCircle = function(r) {
        var c = this;

        Circle.call(c, r);

        return c;
    }

    ist.extend(RadialCircle, Circle);

    RadialCircle.prototype.render_canvas = function(ctx) {
        var c = this;
        var r, x, y;

        c._area.normalise();
        r = c._radius;
        x = c._area._x + r;
        y = c._area._y + r;

        var fp = c._fill_pattern;
        var css;

        if (fp) {
            if (fp instanceof cute.Colour)
                css = fp.css();
            else
                css = fp;
        } else
            css = '#000000';

        var x1 = x-r/2;
        var y1 = y-r/2;
        var x2 = x-r/2;
        var y2 = y-r/2;
        var grad = ctx.createRadialGradient(x-r/2, y-r/2, 0, x-r/2, y-r/2, r);
        grad.addColorStop(0, '#eee');
        grad.addColorStop(1, css);

        ctx.fillStyle(grad);

        if (c._pen > 0) {
            ctx.lineWidth(c._pen);
            ctx.strokeStyle(c._colour);
        }

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        return c;
    }
}).call(this);
