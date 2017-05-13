/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	shadow.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Shadow
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	17/09/12  (Created)
 *  		17/09/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.Shadow
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    cute.Shadow = function(colour, blur, offset_x, offset_y) {
        var sh = this;

        if (colour instanceof cute.Colour)
            sh._colour = colour.css();
        else
            sh._colour = (colour === undefined ? 'black' : colour);
        sh._blur = (blur === undefined ? 0 : blur);
        sh._offset_x = (offset_x === undefined ? 0 : offset_x);
        sh._offset_y = (offset_y === undefined ? 0 : offset_y);

        return sh;
    }

    cute.Shadow.prototype.render_canvas = function(ctx) {
        var sh = this;

        ctx.shadowColor = sh._colour;
        ctx.shadowBlur = sh._blur;
        ctx.shadowOffsetX = sh._offset_x;
        ctx.shadowOffsetY = sh._offset_y;

        return sh;
    }

    cute.Shadow.prototype.render_reset = function(ctx) {
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        return this;
    }
}).call(this);
