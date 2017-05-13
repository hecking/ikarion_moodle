/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	text.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Text
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		10/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.Text
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Text = cute.Text = function(str, font, fmt, base) {
        var t = this;

        cute.Graphical.call(t);
        t._string = (str === undefined ? "" : str);
        t._font = font || new cute.Font({
            family: 'sans-serif',
            size: '14px'
        });
        t._format = fmt || 'left';
        t._baseline = base || 'top';
        t._position = new cute.Point(0,0);
        t._background = null;
        t._selection = null;

        if (cute.ctx) { /* TBD -- initialisation of constructor */
            t.init_size();
        }

        return t;
    }

    ist.extend(Text, cute.Graphical);

    Text.prototype.toString = function() {
        var t = this;
        var a = t._area;

        return 'cute.Text(' + t._string + ') area [' + a._x + ' ' + a._y + ' ' + a._w + ' ' + a._h + ']';
    }

    Text.prototype.init_size = function() {
        var t = this;
        var w, h;

        h = t._font.height();
        cute.ctx.font(t._font);
        w = cute.ctx.measureText(t._string).width;

        if (h !== t._area._h || w !== t._area._w) {
            t.set(undefined, undefined, w, h);
        }

        return t;
    }

    Text.prototype.init_height = function() {
        var t = this;
        var h;

        h = t._font.height();
        if (h !== t._area._h) {
            t.set(undefined, undefined, undefined, h);
        }

        return t;
    }

    Text.prototype.init_width = function() {
        var t = this;
        var w;

        cute.ctx.font(t._font);
        w = cute.ctx.measureText(t._string).width;
        if (w !== t._area._w)
            t.set(undefined, undefined, w, undefined);

        return t;
    }

    Text.prototype.font = function(ft) {
        var t = this;

        if (ft === undefined)
            return t._font;
        if (ft !== t._font) {
            t._font = ft;
            t.init_size();
            t.request_compute(true);
        }

        return t;
    }

    Text.prototype.string = function(str) {
        var t = this;

        if (str === undefined)
            return t._string;
        if (str != t._string) {
            t._string = str;
            t.init_width();
            t.request_compute(true);
        }
        return t;
    }

    Text.prototype.render_canvas = function(ctx, canvas) {
        var t = this;
        var a = t._area;

        ctx.font(t._font.css());
        ctx.lineWidth(t._pen);
        ctx.fillStyle(t._colour);

        if (t._baseline === 'top') // TBD - Hack for FireFox bug in Ziggy
            ctx.text(t._string, a._x, a._y, t._baseline);
        else
            ctx.text(t._string, a._x, a._y, t._baseline);

        return t;
    }
}).call(this);
