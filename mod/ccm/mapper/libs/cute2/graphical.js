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
        { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print(tab + gr); } else console.log(tab + gr); };

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
        { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('Graphical.rotate: not implemented'); } else console.log('Graphical.rotate: not implemented'); };
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
            for (var i=0; i<gr._recognisers.length; i++) {
                { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('  rec ' + gr._recognisers[i]); } else console.log('  rec ' + gr._recognisers[i]); };
                if (gr._recognisers[i].event(ev, gr))
                    return true;
            }
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

        { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('Graphical.in_event_area ' + x + c + y); } else console.log('Graphical.in_event_area ' + x + c + y); };
        { if (typeof(console) === 'undefined') { if (typeof(navigator) === 'undefined') print('   a ' + a); } else console.log('   a ' + a); };

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
