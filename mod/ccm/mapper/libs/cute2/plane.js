/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	plane.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Plane
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2014  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		17/02/14  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Plane
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;
    var c = ', ';

    var Plane = cute.Plane = function(opts) {
        var pl = this;

        cute.Figure.call(pl);

        pl._size = (opts.size === undefined ? new cute.Size(0,0) : opts.size);
        pl._origin = (opts.origin === undefined ? new cute.Point(0,0) : opts.origin);
        pl._scale = (opts.scale === undefined ? new cute.Point(1,1) : opts.scale);
        pl._rotate = (opts.rotate === undefined ? 0 : opts.rotate);

        return pl;
    }

    ist.extend(Plane, cute.Figure);

    Plane.prototype.size = function(v0) { if (v0 === undefined) return this._size; this._size = v0; return this; };
    Plane.prototype.origin = function(v0) { if (v0 === undefined) return this._origin; this._origin = v0; return this; };
    Plane.prototype.scale = function(v0) { if (v0 === undefined) return this._scale; this._scale = v0; return this; };
    Plane.prototype.rotate = function(v0) { if (v0 === undefined) return this._rotate; this._rotate = v0; return this; };

    Plane.prototype.toString = function() {
        return 'cute.Plane()';
    };

    Plane.prototype.compute = function() {
        this._request_compute = false;
        return this;
    }

    Plane.prototype.render_canvas = function(ctx, canvas) {
        var pl = this;
        var ox = pl._offset._x;
        var oy = pl._offset._y;

        ctx.save();
        ctx.translate(ox, oy);
        ctx.push_plane(pl);

        for (var gr, i=0; gr=pl._graphicals[i], i<pl._graphicals.length; i++) {
            gr.Compute();
            if (gr._displayed)
                gr.render_canvas(ctx, canvas);
        }

        ctx.pop_plane();
        ctx.restore();
    };

    Plane.prototype.tx = function(x) {
        var pl = this;
        var ox = pl._origin._x;
        var sx = pl._scale._x;
        var cx = x * sx + ox;

        return cx;
    };

    Plane.prototype.ty = function(y) {
        var pl = this;
        var oy = pl._origin._y;
        var sy = pl._scale._y;
        var cy = oy - y * sy;

        return cy;
    };

    Plane.prototype.tlx = function(len) {
        return len * this._scale._x;
    };

    Plane.prototype.tly = function(len) {
        return len * this._scale._y;
    };

    Plane.prototype.tarc = function(theta) {
        return theta - this._rotate;
    };

    Plane.prototype.ta = function(theta) {
        return theta + this._rotate;
    };

    Plane.prototype.txy = function(x, y) {
        var pl = this;

        if (pl._rotate !== 0) {
            var c = ', ';
            var rval = geo.rotate(x, y, 0, 0, pl._rotate);

            var tmp = {
                x: pl.tx(rval.x),
                y: pl.ty(rval.y)
            };
            return tmp;
        }

        return {
            x: pl.tx(x),
            y: pl.ty(y)
        };
    };;

    /*------------------------------------------------------------
     *  Event handling
     *------------------------------------------------------------*/

    Plane.prototype.event = function(ev, ex, ey) {
        var pl = this;

        { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('Plane.event ' + ev + c + ex + c + ey); } else console.log('Plane.event ' + ev + c + ex + c + ey); };

        if (pl._active) {
            var x = ex - pl._offset._x;
            var y = ey - pl._offset._y;
            var grs = pl._graphicals;

            for (var gr, i=0; gr=pl._graphicals[i], i<pl._graphicals.length; i++) {
                if (gr._displayed && gr.in_event_area(x,y) && gr.event(ev,x,y))
                    return true;
            }
            return cute.Graphical.prototype.event.call(pl, ev, x, y);
        }

        return false;
    };
}).call(this);
