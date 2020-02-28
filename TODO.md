
[] 1. Heater T0 data never shows up next to red/white tick
	it shows the other two. sometimes worked when second extruder was not enabled
	original code does not have dual extruders but it does work consistently
[x]2. The graphs are shit and a waste of time in my view and should go altogether
[x]3. The third column contents can go altogether- we don’t need to be able to extrude/reverse as we have screen on printer for that- however, enable second extruder check box we need to keep for switching between dual and single extruder printers
[x]4. I would have it auto check temperatures every 3 seconds by default and get rid of the check box options for that
	i would need to look into this, angular gets the info from 
[x]5. Get rid of the speed and motors off boxes and buttons
[x]6. Change “controls” label to “Movement Controls”
[x]7. Change Middle column heading to “Temperature Control”
[x]8. Change middle column sub headings to “Name Off Temp Set Value/Target”
[x]9. Change “Heater T0” to “Extruder LHS” and “Heater T0” to “Extruder RHS”
[x]10. Change default temps from “0” to 220 for extruders and 60 for bed
[x]11. Instead of the temp graphs may have label that says: “Preheat 10°C above print temperatures”
[x]12. It should have a “connected” indicator up top next to name of printer- this should be easy as we are getting temp every 3 seconds so you should be getting data packets back beginning with “ok” every three seconds- if not then printer is turned off or not connected to network – you can see this data in the bottom right hand corner in commands window.
[x]13. Replace “Smoothieware webUI” with “Workshop 3DP webUI:”
[x]14. Get rid of the Language option for polish, just English as default.

[] add indicator for no filiment. and a suspended indicator(disable resume until suspended) "filiment out suspension"

[x]add a at temperature column to extruders and bed (red an green)
	maybe dont bother now it doesnt need 

[] find a way to get information about smoothie status (printing, not printing etc)
		smoothie appears to have a get command it is only referenced in the example of help output hetre: http://smoothieware.org/console-commands?s[]=get
		smoothie allso has some info in the network tab about quiries

[]add back graphs for the temperatures

[x] add reminder about filenames not containing spaces after the files

[] find a faster way to do file uploads
	look at example of file explorer 
	sftp is the suggest way, we are using http
	look at new web interface

	new interface is not an faster