/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	colour.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Colour
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2012, 2013, 2014  University of Twente
 *  
 *  History	11/10/12  (Created)
 *  		12/10/13  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.Colour
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    /** 
     *  Returns a new colour object derived from the specification argument.  The CSS
     *  colour specification is used and no computations on colours are provided.
     *  Specification is either a string (e.g., 'black') or an object literal
     *  of one these forms (RGB and HSL are native in CSS):
     *
     *	RGB[A] model:  { r: 0...255, g: 0...255, b: 0...255, [ a: 0..1 ] }
     *	HSL model:     { h: 0...360, s: 0...100, l: 0...100 }
     *	HSV model:     { h: 0...360, s: 0...1, v: 0...1 }
     *  
     *  @param {String or Object} 	Specification of a colour (string, rgb, hsv, hsl)
     *  @returns {cute.Colour}		Colour object
     */
    var Colour = cute.Colour = function(spec) {
        var c = this;

        // Defaults
        c._red = 0;
        c._green = 0;
        c._blue = 0;
        c._alpha = 1;

            // Compatibility
        if (arguments.length > 1)
            throw 'Error: cute.Colour has a single specification argument';

        if (spec === undefined) {
            return c.rgba({r: c._red, g: c._green, b: c._blue, a: c._alpha});
        }

        if (typeof(spec) == 'string') {
            c._css = spec;
            return c;
        }

        // Using RGB (0...255, 0...255, 0...255)
        if (spec.r !== undefined && spec.g !== undefined && spec.b !== undefined) {
            return c.rgba(spec);
        }

 //  Using HSV (0...360, 0...1, 0...1)
        if (spec.h !== undefined && spec.s !== undefined && spec.v !== undefined)
            return c.hsv(spec);

        //  Using HSL (0...360, 0...100, 0...100)
        if (spec.h !== undefined && spec.s !== undefined && spec.l !== undefined)
            return c.hsl(spec);

        throw 'Error: cute.Colour: specification not recognised';

        return c;
    };

    Colour.prototype.toString = function() {
        return 'Colour(' + this._css + ')';
    };

    /**
     *  @returns{String} css	CSS specification of the colour.
     */
    Colour.prototype.css = function() {
        return this._css;
    };

    Colour.prototype.rgba = function(spec) {
        var c = this;

        c._red = Math.round(spec.r);
        c._green = Math.round(spec.g);
        c._blue = Math.round(spec.b);

        if (spec.a === undefined) {
            c._alpha = 1;
            c._css = 'rgb(' + c._red + ',' + c._green + ',' + c._blue + ')';
        } else {
            c._alpha = spec.a;
            c._css = 'rgba(' + c._red + ',' + c._green + ',' + c._blue + ',' + c._alpha + ')';
        }

        return c;
    };

    Colour.prototype.hsl = function(spec) {
        var c = this;
        var h = spec.h / 360;
        var s = spec.s / 100;
        var l = spec.l / 100;
        var rgb = hslToRgb(h,s,l);

        return c.rgba(hslToRgb(h,s,l));

        /**
         * Converts an HSL color value to RGB. Conversion formula
         * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
         * Assumes h, s, and l are contained in the set [0, 1] and
         * returns r, g, and b in the set [0, 255].
         *
         * @param   Number  h       The hue
         * @param   Number  s       The saturation
         * @param   Number  l       The lightness
         * @return  Array           The RGB representation
         */
        function hslToRgb(h, s, l) {
            var r, g, b;

            if(s == 0){
                r = g = b = l; // achromatic
            } else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return {r: r * 255, g: g * 255, b: b * 255};
        }

        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
    };

    Colour.prototype.hsv = function(hsv) {
        var c = this;
        var h = hsv.h / 360; // 0 ... 360
        var s = hsv.s; // 0 ... 1
        var v = hsv.v; // 0 ... 1
        var r, g, b, i, f, p, q, t;

        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        }

        c.rgba({ r: Math.floor(r * 255),
                 g: Math.floor(g * 255),
                 b: Math.floor(b * 255)
               });

        return c;
    };

    Colour.prototype.red = function() {
        return this._red;
    }

    Colour.prototype.green = function() {
        return this._green;
    }

    Colour.prototype.blue = function() {
        return this._blue;
    }

    Colour.prototype.alpha = function() {
        return this._alpha;
    }
}).call(this);
