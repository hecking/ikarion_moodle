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
