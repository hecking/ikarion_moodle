#   $Id$
#   
#   File	Makefile
#   Part of	Cute
#   Author	Anjo Anjewierden, a.a.anjewierden@utwente.nl
#   Purpose	Creating a single cute.js and minimized cute_min.js
#   
#   Notice	Copyright (c) 2012, 2013, 2014  University of Twente
#   
#   History	06/08/12  (Created)
#   		17/02/14  (Last modified)


.SUFFIXES:	.less .css .h .js .src .web

TEMP=		euclid.js

SOURCES=	main.js context.js area.js point.js size.js \
		graphical.js drawable.js figure.js device.js plane.js canvas.js \
		circle.js box.js arrow.js joint.js line.js font.js text.js \
		connection.js handle.js link.js ellipse.js path.js \
		event.js modifier.js gesture.js move_gesture.js \
		resize_gesture.js \
		constraint_move_gesture.js colour.js \
		drag_drop_gesture.js click_gesture.js

TARGET =	cute.js

all:		$(TEMP) $(SOURCES) $(TARGET) 
		(cd ../geometry; make)

cute.js:	$(SOURCES) test.js
		cat $(SOURCES) > $(TARGET)

%.js:%.src
		gcc -E -x c -P -C $< > $@

%.html:%.web
		gcc -E -x c -P -C $< > $@

%.css:%.less
		lessc $< $@

clean:		
		rm -f $(SOURCES) $(TARGET)

