#   $Id$
#   
#   File	Makefile
#   Part of	CAP
#   Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
#   Purpose	Creating JavaScript using cpp
#   
#   Notice	Copyright (c) 2013  University of Twente
#   
#   History	28/03/13  (Created)
#   		16/05/13  (Last modified)


.SUFFIXES:	.less .css .src .web .js

SOURCES =	expression.js
TARGET =	cap.js

all:		$(SOURCES)
		cat $(SOURCES) > $(TARGET)

%.js:%.src
		gcc -E -x c -P -C $< > $@

%.html:%.web
		gcc -E -x c -P -C $< > $@

%.css:%.less
		lessc $< $@

clean:		
		rm -f $(SOURCES) $(TARGET)

