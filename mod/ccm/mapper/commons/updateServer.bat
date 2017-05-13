set target=\\win326.ad.utwente.nl\Go-Lab\sources\commons\
robocopy css %target%css /MIR /NFL /NDL
robocopy images %target%images /MIR /NFL /NDL
robocopy js %target%js /MIR /NFL /NDL
robocopy js %target%js /MIR /NFL /NDL
robocopy . %target% *.html
