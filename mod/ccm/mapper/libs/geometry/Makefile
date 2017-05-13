#   $Id$
#   
#   File	Makefile
#   Part of	Basic geometry package
#   Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
#   Purpose	Creating JavaScript
#   
#   Notice	Copyright (c) 2014  University of Twente
#   
#   History	17/02/14  (Created)
#   		17/02/14  (Last modified)


.SUFFIXES:	.less .css .src .web .js

SOURCES =	geometry.js

INCLUDES =	../h/js.h ../h/goodies.js

all:		$(SOURCES) $(INCLUDES)
		cd ../h && $(MAKE)

%.js:%.src
		gcc -E -x c -P -C $< > $@

%.html:%.web
		gcc -E -x c -P -C $< > $@

%.css:%.less
		lessc $< $@

clean:		
		clean
		rm -f $(SOURCES)

