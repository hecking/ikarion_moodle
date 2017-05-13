/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	main.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Define kernel
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012, 2013, 2014  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		18/02/14  (Last modified)
 */

/*------------------------------------------------------------
 *  Cute
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function () {
    var cute = this.cute = {
        version: "May  2 2014" + ' ' + "11:41:51",
        author: 'Anjo Anjewierden',
        email: 'a.a.anjewierden@utwente.nl',

        ctx: null,
        add_ons: {},

        toInt: function(n) {
            return Math.round(n);
        }
    };
}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	context.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Custom implementation of context to take care of transformations
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2014  University of Twente
 *  
 *  History	19/04/14  (Created)
 *  		19/04/14  (Last modified)
 */


/*------------------------------------------------------------
 *  Directives
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

/*------------------------------------------------------------
 *  Low-level drawing routines
 *------------------------------------------------------------*/

(function() {
    var cute = this.cute;

    /**
     *  A Context is a wrapper around a CanvasRenderingContext and has the
     *  same methods.  Attributes are also represented as methods.
     *
     *  @constructor
     *  @param {CanvasRenderingContext2D} Original context.
     *  @returns {Context} For canvas drawing.
     */
    var Context = cute.Context = function(ctx, canvas) {
        var c = this;

        c._ctx = ctx;
        c._canvas = canvas;
        c._dummy = false;

        return c;
    }

    Context.prototype.dummy = function(v0) { if (v0 === undefined) return this._dummy; this._dummy = v0; return this; };

    /**
     *  See the MDN or Apple documentation for the basic methods.
     *  The wrappers below are in alphabetical order.
     */
    Context.prototype.arc = function(x, y, radius, start, end, counter) {
        if (this._dummy) return;
        this._ctx.arc(x, y, radius, start, end, (counter === undefined ? true : counter));
    }

    Context.prototype.arcTo = function(x1, y1, x2, y2, radius) {
        this._ctx.arcTo(x1, y1, x2, y2, radius);
    }

    Context.prototype.beginPath = function() {
        if (this._dummy) return;
        this._ctx.beginPath();
    }

    Context.prototype.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
        if (this._dummy) return;
        this._ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    }

    Context.prototype.clearRect = function(x, y, w, h) {
        if (this._dummy) return;
        this._ctx.clearRect(x, y, w, h);
    }

    Context.prototype.clip = function() {
        if (this._dummy) return;
        this._ctx.clip();
    }

    Context.prototype.closePath = function() {
        if (this._dummy) return;
        this._ctx.closePath();
    }

    Context.prototype.createImageData = function(w, h) {
        if (this._dummy) return;
        return this._ctx.createImageData(w, h);
    }

    Context.prototype.createLinearGradient = function(x0, y0, x1, y1) {
        if (this._dummy) return;
        return this._ctx.createLinearGradient(x0, y0, x1, y1);
    }

    Context.prototype.createPattern = function(img, rep) {
        if (this._dummy) return;
        return this._ctx.createPattern(img, rep);
    }

    Context.prototype.createRadialGradient = function(x0, y0, r0, x1, y1, r1) {
        if (this._dummy) return;
        return this._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    }

    Context.prototype.drawImage = function(img, x, y) {
        if (this._dummy) return;
        this._ctx.drawImage(img, x, y);
    }

    Context.prototype.fill = function() {
        if (this._dummy) return;
        this._ctx.fill();
    }

    Context.prototype.fillRect = function(x, y, w, h) {
        if (this._dummy) return;
        this._ctx.fillRect(x, y, w, h);
    }

    Context.prototype.fillText = function(str, x, y) {
        if (this._dummy) return;
        this._ctx.fillText(str, x, y);
    }

    Context.prototype.getImageData = function(x, y, w, h) {
        if (this._dummy) return;
        return this._ctx.getImageData(x, y, w, h);
    }

    Context.prototype.getLineDash = function() {
        if (this._dummy) return;
        return this._ctx.getLineDash();
    }

    Context.prototype.isPointInPath = function(x, y) {
        if (this._dummy) return;
        return this._ctx.isPointInPath();
    }

    Context.prototype.isPointInStroke = function(x, y) {
        if (this._dummy) return;
        return this._ctx.isPointInStroek();
    }

    Context.prototype.lineTo = function(x, y) {
        if (this._dummy) return;
        this._ctx.lineTo(x, y);
    }

    Context.prototype.measureText = function(str) {
        if (this._dummy) return;
        return this._ctx.measureText(str);
    }

    Context.prototype.moveTo = function(x, y) {
        if (this._dummy) return;
        this._ctx.moveTo(x, y);
    }

/*
    Context.prototype.putImageData = function(data, x, y, dx, dy, dw, dh) {
        this._ctx.putImageData(data, x, y, dx, dy, dw, dh);
    }
*/
    Context.prototype.putImageData = function(data, x, y) {
        if (this._dummy) return;
        this._ctx.putImageData(data, x, y);
    }

    Context.prototype.quadraticCurveTo = function(cpx, cpy, x, y) {
        if (this._dummy) return;
        this._ctx.quadraticCurveTo(cpx, cpy, x, y);
    }

    Context.prototype.rect = function(x, y, w, h) {
        if (this._dummy) return;
        this._ctx.rect(x, y, w, h);
    }

    Context.prototype.restore = function() {
        if (this._dummy) return;
        this._ctx.restore();
    }

    Context.prototype.rotate = function(angle) {
        if (this._dummy) return;
        this._ctx.rotate(angle);
    }

    Context.prototype.save = function() {
        if (this._dummy) return;
        this._ctx.save();
    }

    Context.prototype.scale = function(x, y) {
        if (this._dummy) return;
        this._ctx.scale(x, y);
    }

    Context.prototype.scrollPathIntoView = function() {
        if (this._dummy) return;
        this._ctx.scrollPathIntoView();
    }

    Context.prototype.setLineDash = function(dash) {
        if (this._dummy) return;
        if (this._ctx.setLineDash)
            this._ctx.setLineDash(dash);
    }

    Context.prototype.setTransform = function(m11, m12, m21, m22, dx, dy) {
        if (this._dummy) return;
        this._ctx.setTransform(m11, m12, m21, m22, dx, dy);
    }

    Context.prototype.stroke = function() {
        if (this._dummy) return;
        this._ctx.stroke();
    }

    Context.prototype.strokeRect = function(x, y, w, h) {
        if (this._dummy) return;
        this._ctx.strokeRect(x, y, w, h);
    }

    Context.prototype.strokeText = function(str, x, y) {
        if (this._dummy) return;
        this._ctx.strokeText(str, x, y);
    }

    Context.prototype.transform = function(m11, m12, m21, m22, dx, dy) {
        if (this._dummy) return;
        this._ctx.transform(m11, m12, m21, m22, dx, dy);
    }

    Context.prototype.translate = function(x, y) {
        if (this._dummy) return;
        this._ctx.translate(x, y);
    }


    /**
     *  Attributes of the CanvasRenderingContext2D are also implemented as
     *  methods.  The convention is that if an argument is specified, the
     *  value is changed (setter), and if no argument is given the value is
     *  returned (getter).
     */
    Context.prototype.fillStyle = function(fill) {
        if (this._dummy) return;
        if (fill === undefined)
            return this._ctx.fillStyle;

        if (fill === null)
            this._ctx.fillStyle = '#000000';
        else if (fill instanceof cute.Colour)
            this._ctx.fillStyle = fill.css();
        else
            this._ctx.fillStyle = fill;
    }

    Context.prototype.font = function(font) {
        if (this._dummy) return;
        if (font === undefined)
            return this._ctx.font;

        if (font instanceof cute.Font)
            this._ctx.font = font.css();
        else
            this._ctx.font = font;
    }

    Context.prototype.globalAlpha = function(alpha) {
        if (this._dummy) return;
        if (alpha === undefined)
            return this._ctx.globalAlpha;
        this._ctx.globalAlpha = alpha;
    }

    Context.prototype.globalCompositeOperation = function(str) {
        if (this._dummy) return;
        if (str === undefined)
            return this._ctx.globalCompositeOperation;
        this._ctx.globalCompositeOperation = str;
    }

    Context.prototype.lineCap = function(cap) {
        if (this._dummy) return;
        if (cap === undefined)
            return this._ctx.lineCap;
        this._ctx.lineCap = cap;
    }

    Context.prototype.lineDashOffset = function(offset) {
        if (this._dummy) return;
        if (offset === undefined)
            return this._ctx.lineDashOffset;
        this._ctx.lineDashOffset = offset;
    }

    Context.prototype.lineJoin = function(join) {
        if (this._dummy) return;
        if (join === undefined)
            return this._ctx.lineJoin;
        this._ctx.lineJoin = join;
    }

    Context.prototype.lineWidth = function(pen) {
        if (this._dummy) return;
        if (pen === undefined)
            return this._ctx.lineWidth;

        this._ctx.lineWidth = pen;
    }

    Context.prototype.miterLimit = function(val) {
        if (this._dummy) return;
        if (val === undefined)
            return this._ctx.miterLimit;

        this._ctx.miterLimit = val;
    }

    Context.prototype.shadowBlur = function(val) {
        if (this._dummy) return;
        if (val === undefined)
            return this._ctx.shadowBlur;

        this._ctx.shadowBlur = val;
    }

    Context.prototype.shadowColor = function(str) {
        if (this._dummy) return;
        if (str === undefined)
            return this._ctx.shadowColor;

        this._ctx.shadowColor = str;
    }

    Context.prototype.shadowOffsetX = function(val) {
        if (this._dummy) return;
        if (val === undefined)
            return this._ctx.shadowOffsetX;

        this._ctx.shadowOffsetX = val;
    }

    Context.prototype.shadowOffsetY = function(val) {
        if (this._dummy) return;
        if (val === undefined)
            return this._ctx.shadowOffsetY;

        this._ctx.shadowOffsetY = val;
    }

    Context.prototype.strokeStyle = function(colour) {
        if (this._dummy) return;
        if (colour === undefined)
            return ctx.strokeStyle;

        if (colour === null)
            this._ctx.strokeStyle = '#000000'
        else if (colour instanceof cute.Colour)
            this._ctx.strokeStyle = colour.css();
        else
            this._ctx.strokeStyle = colour;
    }

    Context.prototype.textAlign = function(str) {
        if (this._dummy) return;
        if (str === undefined)
            return this._ctx.textAlign;

        this._ctx.textAlign = str;
    }

    Context.prototype.textBaseline = function(base) {
        if (this._dummy) return;
        if (base === undefined)
            return this._ctx.textBaseline;

        this._ctx.textBaseline = base;
    }


    /*------------------------------------------------------------
     *  Extra's
     *------------------------------------------------------------*/

    Context.prototype.text = function(str, x, y, base) {
        if (this._dummy) return;
        this._ctx.textBaseline = base || 'alphabetic';
        this._ctx.fillText(str, x, y);
    }


    /**
     *  Rounded corner triangle using arcTo.
     *
     *  @author http://www.dbp-consulting.com/tutorials/canvas/CanvasArcTo.html
     */
    Context.prototype.roundedRect = function(x, y, w, h, r, fill, stroke) {
        if (this._dummy) return;
        this._ctx.save(); // save the context so we don't mess up others
        this._ctx.beginPath(); // draw top and top right corner
        this._ctx.moveTo(x+r,y);
        this._ctx.arcTo(x+w,y,x+w,y+r,r);
        // draw right side and bottom right corner
        this._ctx.arcTo(x+w,y+h,x+w-r,y+h,r); // draw bottom and bottom left corner
        this._ctx.arcTo(x,y+h,x,y+h-r,r); // draw left and top left corner
        this._ctx.arcTo(x,y,x+r,y,r);
        if (fill)
            this._ctx.fill();
        if (stroke)
            this._ctx.stroke();
        this._ctx.restore();
    }

    Context.prototype.circle = function(x, y, radius) {
        if (this._dummy) return;
        this._ctx.beginPath();
        this._ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        this._ctx.closePath();
        this._ctx.fill();
        this._ctx.stroke();
    }

    Context.prototype.fillCircle = function(x, y, radius) {
        if (this._dummy) return;
        this._ctx.beginPath();
        this._ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        this._ctx.closePath();
        this._ctx.fill();
    }

    Context.prototype.strokeCircle = function(x, y, radius) {
        if (this._dummy) return;
        this._ctx.beginPath();
        this._ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        this._ctx.closePath();
        this._ctx.stroke();
    }


    /*------------------------------------------------------------
     *  Ellipse
     *------------------------------------------------------------*/

    Context.prototype.ellipse = function(x, y, w, h) {
        if (this._dummy) return;
        this.drawEllipse(x, y, w, h, true, true);
    }

    Context.prototype.strokeEllipse = function(x, y, w, h) {
        if (this._dummy) return;
        this.drawEllipse(x, y, w, h, false, true);
    }

    Context.prototype.fillEllipse = function(x, y, w, h) {
        if (this._dummy) return;
        this.fillEllipse(x, y, w, h, true, false);
    }

    Context.prototype.drawEllipse = function(x, y, w, h, fill, stroke) {
        if (this._dummy) return;
        var kappa = 0.5522848;
        var ox, oy, xe, ye, xm, ym;

        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w, // x-end
        ye = y + h, // y-end
        xm = x + w / 2, // x-middle
        ym = y + h / 2; // y-middle

        this._ctx.beginPath();
        this._ctx.moveTo(x, ym);
        this._ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        this._ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        this._ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        this._ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        this._ctx.closePath();
        if (fill)
            this._ctx.fill();
        if (stroke)
            this._ctx.stroke();
    }

    Context.prototype.strokeArc = function(x, y, radius, start, end, counter) {
        if (this._dummy) return;
        this._ctx.beginPath();
        this._ctx.arc(x, y, radius, start, end, (counter === undefined ? true : counter));
        this._ctx.closePath();
        this._ctx.stroke();
    }

    Context.prototype.fillArc = function(x, y, radius, start, end, counter) {
        if (this._dummy) return;
        this._ctx.beginPath();
        this._ctx.arc(x, y, radius, start, end, (counter === undefined ? true : counter));
        this._ctx.closePath();
        this._ctx.fill();
    }

    Context.prototype.style = function(style) {
        var ctx = this;

        if (ctx._dummy) return;

        if (style.stroke)
            ctx.strokeStyle(style.stroke);
        if (style.fill)
            ctx.fillStyle(style.fill);
        if (style.line_dash)
            ctx.setLineDash(style.line_dash);

        return;
    }

    Context.prototype.line = function(x1, y1, x2, y2) {
        if (this._dummy) return;
        this._ctx.beginPath();

        x1 = Math.round(x1);
        y1 = Math.round(y1);
        x2 = Math.round(x2);
        y2 = Math.round(y2);

    //  this._ctx.lineCap = 'square';
        this.lineCap('butt');
        if (this._ctx.lineWidth === 1) {
            this._ctx.moveTo(x1-0.5, y1-0.5);
            this._ctx.lineTo(x2-0.5, y2-0.5);
        } else {
            this._ctx.moveTo(x1, y1);
            this._ctx.lineTo(x2, y2);
        }
        this._ctx.closePath();
        this._ctx.stroke();
    }

    Context.prototype.fillPolygon = function(a) {
        if (this._dummy) return;
        var x = 0, y = 1;

        this._ctx.beginPath();
        this._ctx.moveTo(a[x], a[y]);
        for (x=2, y=3; x<a.length; x+=2, y+=2)
            this._ctx.lineTo(a[x], a[y]);
        this._ctx.closePath();
        this._ctx.fill();
    }

    Context.prototype.path = function(points, ox, oy, closed, fill) {
        if (this._dummy) return;
        if (points.length < 2)
            return;

        var x0 = 0, y0 = 0;

        this._ctx.beginPath();
        for (i=0; i<points.length; i++) {
            var x = points[i]._x + ox;
            var y = points[i]._y + oy;

            if (i === 0) {
                this._ctx.moveTo(x, y);
                x0 = x, y0 = y;
            } else {
                this._ctx.lineTo(x, y);
            }
        }
        if (closed) {
            this._ctx.lineTo(x0, y0);
        }
        this._ctx.closePath();
        if (this._ctx.lineWidth > 0) {
            this._ctx.stroke();
        }
        if (fill) {
            this._ctx.fillStyle(fill);
            this._ctx.fill();
        }
    }


/*
    function new_radial_gradient(this._ctx. x0, y0, r0, x1, y1, r1, stops) {
        var grd;

        grd = this._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
        for (var i=0; i<stops.length; i++) {
            grd.addColorStop(stops[i].value, stops[i].color);
        }

        return grd;
    }

    function r_radial_gradient(this._ctx. x0, y0, r0, x1, y1, r1, stops) {
        var grd;

        grd = this._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
        for (var i=0; i<stops.length; i++) {
            grd.addColorStop(stops[i].value, stops[i].color);
        }

        this._ctx.fillStyle(grd);
        this._ctx.beginPath();
        this._ctx.arc(x0, y0, Math.max(r0,r1), 0, 2 * Math.PI, true);
        this._ctx.fill();
    }

    function r_radial_box(this._ctx. x0, y0, r0, x1, y1, r1, stops) {
        var grd;

        grd = this._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
        for (var i=0; i<stops.length; i++) {
            grd.addColorStop(stops[i].value, stops[i].color);
        }
        this._ctx.fillStyle(grd);
        this._ctx.beginPath();
        this._ctx.rect(x0, y0, r0, r1);
        this._ctx.fill();
    }
*/

    Context.prototype.gradientBox = function(x, y, w, h, stops) {
        if (this._dummy) return;
        var grd;

        grd = this._ctx.createLinearGradient(x, y, x, y+h);
        for (var i=0; i<stops.length; i++) {
            grd.addColorStop(stops[i].value, stops[i].color);
        }
        this._ctx.fillStyle(grd);
        this._ctx.beginPath();
        this._ctx.rect(x, y, w, h);
        this._ctx.fill();
    }

}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	area.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of the class Area
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2012, 2013, 2014  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		17/02/14  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Area
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Area = cute.Area = function(x, y, w, h) {
        this._x = (x ? cute.toInt(x) : 0);
        this._y = (y ? cute.toInt(y) : 0);
        this._w = (w ? cute.toInt(w) : 0);
        this._h = (h ? cute.toInt(h) : 0);

        return this;
    }

    Area.prototype.x = function(v0) { if (v0 === undefined) return this._x; this._x = v0; return this; };
    Area.prototype.y = function(v0) { if (v0 === undefined) return this._y; this._y = v0; return this; };
    Area.prototype.w = function(v0) { if (v0 === undefined) return this._w; this._w = v0; return this; };
    Area.prototype.h = function(v0) { if (v0 === undefined) return this._h; this._h = v0; return this; };

    Area.prototype.toString = function() {
        var a = this;
        return '[' + [a._x,+a._y,a._w,a._h].join(', ') + '] ';
    }

    Area.prototype.normalise = function() {
        if (this._w < 0) this._x += w + 1, this._w = -w;
        if (this._h < 0) this._y += h + 1, this._h = -h;
        return this;
    }

    Area.prototype.equal = function(a) {
        this.normalise();
        a.normalise();
        return (this._x === a._x && this._y === a._y
                && this._w === a._w && this._h === a._h);
    }

    Area.prototype.clear = function() {
        this._x = 0;
        this._y = 0;
        this._w = 0;
        this._h = 0;

        return this;
    }

    Area.prototype.intersection = function(a) {
        var x, y, w, h;
        var ax = this._x, ay = this._y, aw = this._w, ah = this._h;
        var bx = b._x, by = b._y, bw = b._w, bh = b._h;
        var orient;
        var norm;

        orient = orientation_area(aw, ah);

        this.normalise();
        a.normalise();

        x = (ax > bx ? ax : bx);
        y = (ay > by ? ay : by);
        w = (ax + aw < bx + bw ? ax + aw : bx + bw) - x;
        h = (ay + ah < by + bh ? ay + ah : by + bh) - y;

        if (w < 0 || h < 0) {
            this.clear();
            return false;
        }

        return this.orientate_area(orientation);
    }

    Area.prototype.orientate_area = function(d) {
        var a = this;
        var w = a._w, h = a._h;

        if (d === 'north_west')
        { if (w < 0) a._x += w+1, w = -w;
          if (h < 0) a._yy += h+1, h = -h;
        } else if (d == 'south_west')
        { if (w < 0) a._x += w+1, w = -w;
          if (h > 0) a._y += h-1, h = -h;
        } else if (d == 'north_east')
        { if (w > 0) a._x += w-1, w = -w;
          if (h < 0) a._y += h+1, h = -h;
        } else if (d == 'south_east')
        { if (w > 0) a._x += w-1, w = -w;
          if (h > 0) a._y += h-1, h = -h;
        }

        return a;
    }

    Area.prototype.orientate = function(a, d) {
        var x = a._x, y = a._y, w = a._w, h = a._h;

        switch (d) {
        case 'north_west':
            if (w < 0) x += w+1, w = -w;
            if (h < 0) y += h+1, h = -h;
            break;
        case 'south_west':
            if (w < 0) x += w+1, w = -w;
            if (h > 0) y += h-1, h = -h;
            break;
        case 'north_east':
            if (w > 0) x += w-1, w = -w;
            if (h < 0) y += h+1, h = -h;
            break;
        case 'south_east':
            if (w > 0) x += w-1, w = -w;
            if (h > 0) y += h-1, h = -h;
        }
        a._x = x, a._y = y, a._w = w, a._h = h;

        return this;
    }

    Area.prototype.orientation = function(orient) {
        if (orient === undefined)
          return orientation_area(this._w, this._h);

        return this.orientate(orient);
    }

    Area.prototype.union = function(b) {
        var x, y, w, h;
        var bx = b._x, by = b._y, bw = b._w, bh = b._h;
        var ax = this._x, ay = this._y, aw = this._w, ah = this._h;

        this.normalise();
        a.normalise();

        x = (ax < bx ? ax : bx);
        y = (ay < by ? ay : by);
        w = (ax + aw > bx + bw ? ax + aw : bx + bw) - x;
        h = (ay + ah > by + bh ? ay + ah : by + bh) - y;

        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;

        return this;
    }

    Area.prototype.union_normalised = function(b) {
        if (b._w === 0 && b._h === 0)
            return this;
        if (this._w === 0 && this._h === 0) {
            this.copy(b);
            return this.normalise();
        }

        b.normalise();

        var x, y, w, h;
        var bx = b._x, by = b._y, bw = b._w, bh = b._h;
        var ax = this._x, ay = this._y, aw = this._w, ah = this._h;

        x = (ax < bx ? ax : bx);
        y = (ay < by ? ay : by);
        w = (ax + aw > bx + bw ? ax + aw : bx + bw) - x;
        h = (ay + ah > by + bh ? ay + ah : by + bh) - y;

        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;

        return this;
    }

    Area.prototype.size = function(s) {
        if (s === undefined)
            return new cute.Size(this._w, this._h);
        this._w = s._w;
        this._h = s._h;

        return this;
    }

    Area.prototype.measure = function() {
        return this._w * this._h;
    }

    Area.prototype.point_in = function(p) {
        var x = p._x, y = p._y;
        var ax = this._x, ay = this._y, aw = this._w, ah = this._h;

        this.normalise();
        return (x >= ax && x <= ax+aw && y >= ay && y <= ay+ah);
    }

    Area.prototype.overlap = function(b) {
        var ax = this._x, ay = this._y, aw = this._w, ah = this._h;
        var bx = b._x, by = b._y, bw = b._w, bh = b._h;

        this.normalise();
        b.normalise();

        return (by >= ay+ah || by+bh <= ay || bx >= ax+aw || bx+bw <= ax);
    }

    Area.prototype.relative_move = function(p) {
        if (p) {
            this._x += p._x;
            this._y += p._y;
        }

        return this;
    }

    Area.prototype.relative_move_back = function(p) {
        this._x -= p._x;
        this._y -= p._y;

        return this;
    }

    Area.prototype.position = function(p) {
        if (p === undefined)
            return new cute.Point(this._x, this._y);
        this._x = p._x;
        this._y = p._y;

        return this;
    }

    Area.prototype.copy = function(a) {
        if (a) {
            this._x = a._x;
            this._y = a._y;
            this._w = a._w;
            this._h = a._h;
            return this;
        }
        return new Area(this._x, this._y, this._w, this._h);
    }

    Area.prototype.inside = function(b) {
        var ax = this._x, ay = this._y, aw = this._w, ah = this._h;
        var bx = b._x, by = b._y, bw = b._w, bh = b._h;

        this.normalise();
        b.normalise();

        if (bx < ax) return false;
        if (bx+bw > ax+aw-1) return false;
        if (by < ay) return false;
        if (by+bh > ay+ah-1) return false;

        return true;
    }

    Area.prototype.distance_x = function(b) {
        var ax = this._x, aw = this._w;
        var bx = b._x, bw = b._w;

        if ( aw < 0 ) ax += aw, aw = -aw;
        if ( bw < 0 ) bx += bw, bw = -bw;

        if ( ax + aw < bx ) return cute.toInt(bx-(ax+aw));
        if ( bx + bw < ax ) return cute.toInt(ax-(bx+bw));

        return 0;
    }

    Area.prototype.distance_y = function(b) {
        var ay = this._y, ah = this._h;
        var by = b._y, bh = b._h;

        if ( ah < 0 ) ay += ah, ah = -ah;
        if ( bh < 0 ) by += bh, bh = -bh;

        if ( ay + ah < by ) return cute.toInt(by-(ay+ah));
        if ( by + bh < ay ) return cute.toInt(ay-(by+bh));

        return 0;
    }

    Area.prototype.distance = function(b) {
        var ax = this._x, ay = this._y, aw = this._w, ah = this._h;
        var bx = b._x, by = b._y, bw = b._w, bh = b._h;

        this.normalise();
        b.normalise();

        if (a.overlap(b))
            return 0;

        if (ay+ah < by)
        { if (bx+bw < ax)
            return cute.toInt(distance(bx+bw, by, ax, ay+ah));
          if (bx > ax+aw)
              return cute.toInt(distance(ax+aw, ay+ah, bx, by));
          return cute.toInt(by-(ay+ah));
        }

        if (by+bh < ay)
        { if (ax+aw < bx)
            return cute.toInt(distance(ax+aw, ay, bx, by+bh));
          if (bx+bw < ax)
              return cute.toInt(distance(bx+bw, by+bh, ax, ay));
          return cute.toInt(ay-(by+bh));
        }

        if (ax+aw < bx)
            return cute.toInt(bx-(ax+aw));

        return cute.toInt(ax-(bx+bw));

        return 0;
    }

    Area.prototype.center = function(p) {
        if (p === undefined)
            return new cute.Point(this._x + this._w/2, this._y + this._h/2);
        this._x = p._x - this._w/2;
        this._y = p._y - this._h/2;

        return this;
    }

    Area.prototype.left_side = function(p) {
        if (this._w >= 0)
            return this._x;
        return this._x + this._w;
    }

    Area.prototype.right_side = function(p) {
        if (this._w >= 0)
            return this._x + this._w;
        return this._x;
    }

    Area.prototype.top_side = function(p) {
        if (this._h >= 0)
            return this._y;
        return this._y + this._h;
    }

    Area.prototype.bottom_side = function(p) {
        if (this._h >= 0)
            return this._y + this._h;
        return this._y;
    }

    Area.prototype.corner = function(p) {
        if (p === undefined)
            return new cute.Point(this._x + this._w, this._y + this._h);
        var w, h;

        w = p._x - this._x;
        w += (w>=0 ? 1 : -1);
        h = p._y - this._y;
        h += (h>=0 ? 1 : -1);

        this._w = cute.toInt(w);
        this._h = cute.toInt(h);

        return this;
    }

    Area.prototype.set = function(x, y, w, h) {
        if (x) this._x = x;
        if (y) this._y = y;
        if (w) this._w = w;
        if (h) this._h = h;

        return this;
    }

    Area.prototype.increase = function(n) {
        var ax = this._x, ay = this._y, aw = this._w, ah = this._h;
        var d = cute.toInt(n);

        if (aw >= 0)
            aw += 2*d, ax -= d;
        else
            aw -= 2*d, ax += d;

        if (ah >= 0)
            ah += 2*d, ay -= d;
        else
            ah -= 2*d, ay += d;

        this._x = cute.toInt(ax);
        this._y = cute.toInt(ay);
        this._w = cute.toInt(aw);
        this._h = cute.toInt(ah);

        return this;
    }

    Area.prototype.decrease = function(n) {
        return this.increase(-n);
    }

    function orientation_area(w, h) {
        return (w>=0 ? (h >=0 ? "north_west" : "south_west")
                : (h>=0 ? "north_east" : "south_east"));
    };

}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	point.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Point
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2012, 2013  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		03/02/13  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.Point
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Point = cute.Point = function(x, y) {
        this._x = (x ? cute.toInt(x) : 0);
        this._y = (y ? cute.toInt(y) : 0);

        return this;
    }

    Point.prototype.x = function(v0) { if (v0 === undefined) return this._x; this._x = v0; return this; };
    Point.prototype.y = function(v0) { if (v0 === undefined) return this._y; this._y = v0; return this; };

    Point.prototype.toString = function() {
        var pt = this;
        var c = ", ";

        return 'Point(' + pt._x + c + pt._y + ')';
    }

    Point.prototype.equal = function(p) {
        return this._x === p._x && this._y === p._y;
    }

    Point.prototype.copy = function(p) {
        if (p) {
            this._x = p._x;
            this._y = p._y;
            return this;
        }
        return new Point(this._x, this._y);
    }

    Point.prototype.set = function(x, y) {
        if (x) this._x = cute.toInt(x);
        if (y) this._y = cute.toInt(y);

        return this;
    }

    Point.prototype.offset = function(x, y) {
        this._x += cute.toInt(x);
        this._y += cute.toInt(y);

        return this;
    }

    Point.prototype.difference = function(p) {
        return new Point(this._x - p._x, this._y - p._y);
    }

    Point.prototype.distance = function(p) {
        return geo.distance(this._x, this._y, p._x, p._y);
    }

    Point.prototype.mid_point = function(p) {
        return new Point(cute.toInt((this._x+p._x+1)/2),
                              cute.toInt((this._y+p._y+1)/2));
    }

    Point.prototype.plus = function(p) {
        this._x += p._x;
        this._y += p._y;
    }

    Point.prototype.minus = function(p) {
        this._x -= p._x;
        this._y -= p._y;
    }

    Point.prototype.mirror = function(p) {
        var mx = 0, my = 0;

        if (p !== undefined)
            mx = p._x, my = p._y;

        this._x = mx - p._x;
        this._y = my - p._y;

        return this;
    }
}).call(this);
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
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	graphical.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Graphical
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2012-2014  University of Twente
 *  
 *  Historh	06/07/12  (Created)
 *  		17/02/14  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Graphical
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Graphical = cute.Graphical = function(x, y, w, h) {
        this._id = undefined;
        this._class_name = undefined;

        this._figure = null;
        this._area = new cute.Area(x, y, w, h);
        this._displayed = false;
        this._pen = 1;
        this._colour = 'black';
        this._fill_pattern = undefined;
        this._handles = [];
        this._connections = [];
        this._name = undefined;
        this._selected = false;
        this._inverted = false;
        this._active = true;
        this._cursor = undefined;
        this._request_compute = true;
        this._layout_manager = null;

        this._recognisers = [];

        return this;
    }

    Graphical.prototype.toString = function() {
        var comma = ", ";

        return "graphical(" + this._id + comma + this._name + ")";
    }

    Graphical.prototype.print_tree = function(depth) {
        var gr = this;
        var tab = '';

        if (depth === undefined)
            depth = 0;

        for (var d=0; d<depth; d++)
            tab += '  ';
        ist.printf(tab + gr);

        return gr;
    }

    Graphical.prototype.free = function() {
        return this.unlink();
    }

    Graphical.prototype.unlink = function() {
        var gr = this;

        gr.disconnect();
        gr.figure(null);

        return gr;
    }

    Graphical.prototype.disconnect = function() {
//        printf('Graphical.disconnect: not implemented');	// TBD
    }

    Graphical.prototype.id = function(id) {
        if (id) {
            this._id = id;
            return this;
        }
        return this._id;
    }

    Graphical.prototype.class_name = function(name) {
        var gr = this;

        if (name === undefined)
            return gr._class_name;
        gr._class_name = name;

        return gr;
    }

    Graphical.prototype.name = function(name) {
        if (name) {
            this._name = name;
            return this;
        }
        return this._name;
    }

    Graphical.prototype.colour = function(col) {
        var gr = this;

        if (col) {
            if (gr._colour != col) {
                gr._colour = col;
                gr.request_compute();
            }
            return gr;
        }
        return gr._colour;
    }

    Graphical.prototype.fill_pattern = function(pat) {
        if (pat) {
            if (this._fill_pattern != pat) {
                this._fill_pattern = pat;
                this.request_compute(true);
            }
            return this;
        }
        return this._fill_pattern;
    }

    Graphical.prototype.pen = function(pen) {
        var gr = this;

        if (pen === undefined)
            return gr._pen;
        if (gr._pen !== pen) {
            gr._pen = pen;
            gr.request_compute();
        }
        return gr;
    }


    /** Shake graphical for a certain duration.
     *
     *  @param {xd} Amount to shake in the x direction (10 is reasonable)
     *  @param {yd} Amount to shake in the y direction (0)
     *  @param {interval} Number of milliseconds between moves (60)
     *  @param {duration} Total duration (milliseconds) of the shake (1000)
     *  @param {done} Function to call when shake is finished, gr is passed
     */
    Graphical.prototype.shake = function(xd, yd, interval, duration, done) {
        var gr = this;

        setTimeout(function()
                   { shake_gr(gr, xd, yd, 1, interval, duration-interval, done);},
                   interval);
    }

    function shake_gr(gr, xd, yd, state, interval, duration, done) {
        var canvas = gr.device();
        var x, y;

        if ((state % 4) === 1 || (state % 4) === 0) {
            x = -xd;
            y = -yd;
        } else {
            x = xd;
            y = yd;
        }

        gr.relative_move_xy(x, y);
        canvas.render();

        if (duration < interval) {
            if (typeof(done) === 'function')
                done(gr);
            return;
        }
        setTimeout(function()
                   { shake_gr(gr, xd, yd, state+1, interval, duration-interval, done);},
                   interval);
    }

    Graphical.prototype.copy = function(gr) {
        var gr1, gr2;

        if (gr)
            gr1 = this, gr2 = gr;
        else
            gr1 = new Graphical(), gr2 = this;
        gr1._area = gr2._area.copy();
        gr1._colour = gr2._colour;
        gr1._cursor = gr2._cursor;
        gr1._displayed = gr2._displayed;
        gr1._handles = gr2._handles;
        gr1._inverted = gr2._inverted;
        gr1._name = gr2._name;
        gr1._pen = gr2._pen;
        gr1._selected = gr2._selected;

        return gr1;
    }

    Graphical.prototype.device = function() {
        var gr = this;

        while (gr._figure) {
            if (gr._figure instanceof cute.Device)
                return gr._figure;
            gr = gr._figure;
        }
        return false;
    }

    Graphical.prototype.figure = function(f) {
        var gr = this;

        if (f === undefined)
            return gr._figure;

        if (gr._figure === f)
            return gr;
        if (gr._figure)
            gr._figure.erase(gr);
        if (f)
            f.append(gr);

        return gr;
    }

    Graphical.prototype.displayed = function(val) {
        var gr = this;

        if (gr._displayed !== val) {
            if (val)
                gr._displayed = true;
            if (gr._figure)
                gr._figure.displayed_graphical(gr, val);
            if (val === false)
                gr._displayed = val;
        }
        return gr;
    }

    Graphical.prototype.is_displayed = function(f) {
        var gr = this;

        while (gr) {
            if (gr._displayed && gr._figure === f)
                return true;
            if (gr._displayed === false)
                return false;
            gr = gr._figure;
        }

        return f === undefined;
    }


    Graphical.prototype.common_figure = function(gr2) {
        var gr = this;
        var f1 = gr._figure;
        var f2 = gr2._figure;

        if (f1 == f2)
        { if (f1)
            return f1;
          return null;
        }

        if (f2 == null)
            return null;
        while (f1 != null && f1._level > f2._level)
            f1 = f1._figure;

        if (f1 == null)
            return null;
        while (f2 != null && f2._level > f1._level)
            f2 = f2._figure;

        while (f1 != null && f2 != null)
        { if (f1 == f2)
            return f1;
          f1 = f1._figure;
          f2 = f2._figure;
        }

        return null;
    }

    Graphical.prototype.request_compute = function(val) {
        var gr = this;

        if (gr._request_compute && val === undefined)
            return gr;
        if (val === false) {
            gr._request_compute = false;
            return gr;
        }
        gr._request_compute = true;
        if (gr._request_compute && gr._figure)
            gr._figure.request_compute();
        return gr;
    }

    Graphical.prototype.block_compute = function() {
        this._blocked_compute = this._request_compute;
        this._request_compute = false;
    }

    Graphical.prototype.unblock_compute = function() {
        this._request_compute = this._blocked_compute;
    }

    Graphical.prototype.Compute = function() { // Internal
        var gr = this;

        if (gr._inside_compute === true) {
            if (gr instanceof cute.Figure)
                gr.compute_bounding_box();
            return gr;
        }

        if (gr._request_compute) {
            gr._inside_compute = true;
            gr.compute();
            gr._request_compute = false;
            gr._inside_compute = false;
        }

        return gr;
    }

    Graphical.prototype.compute = function() {
        var gr = this;

        gr._request_compute = false;

        return gr;
    }

    Graphical.prototype.hide = function(gr2) {
        var gr1 = this;

        if (gr1._figure && (gr2 === undefined || gr2._figure === gr1._figure))
        { gr1._figure.hide(gr1, gr2);
          gr1.update_hide_expose_connections();
        }

        return this;
    }

    Graphical.prototype.expose = function(gr2) {
        var gr1 = this;

        if (gr1._figure && (gr2 === undefined || gr2._figure === gr1._figure))
        { gr1._figure.expose(gr1, gr2);
          gr1.update_hide_expose_connections();
        }

        return this;
    }

    Graphical.prototype.swap = function(gr2) {
        var gr1 = this;

        if (gr1._figure == gr2._figure && gr1._figure)
            gr1._figure.swap_graphicals(gr1, gr2);

        return this;
    }


    /*------------------------------------------------------------
     *  Geometry
     *------------------------------------------------------------*/

    Graphical.prototype.set = function(x, y, w, h) {
        return this.geometry(x, y, w, h);
    }

    Graphical.prototype.geometry = function(x, y, w, h) {
        var a = this._area;
        var changed = false;

        if ( (x && a._x != x)
            || (y && a._y != y)
            || (w && a._w != w)
            || (h && a._h != h))
            changed = true;

        if (x) a._x = x;
        if (y) a._y = y;
        if (w) a._w = w;
        if (h) a._h = h;

        if (changed)
            this.changed_area(x, y, w, h);
        return this;
    }

    Graphical.prototype.area = function(a) {
        var gr = this;

        if (a)
            return gr.set(a._x, a._y, a._w, a._h);
        gr.Compute();

        return gr._area;
    }

    Graphical.prototype.x = function(x) {
        var gr = this;

        if (x === undefined) {
            gr.Compute();
            return gr._area._x;
        }

        return gr.set(a._x);
    }

    Graphical.prototype.y = function(y) {
        var gr = this;

        if (y)
            return gr.set(undefined, a._y);
        gr.Compute();

        return gr._area._y;
    }

    Graphical.prototype.width = function(w) {
        var gr = this;

        if (w === undefined) {
            gr.Compute();
            return gr._area._w;
        }

        return gr.set(undefined, undefined, w);
    }

    Graphical.prototype.height = function(h) {
        var gr = this;

        if (h === undefined) {
            gr.Compute();
            return gr._area._h;
        }

        return gr.set(undefined, undefined, undefined, h);
    }

    Graphical.prototype.position = function(p) {
        var gr = this;

        if (p === undefined)
            return new cute.Point(gr._x, gr._y);

        gr.Compute();
        if (p)
            return gr.set(p._x, p._y);
    }

    Graphical.prototype.size = function(s) {
        var gr = this;

        if (s)
            return gr.set(undefined, undefined, s._w, s._h);
        gr.Compute();

        return new cute.Size(s._w, s._h);
    }

    Graphical.prototype.center = function(p) {
        var gr = this;

        if (p === undefined)
            return new cute.Point(gr._area._x + gr._area._w/2,
                                  gr._area._y + gr._area._h/2);
        gr.Compute();
        return gr.set(p._x - gr._area._w / 2, p._y - gr._area._h / 2);
    }

    Graphical.prototype.set_corner = function(x, y) {
        var gr = this;
        var a = gr._area;

        if (x === undefined)
            x = a._x + a._w;
        if (y === undefined)
            y = a._y + a._h;

        return gr.set(undefined, undefined, x-a._x, y-a._y);
    }

    Graphical.prototype.corner_x = function(x) {
        return this.set_corner(p._x);
    }

    Graphical.prototype.corner_y = function(y) {
        return this.set_corner(undefined, p._y);
    }

    Graphical.prototype.center_x = function(c) {
        if (c === undefined)
            return this._area._x + this._area._w / 2;
        this.Compute();
        return this.set(c + this._area._w / 2);
    }

    Graphical.prototype.center_y = function(c) {
        if (c === undefined)
            return this._area._y + this._area._h / 2;
        this.Compute();
        return this.set(c + this._area._h / 2);
    }

    Graphical.prototype.relative_move = function(p) {
        this.Compute();
        return this.set(this._area._x + p._x, this._area._y + p._y);
    }

    Graphical.prototype.relative_move_xy = function(x, y) {
        this.Compute();
        return this.set(this._area._x + x, this._area._y + y);
    }

    Graphical.prototype.relative_size_wh = function(w, h) {
        this.Compute();
        return this.set(this._area._w + w, this._area._h + h);
    }

    Graphical.prototype.rotate = function(degrees) {
        ist.printf('Graphical.rotate: not implemented');
    }

    Graphical.prototype.normalise = function() {
        this._area.orientation("north_west");
        return this;
    }

    Graphical.prototype.orientation = function(orient) {
        if (orient === undefined)
            return this._area.orientation();

        if (this instanceof cute.Box || // TBD -- why only these
            this instanceof cute.Circle ||
            this instanceof cute.Ellipse)
            this._area.orientation(orientation);
        return this;
    }

    Graphical.prototype.displayed_cursor = function() {
        return this._cursor;
    }

    Graphical.prototype.reparent = function() {
        var gr = this;
        var cons = gr._connections;

        for (var i=0; i<cons.length; i++)
            cons[i].update_figure();
        return gr;
    }

    Graphical.prototype.sub = function(sub) {
        while (sub)
        { if (this === sub)
            return true;
          sub = this._figure;
        }
        return false;
    }

    Graphical.prototype.update_connections = function(level) {
        var conns = this._connections;

        for (var i=0; i<conns.length; i++) {
            var c = conns[i];

            if (c._figure && c._figure._level <= level)
                Graphical.prototype.request_compute.call(c);
        }

        return this;
    }

    Graphical.prototype.changed_area = function(x, y, w, h) {
        var gr = this;

        if (gr._figure && gr._displayed) {
            var f = gr._figure;

            f.request_compute();
            gr.update_connections(f._level);
        }
    //  if (gr._has_constraints) gr.update_constraints();
    }


    Graphical.prototype.absolute_xy = function(f) {
        var gr = this;
        var x, y;

        gr.Compute();
        x = gr._area._x;
        y = gr._area._y;

        while (gr._figure && gr._figure != f) {
            x += gr._figure._offset._x;
            y += gr._figure._offset._y;
            gr = gr._figure;
        }

        return {x: x, y: y};
    }

    /*  Return absolute area of this graphical.
     */
    Graphical.prototype.absolute_area = function() {
        var gr = this;
        var abs = gr.absolute_xy();

        return new cute.Area(abs.x, abs.y, gr._area._w, gr._area._h);
    }

    Graphical.prototype.attach_connection = function(c) {
        this._connections.push(c);
        return this;
    }

    Graphical.prototype.detach_connection = function(c) {
        var gr = this;

        gr._connections.delete_element(c);
        return gr;
    }

    Graphical.prototype.get_handle = function(name) {
        var hdls = this._handles;
        for (var i=0; i<hdls.length; i++) {
            if (hdls[i]._name == name)
                return hdls[i];
        }
        return false;
    }

    Graphical.prototype.handle = function(h) {
        this._handles.push(h);
        return this;
    }


    /*------------------------------------------------------------
     *  Event handling
     *------------------------------------------------------------*/

    Graphical.prototype.event = function(ev, x, y) {
        var gr = this;

        ev._receiver = gr;
        ev._receiver_x = x;
        ev._receiver_y = y;
        if (gr._active) {
            for (var i=0; i<gr._recognisers.length; i++)
                if (gr._recognisers[i].event(ev, gr))
                    return true;
        }
        return false;
    }

    Graphical.prototype.pointed_objects = function(x, y, array) {
        var gr = this;

        if (gr._displayed && gr.in_event_area(x,y))
            array.push(gr);
        return gr;
    }

    Graphical.prototype.in_event_area = function(x, y) {
        var gr = this;
        var a = gr._area;
        var ax, ay, aw, ah;
        var evtol = 5;
        var c = ", ";

    //  gr.compute();
        a.normalise();
        ax = a._x, ay = a._y, aw = a._w, ah = a._h;
        if (aw < evtol) ax -= (evtol-aw)/2, aw = evtol;
        if (ah < evtol) ay -= (evtol-ah)/2, ah = evtol;

        if (x >= ax && x <= ax + aw && y >= ay && y <= ay + ah) {
            return true;
        }
        return false;
    }

    Graphical.prototype.recogniser = function(r) {
        this._recognisers.push(r);
        return this;
    }

    Graphical.prototype.append_recogniser = function(r) {
        this._recognisers.push(r);
        return this;
    }

    Graphical.prototype.prepend_recogniser = function(r) {
        this._recognisers.unshift(r);
        return this;
    }

    Graphical.prototype.delete_recognisers = function() {
        this._recognisers = [];
        return this;
    }

    Graphical.prototype.recognisers = function() {
        return this._recognisers;
    }

    Graphical.prototype.offset_figure = function() {
        var gr = this;
        var x = 0, y = 0;
        var fig = gr._figure;

        while (fig._figure) {
            var pt = fig._offset;

            x += pt._x;
            y += pt._y;
            fig = fig._figure;
        }
        return {x: x, y: y};
    }
}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	figure.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Figure
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012-2014  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		10/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Figure
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Figure = cute.Figure = function() {
        var fig = this;

        cute.Graphical.call(fig);

        fig._level = 0;
        fig._offset = new cute.Point(0,0);
        fig._graphicals = [];
        fig._bad_bounding_box = false;
//        fig._recompute = [];
        fig._background = null;
        fig._pen = 0;
        fig._border = 0;
        fig._radius = 0;
        fig._grid = undefined;

        fig.request_compute(true);

        return fig;
    }

    ist.extend(Figure, cute.Graphical);

    Figure.prototype.toString = function() {
        var fig = this;
        var fx = fig._offset ? fig._offset._x : 'undefined';
        var fy = fig._offset ? fig._offset._y : 'undefined';

        return 'Figure(' + fx + ' ' + fy + ') [' + fig._area + ']';
    }

    Figure.prototype.print_tree = function(depth) {
        var fig = this;
        var tab = '';
        var display;

        depth = (depth === undefined ? 0 : depth);

        for (var d=0; d<depth; d++)
            tab += '  ';

        if (fig._displayed)
            display = '';
        else
            display = '*hidden*';

        if (fig.pp)
            ist.printf(tab + display + ' [' + fig.area() + '] ' + fig + ' ' + fig.pp());
        else
            ist.printf(tab + display + ' [' + fig.area() + '] ' + fig);

        for (var i=0; i<fig._graphicals.length; i++)
            fig._graphicals[i].print_tree(depth+1);

        return fig;
    }

    Figure.prototype.unlink = function() {
        var f = this;
        var grs = f._graphicals;

        for (var i=0; i<grs.length; i++)
            grs[i].figure(null);
        cute.Graphical.prototype.unlink.call(f);

        return null;
    }


    /*------------------------------------------------------------
     *  Repaint management
     *------------------------------------------------------------*/

    Figure.prototype.request_compute = function(val) {
        var f = this;

        f._bad_bounding_box = true;
        cute.Graphical.prototype.request_compute.call(f, val);

        return f;
    }

    Figure.prototype.compute_graphicals = function() {
        var f = this;
//        var a = f._recompute;

/*
        if (a === undefined) {	// TBD - Why?
            return f;
        }

        for (var i=0; i<a.length; i++) {
            var gr = a[i];
            if (gr)
                gr.Compute();
        }
        f._recompute = [];
*/

        return f;
    }

    /*------------------------------------------------------------
     *  Display / Erase
     *------------------------------------------------------------*/

    Figure.prototype.clear = function(how) {
        var f = this;
        var grs = new Array();

        for (var i=0; i<f._graphicals.length; i++)
            grs.push(f._graphicals[i]);

        if (how === 'free') {
            for (var i=0; i<grs.length; i++)
                grs[i].free();
        }
        else if (how === 'erase') {
            for (var i=0; i<grs,length; i++)
                if (grs[i]) f.erase(grs[i]);
        }

        f._graphicals = [];

        return f;
    }

    Figure.prototype.free = function() {
        var f = this;

        f.clear('free');
        f.unlink();

        return f;
    }

    Figure.prototype.display = function(gr, pos) {
        var f = this;

        if (pos)
            gr.set(pos._x, pos._y, undefined, undefined);
        gr.figure(f);
        gr.displayed(true);

        return f;
    }

    Figure.prototype.append = function(gr) {
        var f = this;

        if (f._graphicals === undefined) // TBD -- why
            f._graphicals = [];

/*
        if (f._recompute === undefined)	// TBD -- why?
            f._recompute = [];
*/

        f._graphicals.push(gr);
        gr._figure = f;
        if (!gr._request_compute) {
//            f._recompute.push(gr);
            if (!f._request_compute)
                f.request_compute();
        }
        if (gr._displayed)
            f.displayed_graphical(gr, true);
        gr.reparent();

        return f;
    }


    Figure.prototype.erase = function(gr) {
        var f = this;

        if (gr._figure === f) {
            var i;

            if (gr._displayed)
                f.displayed_graphical(gr, false);
//            f._recompute.delete_element(gr);
/*            for (var i=0; i<f._recompute.length; i) {
                if (f._recompute[i] === gr) {
                    f._recompute.splice(i, 1);
                    continue;
                }
                i++;
            }
*/
            gr._figure = null;
            f._graphicals.delete_element(gr);
            for (var i=0; i<f._graphicals.length; i) {
                if (f._graphicals[i] === gr) {
                    f._graphicals.splice(i, 1);
                    continue;
                }
                i++;
            }

            gr.reparent();
        }
        return f;
    }

    Figure.prototype.displayed_graphical = function(gr, val) {
        var f = this;
    //  var old = gr._displayed;

        gr._displayed = val;
        if (gr instanceof Figure)
            Figure.prototype.update_connections.call(gr, f._level);
        else
            gr.update_connections(f._level);

        f.request_compute();
    //  gr._displayed = old;

        return f;
    }


    Figure.prototype.expose = function(gr, gr2) {
        var f = this;

        if (gr._figure !== f || (gr2 && gr2._figure !== f))
            return f;
        if (gr2) {
            f._graphicals.delete_element(gr);
            f._graphicals.push(gr);
        } else
            f._graphicals = move_after_array(f._graphicals, gr, gr2);
        f.request_compute();

        return f;
    }


    Figure.prototype.hide = function(gr, gr2) {
        var f = this;

        if (gr._figure !== f || (gr2 && gr2._figure !== f))
            return f;
        if (gr2) {
            f._graphicals.delete_element(gr);
            f._graphicals = f._graphicals.splice(0, 0, gr);
        } else
            f._graphicals = move_after_array(f._graphicals, gr, gr2);
        f.request_compute();

        return f;
    }

    Figure.prototype.graphicals = function() {
        return this._graphicals;
    }

    /*------------------------------------------------------------
     *  Selection
     *------------------------------------------------------------*/

    Figure.prototype.offset = function() {
        var fig = this;

        return new cute.Point(fig._offset._x, fig._offset._y);
    }

    /*------------------------------------------------------------
     *  Event handling
     *------------------------------------------------------------*/

    Figure.prototype.event = function(ev, ex, ey) {
        var f = this;

        if (f._active) {
            var x = ex - f._offset._x;
            var y = ey - f._offset._y;
            var grs = f._graphicals;

            for (var i=grs.length; i>0; i--) {
                var gr = grs[i-1];

                if (gr._displayed && gr.in_event_area(x,y) && gr.event(ev,x,y))
                    return true;
            }
            return cute.Graphical.prototype.event.call(f, ev, x, y);
        }

        return false;
    }

    Figure.prototype.pointed_objects = function(ex, ey, array) {
        var f = this;

        if (f._active && f.in_event_area(ex, ey)) {
            var x = ex - f._offset._x;
            var y = ey - f._offset._y;
            var grs = f._graphicals;

            array.push(f);

            for (var i=grs.length; i>0; i--) {
                var gr = grs[i-1];

                gr.pointed_objects(x, y, array);
            }
        }

        return f;
    }


    /*------------------------------------------------------------
     *  Membership
     *------------------------------------------------------------*/

    Figure.prototype.member = function(name) {
        var fig = this;
        var grs = fig._graphicals;

        for (var i=0; i<grs.length; i++) {
            if (grs[i]._name == name)
                return grs[i];
        }

        return false;
    }


    /*------------------------------------------------------------
     *  Geometry
     *------------------------------------------------------------*/

    Figure.prototype.update_connections = function(level) {
        var f = this;
        var grs = f._graphicals;

        for (var i=0; i<grs.length; i++)
            grs[i].update_connections(level);
        cute.Graphical.prototype.update_connections.call(f, level);
        return f;
    }

    Figure.prototype.geometry = function(x, y, w, h) {
        var f = this;
        var a = f._area;

        cute.Graphical.prototype.Compute.call(f);

        if (!x) x = a._x;
        if (!y) y = a._y;

        if (x != a._x || y != a._y) {
            var dx = x - a._x;
            var dy = y - a._y;
            var ax = a._x, ay = a._y, aw = a._w, ah = a._h;

            if (!f._offset) {
                ist.printf('offset for ' + f + ' undefined');
                f._offset = new cute.Point(0,0);
            }
            f._offset._x = f._offset._x + dx;
            f._offset._y = f._offset._y + dy;
            a._x = x;
            a._y = y;

            if (ax != a._x || ay != a._y || aw != a._w || ah != a._h)
                f.changed_area(ax, ay, aw, ah);

            f.update_connections(f._level-1);
        }

        return this;
    }


    Figure.prototype.compute = function() {
        var f = this;

        if (f._request_compute) {
            if (f._pen !== 0 || f._background) {
                f.compute_graphicals();
                f.compute_bounding_box();
            } else {
                f.compute_graphicals();
                f.compute_bounding_box();
            }
            f._request_compute = false;
        }

        return f;
    }


    Figure.prototype.background = function(bg) {
        var f = this;

        if (bg === undefined)
            return f._background;

        if (f._background !== bg) {
            f._background = bg;
            f.request_compute();
        }
        return f;
    }

    Figure.prototype.radius = function(radius) {
        var f = this;

        if (radius) {
            if (f._radius !== radius) {
                f._radius = radius;
                f.request_compute(true);
            }
            return this;
        }
        return f._radius;
    }


    Figure.prototype.border = function(border) {
        var f = this;

        if (border) {
            if (f._border !== border) {
                f._border = border;
                f.request_compute();
            }
            return this;
        }
        return f._border;
    }


    Figure.prototype.update_bounding_box = function() {
        var f = this;
        var a = f._area;
        var grs = f._graphicals;
        var ax = a._x, ay = a._y, aw = a._w, ah = a._h;

        a.clear();
        for (var i=0; i<grs.length; i++) {
            var gr = grs[i];

            if (gr._displayed) {
                gr.Compute();
                a.union_normalised(gr._area);
            }
        }
        a.relative_move(f._offset);

        return (ax !== a._x || ay !== a._y || aw !== a._w || ah !== a._h);
    }

    Figure.prototype.compute_bounding_box = function() {
        var f = this;

        if (f._bad_bounding_box) {
            var a = f._area;
            var ox = a._x, oy = a._y, ow = a._w, oh = a._h;

            if (f.update_bounding_box()) {
                if (f._figure) {
                    f._figure.request_compute();
                    cute.Graphical.prototype.update_connections.call(f, f._level-1);
                }
            }

            f._bad_bounding_box = false;

            if (f._border)
                f._area.increase(f._border);
            if (ox !== a._x || oy !== a._y || ow !== a._w || oh !== a._h)
                f.changed_area(ox, oy, ow, oh);
        }
        return f;
    }


    Figure.prototype.grid = function(gap) {
        var fig = this;

        if (gap === undefined)
            return fig._grid;
        fig._grid = gap;

        return fig;
    }

    /*  Draw a grid (for debugging of coordinates).
     */
    Figure.prototype.draw_grid = function(ctx, gap) {
        var fig = this;
        var canvas = fig.device();
        var w = canvas.width();
        var h = canvas.height();

        for (var x=0; x<w; x+=gap)
            for (var y=0; y<h; y+=gap) {
                ctx.line(0, y, w, y);
                ctx.line(x, 0, x, h);
            }

        return fig;
    }

    Figure.prototype.render_canvas = function(ctx, canvas) {
        var f = this;

        if (f._displayed === false) {
            return f;
        }

        var a = f._area;
        var ox = f._offset._x;
        var oy = f._offset._y;
        var x = f._area._x;
        var y = f._area._y;
        var grs = f._graphicals;
        var tx = x-ox;
        var ty = y-oy;
        var fill = false;
        var stroke = false;

        if (f._grid)
            f.draw_grid(ctx, f._grid);

        if (f._pen > 0) {
            ctx.lineWidth(f._pen);
            ctx.strokeStyle(f._colour);
            stroke = true;
        }
        if (f._background) {
            fill = true;
            ctx.fillStyle(f._background);
        }
        if (fill)
            ctx.fillRect(x, y, a._w, a._h);
        if (stroke)
            ctx.strokeRect(x, y, a._w, a._h);

        ctx.save();
        ctx.translate(ox, oy);

        for (var i=0; i<grs.length; i++) {
            var gr = grs[i];

            gr.Compute();
            if (gr._displayed)
                gr.render_canvas(ctx, canvas);
        }

        ctx.restore();

        return f;
    }
}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	device.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Device
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012, 2013, 2014  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		17/02/14  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Device
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Device = cute.Device = function() {
        cute.Figure.call(this);
        return this;
    }

    ist.extend(Device, cute.Figure);
}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	canvas.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Canvas
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012-2014  University of Twente
 *  
 *  Historh	04/07/12  (Created)
 *  		02/12/13  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Canvas
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Canvas = cute.Canvas = function(spec) {
        var canvas = this;
        var dom = null;
        var id = null;

        canvas._dom = null;
        canvas._context = null;

        cute.Device.call(canvas);

        if (typeof(spec) === 'string')
            id = spec;
        else
            id = spec.id;

        if (id) {
            //  Remove initial # when present
            if (id.charAt(0) === '#') {
                id = id.substring(1, id.length);
            }
            dom = document.getElementById(id);
            if (!dom) {
                { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('Warning: cute.Canvas: "' + id + '" not a canvas'); } else console.log('Warning: cute.Canvas: "' + id + '" not a canvas'); };
                return null;
            }
            canvas._canvas = dom;
            canvas._context = new cute.Context(canvas._canvas.getContext('2d'), canvas);
            canvas.id(id);
        } else {
            if (spec && spec.dummy) {
                dom = 'dummy';
                canvas._context = new cute.Context('dummy', canvas).dummy(true);
            } else
                if (spec) {
                    dom = spec.dom;
                    canvas._canvas = dom;
                    canvas._context = new cute.Context(dom.getContext('2d'), canvas);
                }
        }

        if (!dom || !canvas._context) {
            { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('Error: cute.Canvas: ' + JSON.stringify(spec,null,4) + ' not a canvas'); } else console.log('Error: cute.Canvas: ' + JSON.stringify(spec,null,4) + ' not a canvas'); };
            return null;
        }

        if (!canvas._context.dummy()) {
            canvas._area = new cute.Area(0, 0, canvas._canvas.width, canvas._canvas.height);
            canvas._width = canvas._canvas.width;
            canvas._height = canvas._canvas.height;
            canvas._modified = false;
            cute.ctx = canvas._context;

            canvas._gesture = undefined;

            if (spec.ignore_events !== true) {
                dom.onmousedown = function(ev) { canvas.mouse_event(ev, 'mouse_down'); };
                dom.onmouseup = function(ev) { canvas.mouse_event(ev, 'mouse_up'); };
                dom.onmouseout = function(ev) { canvas.mouse_event(ev, 'mouse_out'); };
                dom.onmousemove = function(ev) { canvas.mouse_event(ev, 'mouse_move'); };

                dom.ontouchstart = function(ev) { canvas.touch_event(ev, 'touch_start'); };
                dom.ontouchmove = function(ev) { canvas.touch_event(ev, 'touch_move'); };
                dom.ontouchend = function(ev) { canvas.touch_event(ev, 'touch_end'); };
                dom.ontouchleave = function(ev) { canvas.touch_event(ev, 'touch_out'); };
                dom.ontouchcancel = function(ev) { canvas.touch_event(ev, 'touch_cancel'); };
            }
        }

        return canvas;
    }

    ist.extend(Canvas, cute.Device);

    Canvas.prototype.context = function() { return this._context; };

    Canvas.prototype.clear = function() {
        cute.Figure.prototype.clear.call(this);
    }

    Canvas.prototype.is_a_canvas = function() {
        return (this._dom && this._context);
    }

    Canvas.prototype.key_event = function(ev, type) {
        var canvas = this;

        { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('key event ' + type); } else console.log('key event ' + type); };
        if (type === 'key_up') {
            { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('resetting canvas'); } else console.log('resetting canvas'); };
            canvas.reset();
        }
        return canvas;
    }


    /** Override graphical width to return the real width of the canvas.
     */
    Canvas.prototype.width = function() {
        return this._canvas.width;
    }

    Canvas.prototype.height = function() {
        return this._canvas.height;
    }

    /*  Canvas has been modified. 
        Schedule a render as soon as possible.
     */
    Canvas.prototype.modified = function() {
        var canvas = this;

        if (canvas._modified)
            return;
        canvas._modified = true;
        setTimeout(function () { canvas.render(); }, 0);
    }


    /**  Render the content of the canvas. This is effectively a complete redraw.
     *
     *   Options are:
     *       debug: [false],     // Debug information
     *       clear: [true],      // Clear screen before drawing
     *       scale: [1],         // Scale, 0.5 image is half in both x- and y direction
     *       offset: {x: 0, y: 0}// Offset
     */
    Canvas.prototype.render = function(opts) {
        var canvas = this;
        var opts = opts || {};
        var ctx = canvas._context;
        var grs = canvas.graphicals();
        var ox = (opts.offset ? opts.offset.x : canvas._offset.x());
        var oy = (opts.offset ? opts.offset.y : canvas._offset.y());

        canvas._modified = false;

        if (opts.debug)
            { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('[Cute] Canvas render '); } else console.log('[Cute] Canvas render '); };

            /* Clear the original size of the DOM canvas.
               The canvas._area changes dynamically.
             */
        if (opts.clear !== false) {
            if (opts.debug) {
                { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('clear ' + canvas._width + ' ' + canvas._height); } else console.log('clear ' + canvas._width + ' ' + canvas._height); };
                { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('ox / oy ' + ox + ' ' + oy); } else console.log('ox / oy ' + ox + ' ' + oy); };
            }
            ctx.clearRect(0, 0, canvas._width, canvas._height);
        }

        if (canvas._background) {
            ctx,fillStyle(canvas._background);
            ctxrect(0, 0, canvas._width, canvas._height);
            ctx.fill();
        }

        ctx.save();
        ctx.textBaseline('top');
        ctx.translate(ox, oy);

        if (opts.scale && opts.scale !== 1)
            ctx.scale(opts.scale, opts.scale);

        if (opts.debug) {
            { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('[] Rendering ' + grs.length + ' objects'); } else console.log('[] Rendering ' + grs.length + ' objects'); };
        }

        for (var i=0; i<grs.length; i++) {
            var gr = grs[i];

            gr.Compute();

            if (gr._displayed === false)
                continue;

            gr.render_canvas(ctx, canvas);
            if (opts.debug) {
                { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('  [Cute] ' + i + ' ' + gr); } else console.log('  [Cute] ' + i + ' ' + gr); };
                { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('         ' + gr._area); } else console.log('         ' + gr._area); };
            }
        }

        ctx.translate(-ox, -oy);
        ctx.restore();

        if (opts.debug)
            { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('[] Rendering finished'); } else console.log('[] Rendering finished'); };

/*
        printf('Checking for attributes added to context');
        for (var p in ctx) {
            if (p === '_ctx')
                continue;
            if (typeof(ctx[p]) !== 'function') {
                printf('  ' + p + ' = ' + ctx[p]);
            }
        }
*/
        return canvas;
    }

    Canvas.prototype.flash_colour = function(obj, colour, millis) {
        var c = this;
        var old = obj.colour();

        setTimeout(function() {
            obj.colour(colour);
            c.render();
        }, 0);
        setTimeout(function() {
            obj.colour(old);
            c.render();
        }, millis);
    }


    function relative_xy(event, c){
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = c._canvas;

        do {
            totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
            totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
        }
        while(currentElement = currentElement.offsetParent)

        canvasX = event.pageX - totalOffsetX;
        canvasY = event.pageY - totalOffsetY;

        return {x:canvasX, y:canvasY}
    }



    /*  Touch event.  For the time being we forward this as the corresponding
        mouse event.
     */
    Canvas.prototype.touch_event = function(ev, type) {
        var canvas = this;

        if (type == 'touch_start') return this.mouse_event(ev, 'mouse_down');
        if (type == 'touch_end') return this.mouse_event(ev, 'mouse_up');
        if (type == 'touch_move') return this.mouse_event(ev, 'mouse_move');
        if (type == 'touch_leave') return this.mouse_event(ev, 'mouse_out');
        if (type == 'touch_cancel') {
            if (canvas._gesture)
                canvas._gesture.cancel();
            canvas._gesture = undefined;
            return canvas;
        }
    }

    /*  Mouse event.  At the moment this can only deal with one gesture at a
        time.

        TBD -- When two events are physically close on the screen it could be that
        the decision on which gesture (e.g., move or click) has to be delayed
        until the next event comes in.
     */
    Canvas.prototype.mouse_event = function(ev, type) {
        var canvas = this;
        var coords = relative_xy(ev, canvas);
        var x = coords.x;
        var y = coords.y;
        var event = new cute.Event(ev, type, canvas, x, y, ev.timeStamp);
        var g = canvas._gesture;

        ev.preventDefault();

        if (type === 'mouse_down') { // find matching gesture
            if (g) {
                { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('THIS SHOULD NOT HAPPEN'); } else console.log('THIS SHOULD NOT HAPPEN'); };
                { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('  terminate ' + g + ' because of new mouse_down'); } else console.log('  terminate ' + g + ' because of new mouse_down'); };
                g.terminate(event);
            }
            canvas._gesture = undefined;
            canvas.event(event, x, y);
            canvas._gesture = event._gesture;
            if (canvas._gesture)
                g = canvas._gesture;
    //	ev.preventDefault();

            return canvas;
        }

        if (type === 'mouse_move') { // call .drag
            if (g) {
                event._gesture = g;
                g.drag(event);
                canvas._gesture = event._gesture;
    //	    ev.preventDefault();
            }
            return canvas;
        }

        if (type === 'mouse_up') { // call .terminate
            if (g) {
                event._gesture = g;
                g.terminate(event);
                canvas._gesture = undefined;
    //	    ev.preventDefault();
            }
            return canvas;
        }

        if (type === 'mouse_out') { // call .cancel
            if (g) {
                event._gesture = g;
                g.cancel(event);
                canvas._gesture = undefined;
    //	    ev.preventDefault();
            }
            return canvas;
        }
    }


    /*  Reset internal and visible state of the canvas.
     */
    Canvas.prototype.reset = function() {
        var canvas = this;
        var g = canvas._gesture;

        if (g) {
            canvas._gesture = undefined;
            g.cancel(); // TBD - sometimes fails
        }

        return canvas.render();
    }
}).call(this);
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
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	box.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Box
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		10/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.Box
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Box = cute.Box = function (w, h) {
        var b = this;

        cute.Graphical.call(b, 0,0,w,h);
        b._radius = 0;
        b._fill_pattern = undefined;
        b._stops = undefined;

        return this;
    }

    ist.extend(Box, cute.Graphical);

    Box.prototype.stops = function(stops) {
        var b = this;

        if (stops === undefined)
            return b._stops;

        if (b._stops != stops) {
            b._stops = stops;
            b.request_compute();
        }
        return b;
    }

    Box.prototype.render_canvas = function(ctx) {
        var b = this;
        var a = b._area;
        var x = a._x;
        var y = a._y;
        var w = a._w;
        var h = a._h;
        var fill = b._fill_pattern !== undefined;
        var stroke = b._pen > 0;
        var stops = b._stops !== undefined;
        var rounded = b._radius > 0;

        if (stops)
            ctx.gradientBox(x, y, w, h, b._stops);

        if (fill) {
            ctx.fillStyle(b._fill_pattern);
            ctx.fillRect(x, y, w, h);
        }

        if (stroke) {
            ctx.strokeStyle(b._colour);
            ctx.lineWidth(b._pen);
            if (rounded)
                ctx.roundedRect(x, y, w, h, b._radius, fill, stroke);
            else
                ctx.strokeRect(x, y, w, h);
        }

        return b;
    }

    Box.prototype.radius = function(r) {
        if (r) {
            if (r !== this._radius) {
                this._radius = r;
            }
            return this;
        }
        return this._radius;
    }

    Box.prototype.fill_pattern = function(img) {
        if (img) {
            if (img !== this._fill_pattern) {
                this._fill_pattern = img;
            }
            return this;
        }
        return this._fill_pattern;
    }

    Box.prototype.toString = function() {
        var b = this;
        var a = b._area;
        var name = b._name ? (b._name + ': ') : '';

        return name + 'Box(' + [a._x, a._y, a._w, a._h].join(', ') + ') ' +
            'pen(' + b._pen + ') ' +
            'colour(' + b._colour + ')';
    }
}).call(this);
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
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	line.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of the class Line
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2012, 2013  University of Twente
 *  
 *  History	04/07/12  (Created)
 *  		20/01/14  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Line
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;
    var geo = this.geo;

    var Line = cute.Line = function(x1, y1, x2, y2, arrows) {
        cute.Joint.call(this, 0, 0, 0, 0, arrows);

        this._start_x = (x1 ? cute.toInt(x1) : 0);
        this._start_y = (y1 ? cute.toInt(y1) : 0);
        this._end_x = (x2 ? cute.toInt(x2) : 0);
        this._end_y = (y2 ? cute.toInt(y2) : 0);
        this._arrows = arrows;

        return this;
    }

    ist.extend(Line, cute.Joint);

    Line.prototype.toString = function() {
        var ln = this;
        var c = ", ";
        return "cute.Line(" + ln._start_x + c + ln._start_y + c + ln._end_x + c + ln._end_y + ")";
    }

    Line.prototype.start_x = function(x) {
        var ln = this;

        if (x === undefined)
            return ln._start_x;

        if (x !== ln._start_x) {
            ln._start_x = x;
            ln.request_compute();
        }

        return ln;
    }

    Line.prototype.start_y = function(y) {
        var ln = this;

        if (y === undefined)
            return ln._start_y;

        if (y !== ln._start_y) {
            ln._start_y = y;
            ln.request_compute();
        }

        return ln;
    }


    Line.prototype.end_x = function(x) {
        var ln = this;

        if (x === undefined)
            return ln._end_x;

        if (x !== ln._end_x) {
            ln._end_x = x;
            ln.request_compute();
        }

        return ln;
    }

    Line.prototype.end_y = function(y) {
        var ln = this;

        if (y === undefined)
            return ln._end_y;

        if (y !== ln._end_y) {
            ln._end_y = y;
            ln.request_compute();
        }

        return ln;
    }


    Line.prototype.points = function(sx, sy, ex, ey) {
        var ln = this;

        if (sx !== undefined) ln._start_x = sx;
        if (sy !== undefined) ln._start_y = sy;
        if (ex !== undefined) ln._end_x = ex;
        if (ey !== undefined) ln._end_y = ey;

        return ln.request_compute();
    }

    Line.prototype.adjust_first_arrow = function() {
        var ln = this;

        if (ln._first_arrow) {
            ln._first_arrow.points(ln._start_x, ln._start_y, ln._end_x, ln._end_y);
            ln._first_arrow._displayed = true;
            ln._first_arrow.Compute();
            return true;
        }
        return false;
    }

    Line.prototype.adjust_second_arrow = function() {
        var ln = this;

        if (ln._second_arrow) {
            ln._second_arrow.points(ln._end_x, ln._end_y, ln._start_x, ln._start_y);
            ln._second_arrow._displayed = true;
            ln._second_arrow.Compute();
            return true;
        }
        return false;
    }

    Line.prototype.copy = function(l2) {
        var l1 = this;

        cute.Joint.prototype.copy(l1, l2);
        l1._start_x = l2._start_x;
        l1._start_y = l2._start_y;
        l1._end_x = l2._end_x;
        l1._end_y = l2._end_y;

        return l1;
    }

    Line.prototype.compute = function() {
        var ln = this;

        if (ln._request_compute) {
            var x1 = ln._start_x;
            var x2 = ln._end_x;
            var y1 = ln._start_y;
            var y2 = ln._end_y;
            var pen = ln._pen;
            var x, y, w, h;
            var a = ln._area;

            if (x1 < x2)
                x = x1, w = x2-x1;
            else
                x = x2, w = x1-x2;
            if (y1 < y2)
                y = y1, h = y2-y1;
            else
                y = y2, h = y1-y2;

            if (pen === 1)
                w++, h++;
            else
                if (pen > 1) {
                    var ex = (h > 0 ? (pen*h)/(w+h) : 0); /* h=0: horizontal */
                    var ey = (w > 0 ? (pen*w)/(w+h) : 0); /* w=0: vertical */
                    var hx = ex/2;
                    var hy = ey/2;

                    x -= hx;
                    w += ex;
                    y -= hy;
                    h += ey;
                }

            a._x = x;
            a._y = y;
            a._w = w;
            a._h = h;

            if (ln.adjust_first_arrow())
                a.union_normalised(ln._first_arrow._area);
            if (ln.adjust_second_arrow())
                a.union_normalised(ln._second_arrow._area);

            ln._request_compute = false;
        }
        return ln;
    }

    Line.prototype.render_canvas = function(ctx, canvas) {
        var ln = this;
        var x1 = ln._start_x;
        var x2 = ln._end_x;
        var y1 = ln._start_y;
        var y2 = ln._end_y;
        var pen = ln._pen;
        var first = ln._first_arrow;
        var second = ln._second_arrow;

        if (pen > 0) {
            ctx.strokeStyle(ln._colour);
            ctx.lineWidth(pen);

            //  If arrows are present we only draw the part of the line
            //  that is not drawn by the arrow.  (We assume the arrow to
            //  be filled).
            if (first) {
                var pt1 = new geo.Point(x1,y1);
                var pt2 = new geo.Point(x2,y2);
                var line = new geo.Line(pt1, pt2);
                var d = first.length();
                var pt = line.point_at_distance(pt1, pt2, d);

                x1 = pt.x();
                y1 = pt.y();
            }

            if (second) {
                var pt1 = new geo.Point(x1,y1);
                var pt2 = new geo.Point(x2,y2);
                var line = new geo.Line(pt1, pt2);
                var d = second.length();
                var pt = line.point_at_distance(pt2, pt1, d);

                x2 = pt.x();
                y2 = pt.y();
            }

            ctx.line(x1, y1, x2, y2);
        }

        if (first)
            first.render_canvas(ctx, canvas);
        if (second)
            second.render_canvas(ctx, canvas);

        return ln;
    }
}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	font.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Font
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012, 2014  University of Twente
 *  
 *  History	22/07/12  (Created)
 *  		30/01/14  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.Font
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function () {
    var cute = this.cute;

    /**
     *  Create a font for drawing on the canvas from a specification or a
     *  CSS string.  
     */
    var Font = cute.Font = function(spec) {
        var spec = spec || {};
        var ft = this;

        if (arguments.length > 1) {
            throw 'cute.Font: Single specification argument or CSS string';
        }

        if (typeof(spec) === 'string') {
            ft._css = spec;
            ft._css_set = true;
        } else {
            ft._style = spec.style || "normal"; // italic, oblique
            ft._weight = spec.weight || "normal";// bold, bolder, lighter, 100, ... 900
            ft._size = spec.size || "16px";
            ft._line_height = spec.line_height || null;
            ft._family = spec.family || "sans-serif";
            ft._css = null;
            ft._css_set = false; // If true user has specified full CSS font
        }

        ft._height = 0;
        ft._ascent = 0;
        ft._descent = 0;

        ft.request_compute();

        return ft;
    }

    Font.prototype.request_compute = function() {
        this._request_compute = true;
        return this;
    }

    Font.prototype.compute = function() {
        var ft = this;

        if (ft._request_compute) {
            var text, block, div, body;

            if (!ft._css_set) {
                ft._css = ft._weight + ' ' + ft._style + ' ' + ft._size;
                if (ft._line_height !== null)
                    ft._css += '/' + ft._line_height;
                ft._css += ' ' + ft._family;
            }

            text = $('<span style="font: ' + ft._css + '">Hg</span>');
            block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');
            div = $('<div></div>');
            body = $('body');
            div.append(text, block);
            body.append(div);

            try {
                block.css({ verticalAlign: 'baseline' });
                ft._ascent = block.offset().top - text.offset().top;
                block.css({ verticalAlign: 'bottom' });
                ft._height = Math.ceil(block.offset().top - text.offset().top);
                ft._descent = ft._height - ft._ascent;
            } finally {
                div.remove();
            }

            ft._request_compute = false;
        }

        return ft;
    }


    Font.prototype.width = function(str) {
        cute.ctx.font(this.css());

        return cute.ctx.measureText(str).width;
    }

    Font.prototype.height = function() {
        var ft = this;

        ft.compute();
        return ft._height + 15; // TBD - Hack to increase touch area
    }


    Font.prototype.ascent = function() {
        var ft = this;

        ft.compute();
        return ft._ascent;
    }


    Font.prototype.descent = function() {
        var ft = this;

        ft.compute();
        return ft._descent;
    }


    Font.prototype.family = function(fam) {
        var f = this;

        if (fam === undefined)
            return f._family;

        if (f._family != fam) {
            f._family = fam;
            f._css = undefined;
            f._css_set = false;
            f.request_compute();
        }

        return f;
    }


    Font.prototype.style = function(s) {
        var f = this;

        if (s === undefined)
            return f._style;

        if (f._style != s) {
            f._style = s;
            f._css = undefined;
            f._css_set = false;
            f.request_compute();
        }

        return f;
    }


    Font.prototype.weight = function(w) {
        var f = this;

        if (w === undefined)
            return f._weight;

        if (f._weight != w) {
            f._weight = w;
            f._css = undefined;
            f._css_set = false;
            f.request_compute();
        }

        return f;
    }


    Font.prototype.css = function(font) {
        var ft = this;

        if (font === undefined) {
            ft.compute();
            return ft._css;
        }

        ft._css = font;
        ft._css_set = true;
        ft.request_compute();
        ft.compute();

        return ft;
    }
}).call(this);
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
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	connection.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Connection
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	11/07/12  (Created)
 *  		11/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Connection
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Connection = cute.Connection = function(from, to, link, from_handle, to_handle) {
        var c = this;

        cute.Line.call(c, 0,0,0,0);
        if (!link)
            link = new cute.Link();
        cute.Line.prototype.copy.call(c, link._line);

        c._link = link;
        c._from_handle = from_handle || null;
        c._to_handle = to_handle || null;
        c._fixed_from = (from_handle ? true : false);
        c._fixed_to = (to_handle ? true : false);

        return c.relate(from, to);
    }

    ist.extend(Connection, cute.Line);

    Connection.prototype.toString = function() {
        var cn = this;
        var c = ", ";
        return "connection(" + cn._from + c + cn._to + c + cn._link + ")";
    }

    Connection.prototype.unlink = function() {
        var c = this;

        if (c._from) c._from.detach_connection(c);
        if (c._to) c._to.detach_connection(c);

        cute.Graphical.prototype.unlink.call(c);

        return c;
    }

    Connection.prototype.relate = function(from, to) {
        var c = this;

        if (from != c._from && c._from) {
            c._from.detach_connection(c);
            c._from = null;
        }

        if (to != c._to && c._to) {
            c._to.detach_connection(c);
            c._to = null;
        }

        if (from) {
            from.attach_connection(c);
            c._from = from;
        }

        if (to) {
            to.attach_connection(c);
            c._to = to;
        }

      return c.update_device();
    }


    Connection.prototype.update_device = function() { // Internal?
        var c = this;
        var from = this._from;
        var to = this._to;
        var dev;

        if (!from || !to || !(dev = from.common_device(to)))
            return c.device(null);
        c.device(dev);

        return c.request_compute();
    }


    function available_from_handles(c, gr) {
        if (c._from_handle && c._fixed_from)
            return [gr.get_handle(c._from_handle)];
        return available_handles(c, c._link._from, gr);
    }

    function available_to_handles(c, gr) {
        if (c._to_handle && c._fixed_to)
            return [gr.get_handle(c._to_handle)];
        return available_handles(c, c._link._to, gr);
    }

    function available_handles(c, kind, gr) {
        var handles = [];
        var hdls = gr._handles;

        for (var i=0; i<hdls.length; i++) {
            var h = hdls[i];
            if (h._kind == kind)
                handles.push(h);
        }

        return handles;
    }

    /*  Find the best handles and return the connection points in result.
        Implementation is naive, it finds the matching handles in from and to that
        have the shortest distance.
     */

    Connection.prototype.connection_points = function(from, to, result) {
        var c = this;
        var hfs = available_from_handles(c, from);
        var hts = available_to_handles(c, to);
        var dev = c._device;
        var xfs = new Array(hfs.length);
        var yfs = new Array(hfs.length);
        var xts = new Array(hts.length);
        var yts = new Array(hts.length);

        for (var i=0; i<hfs.length; i++) {
            var xy = hfs[i].xy(from, dev);
            xfs[i] = xy.x;
            yfs[i] = xy.y;
        }
        for (var i=0; i<hts.length; i++) {
            var xy = hts[i].xy(to, dev);
            xts[i] = xy.x;
            yts[i] = xy.y;
        }

        var bestf = 0, bestt = 0, bestd = Infinity;
        var found = false;

        for (var i=0; i<hfs.length; i++) {
            for (var j=0; j<hts.length; j++) {
                var d = geo.distance(xfs[i], yfs[i], xts[j], yts[j]);
                if (found === false || d < bestd) {
                    bestd = d;
                    bestf = i;
                    bestt = j;
                    found = true;
                }
            }
        }

        if (found) {
            var hf = hfs[bestf];
            var ht = hts[bestt];

            result.x1 = xfs[bestf];
            result.y1 = yfs[bestf];
            result.x2 = xts[bestt];
            result.y2 = yts[bestt];

            c._from_handle = hf._name;
            c._to_handle = ht._name;
            return true;
        }

        return false;
    }

    Connection.prototype.update_line = function(x1, y1, x2, y2) {
        var c = this;

        if (x1 != cute.Line.prototype.start_x.call(c) ||
            y1 != cute.Line.prototype.start_y.call(c) ||
            x2 != cute.Line.prototype.end_x.call(c) ||
            y2 != cute.Line.prototype.end_y.call(c))
            c.points(x1, y1, x2, y2);
        return this;
    }

    Connection.prototype.compute = function() {
        var c = this;

        if (c._request_compute) {
            var from = c._from;
            var to = c._to;
            var dev = c._device;

            if (from.is_displayed(dev) && to.is_displayed(dev)) {
                var r = {x1: 0, y1:0, x2: 0, y2: 0};

                if (c.connection_points(from, to, r)) {
                    c.update_line(r.x1, r.y1, r.x2, r.y2);
                    cute.Line.prototype.compute.call(c);
                    c.displayed(true);
                    c._request_compute = false;
                    return this;
                }
            }
            c._request_compute = false;
            c.displayed(false);
        }

        return this;
    }

    var connection_in_points = 0;

    Connection.prototype.points = function(x1, y1, x2, y2) {
        connection_in_points++;
        cute.Line.prototype.points.call(this, x1, y1, x2, y2);
        connection_in_points--;

        return this;
    }

    Connection.prototype.geometry = function(x, y, w, h) {
        if (connection_in_points > 0)
            cute.Graphical.prototype.geometry(x, y, w, h);
        return this;
    }

    Connection.prototype.opposite = function(gr) {
        var c = this;

        if (c._to === gr)
            return c._from;
        if (c._from === gr)
            return c._to;
        return null;
    }

    Connection.prototype.update_link_attributes = function() {
        var c = this;
        var proto = c._link._line;

        c._pen = proto._pen;
        c.set_arrows(proto._first_arrow, proto._second_arrow);

        return c.request_compute();
    }
}).call(this);
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
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	link.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Link
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	12/07/12  (Created)
 *  		12/07/12  (Last modified)
 */


/*------------------------------------------------------------
 *  Class Link
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Link = cute.Link = function(from, to, link, line, func) {
        var l = this;

        if (!from)
            from = "link";
        l._from = from;
        l._to = to || from;
        l._line = line || new cute.Line();
        l._connection_constructor = func;

        return l;
    }

    Link.prototype.toString = function() {
        var l = this;
        var c = ", ";

        return "link(" + l._from + c + l._to + c + l._link + ")";
    }


    /*   Returns a new connection based on the link.
     */
    Link.prototype.connection = function(gr, gr2, from, to) {
        return l._connection_constructor(gr, gr2, this, from, to);
    }


    Link.prototype.from = function(gr) {
        if (gr) {
            this._from = gr;
            return this;
        }
        return this._from;
    }

    Link.prototype.to = function(gr) {
        if (gr) {
            this._to = gr;
            return this;
        }
        return this._to;
    }

    Link.prototype.line = function(ln) {
        if (ln) {
            this._line = ln;
            return this;
        }
        return this._line;
    }

    Link.prototype.connection_constructor = function(f) {
        if (f) {
            this._connection_constructor = f;
            return this;
        }
        return this._connection_constructor;
    }
}).call(this);
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
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	path.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Path
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	13/07/12  (Created)
 *  		13/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.Path
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Path = cute.Path = function(points) {
        var p = this;

        cute.Joint.call(p);
        p._offset = new cute.Point(0,0);
        p._points = (points || []);
        p._closed = false;
        p._mark = null;

        if (points)
            p.points(points);

        return p;
    }

    ist.extend(Path, cute.Joint);

    Path.prototype.toString = function() {
        var p = this;
        return "cute.Path(" + p._w, + ", " + p._h + ")";
    }

    Path.prototype.adjust_first_arrow = function() {
        var p = this;

        if (p._first_arrow) {
            if (p._points.length >= 2) {
                var tip = p._points[0];
                var ref = p._points[1];

                p._first_arrow.points(tip.x + p._offset._x,
                                      tip.y + p._offset._y,
                                      ref.x + p._offset._x,
                                      ref.y + p._offset._y);
                p._first_arrow.Compute();
                return true;
            }
        }
        return false;
    }


    Path.prototype.adjust_second_arrow = function() {
        var p = this;

        if (p._second_arrow) {
            if (p._points.length >= 2) {
                var tip = p._points[p._points.length-1];
                var ref = p._points[p._points.length-2];

                p._second_arrow.points(tip.x + p._offset._x,
                                       tip.y + p._offset._y,
                                       ref.x + p._offset._x,
                                       ref.y + p._offset._y);
                p._second_arrow.Compute();
                return true;
            }
        }
        return false;
    }

    Path.prototype.render_canvas = function(ctx, canvas) {
        var p = this;
        var ox, oy;

        ox = p._area._x + p._offset._x;
        oy = p._area._y + p._offset._y;

        ctx.fillStyle(p._colour);
        ctx.lineWidth(p._pen);
        ctx.path(p._points, ox, oy, p._closed, p._fill_pattern);

        // TBD -- mark

        if (p.adjust_first_arrow())
            p._first_arrow.render_canvas(ctx, canvas);
        if (p.adjust_second_arrow())
            p._second_arrow.render_canvas(ctx, canvas);

        return this;
    }


    Path.prototype.append = function(pt) {
        this._points.push(pt);
        this.request_compute();
        return this;
    }

    Path.prototype.clear = function() {
        var p = this;

        p._points = [];
        p.request_compute();

        return p;
    }

    Path.prototype.points = function(pts) {
        var p = this;
        p._points = pts;
        p.request_compute();

        return p;
    }


    Path.prototype.closed = function(val) {
        if (val) {
            if (val != this._closed) {
                this._closed = val;
                this.request_compute();
                return this;
            }
            return this;
        }
        return this._closed;
    }


    Path.prototype.mark = function(img) {
        if (img) {
            if (img != this._mark) {
                this._mark = img;
                this.request_compute();
                return this;
            }
            return this;
        }
        return this._mark;
    }


    Path.prototype.compute = function() {
        var p = this;

        if (p._request_compute) {
            p.compute_bounding_box();
            cute.Graphical.prototype.changed_area(p);
            p._request_compute = false;
        }
        return p;
    }


    Path.prototype.compute_bounding_box = function() {
        var p = this;
        var points = p._points;
        var minx = 1000000, miny = 1000000, maxx = -1000000, maxy = -10000000;

        for (var i=0; i<points.length; i++) {
            var pt = points[i];
            var px = pt._x;
            var py = pt._y;

            if (px < minx) minx = px;
            if (px > maxx) maxx = px;
            if (py < miny) miny = py;
            if (py > maxy) maxy = py;
        }

        if (p._mark || p._selected === true) {
            var mw = 0;
            var mh = 0;

            if (p._mark) {
                mw = p._mark._size._w;
                mh = p._mark._size._h;
            }
            if (p._selected === true) { /* selection bubbles */
                mw = Math.max(mw, 5);
                mh = Math.max(mh, 5);
            }

            minx -= (mw+1)/2;
            maxx += (mw+1)/2;
            miny -= (mh+1)/2;
            maxy += (mh+1)/2;
        }

        if (maxx >= minx && maxy >= miny) {
            var pens = p._pen / 2;
            var pena = p._pen % 2 == 0 ? pens : pens + 1;

            minx -= pens; maxx += pena;
            miny -= pens; maxy += pena;

            p._area._x = minx + p._offset._x;
            p._area._y = miny + p._offset._y;
            p._area._w = maxx - minx;
            p._area._h = maxy - miny;
        } else
            p._area.clear();

        if (p.adjust_first_arrow())
            p._area.union_normalised(p._first_arrow._area);
        if (p.adjust_second_arrow())
            p._area.union_normalised(p._second_arrow._area);

        return this;
    }


    Path.prototype.geometry = function(x, y, w, h) {
        var p = this;
        var a = p._area;
        var ox, ax, offx, ooffx;
        var oy, ay, offy, ooffy;
        var ow, oh;
        var xf, yf;

        cute.Graphical.prototype.Compute.call(p);
        ox = a._x;
        oy = a._y;
        ow = a._w;
        oh = a._h;

        // CHANGING_GRAPHICAL
        if (ow == 0 || oh == 0) {
            a.set(x, y, ow, oh);
            if (ox !== a._x || oy !== a._y || ow !== a._w || oh !== a._h)
              p.changed_area(ox, oy, ow, oh);
            return p;
        }

        a.set(x, y, w, h);
        ax = a._x;
        ay = a._y;
        ooffx = p._offset._x;
        ooffy = p._offset._y;
        offx = ooffx + ax - ox;
        offy = ooffy + ay - oy;
        xf = a._w / ow;
        yf = a._h / oh;

        p._offset._x = offx;
        p._offset._y = offy;

        for (var i=0; i<p._points.length; i++) {
            var pt = p._points[i];
            var nx = ax + ((pt._x-ox+ooffx) * xf) - offx;
            var ny = ay + ((pt._y-oy+ooffy) * yf) - offy;

            pt._x = nx;
            pt._y = ny;
        }
        if (ox !== a._x || oy !== a._y || ow !== a._w || oh !== a._h)
            p.changed_area(ox, oy, ow, oh);

        return this;
    }
}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	event.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Handling mouse and touch events
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	14/07/12  (Created)
 *  		14/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Events
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Event = cute.Event = function(ev, type, device, x, y, time) {
        var ev = this;

        ev._ev = ev;
        ev._type = type;
        ev._device = device;
        ev._x = x;
        ev._y = y;
        ev._gesture = null;

        return ev;
    }


    Event.prototype.toString = function() {
        var ev = this;
        var c = ", ";

        return "event(" + ev._type + c + ev._x + c + ev._y + ")";
    }


    Event.prototype.gesture = function(g) {
        var ev = this;

        if (g) {
            ev._gesture = g;
            return ev;
        }
        return ev._gesture;
    }

    Event.prototype.xy_figure = function(gr) { // TBD -- used?
        var ev = this;
        var xy = gr.offset_figure();
        var x = ev._x - xy.x;
        var y = ev._y - xy.y;

        return {x: x, y: y};
    }
}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	modifier.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Modified
 *  Works with	JavaScript 1.5
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	14/07/12  (Created)
 *  		17/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Modifier
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var Modifier = cute.Modifier = function(shift, control, meta) {
        var m = this;

        if (typeof(shift) == 'string')
            m.convert(shift);
        else {
            m._shift = shift || false;
            m._control = control || false;
            m._meta = meta || false;
        }

        return m;
    }

    Modifier.prototype.convert = function(str) {
        var m = this;

        m._shift = false;
        m._control = false;
        m._meta = false;
        for (var i=0; i<str.length; i++)
            switch (str[i]) {
            case 's': m._shift = true; break;
            case 'c': m._control = true; break;
            case 'm': m._meta = true; break;
            }
        return this;
    }

    Modifier.prototype.shift = function(val) {
        if (val === undefined)
            return m._shift;
        m._shift = val;
        return this;
    }

    Modifier.prototype.control = function(val) {
        if (val === undefined)
            return m._control;
        m._control = val;
        return this;
    }

    Modifier.prototype.meta = function(val) {
        if (val === undefined)
            return m._meta;
        m._meta = val;
        return this;
    }
}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	gesture.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class Gesture
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	14/07/12  (Created)
 *  		14/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class Gesture
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    cute.Gesture = function() {
        var g = this;

        g._modifier = undefined;
        g._button = undefined;
        g._condition = null;
        g._active = true;
        g._status = 'inactive';
        g._cursor = undefined;

        return g;
    }


    cute.Gesture.prototype.modifier = function(mod) {
        var g = this;

        if (modifier === undefined)
            return g._modifier;

        if (typeof(modifier) == 'string')
            g._modifier = new cute.Modifier(modifier);
        else
            g._modifier = modifier;

        return g;
    }


    cute.Gesture.prototype.modifiers_match = function(ev) {
        return true;
    }

    cute.Gesture.prototype.event = function(ev) {
        return false;
    }


    /*  Called on proper finish of gesture (e.g., mouse_up).
     */
    cute.Gesture.prototype.terminate = function(ev) {
        return true;
    }


    /*  Called on unproper finish of gesture (e.g., mouse out of window).
     */
    cute.Gesture.prototype.cancel = function(ev) {
        return this.terminate(ev);
    }
}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	move_gesture.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class MoveGesture
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	16/07/12  (Created)
 *  		16/07/12  (Last modified)
 */


/*------------------------------------------------------------
 *  Class cute.MoveGesture
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var MoveGesture = cute.MoveGesture = function() {
        var g = this;

        cute.Gesture.call(g);
        g._offset = new cute.Point(0,0);
        g._event = null;
        g._receiver = null;

        return g;
    }

    ist.extend(MoveGesture, cute.Gesture);

    MoveGesture.prototype.toString = function() {
        var g = this;
        return "MoveGesture(" + g._offset._x + ", " + g._offset._y + ")";
    }

    MoveGesture.prototype.event = function(ev, gr) {
        var g = this;

        g._receiver = gr;
        if (g.initiate(ev)) {
            ev._gesture = g;
            return true;
        }
        return false;
    }

    MoveGesture.prototype.initiate = function(ev) {
        var g = this;
        var gr = ev._receiver;

        if (ev._type === 'mouse_down' && g.modifiers_match(ev)) {
            g._offset._x = ev._x;
            g._offset._y = ev._y;
            g._initial_x = gr._area._x;
            g._initial_y = gr._area._y;

            return true;
        }

        return false;
    }

    MoveGesture.prototype.verify = function(ev) {
        return true;
    }

    MoveGesture.prototype.drag = function(ev) {
        var g = this;
        var dx = ev._x - g._offset._x;
        var dy = ev._y - g._offset._y;
        var gr = g._receiver;

        gr.relative_move_xy(dx, dy);
        g._offset._x = ev._x;
        g._offset._y = ev._y;
        ev._device.modified();

        return true;
    }

    MoveGesture.prototype.terminate = function(ev) {
        return this;
    }
}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	resize_gesture.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class ResizeGesture
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2013  University of Twente
 *  
 *  History	20/09/13  (Created)
 *  		20/09/13  (Last modified)
 */


/*------------------------------------------------------------
 *  Class cute.ResizeGesture
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var ResizeGesture = cute.ResizeGesture = function() {
        var g = this;

        cute.Gesture.call(g);
        g._offset = new cute.Point(0,0);
        g._event = null;
        g._receiver = null;

        return g;
    }

    ist.extend(ResizeGesture, cute.Gesture);


    ResizeGesture.prototype.toString = function() {
        var g = this;
        return "cute.ResizeGesture(" + g._offset._x + ", " + g._offset._y + ")";
    }


    ResizeGesture.prototype.event = function(ev, gr) {
        var g = this;

        g._receiver = gr;
        if (g.initiate(ev)) {
            ev._gesture = g;
            return true;
        }
        return false;
    }


    ResizeGesture.prototype.initiate = function(ev) {
        var g = this;
        var gr = ev._receiver;

        if (ev._type === 'mouse_down' && g.modifiers_match(ev)) {
            g._offset._x = ev._x;
            g._offset._y = ev._y;
            g._initial_x = gr._area._x;
            g._initial_y = gr._area._y;
            g._bottom_y = gr._area._y + gr._area._h;
            g._bottom_x = gr._area._x + gr._area._w / 2;

            return true;
        }

        return false;
    }

    ResizeGesture.prototype.verify = function(ev) {
        return true;
    }

    ResizeGesture.prototype.drag = function(ev) {
        var g = this;
        var dx = ev._x - g._offset._x;
        var dy = ev._y - g._offset._y;
        var gr = g._receiver;

        if (gr instanceof cute.Circle) {
            gr.radius(gr.radius() + (dx+dy)/2);
            gr.center(new cute.Point(g._bottom_x,g._bottom_y-gr.radius()));
        } else {
            gr.relative_size_wh(dx, dy);
        }

        gr.request_compute();
        g._offset._x = ev._x;
        g._offset._y = ev._y;
        ev._device.modified();

        return true;
    }

    ResizeGesture.prototype.terminate = function(ev) {
        return this;
    }

}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	constraint_move_gesture.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class ConstraintMoveGesture
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	06/08/12  (Created)
 *  		06/08/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.ConstraintMoveGesture
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var ConstraintMoveGesture = cute.ConstraintMoveGesture = function(direction) {
        var g = this;

        cute.MoveGesture.call(g);
        g._direction = (direction === undefined ? 'horizontal' : direction);

        return g;
    }

    ist.extend(ConstraintMoveGesture, cute.ConstraintMoveGesture);

    ConstraintMoveGesture.prototype.toString = function() {
        var g = this;
        return "constraint_move_gesture(" + g._offset._x + " " + g._offset._y + ")";
    }

    ConstraintMoveGesture.prototype.drag = function(ev) {
        var g = this;
        var abs_xy = g._receiver.absolute_xy(g._device);
        var x = ev._x - abs_xy.x - g._offset._x;
        var y = ev._y - abs_xy.y - g._offset._y;

        switch (g._direction) {
        case 'horizontal':
            g._receiver.relative_move_xy(x, 0);
            break;
        case 'vertical':
            g._receiver.relative_move_xy(0, y);
        }
        ev._device.modified();

        return true;
    }
}).call(this);
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
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	drag_drop_gesture.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class DragDropGesture
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	16/07/12  (Created)
 *  		16/07/12  (Last modified)
 */

/*------------------------------------------------------------
 *  Class cute.DragDropGesture
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;

    var DragDropGesture = cute.DragDropGesture = function() {
        var g = this;

        cute.MoveGesture.call(g);
        g._target = undefined;
        g._middle = true;
        if ('ontouchend' in document)
            g._hover_above = 35; // Number of pixels to shift receiver to make
        else // it visible on touch devices 
            g._hover_above = 0;

        return g;
    }

    ist.extend(DragDropGesture, cute.MoveGesture);

    DragDropGesture.prototype.toString = function() {
        var g = this;
        return "DragDropGesture(" + g._offset._x + ", " + g._offset._y + ")";
    }


    DragDropGesture.prototype.middle = function(bool) {
        var g = this;

        if (bool === undefined)
            return g._middle;
        g._middle = bool;

        return g;
    }

    DragDropGesture.prototype.hover_above = function(val) {
        var g = this;

        if (val === undefined)
            return g._hover_above;
        g._hover_above = val;

        return g;
    }

    DragDropGesture.prototype.initiate = function(ev) {
        var g = this;
        var gr = ev._receiver;

        if (ev._type === 'mouse_down' && g.modifiers_match(ev)) {
            g._offset._x = ev._x;
            g._offset._y = ev._y;
            g._initial_x = gr._area._x;
            g._initial_y = gr._area._y;

            if (g._hover_above) {
                var abs = gr.absolute_xy();
                var desired_x = abs.x + gr.width() / 2;
                var desired_y = abs.y + gr.height();
                var dx = ev._x - desired_x;
                var dy = ev._y - desired_y;

                gr.relative_move_xy(dx, dy-g._hover_above);
                gr.device().modified();
            }
            return true;
        }

        return false;
    }

    DragDropGesture.prototype.verify = function(ev) {
    }

    DragDropGesture.prototype.pointed_objects = function(ev) {
        var g = this;
        var dev = ev._device;
        var pointed = new Array();
        var x, y;

        if (g.middle()) {
            var gr = g._receiver;
            var abs = gr.absolute_xy();

            x = abs.x + gr._area._w/2;
            y = abs.y + gr._area._h/2;
        } else {
            x = ev._x;
            y = ev._y;
        }
        dev.pointed_objects(x, y, pointed);
        pointed.reverse();

        return pointed;
    }

    DragDropGesture.prototype.terminate = function(ev) {
        var g = this;
        var dev = ev._device;
        var gr = g._receiver;
        var pointed;
        var i;

        pointed = g.pointed_objects(ev);

        g._target = undefined;
        for (i=0; i<pointed.length && !g._target; i++) {
            var target = pointed[i];

            if (gr === target)
                continue;
            if (target.drop_target) {
                switch (target.drop_target(gr, g)) {
                case true:
                    g._target = target;
                    break;
                case false:
                    continue;
                case 'refuse':
                    return g; // TBD -- really exit here?
                }
            }
        }

        gr.set(g._initial_x, g._initial_y);
        dev.modified();

        return g;
    }
}).call(this);
/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	click_gesture.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Definition of class ClickGesture
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	16/07/12  (Created)
 *  		16/07/12  (Last modified)
 */


/*------------------------------------------------------------
 *  Class cute.ClickGesture
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

(function() {
    var cute = this.cute;
    var geo = this.geo;

    var ClickGesture = cute.ClickGesture = function() {
        var g = this;

        cute.Gesture.call(g);
        g._offset = new cute.Point(0,0);
        g._event = null;
        g._receiver = null;
        g._max_drag_distance = 5;

        return this;
    }

    ist.extend(ClickGesture, cute.Gesture);

    ClickGesture.prototype.toString = function() {
        var g = this;
        return "ClickGesture(" + g._offset._x + ", " + g._offset._y + ")";
    }


    ClickGesture.prototype.event = function(ev, gr) {
        var g = this;

        g._receiver = gr;
        if (g.initiate(ev)) {
            ev._gesture = g;
            return true;
        }
        return false;
    }


    ClickGesture.prototype.initiate = function(ev) {
        var g = this;
        var gr = ev._receiver;

        if (ev._type === 'mouse_down' && g.modifiers_match(ev)) {
            g._offset._x = ev._x;
            g._offset._y = ev._y;
            g._initial_x = ev._receiver._area._x;
            g._initial_y = ev._receiver._area._y;

            return true;
        }

        return false;
    }


    ClickGesture.prototype.verify = function(ev) {
        return true;
    }


    ClickGesture.prototype.drag = function(ev) {
        var g = this;
        var dx = ev._x - g._offset._x;
        var dy = ev._y - g._offset._y;
        var gr = g._receiver;

        if (geo.distance(ev._x, ev._y, g._offset._x, g._offset._y) > g._max_drag_distance) {
            ev._gesture = null;
            return true;
        }

        return true;
    }


    ClickGesture.prototype.terminate = function(ev) {
        var g = this;
        var gr = g._receiver;

        if (gr.on_click) {
            if (gr.on_click(ev._x, ev._y))
                ev._device.modified();
        }
        return g;
    }
}).call(this);
