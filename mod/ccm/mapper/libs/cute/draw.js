/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	draw.src
 *  Part of	Cute
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Low-level drawing routines
 *  Works with	SWI-Prolog (www.swi-prolog.org)
 *  
 *  Notice	Copyright (c) 2012  University of Twente
 *  
 *  History	11/07/12  (Created)
 *  		06/08/12  (Last modified)
 */


/*------------------------------------------------------------
 *  Drawing primitives
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

"use strict";

/*------------------------------------------------------------
 *  Debugging
 *------------------------------------------------------------*/

function debug_ctx(ctx, label) {
    ist.printf(label);
    ist.printf('  lineWidth:     ' + ctx.lineWidth);
    ist.printf('  strokeStyle:   ' + ctx.strokeStyle);
    ist.printf('  fillStyle:     ' + ctx.fillStyle);
    ist.printf('  font:          ' + ctx.font);
    ist.printf('  shadowColor:   ' + ctx.shadowColor);
    ist.printf('  shadowBlur:    ' + ctx.shadowBlur);
    ist.printf('  shadowOffsetX: ' + ctx.shadowOffsetX);
    ist.printf('  shadowOffsetY: ' + ctx.shadowOffsetY);
}


/*------------------------------------------------------------
 *  Low-level drawing routines
 *------------------------------------------------------------*/

var cute = window.cute;

function r_clear(ctx, x, y, w, h) {
    ctx.clearRect(x, y, w, h);
}

function r_line_width(ctx, pen) {
    ctx.lineWidth = pen;
}

function r_font(ctx, font) {
    if (font instanceof cute.Font)
 ctx.font = font.css();
    else
 ctx.font = font;
}

function r_stroke_style(ctx, colour) {
    if (colour === undefined)
 ctx.strokeStyle = '#000000'
    else if (colour instanceof cute.Colour)
 ctx.strokeStyle = colour._css;
    else
 ctx.strokeStyle = colour;
}

function r_fill_style(ctx, fill) {
    if (fill === undefined)
 ctx.fillStyle = '#000000';
    else if (fill instanceof cute.Colour)
 ctx.fillStyle = fill.css();
    else
 ctx.fillStyle = fill;
}

function r_shadow(ctx, sh) {
    if (sh instanceof cute.Shadow) {
 ctx.shadowColor = sh._colour;
 ctx.shadowBlur = sh._blur;
 ctx.shadowOffsetX = sh._offset_x;
 ctx.shadowOffsetY = sh._offset_y;
 return;
    }
    if (sh === undefined) {
 ctx.shadowBlur = 0;
    }
}

function r_text(ctx, str, x, y, base) {
    ctx.textBaseline = base || 'alphabetic';
    ctx.fillText(str, x, y);
//  ctx.strokeText(str, x, y);
}


function r_rect(ctx, x, y, w, h) {
    ctx.rect(x, y, w, h);
}

function r_fill(ctx) {
//  debug_ctx('r_fill', ctx);
    ctx.fill();
}

function r_stroke(ctx) {
//  debug_ctx('r_stroke', ctx);
    ctx.stroke();
}

function r_fill_rect(ctx, x, y, w, h) {
//  debug_ctx(ctx);
    ctx.fillRect(x, y, w, h);
}


function r_draw_image(ctx, img, x, y) {
    ctx.drawImage(img, x, y);
}

function r_stroke_rect(ctx, x, y, w, h) {
    ctx.strokeRect(x, y, w, h);
}


/**
 *  Rounded corner triangle using arcTo.
 *
 *  @author http://www.dbp-consulting.com/tutorials/canvas/CanvasArcTo.html
 */
function r_rounded_rect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.save(); // save the context so we don't mess up others
    ctx.beginPath(); // draw top and top right corner
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+r,r);
    // draw right side and bottom right corner
    ctx.arcTo(x+w,y+h,x+w-r,y+h,r); // draw bottom and bottom left corner
    ctx.arcTo(x,y+h,x,y+h-r,r); // draw left and top left corner
    ctx.arcTo(x,y,x+r,y,r);
    if (fill)
 ctx.fill();
    if (stroke)
 ctx.stroke();
    ctx.restore();
}

function r_stroke_rounded_rect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.stroke();
}

function r_circle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function r_fill_circle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function r_stroke_circle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
}


/*------------------------------------------------------------
 *  Ellipse
 *------------------------------------------------------------*/

function r_ellipse(ctx, x, y, w, h) {
    r_draw_ellipse(ctx, x, y, w, h, true, true);
}

function r_stroke_ellipse(ctx, x, y, w, h) {
    r_draw_ellipse(ctx, x, y, w, h, false, true);
}

function r_fill_ellipse(ctx, x, y, w, h) {
    r_draw_ellipse(ctx, x, y, w, h, true, false);
}

function r_draw_ellipse(ctx, x, y, w, h, fill, stroke) {
    var kappa = 0.5522848;
    var ox, oy, xe, ye, xm, ym;

    ox = (w / 2) * kappa, // control point offset horizontal
    oy = (h / 2) * kappa, // control point offset vertical
    xe = x + w, // x-end
    ye = y + h, // y-end
    xm = x + w / 2, // x-middle
    ym = y + h / 2; // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath();
    if (fill)
 ctx.fill();
    if (stroke)
 ctx.stroke();
}


function r_arc(ctx, x, y, radius, start, end) {
    ctx.beginPath();
    ctx.arc(x, y, radius, start, end, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function r_stroke_arc(ctx, x, y, radius, start, end) {
    ctx.beginPath();
    ctx.arc(x, y, radius, start, end, true);
    ctx.closePath();
    ctx.stroke();
}

function r_fill_arc(ctx, x, y, radius, start, end) {
    ctx.beginPath();
    ctx.arc(x, y, radius, start, end, true);
    ctx.closePath();
    ctx.fill();
}

function r_line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();

    x1 = Math.round(x1);
    y1 = Math.round(y1);
    x2 = Math.round(x2);
    y2 = Math.round(y2);

//  ctx.lineCap = 'square';
    ctx.lineCap = 'butt';
    if (ctx.lineWidth === 1) {
 ctx.moveTo(x1-0.5, y1-0.5);
 ctx.lineTo(x2-0.5, y2-0.5);
    } else {
 ctx.moveTo(x1, y1);
 ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.stroke();
}


function r_fill_polygon(ctx, a) {
    var x = 0, y = 1;

    ctx.beginPath();
    ctx.moveTo(a[x], a[y]);
    for (x=2, y=3; x<a.length; x+=2, y+=2)
 ctx.lineTo(a[x], a[y]);
    ctx.closePath();
    ctx.fill();
}


function r_path(ctx, points, ox, oy, closed, fill) {
    if (points.length < 2)
 return;

    var x0 = 0, y0 = 0;

    ctx.beginPath();
    for (i=0; i<points.length; i++) {
 var x = points[i]._x + ox;
 var y = points[i]._y + oy;

 if (i === 0) {
     ctx.moveTo(x, y);
     x0 = x, y0 = y;
 } else {
     ctx.lineTo(x, y);
 }
    }
    if (closed) {
 ctx.lineTo(x0, y0);
    }
    ctx.closePath();
    if (ctx.lineWidth > 0) {
 ctx.stroke();
    }
    if (fill) {
 r_fill_style(ctx, fill);
 ctx.fill();
    }
}


function new_radial_gradient(ctx, x0, y0, r0, x1, y1, r1, stops) {
    var grd;

    grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    for (var i=0; i<stops.length; i++) {
 grd.addColorStop(stops[i].value, stops[i].color);
    }

    return grd;
}


function r_radial_gradient(ctx, x0, y0, r0, x1, y1, r1, stops) {
    var grd;

    grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    for (var i=0; i<stops.length; i++) {
 grd.addColorStop(stops[i].value, stops[i].color);
    }

    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x0, y0, Math.max(r0,r1), 0, 2 * Math.PI, true);
    ctx.fill();
}


function r_radial_box(ctx, x0, y0, r0, x1, y1, r1, stops) {
    var grd;

    grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    for (var i=0; i<stops.length; i++) {
 grd.addColorStop(stops[i].value, stops[i].color);
    }
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.rect(x0, y0, r0, r1);
    ctx.fill();
}


function r_gradient_box(ctx, x, y, w, h, stops) {
    var grd;

    grd = ctx.createLinearGradient(x, y, x, y+h);
    for (var i=0; i<stops.length; i++) {
 grd.addColorStop(stops[i].value, stops[i].color);
    }
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
}
