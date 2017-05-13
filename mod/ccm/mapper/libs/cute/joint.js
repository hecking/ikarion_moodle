/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	joint.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Joint
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	10/07/12  (Created)
 *  		10/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.Joint
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Joint = cute.Joint = function (x, y, w, h, arrows) {
        var joint = this;

        cute.Graphical.call(joint, x, y, w, h);

        joint._first_arrow = null;
        joint._second_arrow = null;
        joint.arrows(arrows);

        return joint;
    }

    ist.extend(Joint, cute.Graphical);

    Joint.prototype.set_arrows = function(first, second) {
        var joint = this;

        first = first || joint._first_arrow;
        second = second || joint._second_arrow;

        if (joint._first_arrow === first && joint._second_arrow === second)
            return joint;

        joint._first_arrow = first;
        joint._second_arrow = second;

        joint.request_compute();

        return joint;
    }

    Joint.prototype.first_arrow = function(arrow) {
        return this.set_arrows(arrow);
    }

    Joint.prototype.second_arrow = function(arrow) {
        return this.set_arrows(undefined, arrow);
    }

    Joint.prototype.arrows = function(style) {
        var joint = this;

        if (style === undefined) {
            if (joint._first_arrow)
                return (joint._second_arrow ? 'both' : 'first');
            return (joint._second_arrow ? 'second' : 'none');
        }

        var first = null;
        var second = null;

        switch (style) {
        case 'none':
            break;
        case 'first':
            first = joint._first_arrow || joint.default_arrow();
            break;
        case 'second':
            second = joint._second_arrow || joint.default_arrow();
            break;
        case 'both':
            first = joint._first_arrow || joint.default_arrow();
            second = joint._second_arrow || joint.default_arrow();
            break;
        default:
            throw 'Error: cute.Joint.arrows argument invalid ' + style;
        }

        return joint.set_arrows(first, second);
    }

    Joint.prototype.default_arrow = function() {
        return new cute.Arrow();
    }
}).call(this);
