/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	ellipse.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Ellipse
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	13/07/12  (Created)
 *  		13/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.Ellipse
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Ellipse = cute.Ellipse = function (w, h) {
        cute.Graphical.call(this, 0,0,w,h);

        return this;
    }

    ist.extend(Ellipse, cute.Graphical);

    Ellipse.prototype.toString = function() {
        var e = this;
        return "cute.Ellipse(" + e._w, + ", " + e._h + ")";
    }

    Ellipse.prototype.render_canvas = function(ctx) {
        var e = this;
        var a = e._area;
        var x, y, w, h;

        e._area.normalise();
        x = a._x + r;
        y = a._y + r;
        w = a._w;
        h = a._h;

        if (c._fill_pattern)
            ctx.fillStyle(e._fill_pattern);
        if (c._pen > 0) {
            ctx.lineWidth(e._pen);
            ctx.strokeStyle(e._colour);
        }

        if (e._fill_pattern && e._pen > 0)
            ctx.ellipse(x, y, w, h);
        else if (e._fill_pattern)
            ctx.fillEllipse(x, y, w, h);
        else if (e._pen > 0)
            ctx.strokeEllipse(x, y, w, h);

        return e;
    }
}).call(this);
