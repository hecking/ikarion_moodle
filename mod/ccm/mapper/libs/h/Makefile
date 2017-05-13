#   $Id$
#   
#   File	Makefile
#   Part of	Includes
#   Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
#   Purpose	Make
#   
#   Notice	Copyright (c) 2014  University of Twente
#   
#   History	28/01/14  (Created)
#   		17/02/14  (Last modified)


.SUFFIXES:	.less .css .h .js .src .web

SOURCES =	goodies.js

INCLUDES =	js.h goodies.h

all:		
		

%.js:%.src
		gcc -E -x c -P -C $< > $@

%.html:%.web
		gcc -E -x c -P -C $< > $@

%.css:%.less
		lessc $< $@

clean:		
		clean

