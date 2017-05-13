/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	geometry.src
 *  Part of	Geometry package
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Classes for basic geometry objects (point, line, circle)
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2013, 2014  University of Twente
 *  
 *  History	31/07/13  (Created)
 *  		01/05/14  (Last modified)
 */

/*------------------------------------------------------------
 *  Directives
 *------------------------------------------------------------*/
/*  Use with gcc -E -x c -P -C *.h > *.js 
 */

/** 
 *  geometry.js
 *
 *  This file contains classes and methods for the principal geometrical
 *  concepts Point, Line (Segment, Ray), Circle and Arc.  These classes should
 *  make the development of canvas drawing that involves geometry and
 *  trigonometry simpler (see Cute, Ziggy and Lite).
 *
 *  All angle based methods use radians.  Converting between radians and
 *  degrees can be done with geo.radians(degrees) and geo.degrees(radians).
 *
 *  The namespace is window.geo.
 *
 *  @author	Anjo Anjewierden a.a.anjewierden@utwente.nl
 *  @version	v0.1 (2014-05-01)
 */
(function() {
    "use strict";

    var geo = this.geo = {};
    var Pi2 = Math.PI * 2;

    geo.epsilon = 0.000000001;

    geo.canvas = null;

    geo.draw_on = function(canvas, area, origin, angle, euclidean) {
        geo.canvas = canvas;
        geo.ctx = canvas.context();
        geo.x = area.x();
        geo.y = area.y();
        geo.w = area.w();
        geo.h = area.h();
        geo.ox = origin.x();
        geo.oy = origin.y();
        geo.angle = angle;
        geo.euclidean = euclidean;
        geo.bx = -geo.ox;
        geo.by = -geo.oy;
        geo.bw = geo.w;
        geo.bh = geo.h;
    }

    geo.grid = function(gap) {
        var ctx = geo.ctx;
        var left = geo.bx;
        var right = geo.bx + geo.bw;
        var top = geo.by;
        var bottom = geo.by + geo.bh;

        ctx.fillStyle('yellow');
        geo.circle(0, 0, 5);

        ctx.strokeStyle('grey');

        for (var x=geo.bx; x < geo.bx+geo.bw; x+=gap) {
            geo.line(x, bottom, x, top);
        }
        for (var y=geo.by; y < geo.by+geo.bh; y+=gap) {
            geo.line(left, y, right, y);
        }
    }

    geo.tx = function(x) {
        return x + geo.ox;
    }

    geo.ty = function(y) {
        if (!geo.euclidean)
            return y + geo.oy;
        return geo.oy - y;
    }

    geo.line = function(x1, y1, x2, y2) {
//        assert(geo.canvas);

        var ctx = geo.ctx;
        var rx1 = geo.tx(x1);
        var ry1 = geo.ty(y1);
        var rx2 = geo.tx(x2);
        var ry2 = geo.ty(y2);

        ctx.line(rx1, ry1, rx2, ry2);
    }

    geo.circle = function(x, y, r) {
//        assert(geo.canvas);

        var ctx = geo.ctx;
        var rx = geo.tx(x);
        var ry = geo.ty(y);

        ctx.circle(rx, ry, r);
    }

    geo.arc = function(x, y, r, sa, ea) {
//        assert(geo.canvas);

        var ctx = geo.ctx;
        var cx = geo.tx(x);
        var cy = geo.ty(y);
        var c = ', ';

        ctx.beginPath();
        ctx.arc(cx, cy, r, sa, ea, false);
        ctx.stroke();
    }

    /**
     *  Create a point from and x- and y-coordinates.  The coordinates can
     *  either be numbers or an object with x and y attributes.
     *
     *  @constructor
     *  @param {arglist} 	Either x, y or {x: x, y: y}.
     *  @returns {geo.Point}	
     */
    var Point = geo.Point = function() {
        var pt = this;
        var len = arguments.length;

        switch (len) {
        case 1:
            var opts = arguments[0];

            pt._x = (opts.x === undefined ? 0 : opts.x);
            pt._y = (opts.y === undefined ? 0 : opts.y);
            return pt;

        case 2:
            pt._x = arguments[0];
            pt._y = arguments[1];
            return pt;

        default:
            throw 'geo.Point: arguments invalid ' + arguments;
        }

        return pt;
    };

    Point.prototype.x = function(v0) { if (v0 === undefined) return this._x; this._x = v0; return this; };
    Point.prototype.y = function(v0) { if (v0 === undefined) return this._y; this._y = v0; return this; };

    Point.prototype.toString = function() {
        return 'geo.Point(' + this._x + ', ' + this._y + ')';
    };

    Point.prototype.self = function() {
        return Point;
    }

    Point.prototype.equal = function(pt) {
        return geo.equal(pt.x(), this.x()) && geo.equal(pt.y(), this.y());
    };

    Point.prototype.draw = function(style) {
        var pt = this;
        var ctx = geo.canvas.context();

//        printf('Point.draw: ' + pt);
        if (style)
            ctx.style(style)
        else {
            ctx.strokeStyle('blue');
            ctx.fillStyle('blue');
        }
        geo.circle(pt._x, pt._y, 7);
    }

    /**
     *  Return a copy of this Point.
     *
     *  @returns {Point}	Copy of this Point.
     */
    Point.prototype.copy = function() {
        var pt = this;

        return new Point(pt.x(), pt.y());
    };

    /**
     *  Find the point in points closest to this Point.
     *
     *  @param {arglist}	Either an array of points or an arglist.
     *  @returns {Point}	Point closest to this Point
     */
    Point.prototype.closest = function(pts) {
        var pt = this;
        var points = (pts instanceof Array ? pts : arguments);
        var best = null;
        var dist = null;

        for (var pt2, i=0; pt2=points[i], i<points.length; i++) {
            var d = geo.distance2(pt, pt2);

            if (dist === null || d < dist) {
                best = pt2;
                dist = d;
            }
        }

        return best;
    };

    /**
     *  Euclidean distance between this Point and another Point.
     *
     *  @param {Point}		The other point.
     *  @returns {number}	Distance between the points.
     */
    Point.prototype.distance = function(pt2) {
        var pt1 = this;

        return geo.distance(pt1.x(), pt1.y(), pt2.x(), pt2.y());
    };

    /**
     *  Rotate this Point around a center by an angle and return the resulting Point.
     *
     *  @param {Point}		Center to rotate around.
     *  @param {number}		Angle (radians) to rotate by.
     *  @returns {goint}	New point after rotation.
     */
    Point.prototype.rotate = function(center, theta) {
        var pt = this;

        return new Point(geo.rotate(pt.x(), pt.y(), center.x(), center.y(), theta));

        var cx = center.x();
        var cy = center.y();
        var x = pt.x() - cx;
        var y = pt.y() - cy;

        return new Point(cx + x * Math.cos(theta) - y * Math.sin(theta),
                         cy + x * Math.sin(theta) + y * Math.cos(theta));
    };

    /**
     *  Return a new point that is on the line between center and pt2 and at
     *  the same distance from this point.  This method is useful when the
     *  user can drag a point to a new location (pt2), but the move is
     *  constrained by the distance to the center to be maintained.
     *
     *  @param {Point}		Center.
     *  @param {Point}		Second point
     *  @returns {Point}	Closest point on line between center and this point.
     */
    Point.prototype.rotate_with_center = function(center, pt2) {
        var pt1 = this;
        var r = geo.distance(pt.x(), pt.y(), center.x(), center.y());
        var ln2 = new Line(center, pt2);
        var c = new Circle(center, r);
        var pts = c.intersection(ln2);

        if (pts.length !== 2) {
            var pt1 = pts[0];
            var pt2 = pts[1];
            var d1 = geo.distance(pt1.x(), pt1.y(), pt.x(), pt.y());
            var d2 = geo.distance(pt2.x(), pt2.y(), pt.x(), pt.y());

            if (d1 < d2)
                return pt1.copy();
            return pt2.copy();
        }

        throw 'geo.Point.rotate_with_center: number of intersection points is not 2';
    };

    /**
     *  Returns the rotation angle between this point and pt2 given
     *  center.
     *
     *  @param {Point}		Center.
     *  @param {Point}		Reference point.
     *  @returns {number}	Degrees
     */
    Point.prototype.rotation_angle = function(center, pt2) {
        var pt1 = this;
        var a = pt2.distance(center);
        var b = pt1.distance(center);
        var c = pt1.distance(pt2);

        var gamma = Math.acos((a*a + b*b - c*c) / (2 * a * b));

        return gamma;
    }


    /*------------------------------------------------------------
     *  Line - infinite line
     *------------------------------------------------------------*/

    /**
     *  Create a line from two points.
     *
     *  @constructor
     *  @param {arglist}  Either x1, y1, x2, y2; or Point1, Point2, or {x1: x1, ...}
     *  @returns {geo.Point}	
     */
    var Line = geo.Line = function(opts) {
        var ln = this;
        var len = arguments.length;

        switch (len) {
        case 1:
            var opts = arguments[0];

            if (opts.p && opts.q) {
                ln._p = opts.p.copy();
                ln._q = opts.q.copy();
            } else {
                ln._p = new Point(opts.x1, opts.y1);
                ln._q = new Point(opts.x2, opts.y2);
            }

            return ln;

        case 2:
            ln._p = arguments[0].copy();
            ln._q = arguments[1].copy();
            return ln;

        case 4:
            ln._p = new Point(arguments[0], arguments[1]);
            ln._q = new Point(arguments[2], arguments[3]);
            return ln;

        default:
            throw 'geo.Line: arguments invalid ' + arguments;
        }
    };

    Line.prototype.p = function() { return this._p; };
    Line.prototype.q = function() { return this._q; };

    Line.prototype.toString = function() {
        var ln = this;
        var c = ', ';

        return 'geo.Line(' + ln._p._x + c + ln._p._y + c + ln._q._x + c + ln._q._y + ')';
    };

    Line.prototype.self = function() {
        return Line;
    }

    Line.prototype.copy = function() {
        return new Line(this._p.copy(), this._q.copy());
    }

    Line.prototype.equal = function(ln2) {
        var ln = this;

        return ln.self() === ln2.self() &&
            geo.equal(ln.x1(), ln2.x1()) &&
            geo.equal(ln.x2(), ln2.x2()) &&
            geo.equal(ln.y1(), ln2.y1()) &&
            geo.equal(ln.y2(), ln2.y2());
    }

    Line.prototype.start = function() {
        return this._p.copy();
    }

    Line.prototype.end = function() {
        return this._q.copy();
    }

    Line.prototype.draw = function(style) {
        var ln = this;
        var ctx = geo.canvas.context();
        var rect = rectangle(geo.bx, geo.by, geo.bw, geo.bh);

//        printf('Line.draw: ' + ln);
        if (style)
            ctx.style(style)
        else {
            ctx.strokeStyle('black');
            ctx.fillStyle('black');
        }
        geo.circle(ln._p._x, ln._p._y, 5);
        geo.circle(ln._q._x, ln._q._y, 5);

        var pts = rect.intersection(ln);

        if (pts.length !== 2) {
            { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('   ' + ln); } else console.log('   ' + ln); };
            for (var pt, i=0; pt=pts[i], i<pts.length; i++) {
                { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print(i + ' ' + pt); } else console.log(i + ' ' + pt); };
            }
            throw 'Line.draw not two points';
        } else
            geo.line(pts[0].x(), pts[0].y(), pts[1].x(), pts[1].y());
    }

    Line.prototype.x1 = function(val) {
        var l = this;

        if (val === undefined)
            return l._p._x;
        l._p._x = val;

        return l;
    }

    Line.prototype.x2 = function(val) {
        var l = this;

        if (val === undefined)
            return l._q._x;
        l._q._x = val;

        return l;
    }

    Line.prototype.y1 = function(val) {
        var l = this;

        if (val === undefined)
            return l._p._y;
        l._p._y = val;

        return l;
    }

    Line.prototype.y2 = function(val) {
        var l = this;

        if (val === undefined)
            return l._q._y;
        l._q._y = val;

        return l;
    }

    /**
     *  See geo.slope().
     */
    Line.prototype.slope = function() {
        var ln = this;

        return geo.slope(ln._p.x(), ln._p.y(), ln._q.x(), ln._q.y());
    }

    /**
     *  See geo.intercept().
     */
    Line.prototype.intercept = function() {
        var ln = this;

        return geo.intercept(ln._p.x(), ln._p.y(), ln._q.x(), ln._q.y());
    }

    /**
     *  Rotate this Line angle radians around a center.
     *
     *  @param {Point} Center.
     *  @param {number} Angle.
     *  @returns {Line} New line after the rotation.
     */
    Line.prototype.rotate = function(center, angle) {
        var ln = this;
        var p2 = ln.p().rotate(center, angle);
        var q2 = ln.q().rotate(center, angle);

        return new Line(p2, q2);
    }

    /**
     *  Coerce this Line to a Ray.
     */
    Line.prototype.ray = function() {
        return new Ray(this.p().copy(), this.q().copy());
    }

    /**
     *  Coerce this Line to a Segment.
     */
    Line.prototype.segment = function() {
        return new Segment(this.p().copy(), this.q().copy());
    }

    /**
     *  Given a y-coordinate on this Line, return the corresponding x.
     *
     *  @param {number} y - coordinate.
     *  @param {number|null} x - X-coordinate.
     */
    Line.prototype.x = function(y) {
        var ln = this;
        var m = ln.slope();

        if (m === null)
            return null;

        var b = ln.intercept();

        return (y - b) / m;
    }

    /**
     *  Give an x-coordinate on this Line, return the corresponding y.
     *
     *  @param {number} x - coordinate.
     *  @param {number|null} y - Y-coordinate.
     */
    Line.prototype.y = function(x) {
        var ln = this;
        var m = ln.slope();

        if (m === null)
            return null;

        var b = ln.intercept();

        return m * x + b;
    }

    Line.prototype.contains = function(pt) {
        var ln = this;

        return geo.collinear(ln.p(), pt, ln.q());
    }

    Line.prototype.in_range = function(pt) {
        return true;
    }

    /**
     *  Returns the intersection point of this Line and ln2.  
     *
     *  @param {Line} The other line.
     *  @returns {Point|null} Intersection point.
     */
    Line.prototype.intersection = function(ln2) {
        var ln1 = this;
        var pt = geo.intersection(ln1.p(), ln1.q(), ln2.p(), ln2.q());

        return (pt ? (ln2.in_range(pt) ? pt : null) : null);
    }

    /** Returns a line that is perpendicular to this line
     *  and goes through the argument pt.
     *
     *  @param {Point} pt	Point on the line returned.
     *  @returns {Line}	Line perpendicular to this line at pt
     */
    Line.prototype.perpendicular = function(pt) {
        var ln = this;
        var m1 = ln.slope();
        var offset = 5;

        if (m1 === null)
            return new Line({ p: pt.copy(),
                              q: new Point({ x: pt.x() + offset,
                                             y: pt.y()
                                           })
                            });

        if (m1 === 0)
            return new Line({ p: pt.copy(),
                              q: new Point({ x: pt.x(),
                                             y: pt.y() + offset
                                           })
                            });

        var m2 = - (1/m1);
        var i2 = -(m2 * pt.x()) + pt.y();
        var y = (pt.x() + offset) * m2 + i2;

        return new Line({ p: pt.copy(),
                          q: new Point({ x: pt.x() + offset, y: y})
                        });
    }

    /**
     *  Returns true when the line is horizontal.
     */
    Line.prototype.horizontal = function() {
        var ln = this;

        return ln._p.y() === ln._q.y();
    }

    /**
     *  Returns true when the line is vertical.
     */
    Line.prototype.vertical = function() {
        var ln = this;

        return ln._p.x() === ln._q.x();
    }

    /**
     *  Find a point on this line that is distance d away from p1
     *  in the direction of p2.  Both p1 and p2 must be on
     *  this Line.
     *
     *  @param {p1}	Point on this Line (not checked)
     *  @param {p2}	Point on this Line (not checked)
     *  @param {d}	Distance from p1 
     *  @return {Point}	New point on this line that is d away from p1
     */
    Line.prototype.point_at_distance = function(p1, p2, d) {
        var ln = this;

        if (ln.horizontal()) {
            if (p2.x() > p1.x())
                return new Point(p1.x()+d, p1.y());
            return new Point(p1.x()-d, p1.y());
        }

        if (ln.vertical()) {
            if (p2.y() > p1.y())
                return new Point(p1.x(), p1.y()+d);
            return new Point(p1.x(), p1.y()-d);
        }

        return p2.closest(ln.points_at_distance(p1,d));
    }

    /**
     *  Find two points on this line that are a certain distance away from
     *  another point on this line.
     *
     *  @param {p}	Point on this line (not checked)
     *  @param {d}	Distance from p
     *  @return {Point}	New point on this line that is d away from p
     */
    Line.prototype.points_at_distance = function(p, d) {
        var ln = this;

        if (ln.horizontal())
            return [new Point(p.x()+d, p.y()), new Point(p.x()-d, p.y())];

        if (ln.vertical())
            return [new Point(p.x(), p.y()+d), new Point(p.x(), p.y()-d)];

        var a = ln.slope();
        var unit_d = Math.sqrt(a*a + 1);
        var factor = d / unit_d;

        var px1 = p.x() + factor;
        var py1 = p.y() + factor * a;
        var px2 = p.x() - factor;
        var py2 = p.y() - factor * a;

        return [new Point(px1,py1), new Point(px2,py2)];
    }

    Line.prototype.angle = function(ln2) {
        var ln1 = this;
        var angle1 = Math.atan2(ln1.y1() - ln1.y2(),
                                ln1.x1() - ln1.x2());
        var angle2 = Math.atan2(ln2.y1() - ln2.y2(),
                                ln2.x1() - ln2.x2());

/*
        angle1 = geo.normal_angle(angle1);
        angle2 = geo.normal_angle(angle2);
*/
        return angle2 - angle1;
    }


    /*------------------------------------------------------------
     *  Ray - line starting in one point and extending
     *------------------------------------------------------------*/

    var Ray = geo.Ray = function() {
        var r = this;

        Line.apply(r, arguments);

        return r;
    }

    ist.extend(Ray, Line);

    Ray.prototype.toString = function() {
        var r = this;

        return sprintf('geo.Ray(%d, %d, %d, %s)', r.x1(), r.y1(), r.x2(), r.y2());
    }

    Ray.prototype.self = function() {
        return Ray;
    }

    Ray.prototype.copy = function() {
        return new Ray(this.p(), this.q());
    }

    /**
     *  Coerce this Line to a Ray.
     */
    Ray.prototype.line = function() {
        return new Line(this.p().copy(), this.q().copy());
    }

    /**
     *  Coerce this Line to a Segment.
     */
    Ray.prototype.segment = function() {
        return new Segment(this.p().copy(), this.q().copy());
    }

    /**
     *  We know the argument point is on the line of this Ray.
     *  Succeed if it is also on the ray itself.
     */
    Ray.prototype.in_range = function(pt) {
        var r = this;
        var p = r.p();
        var q = r.q();

        return (geo.sign(q.x() - p.x()) === geo.sign(pt.x() - p.x()))
            && (geo.sign(q.y() - p.y()) === geo.sign(pt.y() - p.y()));
    }

    Ray.prototype.intersection = function(obj) {
        var r = this;

        if (obj instanceof Arc) {
            var pts = obj.intersection(r);

            { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('pts.length ' + pts.length); } else console.log('pts.length ' + pts.length); };

            switch (pts.length) {
            case 0: return null;
            case 1: return pts[0];
            default: return obj.p().closest(pts);
            }

            { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('pts.length ' + pts.length); } else console.log('pts.length ' + pts.length); };
            return null;
        }

        var ln = obj;
        var pt = geo.intersection(r.p(), r.q(), ln.p(), ln.q());
        var p = r.p();
        var q = r.q();

//        printf('  intersection ' + pt);

        if (pt && r.in_range(pt) && ln.in_range(pt))
            return pt;

        return null;
    }

    Ray.prototype.move = function(x, y) {
        var r = this;

        if (arguments.length === 1) {
            x = arguments[0].x();
            y = arguments[0].y();
        }

        var dx = x - r._p._x;
        var dy = y - r._p._y;

        r._p._x = x;
        r._p._y = y;
        r._q._x += dx;
        r._q._y += dy;

        return r;
    }

    Ray.prototype.draw = function(style) {
        var r = this;
        var ctx = geo.canvas.context();
        var rect = rectangle(geo.bx, geo.by, geo.bw, geo.bh);

//        printf('Ray.draw: ' + r);

        if (style)
            ctx.style(style);
        else {
            ctx.strokeStyle('red');
            ctx.fillStyle('red');
        }
        geo.circle(r._p._x, r._p._y, 3);

        var pts = rect.intersection(r);

        if (pts.length !== 1) {
            { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('Ray.points not one ' + pts.length); } else console.log('Ray.points not one ' + pts.length); };
            { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('  ' + r); } else console.log('  ' + r); };
            { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('  ' + rect); } else console.log('  ' + rect); };
            for (var pt, i=0; pt=pts[i], i<pts.length; i++) {
                { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print(i + ' ' + pt); } else console.log(i + ' ' + pt); };
            }
//            ctx.lineWidth(3);
//            var ln = r.line();
//            ln.draw();
            throw 'Ray.draw not a single point';
        } else {
            ctx.lineWidth(1);
            geo.line(r._p._x, r._p._y, pts[0].x(), pts[0].y());
        }
    }


    /*------------------------------------------------------------
     *  Segment - straight line between two points
     *------------------------------------------------------------*/

    var Segment = geo.Segment = function() {
        Line.apply(this, arguments);
    }

    ist.extend(Segment, Ray);

    Segment.prototype.toString = function() {
        var s = this;
        var c = ', ';

        return 'geo.Segment(' + s.x1() + c + s.y1() + c + s.x2() + c + s.y2() + ')';
    }

    Segment.prototype.self = function() {
        return Segment;
    }

    Segment.prototype.copy = function() {
        var s = this;

        return new Segment(s.x1(), s.y1(), s.x2(), s.y2());
    }

    /**
     *  Coerce this Line to a Line.
     */
    Segment.prototype.line = function() {
        return new Line(this.p().copy(), this.q().copy());
    }

    /**
     *  Coerce this Line to a Segment.
     */
    Segment.prototype.ray = function() {
        return new Ray(this.p().copy(), this.q().copy());
    }

    Segment.prototype.draw = function(style) {
        var s = this;
        var ctx = geo.canvas.context();

//        printf('Segment.draw: ' + s);
        if (style)
            ctx.style(style);
        else {
            ctx.strokeStyle('green');
        }
        geo.line(s.x1(), s.y1(), s.x2(), s.y2());

        return s;
    }

    Segment.prototype.contains = function(pt) {
        var s = this;

        return geo.collinear(s.p(), pt, s.q()) && geo.between(s.p(), pt, s.q());
    }

    Segment.prototype.in_range = function(pt) {
        var s = this;

        return geo.between(s.p(), pt, s.q());
    }

    Segment.prototype.intersection = function(ln) {
        var s = this;
        var pt = geo.intersection(s.p(), s.q(), ln.p(), ln.q());

        return (pt && geo.between(s.p(), pt, s.q()) ? pt : null);
    }


    /*------------------------------------------------------------
     *  Circle
     *------------------------------------------------------------*/

    /**
     *  Create a circle from a center point and a radius.
     */
    var Circle = geo.Circle = function() {
        var c = this;
        var len = arguments.length;

        switch (len) {
        case 1:
            var opts = arguments[0];

            c._center = opts.center.copy();
            c._radius = opts.radius;
            return c;

        case 2:
            c._center = arguments[0].copy();
            c._radius = arguments[1];
            return c;

        case 3:
            c._center = new geo.Point(arguments[0], arguments[1]);
            c._radius = arguments[2];
            return c;

        default:
            throw 'geo.Circle: arguments invalid ' + arguments;
        }
    };

    Circle.prototype.toString = function() {
        return 'Circle(' + this._center + ', ' + this._radius + ')';
    }

    Circle.prototype.center = function() {
        return this._center;
    }

    Circle.prototype.cx = function() {
        return this._center._x;
    }

    Circle.prototype.cy = function() {
        return this._center._y;
    }

    Circle.prototype.radius = function() {
        if (typeof(this._radius) === 'object')
            return this._radius.value();
        return this._radius;
    }

    Circle.prototype.angle = function(pt) {
        var c = this;
        var angle = Math.atan2(pt.y() - c.cy(),
                               pt.x() - c.cx());

        return angle;

    }

    /**
     *  Return an array of intersection points for the line.
     *  TBD -- intersection with another circle.
     */
    Circle.prototype.intersection = function(ln) {
        if (ln instanceof Line) {
            var c = this;

            var x1 = ln.x1();
            var y1 = ln.y1();
            var x2 = ln.x2();
            var y2 = ln.y2();
            var cx = c.center().x();
            var cy = c.center().y();
            var r = c.radius();

            //  Scale c to origin
            x1 -= cx; y1 -= cy; x2 -= cx; y2 -= cy;

            var dx = x2 - x1;
            var dy = y2 - y1;
            var dr = Math.sqrt(dx*dx + dy*dy);
            var D = x1 * y2 - x2 * y1;
            var disc = r*r * dr*dr - D*D;

            //  No solutions
            if (disc < 0)
                return [];

            var sub = Math.sqrt(disc);
            var dr2 = dr * dr;

            //  Tangent line
            if (disc === 0) {
                var x = cx + (D * dy + geo.sign2(dy) * dx * sub) / dr2;
                var y = cy + (-D * dx + Math.abs(dy) * sub) / dr2;

                return [new Point({x: x, y: y})];
            }

            //  Intersection
            var x1 = cx + (D * dy + geo.sign2(dy) * dx * sub) / dr2;
            var y1 = cy + (-D * dx + Math.abs(dy) * sub) / dr2;
            var x2 = cx + (D * dy - geo.sign2(dy) * dx * sub) / dr2;
            var y2 = cy + (-D * dx - Math.abs(dy) * sub) / dr2;

            return [ new Point({x: x1, y: y1}),
                     new Point({x: x2, y: y2})
                   ];
        }
        throw 'geo.Circle.intersection: argument not a geo.Line';
    }

    /**
     *  Create an arc from a center point, radius and two angles.
     */
    var Arc = geo.Arc = function() {
        var a = this;
        var len = arguments.length;

        switch (len) {
        case 1:
            var opts = arguments[0];

            a._center = opts.center.copy();
            a._radius = opts.radius;
            a._start_angle = opts.start;
            a._end_angle = opts.end;

            return a;

        case 4:
            a._center = arguments[0].copy();
            a._radius = arguments[1];
            a._start_angle = arguments[2];
            a._end_angle = arguments[3];

            return a;

        case 5:
            a._center = new geo.Point(arguments[0], arguments[1]);
            a._radius = arguments[2];
            a._start_angle = arguments[3];
            a._end_angle = arguments[4];

            return a;

        default:
            throw 'geo.Arc: arguments invalid ' + arguments;
        }
    };

    Arc.prototype.center = function() { return this._center; };
    Arc.prototype.radius = function() { return this._radius; };
    Arc.prototype.start_angle = function() { return this._start_angle; };
    Arc.prototype.end_angle = function() { return this._end_angle; };

    Arc.prototype.toString = function() {
        return 'geo.Arc(' + this.center() + ' ' + this.radius() + ' ' + geo.degrees(this.start_angle()) + ' ' + geo.degrees(this.end_angle());
    }

    Arc.prototype.start = function() {
        var a = this;

        return new geo.Point(a.cx() + a.radius() * Math.cos(a.start_angle()*Math.PI),
                             a.cy() + a.radius() * Math.sin(a.start_angle()*Math.PI));
    }

    Arc.prototype.end = function() {
        var a = this;

        return new geo.Point(a.cx() + a.radius() * Math.cos(a.end_angle()*Math.PI),
                             a.cy() + a.radius() * Math.sin(a.end_angle()*Math.PI));
    }

    Arc.prototype.cx = function() {
        return this._center._x;
    }

    Arc.prototype.cy = function() {
        return this._center._y;
    }

    Arc.prototype.draw = function(style) {
        var a = this;
        var ctx = geo.canvas.context();

        if (style)
            ctx.style(style);
        else
            ctx.strokeStyle('black');

        geo.arc(a.cx(), a.cy(), a.radius(), a.start_angle(), a.end_angle());
    }

    /**
     *  Return the points on a line that intersect with this Arc.
     *
     *  @param {Line}		Line to intersect with.
     *  @returns {Point[]}	Array of points on both this arc and Line.
     */
    Arc.prototype.intersection = function(ln) {
        var arc = this;
        var c = new geo.Circle(arc._center, arc._radius);
        var pts = c.intersection(ln);
        var rval = [];

        if (pts) {
            for (var pt, i=0; pt=pts[i], i<pts.length; i++) {
                var angle = c.angle(pt);

                if (angle >= arc._start_angle && angle <= arc._end_angle) {
                    rval.push(pt);
                    continue;
                }
            }
        }

        return rval;
    }


    /*------------------------------------------------------------
     *  Rectangle - mainly for intersection
     *------------------------------------------------------------*/

    var Rectangle = geo.Rectangle = function() {
        var rect = this;
        var len = arguments.length;

        switch (len) {
        case 1:
            var opts = arguments[0];

            rect._x = opts.x;
            rect._y = opts.y;
            rect._w = opts.w;
            rect._h = opts.h;

            return rect;

        case 2:
            var x1 = arguments[0].x();
            var y1 = arguments[0].y();
            var x2 = arguments[1].x();
            var y2 = arguments[1].y();

            rect._x = Math.min(x1, x2);
            rect._y = Math.min(y1, y2);
            rect._w = Math.abs(x1 - x2);
            rect._h = Math.abs(y1 - y2);

            return rect;

        case 4:
            rect._x = arguments[0];
            rect._y = arguments[1];
            rect._w = arguments[2];
            rect._h = arguments[3];

            return rect;

        default:
            throw 'geo.Rectangle: arguments invalid ' + arguments;
        };
    }

    Rectangle.prototype.x = function() { return this._x; };
    Rectangle.prototype.y = function() { return this._y; };
    Rectangle.prototype.w = function() { return this._w; };
    Rectangle.prototype.h = function() { return this._h; };

    Rectangle.prototype.toString = function() {
        return sprintf('geo.Rectangle(%s, %s, %s, %s)', this._x, this._y, this._w, this._h);
    }

    /**
     *  Intersection between this Rectangle and a line.
     *
     *  @param {Line} A line to intersect with.
     *  @return {Point[]} Array of (0, 1, 2) intersection points.
     */
    Rectangle.prototype.intersection = function(ln) {
        var rect = this;
        var pts = [];
        var x = rect._x;
        var y = rect._y;
        var w = rect._w;
        var h = rect._h;
        var pt;

//        printf('Rectangle.intersection ');
//        printf('  ' + rect);
//        printf('  ' + ln);

        var seg1 = segment(x, y, x, y+h);
        var seg2 = segment(x, y, x+w, y);
        var seg3 = segment(x+w, y, x+w, y+h);
        var seg4 = segment(x, y+h, x+w, y+h);

/**/
        if ((pt=ln.intersection(seg1))) pts.push(pt);
        if ((pt=ln.intersection(seg2))) pts.push(pt);
        if ((pt=ln.intersection(seg3))) pts.push(pt);
        if ((pt=ln.intersection(seg4))) pts.push(pt);
/**/

/*
        printf(' seg1 ' + seg1);
        pt = ln.intersection(seg1);
        printf('  ' + pt);
        if (pt)
            pts.push(pt);

        printf(' seg2 ' + seg2);
        pt = ln.intersection(seg2);
        printf('  ' + pt);
        if (pt)
            pts.push(pt);

        printf(' seg3 ' + seg3);
        pt = ln.intersection(seg3);
        printf('  ' + pt);
        if (pt)
            pts.push(pt);

        printf(' seg4 ' + seg4);
        pt = ln.intersection(seg4);
        printf('  ' + pt);
        if (pt)
            pts.push(pt);
*/

        return geo.remove_duplicates(pts);
    }


    /*------------------------------------------------------------
     *  Utility functions
     *------------------------------------------------------------*/

    /**
     *  Slope of a line going through two points.
     *
     *  @param {number}		X-coordinate of first point.
     *  @param {number}		Y-coordinate of first point.
     *  @param {number}		X-coordinate of second point.
     *  @param {number}		Y-coordinate of second point.
     *  @returns {null|number} Slope of the line, or null for vertical lines.
     */
    geo.slope = function(x1, y1, x2, y2) {
        if (x1 === x2)
            return null;
        return (y2-y1) / (x2-x1);
    }

    /**
     *  Intercept of a line going through two points.
     *
     *  @param {number}		X-coordinate of first point.
     *  @param {number}		Y-coordinate of first point.
     *  @param {number}		X-coordinate of second point.
     *  @param {number}		Y-coordinate of second point.
     *  @returns {null|number} Intercept of the line, or null for vertical lines.
     */
    geo.intercept = function(x1, y1, x2, y2) {
        var m = geo.slope(x1, y1, x2, y2);

        if (m === null)
            return null;
        return y1 - (m * x1);
    }

    /**
     *  Sign of a value.
     *
     *  @param {number}		Value.
     *  @returns {number}	Sign of value (1, 0, -1).
     */
    geo.sign = function(x) {
        return x > 0 ? 1 : x < 0 ? -1 : 0;
    };

    /**
     *  Sign of a value.
     *
     *  @param {number}		Value.
     *  @returns {number}	Sign of value (1, -1).
     */
    geo.sign2 = function(x) {
        return x < 0 ? -1 : 1;
    };

    /**
     *  Distance between two points.
     *
     *  @param {number}		X-coordinate of first point.
     *  @param {number}		Y-coordinate of first point.
     *  @param {number}		X-coordinate of second point.
     *  @param {number}		Y-coordinate of second point.
     *  @returns {number}	Distance between the two points.
     */
    geo.distance = function(x1, y1, x2, y2) {
        return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    };

    geo.distance2 = function(x1, y1, x2, y2) {
        return (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
    };

    /*
     *  Convert from radians to degrees.
     *
     *  @param {number}		Radians.
     *  @returns {number}	Degrees.
     */
    geo.degrees = function(rads) {
        return rads * 180 / Math.PI;
    }

    /*
     *  Convert from degrees to radians.
     *
     *  @param {number}		Degrees
     *  @returns {number}	Radians.
     */
    geo.radians = function(degrees) {
        return degrees * Math.PI / 180;
    }

    geo.rotate = function(x, y, cx, cy, theta) {
        var x = x - cx;
        var y = y - cy;

        return {
            x: cx + x * Math.cos(theta) - y * Math.sin(theta),
            y: cy + x * Math.sin(theta) + y * Math.cos(theta)
        };
    }

    geo.collinear = function(p, q, r) {
        { if (!(p instanceof Point)) { { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('assert: ' + "geometry.src" + ': ' + 1348 + ' ' + "p" + ' not a ' + "Point"); } else console.log('assert: ' + "geometry.src" + ': ' + 1348 + ' ' + "p" + ' not a ' + "Point"); }; return null;} };
        { if (!(q instanceof Point)) { { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('assert: ' + "geometry.src" + ': ' + 1349 + ' ' + "q" + ' not a ' + "Point"); } else console.log('assert: ' + "geometry.src" + ': ' + 1349 + ' ' + "q" + ' not a ' + "Point"); }; return null;} };
        { if (!(r instanceof Point)) { { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('assert: ' + "geometry.src" + ': ' + 1350 + ' ' + "r" + ' not a ' + "Point"); } else console.log('assert: ' + "geometry.src" + ': ' + 1350 + ' ' + "r" + ' not a ' + "Point"); }; return null;} };
        var px = p.x();
        var py = p.y();
        var qx = q.x();
        var qy = q.y();
        var rx = r.x();
        var ry = r.y();
        var diff = (qx - px) * (ry - py) - (rx - px) * (qy - py);

        return Math.abs(diff) < geo.epsilon;
    }

    geo.between = function(p, a, q) {
        var px = p.x();
        var py = p.y();
        var ax = a.x();
        var ay = a.y();
        var qx = q.x();
        var qy = q.y();
        var s = function(x, y) { return geo.smaller(x,y); };

        return ((s(px, ax) && s(ax, qx) && s(py, ay) && s(ay, qy)) ||
                (s(qx, ax) && s(ax, px) && s(qy, ay) && s(ay, py)));
    }

    geo.normal_angle = function(angle) {
        while (angle < 0)
            angle += Pi2;
        while (angle > Pi2)
            angle -= Pi2;
        return angle;
    };

    geo.intersection = function(p1, q1, p2, q2) {
        var m1 = geo.slope(p1.x(), p1.y(), q1.x(), q1.y());
        var m2 = geo.slope(p2.x(), p2.y(), q2.x(), q2.y());

        if (m1 === m2)
            return null;

        if (m1 === null) {
            var x = p1.x();
            var b2 = geo.intercept(p2.x(), p2.y(), q2.x(), q2.y());
            var y = m2 * x + b2;

            return new Point(x, y);
        }

        if (m2 === null) {
            var x = p2.x();
            var b1 = geo.intercept(p1.x(), p1.y(), q1.x(), q1.y());
            var y = m1 * x + b1;

            return new Point(x, y);
        }

        var b1 = geo.intercept(p1.x(), p1.y(), q1.x(), q1.y());
        var b2 = geo.intercept(p2.x(), p2.y(), q2.x(), q2.y());
        var x = (b2 - b1) / (m1 - m2);
        var y = m1 * x + b1;

        return new Point(x, y);
    }

    geo.equal = function(a, b) {
        return (Math.abs(a-b) < geo.epsilon);
    }

    geo.smaller = function(a, b) {
        return a < b || (Math.abs(a-b) < geo.epsilon);
    }

    geo.remove_duplicates = function(array) {
        for (var i=0; i<array.length; i++) {
            var elem = array[i];

            for (var j=i+1; j<array.length; ) {
                var other = array[j];

                if (elem.equal(other)) {
                    array.splice(j, 1);
                    continue;
                }
                j++;
            }
        }

        return array;
    };

    /*------------------------------------------------------------
     *  Short hands
     *------------------------------------------------------------*/

    function line(x1, y1, x2, y2) {
        return new Line(x1, y1, x2, y2);
    }

    function segment(x1, y1, x2, y2) {
        return new Segment(x1, y1, x2, y2);
    }

    function ray(x1, y1, x2, y2) {
        return new Ray(x1, y1, x2, y2);
    }

    function point(x, y) {
        return new Point(x, y);
    }

    function rectangle(x, y, w, h) {
        return new Rectangle(x, y, w, h);
    }
}).call(this);
