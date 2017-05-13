/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	handle.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Handle
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  Historh	12/07/12  (Created)
 *  		12/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Handle
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    cute.Handle = function(func_x, func_y, kind, name) {
        var h = this;

        if (!kind)
            kind = "link";
        if (!name)
            name = kind;

        h._x_position = func_x; /* Call as: func_x(w, h) */
        h._y_position = func_y;
        h._kind = kind;
        h._name = name;

        return h;
    }


    cute.Handle.prototype.toString = function() {
        var c = ", ";
        return "handle(" + this._kind + c + this._name + ")";
    }


    /*------------------------------------------------------------
     *  Assessors
     *------------------------------------------------------------*/

    cute.Handle.prototype.y_position = function(f) {
        if (f) {
            this._y_position = f;
            return this;
        }
        return this._y_position;
    }

    cute.Handle.prototype.x_position = function(f) {
        if (f) {
            this._x_position = f;
            return this;
        }
        return this._x_position;
    }

    cute.Handle.prototype.kind = function(kind) {
        if (kind) {
            this._kind = kind;
            return this;
        }
        return this._kind;
    }

    cute.Handle.prototype.name = function(name) {
        if (name) {
            this._name = name;
            return this;
        }
        return this._name;
    }


    /*------------------------------------------------------------
     *  Computing the xy position
     *------------------------------------------------------------*/

    cute.Handle.prototype.xy = function(gr, dev) {
        var h = this;
        var x, y, gx, gy;
        var xy;

        if (!dev)
            dev = gr._device;

        if (xy = gr.absolute_xy(dev)) {
            gx = xy.x;
            gy = xy.y;
        } else
            return false;

        x = h._x_position(gr._area._w, gr._area._h);
        y = h._y_position(gr._area._w, gr._area._h);

        return {x: x+gx, y: y+gy};
    }


    cute.Handle.prototype.position = function(gr, dev) {
        var xy = this.xy(gr, dev);

        if (xy)
            return new cute.Point(xy.x, xy.y);
        return false;
    }


    cute.Handle.prototype.x = function(gr, dev) {
        var xy = this.xy(gr, dev);

        if (xy)
            return xy.x;
        return false;
    }


    cute.Handle.prototype.y = function(gr, dev) {
        var xy = this.xy(gr, dev);

        if (xy)
            return xy.y;
        return false;
    }
}).call(this);
