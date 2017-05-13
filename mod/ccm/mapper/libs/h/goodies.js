/*  $Id$	-*- mode: javascript -*-
 *  
 *  File	goodies.js
 *  Part of	JavaScript
 *  Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
 *  Purpose	Goodies for JavaScript
 *  Works with	JavaScript
 *  
 *  Notice	Copyright (c) 2013, 2014  University of Twente
 *  
 *  History	16/04/13  (Created)
 *  		17/02/14  (Last modified)
 */ 

/*------------------------------------------------------------
 *  Directives
 *------------------------------------------------------------*/

"use strict";

(function() {
    //  Namespace for the goodies
    if (typeof(this.ist) === 'undefined') {
        this.ist = {};

        //  Use with js.h: extend(sub, super)
        if (typeof(this.ist.extend) === 'undefined') {
            this.ist.extend = function(sub_class, super_class) {
                var F = function() {};

                F.prototype = super_class.prototype;
                sub_class.prototype = new F();
                sub_class.prototype.constructor = sub_class;

                sub_class.superclass = super_class.prototype;
                if (super_class.prototype.constructor == Object.prototype.constructor)
                    super_class.prototype.constructor = super_class;
            };
        }

        //  Use with js.h: printf(str)
        if (typeof(this.ist.printf) === 'undefined') {
            this.ist.printf = function(str) {
                if (typeof(console) === 'undefined') {
                    if (typeof(navigator) === 'undefined')
                        print(str);
                } else
                    console.log(str);
                if (ist.debug) {
                    $(ist.debug).append(str).append('<br>');
                }
            };
        }
    }

    if (typeof(String.prototype.capitalize) === 'undefined') {
        String.prototype.capitalize = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
    }

    if (typeof(Array.prototype.random_element) === 'undefined') {
        Array.prototype.random_element = function() {
            return this[Math.floor(Math.random() * this.length)];
        };
    }

    if (typeof(Array.prototype.member) === 'undefined') {
        Array.prototype.member = function(elem) {
            return this.indexOf(elem) !== -1;
        };
    }

    if (typeof(Array.prototype.delete_element) === 'undefined') {
        Array.prototype.delete_element = function(elem) {
            for (var i=0; i<this.length;) {
                if (this[i] === elem) {
                    this.splice(i, 1);
                    continue;
                }
                i++;
            }
        };
    }
}).call(this);
