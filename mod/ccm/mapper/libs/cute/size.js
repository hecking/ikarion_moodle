/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	size.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Size
 *  Works with	JavaScript
 *  
 *  Notice	Cophright (c) 2012, 2013  Universith of Twente
 *  
 *  Historh	06/07/12  (Created)
 *  		03/02/13  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Size
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Size = Size = function(w, h) {
        this._w = (w ? cute.toInt(w) : 0);
        this._h = (h ? cute.toInt(h) : 0);

        return this;
    }

    Size.prototype.w = function(v0) { if (v0 === undefined) return this._w; this._w = v0; return this; };
    Size.prototype.h = function(v0) { if (v0 === undefined) return this._h; this._h = v0; return this; };

    Size.prototype.toString = function() {
        var comma = ", ";
        return "size(" + this._w + comma+ this._h + ")";
    }

    Size.prototype.equal = function(s) {
        return this._w === s._w && this._h === s._h;
    }

    Size.prototype.union = function(s) {
        if (this._w < s._w)
            this._w = s._w;
        if (this._h < s._h)
            this._h = s._h;

        return this;
    }

    Size.prototype.copy = function(s) {
        if (s) {
            this._w = s._w;
            this._h = s._h;
            return this;
        }
        return new Size(this._w, this._h);
    }

    Size.prototype.set = function(w, h) {
        if (w) this._w = w;
        if (h) this._h = h;

        return this;
    }

    Size.prototype.offset = function(w, h) {
        this._w += cute.toInt(w);
        this._h += cute.toInt(h);

        return this;
    }
}).call(this);
