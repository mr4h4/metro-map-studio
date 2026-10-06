/* Metro Map Studio — js/app.js
 * Extracted VERBATIM from the original single-file app (beno.uk/metromapcreator/).
 * Logic patches (marked MMS-PATCH inline):
 *  (3) station type 6 (pill): anchored end on the station point, body stretched
 *      toward the station direction, length lineNstationMw;
 *  (4) free texts: stations are silent; labels are lineNtextM entities placed
 *      anywhere with the Text tool (mode 5), draggable, persisted as
 *      lineNtexts / lineNtextMx / My / Mtext;
 *  (5) studio settings: mmsTextCol / mmsTextFont / mmsCanvasCol drive label
 *      color, label font and canvas background; persisted in the save code;
 *  (6) non-destructive view: mmsZoomK/mmsPanX/mmsPanY drive a persistent
 *      ctx transform (mouse coords mapped back); background paints identity;
 *      pointer coords clamped to the canvas so nothing is drawn off-sheet;'

 *  (1) host check also allows localhost/127.0.0.1/file: for local work
 *      (originals untouched in original/).
 *  (2) mouse coords use canvas.getBoundingClientRect() instead of hardcoded
 *      (clientX-178/clientY-4) so the canvas works in the new studio layout.
 */

  ;

  ;




//////////////////////////////////////////////////////
//////////////////////////////////////////////////////set up
//////////////////////////////////////////////////////


function moo(){
setTimeout("moosghjghjgh()",32)
}
function moosghjghjgh(){
var currentURL = window.location;
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.oncontextmenu = function (){return false} 
if ((currentURL.hostname == 'beno.uk') || (currentURL.hostname == 'www.beno.uk') || (currentURL.hostname == 'localhost') || (currentURL.hostname == '127.0.0.1') || (currentURL.hostname == '') || (currentURL.protocol == 'file:')){
document.getElementById('moocowwowyay').style.display = 'block'
wow()
}else{
alert('This app is from my website: beno.uk\nYou are not running it from this site.\n\nI have put a lot of time and effort to make this app for you.\nThe very least you can do in return is to run it from my website,\nso that my website gets lots of page views.\n\nOtherwise I will not feel like making any more games.')
}}


//////////////////////////////////////////////////////
//////////////////////////////////////////////////////set up vars
//////////////////////////////////////////////////////


numlines = 2
stat1q = 1.2
stat2q = 2
stat3q = 1.85
stat3aq = 1.2
stat4q = 1.2
stat4aq = 0.95
stat5q = 3;stat6q = 1.85;mmsTextCol = "#000000";mmsTextFont = "Arial";mmsCanvasCol = "#ffffff";mmsZoomK = 1;mmsPanX = 0;mmsPanY = 0;mmsDprK = 1;rivercol = "#2f80ed";riverwidth = 24;rivercurve = 6;parkcol = "#66bb6a";parkradius = 0;parkbwid = 0;parkbcol = "#000000";riverver = 0;riverhor = 0;rivertopleft = 0;rivertopright = 0;parks = 0;zonever = 0;zonehor = 0;zonetopleft = 0;zonetopright = 0;zonecol = "#9333ea";zonewidth = 4;seacol = "#38bdf8";seas = 0
stat5aq = 2.25




mousemodem = 0
mousemodeu = 0
mousemoded = 0

currentroute = 1

startx = 0
starty = 0
endx = 0
endy = 0
eendx = 0
eendy = 0
angleaa = 0

undo = 0
redo = 0

curvenum = 2
jumpnum = 2.4
cowpatuuuuu = 0
fontzsize = 8

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////at last! it is now time for the game
//////////////////////////////////////////////////////


function wow(){
textBoxmoo = document.getElementById("ttxt2");
    textBoxmoo.onclick = function() {
        textBoxmoo.select();
}
canvas.addEventListener('mousemove', ev_mousemove, false);
canvas.addEventListener('mousedown', ev_mousedown, false);
canvas.addEventListener('mouseup', ev_mouseup, false);
document.getElementById('blar1').checked = true;
setroutes(1);
drawmap(1)
routechange()
mousemoded = 1
}


function ev_mousemove (ev) {
var __r = canvas.getBoundingClientRect()
if (((typeof mmsZoomK) != "number") || (!(mmsZoomK > 0))){ mmsZoomK = 1; }
if (((typeof mmsPanX) != "number")){ mmsPanX = 0; }
if (((typeof mmsPanY) != "number")){ mmsPanY = 0; }
axmouse = Math.round(((ev.clientX - __r.left) - mmsPanX)/mmsZoomK)
aymouse = Math.round(((ev.clientY - __r.top) - mmsPanY)/mmsZoomK)
/* MMS-PATCH keep gestures inside the sheet: everything drawn is exported */
if (axmouse < 0){ axmouse = 0; }
if (aymouse < 0){ aymouse = 0; }
if (axmouse > (canvas.width/mmsDprK)){ axmouse = (canvas.width/mmsDprK); }
if (aymouse > (canvas.height/mmsDprK)){ aymouse = (canvas.height/mmsDprK); }

if (mousemodem == 3){
currentroutea = currentroute
currentroute = 1
s1 = axmouse
s2 = aymouse


while ((currentroute - 1) < numlines){
ss1 = startxjumper(axmouse, aymouse)
ss2 = startyjumper(aymouse, axmouse)
if (xjumped == 1){
s1 = ss1
}
if (yjumped == 1){
s2 = ss2
}
currentroute++
}
currentroute = currentroutea

ss1 = startxjumper(axmouse, aymouse)
ss2 = startyjumper(aymouse, axmouse)
if (xjumped == 1){
s1 = ss1
}
if (yjumped == 1){
s2 = ss2
}


if ((yjumped == 1) || (xjumped == 1)){
window['line' + currentroute + 'station' + (eval('line' + currentroute + 'stations')) + 'x'] = s1
window['line' + currentroute + 'station' + (eval('line' + currentroute + 'stations')) + 'y'] = s2
drawmap(0)
}}

if (mousemodem == 1){

endx = axmouse
endy = aymouse
if ((startx != endx) || (starty != endy)){
asdasd = ((Math.atan2((endx-startx),(endy-starty)))*(180/Math.PI) + 180)
angleaa = 0
mooaaa = (endx - startx)

if ((asdasd < 30) || (asdasd > 329)){
aeendx = startx
aeendy = endy
angleaa = 1
}

if ((asdasd < 60) && (asdasd > 29)){
aeendx = (startx + mooaaa)
aeendy = (starty + mooaaa)
angleaa = 2
}

if ((asdasd < 120) && (asdasd > 59)){
aeendx = endx
aeendy = starty
angleaa = 3
}

if ((asdasd < 150) && (asdasd > 119)){
aeendx = (startx + mooaaa)
aeendy = (starty - mooaaa)
angleaa = 4
}

if ((asdasd < 210) && (asdasd > 149)){
aeendx = startx
aeendy = endy
angleaa = 5
}

if ((asdasd < 240) && (asdasd > 209)){
aeendx = (startx + mooaaa)
aeendy = (starty + mooaaa)
angleaa = 6
}

if ((asdasd < 300) && (asdasd > 239)){
aeendx = endx
aeendy = starty
angleaa = 7
}

if ((asdasd < 330) && (asdasd > 299)){
aeendx = (startx + mooaaa)
aeendy = (starty - mooaaa)
angleaa = 8
}




s1 = startxjumper(aeendx, aeendy)
s2 = startyjumper(aeendy, aeendx)
endx = s1
endy = s2

mooaaa = (s1 - startx)


if ((asdasd < 30) || (asdasd > 329)){
eendx = startx
eendy = endy
angleaa = 1
}

if ((asdasd < 60) && (asdasd > 29)){
eendx = (startx + mooaaa)
eendy = (starty + mooaaa)
mooaaaa = startyjumper(eendy, eendx)
mooaaa = mooaaaa - starty
eendx = (startx + mooaaa)
eendy = (starty + mooaaa)
angleaa = 2
}

if ((asdasd < 120) && (asdasd > 59)){
eendx = endx
eendy = starty
angleaa = 3
}

if ((asdasd < 150) && (asdasd > 119)){
eendx = (startx + mooaaa)
eendy = (starty - mooaaa)
mooaaaa = startyjumper(eendy, eendx)
mooaaa = starty - mooaaaa
eendx = (startx + mooaaa)
eendy = (starty - mooaaa)
angleaa = 4
}

if ((asdasd < 210) && (asdasd > 149)){
eendx = startx
eendy = endy
angleaa = 5
}

if ((asdasd < 240) && (asdasd > 209)){
eendx = (startx + mooaaa)
eendy = (starty + mooaaa)
mooaaaa = startyjumper(eendy, eendx)
mooaaa = mooaaaa - starty
eendx = (startx + mooaaa)
eendy = (starty + mooaaa)

angleaa = 6
}

if ((asdasd < 300) && (asdasd > 239)){
eendx = endx
eendy = starty
angleaa = 7
}

if ((asdasd < 330) && (asdasd > 299)){
eendx = (startx + mooaaa)
eendy = (starty - mooaaa)
angleaa = 8
mooaaaa = startyjumper(eendy, eendx)
mooaaa = starty - mooaaaa
eendx = (startx + mooaaa)
eendy = (starty - mooaaa)
}









drawmap(0)
if ((startx != eendx) || (starty != eendy)){
ctx.strokeStyle = (eval ("line" + currentroute + "col"))
ctx.lineWidth = (eval ("line" + currentroute + "width"))
ctx.beginPath()
ctx.moveTo(startx,starty)
ctx.lineTo(eendx,eendy) 
ctx.stroke()
}}}



}


function ev_mouseup (ev) {

if (mousemodeu == 3){
/* MMS-PATCH silent stations: names are separate free-text labels (Text tool) */
window['line' + currentroute + 'station' + (eval('line' + currentroute + 'stations')) + 'text'] = ' '
drawmap(1)
mousemodem = 0
mousemodeu = 0
mousemoded = 3
undo++
redo = undo
window["undo" + undo] = ('line' + currentroute + 'station' + (eval('line' + currentroute + 'stations')) + 'type = 0')
window["redo" + undo] = ('line' + currentroute + 'station' + (eval('line' + currentroute + 'stations')) + 'type = ' + (eval('line' + currentroute + 'station' + (eval('line' + currentroute + 'stations')) + 'type')))
}

if (mousemodeu == 1){
if ((startx != endx) || (starty != endy)){
if ((startx != eendx) || (starty != eendy)){

if (angleaa == 1){
window['line' + currentroute + 'ver']++
window['line' + currentroute + 'ver' + (eval('line' + currentroute + 'ver')) + 'x'] = startx
window['line' + currentroute + 'ver' + (eval('line' + currentroute + 'ver')) + 'y1'] = eendy
window['line' + currentroute + 'ver' + (eval('line' + currentroute + 'ver')) + 'y2'] = starty
undo++
redo = undo
window["undo" + undo] = ("line" + currentroute + "ver--")
window["redo" + undo] = ("line" + currentroute + "ver++")
}

if (angleaa == 5){
window['line' + currentroute + 'ver']++
window['line' + currentroute + 'ver' + (eval('line' + currentroute + 'ver')) + 'x'] = startx
window['line' + currentroute + 'ver' + (eval('line' + currentroute + 'ver')) + 'y2'] = eendy
window['line' + currentroute + 'ver' + (eval('line' + currentroute + 'ver')) + 'y1'] = starty
undo++
redo = undo
window["undo" + undo] = ("line" + currentroute + "ver--")
window["redo" + undo] = ("line" + currentroute + "ver++")
}

if (angleaa == 3){
window['line' + currentroute + 'hor']++
window['line' + currentroute + 'hor' + (eval('line' + currentroute + 'hor')) + 'y'] = starty
window['line' + currentroute + 'hor' + (eval('line' + currentroute + 'hor')) + 'x1'] = eendx
window['line' + currentroute + 'hor' + (eval('line' + currentroute + 'hor')) + 'x2'] = startx
undo++
redo = undo
window["undo" + undo] = ("line" + currentroute + "hor--")
window["redo" + undo] = ("line" + currentroute + "hor++")
}

if (angleaa == 7){
window['line' + currentroute + 'hor']++
window['line' + currentroute + 'hor' + (eval('line' + currentroute + 'hor')) + 'y'] = starty
window['line' + currentroute + 'hor' + (eval('line' + currentroute + 'hor')) + 'x2'] = eendx
window['line' + currentroute + 'hor' + (eval('line' + currentroute + 'hor')) + 'x1'] = startx
undo++
redo = undo
window["undo" + undo] = ("line" + currentroute + "hor--")
window["redo" + undo] = ("line" + currentroute + "hor++")
}

if (angleaa == 6){
window['line' + currentroute + 'topleft']++
window['line' + currentroute + 'topleft' + (eval('line' + currentroute + 'topleft')) + 'x'] = startx
window['line' + currentroute + 'topleft' + (eval('line' + currentroute + 'topleft')) + 'y'] = starty
window['line' + currentroute + 'topleft' + (eval('line' + currentroute + 'topleft')) + 'width'] = mooaaa
undo++
redo = undo
window["undo" + undo] = ("line" + currentroute + "topleft--")
window["redo" + undo] = ("line" + currentroute + "topleft++")
}


if (angleaa == 4){
window['line' + currentroute + 'topright']++
window['line' + currentroute + 'topright' + (eval('line' + currentroute + 'topright')) + 'x'] = startx
window['line' + currentroute + 'topright' + (eval('line' + currentroute + 'topright')) + 'y'] = starty
window['line' + currentroute + 'topright' + (eval('line' + currentroute + 'topright')) + 'width'] = (0 - mooaaa)
undo++
redo = undo
window["undo" + undo] = ("line" + currentroute + "topright--")
window["redo" + undo] = ("line" + currentroute + "topright++")
}


if (angleaa == 2){
window['line' + currentroute + 'topleft']++
window['line' + currentroute + 'topleft' + (eval('line' + currentroute + 'topleft')) + 'x'] = (startx + mooaaa)
window['line' + currentroute + 'topleft' + (eval('line' + currentroute + 'topleft')) + 'y'] = (starty + mooaaa)
window['line' + currentroute + 'topleft' + (eval('line' + currentroute + 'topleft')) + 'width'] = (0 - mooaaa)
undo++
redo = undo
window["undo" + undo] = ("line" + currentroute + "topleft--")
window["redo" + undo] = ("line" + currentroute + "topleft++")
}



if (angleaa == 8){
window['line' + currentroute + 'topright']++
window['line' + currentroute + 'topright' + (eval('line' + currentroute + 'topright')) + 'x'] = (startx + mooaaa)
window['line' + currentroute + 'topright' + (eval('line' + currentroute + 'topright')) + 'y'] = (starty - mooaaa)
window['line' + currentroute + 'topright' + (eval('line' + currentroute + 'topright')) + 'width'] = mooaaa
undo++
redo = undo
window["undo" + undo] = ("line" + currentroute + "topright--")
window["redo" + undo] = ("line" + currentroute + "topright++")
}



}}
mousemodem = 0
mousemodeu = 0
mousemoded = 1
drawmap(1)
}

}

function ev_mousedown (ev) {

var __r = canvas.getBoundingClientRect()
if (((typeof mmsZoomK) != "number") || (!(mmsZoomK > 0))){ mmsZoomK = 1; }
if (((typeof mmsPanX) != "number")){ mmsPanX = 0; }
if (((typeof mmsPanY) != "number")){ mmsPanY = 0; }
axmouse = Math.round(((ev.clientX - __r.left) - mmsPanX)/mmsZoomK)
aymouse = Math.round(((ev.clientY - __r.top) - mmsPanY)/mmsZoomK)
/* MMS-PATCH keep gestures inside the sheet: everything drawn is exported */
if (axmouse < 0){ axmouse = 0; }
if (aymouse < 0){ aymouse = 0; }
if (axmouse > (canvas.width/mmsDprK)){ axmouse = (canvas.width/mmsDprK); }
if (aymouse > (canvas.height/mmsDprK)){ aymouse = (canvas.height/mmsDprK); }


if (mousemoded == 1){
s1 = startxjumper(axmouse, aymouse)
s2 = startyjumper(aymouse, axmouse)
startx = s1
starty = s2
endx = s1
endy = s2
eendx = s1
eendy = s2
angleaa = 0
mousemodem = 1
mousemodeu = 1
mousemoded = 0
}

if (mousemoded == 4){
s1 = axmouse
s2 = aymouse

q5 = 1
q6 = eval('line' + currentroute + 'stations')


while((q5 - 1) < q6){

if ((axmouse - ((eval('line' + currentroute + 'width')) * 2)) < (eval('line' + currentroute + 'station' + q5 + 'x'))){
if ((axmouse + ((eval('line' + currentroute + 'width')) * 2)) > (eval('line' + currentroute + 'station' + q5 + 'x'))){
if ((aymouse - ((eval('line' + currentroute + 'width')) * 2)) < (eval('line' + currentroute + 'station' + q5 + 'y'))){
if ((aymouse + ((eval('line' + currentroute + 'width')) * 2)) > (eval('line' + currentroute + 'station' + q5 + 'y'))){


undo++
redo = undo
window["undo" + undo] = ('line' + currentroute + 'station' + q5 + 'type = ' + (eval('line' + currentroute + 'station' + q5 + 'type')))
window["redo" + undo] = ('line' + currentroute + 'station' + q5 + 'type = 0')
window['line' + currentroute + 'station' + q5 + 'type'] = 0


}}}}
q5++
}
mmsTxDN = 0;
try { mmsTxDN = eval('line' + currentroute + 'texts'); } catch (mmsTxE5) { mmsTxDN = 0; }
mmsTxD = 1;
while((mmsTxD - 1) < mmsTxDN){
if ((axmouse - ((eval('line' + currentroute + 'width')) * 2)) < (eval('line' + currentroute + 'text' + mmsTxD + 'x'))){
if ((axmouse + ((eval('line' + currentroute + 'width')) * 2)) > (eval('line' + currentroute + 'text' + mmsTxD + 'x'))){
if ((aymouse - ((eval('line' + currentroute + 'width')) * 2)) < (eval('line' + currentroute + 'text' + mmsTxD + 'y'))){
if ((aymouse + ((eval('line' + currentroute + 'width')) * 2)) > (eval('line' + currentroute + 'text' + mmsTxD + 'y'))){
window['line' + currentroute + 'text' + mmsTxD + 'text'] = "";
}}}}
mmsTxD++;
}
drawmap(1)
}


if (mousemoded == 3){
currentroutea = currentroute
currentroute = 1
s1 = axmouse
s2 = aymouse


while ((currentroute - 1) < numlines){
ss1 = startxjumper(axmouse, aymouse)
ss2 = startyjumper(aymouse, axmouse)
if (xjumped == 1){
s1 = ss1
}
if (yjumped == 1){
s2 = ss2
}
currentroute++
}
currentroute = currentroutea

ss1 = startxjumper(axmouse, aymouse)
ss2 = startyjumper(aymouse, axmouse)
if (xjumped == 1){
s1 = ss1
}
if (yjumped == 1){
s2 = ss2
}




if ((yjumped == 1) || (xjumped == 1)){
window['line' + currentroute + 'stations']++
chosen = ""
len = document.frm3.qkk.length
for (i = 0; i <len; i++) {
if (document.frm3.qkk[i].checked) {
chosen = document.frm3.qkk[i].value
}
}
window['line' + currentroute + 'station' + (eval('line' + currentroute + 'stations')) + 'type'] = eval(chosen)
chosen = ""
len = document.frm3.qk.length
for (i = 0; i <len; i++) {
if (document.frm3.qk[i].checked) {
chosen = document.frm3.qk[i].value
}
}
window['line' + currentroute + 'station' + (eval('line' + currentroute + 'stations')) + 'dir'] = eval(chosen)
window['line' + currentroute + 'station' + (eval('line' + currentroute + 'stations')) + 'x'] = s1
window['line' + currentroute + 'station' + (eval('line' + currentroute + 'stations')) + 'y'] = s2
window['line' + currentroute + 'station' + (eval('line' + currentroute + 'stations')) + 'text'] = ' '
drawmap(0)
mousemodem = 3
mousemodeu = 3
mousemoded = 0
}}



if (mousemoded == 5){
/* MMS-PATCH free text: placed anywhere, no snap; content via prompt */
mmsTextT = prompt('Label text','');
if ((mmsTextT != null) && (mmsTextT != "")){
mmsTextN = 0;
try { mmsTextN = eval("line" + currentroute + "texts"); } catch (mmsTextE6) { mmsTextN = 0; }
if (((typeof mmsTextN) != "number") || (!(mmsTextN >= 0))){ mmsTextN = 0; }
window["line" + currentroute + "texts"] = (mmsTextN + 1);
window["line" + currentroute + "text" + (mmsTextN + 1) + "x"] = axmouse;
window["line" + currentroute + "text" + (mmsTextN + 1) + "y"] = aymouse;
window["line" + currentroute + "text" + (mmsTextN + 1) + "text"] = mmsTextT;
drawmap(1);
}
mousemodem = 0;
mousemodeu = 0;
mousemoded = 5;
}


if (mousemoded == 2){
s1 = startxjumper(axmouse, aymouse)
s2 = startyjumper(aymouse, axmouse)

qq1 = currentroute

qq2 = 1
while ((qq2 - 1) < (eval ("line" + qq1 + "ver"))){
if (((eval ("line" + qq1 + "ver" + qq2 + "x")) == s1) && ((eval ("line" + qq1 + "ver" + qq2 + "y1")) <= s2) && ((eval ("line" + qq1 + "ver" + qq2 + "y2")) >= s2)){
undo++
redo = undo
window["undo" + undo] = ("line" + qq1 + "ver" + qq2 + "x = " + eval("line" + qq1 + "ver" + qq2 + "x") + ";line" + qq1 + "ver" + qq2 + "y1 = " + eval("line" + qq1 + "ver" + qq2 + "y1") + ";line" + qq1 + "ver" + qq2 + "y2 = " + eval("line" + qq1 + "ver" + qq2 + "y2"))
window["redo" + undo] = ("line" + qq1 + "ver" + qq2 + "x = " + -10 + ";line" + qq1 + "ver" + qq2 + "y1 = " + -10 + ";line" + qq1 + "ver" + qq2 + "y2 = " + -10)
eval(eval("redo" + undo))
drawmap(1)
}
qq2++
}
qq2 = 1
while ((qq2 - 1) < (eval ("line" + qq1 + "hor"))){
if (((eval ("line" + qq1 + "hor" + qq2 + "y")) == s2) && ((eval ("line" + qq1 + "hor" + qq2 + "x1")) <= s1) && ((eval ("line" + qq1 + "hor" + qq2 + "x2")) >= s1)){
undo++
redo = undo
window["undo" + undo] = ("line" + qq1 + "hor" + qq2 + "y = " + eval("line" + qq1 + "hor" + qq2 + "y") + ";line" + qq1 + "hor" + qq2 + "x1 = " + eval("line" + qq1 + "hor" + qq2 + "x1") + ";line" + qq1 + "hor" + qq2 + "x2 = " + eval("line" + qq1 + "hor" + qq2 + "x2"))
window["redo" + undo] = ("line" + qq1 + "hor" + qq2 + "y = " + -20 + ";line" + qq1 + "hor" + qq2 + "x1 = " + -20 + ";line" + qq1 + "hor" + qq2 + "x2 = " + -20)
eval(eval("redo" + undo))
drawmap(1)
}
qq2++
}

qq2 = 1
while ((qq2 - 1) < (eval ("line" + qq1 + "topleft"))){
if (((eval ("line" + qq1 + "topleft" + qq2 + "y")) == s2) && ((eval ("line" + qq1 + "topleft" + qq2 + "x")) == s1)){
undo++
redo = undo
window["undo" + undo] = ("line" + qq1 + "topleft" + qq2 + "y = " + eval("line" + qq1 + "topleft" + qq2 + "y") + ";line" + qq1 + "topleft" + qq2 + "x = " + eval("line" + qq1 + "topleft" + qq2 + "x") + ";line" + qq1 + "topleft" + qq2 + "width = " + eval("line" + qq1 + "topleft" + qq2 + "width"))
window["redo" + undo] = ("line" + qq1 + "topleft" + qq2 + "y = " + -30 + ";line" + qq1 + "topleft" + qq2 + "x = " + -30 + ";line" + qq1 + "topleft" + qq2 + "width = " + 0)
eval(eval("redo" + undo))
drawmap(1)
}
qq2++
}

qq2 = 1
while ((qq2 - 1) < (eval ("line" + qq1 + "topleft"))){
if ((((eval ("line" + qq1 + "topleft" + qq2 + "y")) + (eval ("line" + qq1 + "topleft" + qq2 + "width"))) == s2) && (((eval ("line" + qq1 + "topleft" + qq2 + "x")) + (eval ("line" + qq1 + "topleft" + qq2 + "width"))) == s1)){
undo++
redo = undo
window["undo" + undo] = ("line" + qq1 + "topleft" + qq2 + "y = " + eval("line" + qq1 + "topleft" + qq2 + "y") + ";line" + qq1 + "topleft" + qq2 + "x = " + eval("line" + qq1 + "topleft" + qq2 + "x") + ";line" + qq1 + "topleft" + qq2 + "width = " + eval("line" + qq1 + "topleft" + qq2 + "width"))
window["redo" + undo] = ("line" + qq1 + "topleft" + qq2 + "y = " + -30 + ";line" + qq1 + "topleft" + qq2 + "x = " + -30 + ";line" + qq1 + "topleft" + qq2 + "width = " + 0)
eval(eval("redo" + undo))
drawmap(1)
}
qq2++
}


qq2 = 1
while ((qq2 - 1) < (eval ("line" + qq1 + "topright"))){
if (((eval ("line" + qq1 + "topright" + qq2 + "y")) == s2) && ((eval ("line" + qq1 + "topright" + qq2 + "x")) == s1)){
undo++
redo = undo
window["undo" + undo] = ("line" + qq1 + "topright" + qq2 + "y = " + eval("line" + qq1 + "topright" + qq2 + "y") + ";line" + qq1 + "topright" + qq2 + "x = " + eval("line" + qq1 + "topright" + qq2 + "x") + ";line" + qq1 + "topright" + qq2 + "width = " + eval("line" + qq1 + "topright" + qq2 + "width"))
window["redo" + undo] = ("line" + qq1 + "topright" + qq2 + "y = " + -40 + ";line" + qq1 + "topright" + qq2 + "x = " + -40 + ";line" + qq1 + "topright" + qq2 + "width = " + 0)
eval(eval("redo" + undo))
drawmap(1)
}
qq2++
}

qq2 = 1
while ((qq2 - 1) < (eval ("line" + qq1 + "topright"))){
if ((((eval ("line" + qq1 + "topright" + qq2 + "y")) + (eval ("line" + qq1 + "topright" + qq2 + "width"))) == s2) && (((eval ("line" + qq1 + "topright" + qq2 + "x")) - (eval ("line" + qq1 + "topright" + qq2 + "width"))) == s1)){
undo++
redo = undo
window["undo" + undo] = ("line" + qq1 + "topright" + qq2 + "y = " + eval("line" + qq1 + "topright" + qq2 + "y") + ";line" + qq1 + "topright" + qq2 + "x = " + eval("line" + qq1 + "topright" + qq2 + "x") + ";line" + qq1 + "topright" + qq2 + "width = " + eval("line" + qq1 + "topright" + qq2 + "width"))
window["redo" + undo] = ("line" + qq1 + "topright" + qq2 + "y = " + -40 + ";line" + qq1 + "topright" + qq2 + "x = " + -40 + ";line" + qq1 + "topright" + qq2 + "width = " + 0)
eval(eval("redo" + undo))
drawmap(1)
}
qq2++
}









}


}


///////////////////////////////////////////////////////////////////////// THE MAIN DRAW FUNCTION - FIRST CREATE A COPY OF THE VARS
function drawmap(asdqnf){
q1 = 1
while ((q1 - 1) < numlines ){
q2 = 1
window["aline" + q1 + "ver"] = eval ("line" + q1 + "ver")
while ((q2 - 1) < (eval ("aline" + q1 + "ver"))){
window["aline" + q1 + "ver" + q2 + "x"] = eval ("line" + q1 + "ver" + q2 + "x")
window["aline" + q1 + "ver" + q2 + "y1"] = eval ("line" + q1 + "ver" + q2 + "y1")
window["aline" + q1 + "ver" + q2 + "y2"] = eval ("line" + q1 + "ver" + q2 + "y2")
q2++
}
q2 = 1
window["aline" + q1 + "hor"] = eval ("line" + q1 + "hor")
while ((q2 - 1) < (eval ("aline" + q1 + "hor"))){
window["aline" + q1 + "hor" + q2 + "x1"] = eval ("line" + q1 + "hor" + q2 + "x1")
window["aline" + q1 + "hor" + q2 + "x2"] = eval ("line" + q1 + "hor" + q2 + "x2")
window["aline" + q1 + "hor" + q2 + "y"] = eval ("line" + q1 + "hor" + q2 + "y")
q2++
}
q2 = 1
window["aline" + q1 + "topleft"] = eval ("line" + q1 + "topleft")
while ((q2 - 1) < (eval ("aline" + q1 + "topleft"))){
window["aline" + q1 + "topleft" + q2 + "y"] = eval ("line" + q1 + "topleft" + q2 + "y")
window["aline" + q1 + "topleft" + q2 + "x"] = eval ("line" + q1 + "topleft" + q2 + "x")
window["aline" + q1 + "topleft" + q2 + "width"] = eval ("line" + q1 + "topleft" + q2 + "width")
q2++
}
q2 = 1
window["aline" + q1 + "topright"] = eval ("line" + q1 + "topright")
while ((q2 - 1) < (eval ("aline" + q1 + "topright"))){
window["aline" + q1 + "topright" + q2 + "y"] = eval ("line" + q1 + "topright" + q2 + "y")
window["aline" + q1 + "topright" + q2 + "x"] = eval ("line" + q1 + "topright" + q2 + "x")
window["aline" + q1 + "topright" + q2 + "width"] = eval ("line" + q1 + "topright" + q2 + "width")
q2++
}
q1++
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////// NOW ADD SOME CURVES
if (cowpatuuuuu == 1){
ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0, 0, canvas.width, canvas.height);ctx.restore();
}else{
ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle = mmsCanvasCol;
ctx.fillRect (0, 0, canvas.width, canvas.height);ctx.restore();
}

/* MMS-PATCH nature: parks (filled rects) then rivers (round polylines), always
   under tracks; independent of routes/stations so they draw on blank sheets */
try { mmsPkN = parks; } catch (mmsPkE0){ mmsPkN = 0; }
if (((typeof mmsPkN) == "number") && (mmsPkN > 0)){
mmsPkI = 1;
while ((mmsPkI - 1) < mmsPkN){
try {
mmsPkX = eval("park" + mmsPkI + "x");
mmsPkY = eval("park" + mmsPkI + "y");
mmsPkW = eval("park" + mmsPkI + "w");
mmsPkH = eval("park" + mmsPkI + "h");
if (((typeof mmsPkW) == "number") && ((typeof mmsPkH) == "number") && (mmsPkW > 0) && (mmsPkH > 0)){
/* MMS-PATCH park style: corner radius + optional border (Recorder-safe ops only) */
mmsPkRr = 0;
try { mmsPkRrV = parkradius; if (((typeof mmsPkRrV) == "number") && (mmsPkRrV > 0)){ mmsPkRr = mmsPkRrV; } } catch (mmsPkE4){}
if (mmsPkRr > ((mmsPkW < mmsPkH ? mmsPkW : mmsPkH) / 2)){ mmsPkRr = ((mmsPkW < mmsPkH ? mmsPkW : mmsPkH) / 2); }
mmsPkBw = 0;
try { mmsPkBwV = parkbwid; if (((typeof mmsPkBwV) == "number") && (mmsPkBwV > 0)){ mmsPkBw = mmsPkBwV; } } catch (mmsPkE5){}
mmsPkBc = "#000000";
try { mmsPkBcV = parkbcol; if (((typeof mmsPkBcV) == "string") && (mmsPkBcV != "")){ mmsPkBc = mmsPkBcV; } } catch (mmsPkE6){}
ctx.fillStyle = parkcol;
if (mmsPkRr > 0){
ctx.beginPath();
ctx.moveTo((mmsPkX + mmsPkRr), mmsPkY);
ctx.lineTo((mmsPkX + mmsPkW - mmsPkRr), mmsPkY);
ctx.quadraticCurveTo((mmsPkX + mmsPkW), mmsPkY, (mmsPkX + mmsPkW), (mmsPkY + mmsPkRr));
ctx.lineTo((mmsPkX + mmsPkW), (mmsPkY + mmsPkH - mmsPkRr));
ctx.quadraticCurveTo((mmsPkX + mmsPkW), (mmsPkY + mmsPkH), (mmsPkX + mmsPkW - mmsPkRr), (mmsPkY + mmsPkH));
ctx.lineTo((mmsPkX + mmsPkRr), (mmsPkY + mmsPkH));
ctx.quadraticCurveTo(mmsPkX, (mmsPkY + mmsPkH), mmsPkX, (mmsPkY + mmsPkH - mmsPkRr));
ctx.lineTo(mmsPkX, (mmsPkY + mmsPkRr));
ctx.quadraticCurveTo(mmsPkX, mmsPkY, (mmsPkX + mmsPkRr), mmsPkY);
ctx.closePath();
ctx.fill();
if (mmsPkBw > 0){
ctx.lineWidth = mmsPkBw;
ctx.strokeStyle = mmsPkBc;
ctx.stroke();
}
} else {
ctx.fillRect(mmsPkX, mmsPkY, mmsPkW, mmsPkH);
if (mmsPkBw > 0){
ctx.lineWidth = mmsPkBw;
ctx.strokeStyle = mmsPkBc;
ctx.strokeRect(mmsPkX, mmsPkY, mmsPkW, mmsPkH);
}
}
}
} catch (mmsPkE1){}
mmsPkI++;
}
}
/* MMS-PATCH sea: baked parallel hatch lines (see bakeSeaLines) */
try { mmsSeaN = sealines; } catch (mmsSeaE){ mmsSeaN = 0; }
if (((typeof mmsSeaN) == "number") && (mmsSeaN > 0)){
ctx.strokeStyle = seacol;
ctx.lineWidth = 2;
ctx.lineCap = "round";
mmsSeaI = 1;
while ((mmsSeaI - 1) < mmsSeaN){
ctx.beginPath();
ctx.moveTo(eval("sealine" + mmsSeaI + "x1"), eval("sealine" + mmsSeaI + "y1"));
ctx.lineTo(eval("sealine" + mmsSeaI + "x2"), eval("sealine" + mmsSeaI + "y2"));
ctx.stroke();
mmsSeaI++;
}
}
/* MMS-PATCH rivers: pre-baked smooth parallel strands (see bakeRiverStrands),
   stroked as plain polylines so vector export captures them too */
try { mmsRsN = riverstrands; } catch (mmsRsE){ mmsRsN = 0; }
if (((typeof mmsRsN) == "number") && (mmsRsN > 0)){
mmsRsW = 2;
try { mmsRsWv = riverstrandw; if (((typeof mmsRsWv) == "number") && (mmsRsWv > 0)){ mmsRsW = mmsRsWv; } } catch (mmsRsE3){}
ctx.strokeStyle = rivercol;
ctx.lineWidth = mmsRsW;
ctx.lineCap = "round";
ctx.lineJoin = "round";
mmsRsI = 1;
while ((mmsRsI - 1) < mmsRsN){
try { mmsRsC = eval("riverstrand" + mmsRsI + "pts"); } catch (mmsRsE2){ mmsRsC = 0; }
if (((typeof mmsRsC) == "number") && (mmsRsC > 1)){
ctx.beginPath();
ctx.moveTo(eval("riverstrand" + mmsRsI + "pt1x"), eval("riverstrand" + mmsRsI + "pt1y"));
mmsRsJ = 2;
while ((mmsRsJ - 1) < mmsRsC){
ctx.lineTo(eval("riverstrand" + mmsRsI + "pt" + mmsRsJ + "x"), eval("riverstrand" + mmsRsI + "pt" + mmsRsJ + "y"));
mmsRsJ++;
}
ctx.stroke();
}
mmsRsI++;
}
}
/* MMS-PATCH zones: baked chained dotted paths (see bakeZonePaths) */
try { mmsZnN = zonepaths; } catch (mmsZnE){ mmsZnN = 0; }
if (((typeof mmsZnN) == "number") && (mmsZnN > 0)){
mmsZnW = 4;
try { mmsZnWv = zonewidth; if (((typeof mmsZnWv) == "number") && (mmsZnWv > 0)){ mmsZnW = mmsZnWv; } } catch (mmsZnE3){}
ctx.strokeStyle = zonecol;
ctx.lineWidth = mmsZnW;
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.setLineDash([0.1, (mmsZnW * 2.2)]);
mmsZnI = 1;
while ((mmsZnI - 1) < mmsZnN){
try { mmsZnC = eval("zonepath" + mmsZnI + "pts"); } catch (mmsZnE2){ mmsZnC = 0; }
if (((typeof mmsZnC) == "number") && (mmsZnC > 1)){
ctx.beginPath();
ctx.moveTo(eval("zonepath" + mmsZnI + "pt1x"), eval("zonepath" + mmsZnI + "pt1y"));
mmsZnJ = 2;
while ((mmsZnJ - 1) < mmsZnC){
ctx.lineTo(eval("zonepath" + mmsZnI + "pt" + mmsZnJ + "x"), eval("zonepath" + mmsZnI + "pt" + mmsZnJ + "y"));
mmsZnJ++;
}
ctx.stroke();
}
mmsZnI++;
}
ctx.setLineDash([]);
}

q1 = 1
while ((q1 - 1) < numlines ){
ctx.strokeStyle = (eval ("line" + q1 + "col"))
ctx.lineWidth = (eval ("line" + q1 + "width"))
ewidth = (eval ("line" + q1 + "width"))

if (asdqnf == 1){

/////////////////////////////////////////////// 1
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "ver"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "topleft"))){
if (((eval ("line" + q1 + "ver" + q2 + 'x'))  ) == ((eval ("line" + q1 + "topleft" + q3 + 'x')) + (eval ("line" + q1 + "topleft" + q3 + 'width')))){
if (((eval ("line" + q1 + "ver" + q2 + 'y1'))  ) == ((eval ("line" + q1 + "topleft" + q3 + 'y')) + (eval ("line" + q1 + "topleft" + q3 + 'width')))){
window["aline" + q1 + "ver" + q2 + 'y1'] += Math.round(ewidth * curvenum)
window["aline" + q1 + "topleft" + q3 + 'width'] -= Math.round((ewidth * curvenum) * 0.65)
hjkl1 = eval ("line" + q1 + "ver" + q2 + 'x')
hjkl2 = eval ("line" + q1 + "ver" + q2 + 'y1')
hjkl3 = eval ("aline" + q1 + "ver" + q2 + 'x')
hjkl4 = eval ("aline" + q1 + "ver" + q2 + 'y1')
hjkl5 = ((eval ("aline" + q1 + "topleft" + q3 + 'x')) + (eval ("aline" + q1 + "topleft" + q3 + 'width')))
hjkl6 = ((eval ("aline" + q1 + "topleft" + q3 + 'y')) + (eval ("aline" + q1 + "topleft" + q3 + 'width')))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "ver" + q2 + 'y1'] -= 0.5
window["aline" + q1 + "topleft" + q3 + 'width'] += 0.5
}}
q3++
}
q2++
}

/////////////////////////////////////////////// 2
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "ver"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "topright"))){
if (((eval ("line" + q1 + "ver" + q2 + 'x'))  ) == ((eval ("line" + q1 + "topright" + q3 + 'x')) - (eval ("line" + q1 + "topright" + q3 + 'width')))){
if (((eval ("line" + q1 + "ver" + q2 + 'y1'))  ) == ((eval ("line" + q1 + "topright" + q3 + 'y')) + (eval ("line" + q1 + "topright" + q3 + 'width')))){
window["aline" + q1 + "ver" + q2 + 'y1'] += Math.round(ewidth * curvenum)
window["aline" + q1 + "topright" + q3 + 'width'] -= Math.round((ewidth * curvenum) * 0.65)
hjkl1 = eval ("line" + q1 + "ver" + q2 + 'x')
hjkl2 = eval ("line" + q1 + "ver" + q2 + 'y1')
hjkl3 = eval ("aline" + q1 + "ver" + q2 + 'x')
hjkl4 = eval ("aline" + q1 + "ver" + q2 + 'y1')
hjkl5 = ((eval ("aline" + q1 + "topright" + q3 + 'x')) - (eval ("aline" + q1 + "topright" + q3 + 'width')))
hjkl6 = ((eval ("aline" + q1 + "topright" + q3 + 'y')) + (eval ("aline" + q1 + "topright" + q3 + 'width')))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "ver" + q2 + 'y1'] -= 0.5
window["aline" + q1 + "topright" + q3 + 'width'] += 0.5
}}
q3++
}
q2++
}


/////////////////////////////////////////////// 3
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topleft"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "hor"))){
if (((eval ("line" + q1 + "topleft" + q2 + 'x'))  ) == ((eval ("line" + q1 + "hor" + q3 + 'x2'))  )){
if (((eval ("line" + q1 + "topleft" + q2 + 'y'))  ) == ((eval ("line" + q1 + "hor" + q3 + 'y'))  )){
window["aline" + q1 + "hor" + q3 + 'x2'] -= Math.round(ewidth * curvenum)
window["aline" + q1 + "topleft" + q2 + 'width'] -= Math.round((ewidth * curvenum) * 0.65)
window["aline" + q1 + "topleft" + q2 + 'x'] += Math.round((ewidth * curvenum) * 0.65)
window["aline" + q1 + "topleft" + q2 + 'y'] += Math.round((ewidth * curvenum) * 0.65)
hjkl1 = eval ("line" + q1 + "topleft" + q2 + 'x')
hjkl2 = eval ("line" + q1 + "topleft" + q2 + 'y')
hjkl3 = eval ("aline" + q1 + "hor" + q3 + 'x2')
hjkl4 = eval ("aline" + q1 + "hor" + q3 + 'y')
hjkl5 = (eval ("aline" + q1 + "topleft" + q2 + 'x'))
hjkl6 = (eval ("aline" + q1 + "topleft" + q2 + 'y'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "hor" + q3 + 'x2'] += 0.5
window["aline" + q1 + "topleft" + q2 + 'width'] += 0.5
window["aline" + q1 + "topleft" + q2 + 'x'] -= 0.5
window["aline" + q1 + "topleft" + q2 + 'y'] -= 0.5
}}
q3++
}
q2++
}

/////////////////////////////////////////////// 4
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topleft"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "ver"))){
if (((eval ("line" + q1 + "topleft" + q2 + 'x'))  ) == ((eval ("line" + q1 + "ver" + q3 + 'x'))  )){
if (((eval ("line" + q1 + "topleft" + q2 + 'y'))  ) == ((eval ("line" + q1 + "ver" + q3 + 'y2'))  )){
window["aline" + q1 + "ver" + q3 + 'y2'] -= Math.round(ewidth * curvenum)
window["aline" + q1 + "topleft" + q2 + 'width'] -= Math.round((ewidth * curvenum) * 0.65)
window["aline" + q1 + "topleft" + q2 + 'x'] += Math.round((ewidth * curvenum) * 0.65)
window["aline" + q1 + "topleft" + q2 + 'y'] += Math.round((ewidth * curvenum) * 0.65)
hjkl1 = eval ("line" + q1 + "topleft" + q2 + 'x')
hjkl2 = eval ("line" + q1 + "topleft" + q2 + 'y')
hjkl3 = eval ("aline" + q1 + "ver" + q3 + 'x')
hjkl4 = eval ("aline" + q1 + "ver" + q3 + 'y2')
hjkl5 = (eval ("aline" + q1 + "topleft" + q2 + 'x'))
hjkl6 = (eval ("aline" + q1 + "topleft" + q2 + 'y'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "ver" + q2 + 'y3'] += 0.5
window["aline" + q1 + "topleft" + q2 + 'width'] += 0.5
window["aline" + q1 + "topleft" + q2 + 'x'] -= 0.5
window["aline" + q1 + "topleft" + q2 + 'y'] -= 0.5

}}
q3++
}
q2++
}

/////////////////////////////////////////////// 5
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topright"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "hor"))){
if (((eval ("line" + q1 + "topright" + q2 + 'x'))  ) == ((eval ("line" + q1 + "hor" + q3 + 'x1'))  )){
if (((eval ("line" + q1 + "topright" + q2 + 'y'))  ) == ((eval ("line" + q1 + "hor" + q3 + 'y'))  )){
window["aline" + q1 + "hor" + q3 + 'x1'] += Math.round(ewidth * curvenum)
window["aline" + q1 + "topright" + q2 + 'width'] -= Math.round((ewidth * curvenum) * 0.65)
window["aline" + q1 + "topright" + q2 + 'x'] -= Math.round((ewidth * curvenum) * 0.65)
window["aline" + q1 + "topright" + q2 + 'y'] += Math.round((ewidth * curvenum) * 0.65)
hjkl1 = eval ("line" + q1 + "topright" + q2 + 'x')
hjkl2 = eval ("line" + q1 + "topright" + q2 + 'y')
hjkl3 = eval ("aline" + q1 + "hor" + q3 + 'x1')
hjkl4 = eval ("aline" + q1 + "hor" + q3 + 'y')
hjkl5 = (eval ("aline" + q1 + "topright" + q2 + 'x'))
hjkl6 = (eval ("aline" + q1 + "topright" + q2 + 'y'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "hor" + q3 + 'x1'] -= 0.5
window["aline" + q1 + "topright" + q2 + 'width'] += 0.5
window["aline" + q1 + "topright" + q2 + 'x'] += 0.5
window["aline" + q1 + "topright" + q2 + 'y'] -= 0.5
}}
q3++
}
q2++
}

/////////////////////////////////////////////// 6
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "hor"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "topleft"))){
if (((eval ("line" + q1 + "hor" + q2 + 'x1'))  ) == ((eval ("line" + q1 + "topleft" + q3 + 'x')) + (eval ("line" + q1 + "topleft" + q3 + 'width')))){
if (((eval ("line" + q1 + "hor" + q2 + 'y'))  ) == ((eval ("line" + q1 + "topleft" + q3 + 'y')) + (eval ("line" + q1 + "topleft" + q3 + 'width')))){
window["aline" + q1 + "hor" + q2 + 'x1'] += Math.round(ewidth * curvenum)
window["aline" + q1 + "topleft" + q3 + 'width'] -= Math.round((ewidth * curvenum) * 0.65)
hjkl1 = eval ("line" + q1 + "hor" + q2 + 'x1')
hjkl2 = eval ("line" + q1 + "hor" + q2 + 'y')
hjkl3 = eval ("aline" + q1 + "hor" + q2 + 'x1')
hjkl4 = eval ("aline" + q1 + "hor" + q2 + 'y')
hjkl5 = ((eval ("aline" + q1 + "topleft" + q3 + 'x')) + (eval ("aline" + q1 + "topleft" + q3 + 'width')))
hjkl6 = ((eval ("aline" + q1 + "topleft" + q3 + 'y')) + (eval ("aline" + q1 + "topleft" + q3 + 'width')))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "hor" + q2 + 'x1'] -= 0.5
window["aline" + q1 + "topleft" + q3 + 'width'] += 0.5
}}
q3++
}
q2++
}

/////////////////////////////////////////////// 7
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "hor"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "topright"))){
if (((eval ("line" + q1 + "hor" + q2 + 'x2'))  ) == ((eval ("line" + q1 + "topright" + q3 + 'x')) - (eval ("line" + q1 + "topright" + q3 + 'width')))){
if (((eval ("line" + q1 + "hor" + q2 + 'y'))  ) == ((eval ("line" + q1 + "topright" + q3 + 'y')) + (eval ("line" + q1 + "topright" + q3 + 'width')))){
window["aline" + q1 + "hor" + q2 + 'x2'] -= Math.round(ewidth * curvenum)
window["aline" + q1 + "topright" + q3 + 'width'] -= Math.round((ewidth * curvenum) * 0.65)
hjkl1 = eval ("line" + q1 + "hor" + q2 + 'x2')
hjkl2 = eval ("line" + q1 + "hor" + q2 + 'y')
hjkl3 = eval ("aline" + q1 + "hor" + q2 + 'x2')
hjkl4 = eval ("aline" + q1 + "hor" + q2 + 'y')
hjkl5 = ((eval ("aline" + q1 + "topright" + q3 + 'x')) - (eval ("aline" + q1 + "topright" + q3 + 'width')))
hjkl6 = ((eval ("aline" + q1 + "topright" + q3 + 'y')) + (eval ("aline" + q1 + "topright" + q3 + 'width')))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "hor" + q2 + 'x2'] += 0.5
window["aline" + q1 + "topright" + q3 + 'width'] += 0.5
}}
q3++
}
q2++
}

/////////////////////////////////////////////// 8
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topright"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "ver"))){
if (((eval ("line" + q1 + "topright" + q2 + 'x'))  ) == ((eval ("line" + q1 + "ver" + q3 + 'x'))  )){
if (((eval ("line" + q1 + "topright" + q2 + 'y'))  ) == ((eval ("line" + q1 + "ver" + q3 + 'y2'))  )){
window["aline" + q1 + "ver" + q3 + 'y2'] -= Math.round(ewidth * curvenum)
window["aline" + q1 + "topright" + q2 + 'width'] -= Math.round((ewidth * curvenum) * 0.65)
window["aline" + q1 + "topright" + q2 + 'x'] -= Math.round((ewidth * curvenum) * 0.65)
window["aline" + q1 + "topright" + q2 + 'y'] += Math.round((ewidth * curvenum) * 0.65)
hjkl1 = eval ("line" + q1 + "topright" + q2 + 'x')
hjkl2 = eval ("line" + q1 + "topright" + q2 + 'y')
hjkl3 = eval ("aline" + q1 + "ver" + q3 + 'x')
hjkl4 = eval ("aline" + q1 + "ver" + q3 + 'y2')
hjkl5 = (eval ("aline" + q1 + "topright" + q2 + 'x'))
hjkl6 = (eval ("aline" + q1 + "topright" + q2 + 'y'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "ver" + q3 + 'y2'] += 0.5
window["aline" + q1 + "topright" + q2 + 'width'] += 0.5
window["aline" + q1 + "topright" + q2 + 'x'] += 0.5
window["aline" + q1 + "topright" + q2 + 'y'] -= 0.5
}}
q3++
}
q2++
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////







q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topright"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "ver"))){
if (((eval ("line" + q1 + "topright" + q2 + 'x'))  ) == ((eval ("line" + q1 + "ver" + q3 + 'x'))  )){
if (((eval ("line" + q1 + "topright" + q2 + 'y'))  ) > ((eval ("line" + q1 + "ver" + q3 + 'y1'))  )){
if (((eval ("line" + q1 + "topright" + q2 + 'y'))  ) < ((eval ("line" + q1 + "ver" + q3 + 'y2'))  )){
window["aline" + q1 + "topright" + q2 + 'width'] -= Math.round((ewidth * curvenum))
window["aline" + q1 + "topright" + q2 + 'x'] -= Math.round((ewidth * curvenum))
window["aline" + q1 + "topright" + q2 + 'y'] += Math.round((ewidth * curvenum))
hjkl1 = eval ("line" + q1 + "topright" + q2 + 'x')
hjkl2 = eval ("line" + q1 + "topright" + q2 + 'y')
hjkl3 = eval ("line" + q1 + "topright" + q2 + 'x')
hjkl4 = ((eval ("line" + q1 + "topright" + q2 + 'y')) - (Math.round((ewidth * curvenum))))
hjkl5 = (eval ("aline" + q1 + "topright" + q2 + 'x'))
hjkl6 = (eval ("aline" + q1 + "topright" + q2 + 'y'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "topright" + q3 + 'width'] += 0.5
window["aline" + q1 + "topright" + q3 + 'x'] += 0.5
window["aline" + q1 + "topright" + q3 + 'y'] -= 0.5
}}}
q3++
}
q2++
}



q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topleft"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "ver"))){
if (((eval ("line" + q1 + "topleft" + q2 + 'x'))  ) == ((eval ("line" + q1 + "ver" + q3 + 'x'))  )){
if (((eval ("line" + q1 + "topleft" + q2 + 'y'))  ) > ((eval ("line" + q1 + "ver" + q3 + 'y1'))  )){
if (((eval ("line" + q1 + "topleft" + q2 + 'y'))  ) < ((eval ("line" + q1 + "ver" + q3 + 'y2'))  )){
window["aline" + q1 + "topleft" + q2 + 'width'] -= Math.round((ewidth * curvenum))
window["aline" + q1 + "topleft" + q2 + 'x'] += Math.round((ewidth * curvenum))
window["aline" + q1 + "topleft" + q2 + 'y'] += Math.round((ewidth * curvenum))
hjkl1 = eval ("line" + q1 + "topleft" + q2 + 'x')
hjkl2 = eval ("line" + q1 + "topleft" + q2 + 'y')
hjkl3 = eval ("line" + q1 + "topleft" + q2 + 'x')
hjkl4 = ((eval ("line" + q1 + "topleft" + q2 + 'y')) - (Math.round((ewidth * curvenum))))
hjkl5 = (eval ("aline" + q1 + "topleft" + q2 + 'x'))
hjkl6 = (eval ("aline" + q1 + "topleft" + q2 + 'y'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "topleft" + q3 + 'width'] += 0.5
window["aline" + q1 + "topleft" + q3 + 'x'] -= 0.5
window["aline" + q1 + "topleft" + q3 + 'y'] -= 0.5
}}}
q3++
}
q2++
}



q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topleft"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "ver"))){
if (((eval ("line" + q1 + "topleft" + q2 + 'x')) + (eval ("line" + q1 + "topleft" + q2 + 'width'))) == ((eval ("line" + q1 + "ver" + q3 + 'x'))  )){
if (((eval ("line" + q1 + "topleft" + q2 + 'y')) + (eval ("line" + q1 + "topleft" + q2 + 'width'))  ) > ((eval ("line" + q1 + "ver" + q3 + 'y1'))  )){
if (((eval ("line" + q1 + "topleft" + q2 + 'y')) + (eval ("line" + q1 + "topleft" + q2 + 'width'))  ) < ((eval ("line" + q1 + "ver" + q3 + 'y2'))  )){
window["aline" + q1 + "topleft" + q2 + 'width'] -= Math.round((ewidth * curvenum))

hjkl1 = ((eval ("line" + q1 + "topleft" + q2 + 'x')) + (eval ("line" + q1 + "topleft" + q2 + 'width')))
hjkl2 = ((eval ("line" + q1 + "topleft" + q2 + 'y')) + (eval ("line" + q1 + "topleft" + q2 + 'width')))
hjkl3 = ((eval ("line" + q1 + "topleft" + q2 + 'x')) + (eval ("line" + q1 + "topleft" + q2 + 'width')))
hjkl4 = (((eval ("line" + q1 + "topleft" + q2 + 'y')) + (eval ("line" + q1 + "topleft" + q2 + 'width'))) + (Math.round((ewidth * curvenum))))
hjkl5 = ((eval ("aline" + q1 + "topleft" + q2 + 'x')) + (eval ("aline" + q1 + "topleft" + q2 + 'width')))
hjkl6 = ((eval ("aline" + q1 + "topleft" + q2 + 'y')) + (eval ("aline" + q1 + "topleft" + q2 + 'width')))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "topleft" + q3 + 'width'] += 1
}}}
q3++
}
q2++
}


q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topright"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "ver"))){
if (((eval ("line" + q1 + "topright" + q2 + 'x')) - (eval ("line" + q1 + "topright" + q2 + 'width'))) == ((eval ("line" + q1 + "ver" + q3 + 'x'))  )){
if (((eval ("line" + q1 + "topright" + q2 + 'y')) + (eval ("line" + q1 + "topright" + q2 + 'width'))  ) > ((eval ("line" + q1 + "ver" + q3 + 'y1'))  )){
if (((eval ("line" + q1 + "topright" + q2 + 'y')) + (eval ("line" + q1 + "topright" + q2 + 'width'))  ) < ((eval ("line" + q1 + "ver" + q3 + 'y2'))  )){
window["aline" + q1 + "topright" + q2 + 'width'] -= Math.round((ewidth * curvenum))

hjkl1 = ((eval ("line" + q1 + "topright" + q2 + 'x')) - (eval ("line" + q1 + "topright" + q2 + 'width')))
hjkl2 = ((eval ("line" + q1 + "topright" + q2 + 'y')) + (eval ("line" + q1 + "topright" + q2 + 'width')))
hjkl3 = ((eval ("line" + q1 + "topright" + q2 + 'x')) - (eval ("line" + q1 + "topright" + q2 + 'width')))
hjkl4 = (((eval ("line" + q1 + "topright" + q2 + 'y')) + (eval ("line" + q1 + "topright" + q2 + 'width'))) + (Math.round((ewidth * curvenum))))
hjkl5 = ((eval ("aline" + q1 + "topright" + q2 + 'x')) - (eval ("aline" + q1 + "topright" + q2 + 'width')))
hjkl6 = ((eval ("aline" + q1 + "topright" + q2 + 'y')) + (eval ("aline" + q1 + "topright" + q2 + 'width')))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "topright" + q3 + 'width'] += 1
}}}
q3++
}
q2++
}

//////////////////////////////





q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topright"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "hor"))){
if (((eval ("line" + q1 + "topright" + q2 + 'y'))  ) == ((eval ("line" + q1 + "hor" + q3 + 'y'))  )){
if (((eval ("line" + q1 + "topright" + q2 + 'x'))  ) > ((eval ("line" + q1 + "hor" + q3 + 'x1'))  )){
if (((eval ("line" + q1 + "topright" + q2 + 'x'))  ) < ((eval ("line" + q1 + "hor" + q3 + 'x2'))  )){
window["aline" + q1 + "topright" + q2 + 'width'] -= Math.round((ewidth * curvenum))
window["aline" + q1 + "topright" + q2 + 'x'] -= Math.round((ewidth * curvenum))
window["aline" + q1 + "topright" + q2 + 'y'] += Math.round((ewidth * curvenum))
hjkl1 = eval ("line" + q1 + "topright" + q2 + 'x')
hjkl2 = eval ("line" + q1 + "topright" + q2 + 'y')
hjkl3 = ((eval ("line" + q1 + "topright" + q2 + 'x')) + (Math.round((ewidth * curvenum))))
hjkl4 = eval ("line" + q1 + "topright" + q2 + 'y')
hjkl5 = (eval ("aline" + q1 + "topright" + q2 + 'x'))
hjkl6 = (eval ("aline" + q1 + "topright" + q2 + 'y'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "topright" + q3 + 'width'] += 0.5
window["aline" + q1 + "topright" + q3 + 'x'] += 0.5
window["aline" + q1 + "topright" + q3 + 'y'] -= 0.5
}}}
q3++
}
q2++
}



q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topleft"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "hor"))){
if (((eval ("line" + q1 + "topleft" + q2 + 'y'))  ) == ((eval ("line" + q1 + "hor" + q3 + 'y'))  )){
if (((eval ("line" + q1 + "topleft" + q2 + 'x'))  ) > ((eval ("line" + q1 + "hor" + q3 + 'x1'))  )){
if (((eval ("line" + q1 + "topleft" + q2 + 'x'))  ) < ((eval ("line" + q1 + "hor" + q3 + 'x2'))  )){
window["aline" + q1 + "topleft" + q2 + 'width'] -= Math.round((ewidth * curvenum))
window["aline" + q1 + "topleft" + q2 + 'x'] += Math.round((ewidth * curvenum))
window["aline" + q1 + "topleft" + q2 + 'y'] += Math.round((ewidth * curvenum))
hjkl1 = eval ("line" + q1 + "topleft" + q2 + 'x')
hjkl2 = eval ("line" + q1 + "topleft" + q2 + 'y')
hjkl3 = ((eval ("line" + q1 + "topleft" + q2 + 'x')) - (Math.round((ewidth * curvenum))))
hjkl4 = eval ("line" + q1 + "topleft" + q2 + 'y')
hjkl5 = (eval ("aline" + q1 + "topleft" + q2 + 'x'))
hjkl6 = (eval ("aline" + q1 + "topleft" + q2 + 'y'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "topleft" + q3 + 'width'] += 0.5
window["aline" + q1 + "topleft" + q3 + 'x'] -= 0.5
window["aline" + q1 + "topleft" + q3 + 'y'] -= 0.5
}}}
q3++
}
q2++
}



q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topleft"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "hor"))){
if (((eval ("line" + q1 + "topleft" + q2 + 'y')) + (eval ("line" + q1 + "topleft" + q2 + 'width')) ) == ((eval ("line" + q1 + "hor" + q3 + 'y'))  )){
if (((eval ("line" + q1 + "topleft" + q2 + 'x')) + (eval ("line" + q1 + "topleft" + q2 + 'width')) ) > ((eval ("line" + q1 + "hor" + q3 + 'x1'))  )){
if (((eval ("line" + q1 + "topleft" + q2 + 'x')) + (eval ("line" + q1 + "topleft" + q2 + 'width')) ) < ((eval ("line" + q1 + "hor" + q3 + 'x2'))  )){
window["aline" + q1 + "topleft" + q2 + 'width'] -= Math.round((ewidth * curvenum))
hjkl1 = ((eval ("line" + q1 + "topleft" + q2 + 'x'))       + (eval ("line" + q1 + "topleft" + q2 + 'width'))     )
hjkl2 = ((eval ("line" + q1 + "topleft" + q2 + 'y'))        + (eval ("line" + q1 + "topleft" + q2 + 'width'))    )
hjkl3 = (((eval ("line" + q1 + "topleft" + q2 + 'x'))  + (eval ("line" + q1 + "topleft" + q2 + 'width'))  ) + (Math.round((ewidth * curvenum))))
hjkl4 = ((eval ("line" + q1 + "topleft" + q2 + 'y'))       + (eval ("line" + q1 + "topleft" + q2 + 'width'))     )
hjkl5 = ((eval ("aline" + q1 + "topleft" + q2 + 'x'))      + (eval ("aline" + q1 + "topleft" + q2 + 'width'))      )
hjkl6 = ((eval ("aline" + q1 + "topleft" + q2 + 'y'))       + (eval ("aline" + q1 + "topleft" + q2 + 'width'))     )
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "topleft" + q3 + 'width'] += 0.5
}}}
q3++
}
q2++
}





q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topright"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "hor"))){
if (((eval ("line" + q1 + "topright" + q2 + 'y')) + (eval ("line" + q1 + "topright" + q2 + 'width')) ) == ((eval ("line" + q1 + "hor" + q3 + 'y'))  )){
if (((eval ("line" + q1 + "topright" + q2 + 'x')) - (eval ("line" + q1 + "topright" + q2 + 'width')) ) > ((eval ("line" + q1 + "hor" + q3 + 'x1'))  )){
if (((eval ("line" + q1 + "topright" + q2 + 'x')) - (eval ("line" + q1 + "topright" + q2 + 'width')) ) < ((eval ("line" + q1 + "hor" + q3 + 'x2'))  )){
window["aline" + q1 + "topright" + q2 + 'width'] -= Math.round((ewidth * curvenum))
hjkl1 = ((eval ("line" + q1 + "topright" + q2 + 'x'))       - (eval ("line" + q1 + "topright" + q2 + 'width'))     )
hjkl2 = ((eval ("line" + q1 + "topright" + q2 + 'y'))        + (eval ("line" + q1 + "topright" + q2 + 'width'))    )
hjkl3 = (((eval ("line" + q1 + "topright" + q2 + 'x'))  - (eval ("line" + q1 + "topright" + q2 + 'width'))  ) - (Math.round((ewidth * curvenum))))
hjkl4 = ((eval ("line" + q1 + "topright" + q2 + 'y'))       + (eval ("line" + q1 + "topright" + q2 + 'width'))     )
hjkl5 = ((eval ("aline" + q1 + "topright" + q2 + 'x'))      - (eval ("aline" + q1 + "topright" + q2 + 'width'))      )
hjkl6 = ((eval ("aline" + q1 + "topright" + q2 + 'y'))       + (eval ("aline" + q1 + "topright" + q2 + 'width'))     )
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "topright" + q3 + 'width'] += 0.5
}}}
q3++
}
q2++
}

//////////////////////////////////////////////////////////////////



q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topright"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "hor"))){
xd = eval ("line" + q1 + "topright" + q2 + 'x')
yd = eval ("line" + q1 + "topright" + q2 + 'y')
ld = eval ("line" + q1 + "topright" + q2 + 'width')
xp = eval ("line" + q1 + "hor" + q3 + 'x2')
yp = eval ("line" + q1 + "hor" + q3 + 'y')
if (((xd - xp) == (yp - yd)) && (xp > (xd - ld)) && (xp < xd) && (yp > yd) && (yp < (yd + ld))){
window["aline" + q1 + "hor" + q3 + 'x2'] -= ((Math.round((ewidth * curvenum))) * 1.4)
hjkl1 = (eval ("line" + q1 + "hor" + q3 + 'x2'))
hjkl2 = (eval ("line" + q1 + "hor" + q3 + 'y'))
hjkl3 = ((eval ("line" + q1 + "hor" + q3 + 'x2')) + Math.round((ewidth * curvenum)))
hjkl4 = ((eval ("line" + q1 + "hor" + q3 + 'y')) - Math.round((ewidth * curvenum)))
hjkl5 = (eval ("aline" + q1 + "hor" + q3 + 'x2'))
hjkl6 = (eval ("aline" + q1 + "hor" + q3 + 'y'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "hor" + q3 + 'x2'] += 0.5
}
q3++
}
q2++
}



q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topright"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "hor"))){
xd = eval ("line" + q1 + "topright" + q2 + 'x')
yd = eval ("line" + q1 + "topright" + q2 + 'y')
ld = eval ("line" + q1 + "topright" + q2 + 'width')
xp = eval ("line" + q1 + "hor" + q3 + 'x1')
yp = eval ("line" + q1 + "hor" + q3 + 'y')
if (((xd - xp) == (yp - yd)) && (xp > (xd - ld)) && (xp < xd) && (yp > yd) && (yp < (yd + ld))){
window["aline" + q1 + "hor" + q3 + 'x1'] += ((Math.round((ewidth * curvenum))) * 1.4)
hjkl1 = (eval ("line" + q1 + "hor" + q3 + 'x1'))
hjkl2 = (eval ("line" + q1 + "hor" + q3 + 'y'))
hjkl3 = ((eval ("line" + q1 + "hor" + q3 + 'x1')) - Math.round((ewidth * curvenum)))
hjkl4 = ((eval ("line" + q1 + "hor" + q3 + 'y')) + Math.round((ewidth * curvenum)))
hjkl5 = (eval ("aline" + q1 + "hor" + q3 + 'x1'))
hjkl6 = (eval ("aline" + q1 + "hor" + q3 + 'y'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "hor" + q3 + 'x1'] -= 0.5
}
q3++
}
q2++
}





q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topright"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "ver"))){
xd = eval ("line" + q1 + "topright" + q2 + 'x')
yd = eval ("line" + q1 + "topright" + q2 + 'y')
ld = eval ("line" + q1 + "topright" + q2 + 'width')
xp = eval ("line" + q1 + "ver" + q3 + 'x')
yp = eval ("line" + q1 + "ver" + q3 + 'y2')
if (((xd - xp) == (yp - yd)) && (xp > (xd - ld)) && (xp < xd) && (yp > yd) && (yp < (yd + ld))){
window["aline" + q1 + "ver" + q3 + 'y2'] -= ((Math.round((ewidth * curvenum))) * 1.4)
hjkl1 = (eval ("line" + q1 + "ver" + q3 + 'x'))
hjkl2 = (eval ("line" + q1 + "ver" + q3 + 'y2'))
hjkl3 = ((eval ("line" + q1 + "ver" + q3 + 'x')) - Math.round((ewidth * curvenum)))
hjkl4 = ((eval ("line" + q1 + "ver" + q3 + 'y2')) + Math.round((ewidth * curvenum)))
hjkl5 = (eval ("aline" + q1 + "ver" + q3 + 'x'))
hjkl6 = (eval ("aline" + q1 + "ver" + q3 + 'y2'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "ver" + q3 + 'y2'] += 0.5
}
q3++
}
q2++
}




q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topright"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "ver"))){
xd = eval ("line" + q1 + "topright" + q2 + 'x')
yd = eval ("line" + q1 + "topright" + q2 + 'y')
ld = eval ("line" + q1 + "topright" + q2 + 'width')
xp = eval ("line" + q1 + "ver" + q3 + 'x')
yp = eval ("line" + q1 + "ver" + q3 + 'y1')
if (((xd - xp) == (yp - yd)) && (xp > (xd - ld)) && (xp < xd) && (yp > yd) && (yp < (yd + ld))){
window["aline" + q1 + "ver" + q3 + 'y1'] += ((Math.round((ewidth * curvenum))) * 1.4)
hjkl1 = (eval ("line" + q1 + "ver" + q3 + 'x'))
hjkl2 = (eval ("line" + q1 + "ver" + q3 + 'y1'))
hjkl3 = ((eval ("line" + q1 + "ver" + q3 + 'x')) + Math.round((ewidth * curvenum)))
hjkl4 = ((eval ("line" + q1 + "ver" + q3 + 'y1')) - Math.round((ewidth * curvenum)))
hjkl5 = (eval ("aline" + q1 + "ver" + q3 + 'x'))
hjkl6 = (eval ("aline" + q1 + "ver" + q3 + 'y1'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "ver" + q3 + 'y1'] -= 0.5
}
q3++
}
q2++
}

///////////////////////////////



q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topleft"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "ver"))){
xd = eval ("line" + q1 + "topleft" + q2 + 'x')
yd = eval ("line" + q1 + "topleft" + q2 + 'y')
ld = eval ("line" + q1 + "topleft" + q2 + 'width')
xp = eval ("line" + q1 + "ver" + q3 + 'x')
yp = eval ("line" + q1 + "ver" + q3 + 'y1')
if (((xp - xd) == (yp - yd)) && (xp > xd) && (xp < (xd + ld)) && (yp > yd) && (yp < (yd + ld))){
window["aline" + q1 + "ver" + q3 + 'y1'] += ((Math.round((ewidth * curvenum))) * 1.4)
hjkl1 = (eval ("line" + q1 + "ver" + q3 + 'x'))
hjkl2 = (eval ("line" + q1 + "ver" + q3 + 'y1'))
hjkl3 = ((eval ("line" + q1 + "ver" + q3 + 'x')) - Math.round((ewidth * curvenum)))
hjkl4 = ((eval ("line" + q1 + "ver" + q3 + 'y1')) - Math.round((ewidth * curvenum)))
hjkl5 = (eval ("aline" + q1 + "ver" + q3 + 'x'))
hjkl6 = (eval ("aline" + q1 + "ver" + q3 + 'y1'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "ver" + q3 + 'y1'] -= 0.5
}
q3++
}
q2++
}


q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topleft"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "ver"))){
xd = eval ("line" + q1 + "topleft" + q2 + 'x')
yd = eval ("line" + q1 + "topleft" + q2 + 'y')
ld = eval ("line" + q1 + "topleft" + q2 + 'width')
xp = eval ("line" + q1 + "ver" + q3 + 'x')
yp = eval ("line" + q1 + "ver" + q3 + 'y2')
if (((xp - xd) == (yp - yd)) && (xp > xd) && (xp < (xd + ld)) && (yp > yd) && (yp < (yd + ld))){
window["aline" + q1 + "ver" + q3 + 'y2'] -= ((Math.round((ewidth * curvenum))) * 1.4)
hjkl1 = (eval ("line" + q1 + "ver" + q3 + 'x'))
hjkl2 = (eval ("line" + q1 + "ver" + q3 + 'y2'))
hjkl3 = ((eval ("line" + q1 + "ver" + q3 + 'x')) + Math.round((ewidth * curvenum)))
hjkl4 = ((eval ("line" + q1 + "ver" + q3 + 'y2')) + Math.round((ewidth * curvenum)))
hjkl5 = (eval ("aline" + q1 + "ver" + q3 + 'x'))
hjkl6 = (eval ("aline" + q1 + "ver" + q3 + 'y2'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "ver" + q3 + 'y2'] += 0.5
}
q3++
}
q2++
}




q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topleft"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "hor"))){
xd = eval ("line" + q1 + "topleft" + q2 + 'x')
yd = eval ("line" + q1 + "topleft" + q2 + 'y')
ld = eval ("line" + q1 + "topleft" + q2 + 'width')
xp = eval ("line" + q1 + "hor" + q3 + 'x2')
yp = eval ("line" + q1 + "hor" + q3 + 'y')
if (((xp - xd) == (yp - yd)) && (xp > xd) && (xp < (xd + ld)) && (yp > yd) && (yp < (yd + ld))){
window["aline" + q1 + "hor" + q3 + 'x2'] -= ((Math.round((ewidth * curvenum))) * 1.4)
hjkl1 = (eval ("line" + q1 + "hor" + q3 + 'x2'))
hjkl2 = (eval ("line" + q1 + "hor" + q3 + 'y'))
hjkl3 = ((eval ("line" + q1 + "hor" + q3 + 'x2')) + Math.round((ewidth * curvenum)))
hjkl4 = ((eval ("line" + q1 + "hor" + q3 + 'y')) + Math.round((ewidth * curvenum)))
hjkl5 = (eval ("aline" + q1 + "hor" + q3 + 'x2'))
hjkl6 = (eval ("aline" + q1 + "hor" + q3 + 'y'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "hor" + q3 + 'x2'] += 0.5
}
q3++
}
q2++
}



q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topleft"))){
q3 = 1
while ((q3 - 1) < (eval ("line" + q1 + "hor"))){
xd = eval ("line" + q1 + "topleft" + q2 + 'x')
yd = eval ("line" + q1 + "topleft" + q2 + 'y')
ld = eval ("line" + q1 + "topleft" + q2 + 'width')
xp = eval ("line" + q1 + "hor" + q3 + 'x1')
yp = eval ("line" + q1 + "hor" + q3 + 'y')
if (((xp - xd) == (yp - yd)) && (xp > xd) && (xp < (xd + ld)) && (yp > yd) && (yp < (yd + ld))){
window["aline" + q1 + "hor" + q3 + 'x1'] += ((Math.round((ewidth * curvenum))) * 1.4)
hjkl1 = (eval ("line" + q1 + "hor" + q3 + 'x1'))
hjkl2 = (eval ("line" + q1 + "hor" + q3 + 'y'))
hjkl3 = ((eval ("line" + q1 + "hor" + q3 + 'x1')) - Math.round((ewidth * curvenum)))
hjkl4 = ((eval ("line" + q1 + "hor" + q3 + 'y')) - Math.round((ewidth * curvenum)))
hjkl5 = (eval ("aline" + q1 + "hor" + q3 + 'x1'))
hjkl6 = (eval ("aline" + q1 + "hor" + q3 + 'y'))
ctx.beginPath()
ctx.moveTo(hjkl5, hjkl6)
ctx.quadraticCurveTo(hjkl1, hjkl2, hjkl3, hjkl4);
ctx.stroke()
window["aline" + q1 + "hor" + q3 + 'x1'] -= 0.5
}
q3++
}
q2++
}









/////////////////////////////////////////////////////////////////////////////////////////////////////

}

gpoogg = (eval ("line" + q1 + "col"))
ctx.strokeStyle = gpoogg
gpooggq = (eval ("line" + q1 + "width"))
ctx.lineWidth = gpooggq



q2 = 1
while ((q2 - 1) < (eval ("aline" + q1 + "ver"))){


ctx.beginPath()
ctx.moveTo((eval ("aline" + q1 + "ver" + q2 + "x")), (eval ("aline" + q1 + "ver" + q2 + "y1")))
ctx.lineTo((eval ("aline" + q1 + "ver" + q2 + "x")), (eval ("aline" + q1 + "ver" + q2 + "y2"))) 
ctx.stroke()


q2++
}

q2 = 1
while ((q2 - 1) < (eval ("aline" + q1 + "hor"))){


ctx.beginPath()
ctx.moveTo((eval ("aline" + q1 + "hor" + q2 + "x1")), (eval ("aline" + q1 + "hor" + q2 + "y")))
ctx.lineTo((eval ("aline" + q1 + "hor" + q2 + "x2")), (eval ("aline" + q1 + "hor" + q2 + "y"))) 
ctx.stroke()


q2++
}

q2 = 1
while ((q2 - 1) < (eval ("aline" + q1 + "topleft"))){


ctx.beginPath()
ctx.moveTo((eval ("aline" + q1 + "topleft" + q2 + "x")), (eval ("aline" + q1 + "topleft" + q2 + "y")))
ctx.lineTo((eval ("aline" + q1 + "topleft" + q2 + "x") + (eval ("aline" + q1 + "topleft" + q2 + "width"))), ((eval ("aline" + q1 + "topleft" + q2 + "y")) + (eval ("aline" + q1 + "topleft" + q2 + "width"))))
ctx.stroke()


q2++
}


q2 = 1
while ((q2 - 1) < (eval ("aline" + q1 + "topright"))){


ctx.beginPath()
ctx.moveTo((eval ("aline" + q1 + "topright" + q2 + "x")), (eval ("aline" + q1 + "topright" + q2 + "y")))
ctx.lineTo((eval ("aline" + q1 + "topright" + q2 + "x") - (eval ("aline" + q1 + "topright" + q2 + "width"))), ((eval ("aline" + q1 + "topright" + q2 + "y")) + (eval ("aline" + q1 + "topright" + q2 + "width"))))
ctx.stroke()


q2++
}

q1++
}

q1 = 1
while ((q1 - 1) < numlines ){
gpoogg = (eval ("line" + q1 + "col"))
ctx.strokeStyle = gpoogg
gpooggq = (eval ("line" + q1 + "width"))
ctx.lineWidth = gpooggq



q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "stations"))){
gaagpootype = (eval ("line" + q1 + "station" + q2 + "type"))
gaagpoodir = (eval ("line" + q1 + "station" + q2 + "dir"))
gaagpootext = (eval ("line" + q1 + "station" + q2 + "text"))
gaagpoox = (eval ("line" + q1 + "station" + q2 + "x"))
gaagpooy = (eval ("line" + q1 + "station" + q2 + "y"))
if (gaagpootype == 1){
ctx.fillStyle = gpoogg
ctx.beginPath();
ctx.arc(gaagpoox,gaagpooy,(gpooggq*stat1q),0,Math.PI*2,true);
ctx.closePath();
ctx.fill();
}

if (gaagpootype == 2){
stat2qq = (stat2q * gpooggq)
if (gaagpoodir == 1){
ctx.beginPath()
ctx.moveTo(gaagpoox, gaagpooy)
ctx.lineTo((gaagpoox - (stat2qq * 0.65)), (gaagpooy - (stat2qq * 0.65)))
ctx.stroke()
}
if (gaagpoodir == 2){
ctx.beginPath()
ctx.moveTo(gaagpoox, gaagpooy)
ctx.lineTo((gaagpoox), (gaagpooy - (stat2qq * 1)))
ctx.stroke()
}
if (gaagpoodir == 3){
ctx.beginPath()
ctx.moveTo(gaagpoox, gaagpooy)
ctx.lineTo((gaagpoox + (stat2qq * 0.65)), (gaagpooy - (stat2qq * 0.65)))
ctx.stroke()
}
if (gaagpoodir == 4){
ctx.beginPath()
ctx.moveTo(gaagpoox, gaagpooy)
ctx.lineTo((gaagpoox - (stat2qq * 1)), (gaagpooy))
ctx.stroke()
}
if (gaagpoodir == 5){
ctx.beginPath()
ctx.moveTo(gaagpoox, gaagpooy)
ctx.lineTo((gaagpoox + (stat2qq * 1)), (gaagpooy))
ctx.stroke()
}
if (gaagpoodir == 6){
ctx.beginPath()
ctx.moveTo(gaagpoox, gaagpooy)
ctx.lineTo((gaagpoox - (stat2qq * 0.65)), (gaagpooy + (stat2qq * 0.65)))
ctx.stroke()
}
if (gaagpoodir == 7){
ctx.beginPath()
ctx.moveTo(gaagpoox, gaagpooy)
ctx.lineTo((gaagpoox), (gaagpooy + (stat2qq * 1)))
ctx.stroke()
}
if (gaagpoodir == 8){
ctx.beginPath()
ctx.moveTo(gaagpoox, gaagpooy)
ctx.lineTo((gaagpoox + (stat2qq * 0.65)), (gaagpooy + (stat2qq * 0.65)))
ctx.stroke()
}





}


if (gaagpootype == 3){
ctx.fillStyle = "#000000"
ctx.beginPath();
ctx.arc(gaagpoox,gaagpooy,(gpooggq*stat3q),0,Math.PI*2,true);
ctx.closePath();
ctx.fill();
ctx.fillStyle = "#FFFFFF"
ctx.beginPath();
ctx.arc(gaagpoox,gaagpooy,(gpooggq*stat3aq),0,Math.PI*2,true);
ctx.closePath();
ctx.fill();
}
if (gaagpootype == 4){
ctx.fillStyle = gpoogg
ctx.beginPath();
ctx.arc(gaagpoox,gaagpooy,(gpooggq*stat4q),0,Math.PI*2,true);
ctx.closePath();
ctx.fill();
ctx.fillStyle = "#FFFFFF"
ctx.beginPath();
ctx.arc(gaagpoox,gaagpooy,(gpooggq*stat4aq),0,Math.PI*2,true);
ctx.closePath();
ctx.fill();
}
if (gaagpootype == 5){
ctx.fillStyle = "#000000"
ctx.beginPath();
ctx.arc(gaagpoox,gaagpooy,(gpooggq*stat5q),0,Math.PI*2,true);
ctx.closePath();
ctx.fill();
ctx.fillStyle = "#FFFFFF"
ctx.beginPath();
ctx.arc(gaagpoox,gaagpooy,(gpooggq*stat5aq),0,Math.PI*2,true);
ctx.closePath();
ctx.fill();
}

if (gaagpootype == 6){
/* MMS-PATCH pill: anchor end fixed on the station point, body stretches toward gaagpoodir */
mmsPillW = 0;
try { mmsPillW = eval("line" + q1 + "station" + q2 + "w"); } catch (mmsPillE) { mmsPillW = 0; }
if (((typeof mmsPillW) != "number") || (!(mmsPillW > 0))){ mmsPillW = ((gpooggq*stat3q)*2 + 24); }
mmsPillR = (gpooggq*stat3q);
mmsPillR2 = (gpooggq*stat3aq);
mmsPillUX = 1; mmsPillUY = 0;
if (gaagpoodir == 1){ mmsPillUX = -0.7071; mmsPillUY = -0.7071; }
if (gaagpoodir == 2){ mmsPillUX = 0; mmsPillUY = -1; }
if (gaagpoodir == 3){ mmsPillUX = 0.7071; mmsPillUY = -0.7071; }
if (gaagpoodir == 4){ mmsPillUX = -1; mmsPillUY = 0; }
if (gaagpoodir == 5){ mmsPillUX = 1; mmsPillUY = 0; }
if (gaagpoodir == 6){ mmsPillUX = -0.7071; mmsPillUY = 0.7071; }
if (gaagpoodir == 7){ mmsPillUX = 0; mmsPillUY = 1; }
if (gaagpoodir == 8){ mmsPillUX = 0.7071; mmsPillUY = 0.7071; }
mmsPillBX = (gaagpoox + mmsPillW*mmsPillUX);
mmsPillBY = (gaagpooy + mmsPillW*mmsPillUY);
mmsPillNX = (0 - mmsPillUY);
mmsPillNY = mmsPillUX;
ctx.fillStyle = "#000000";
ctx.beginPath();
ctx.arc(gaagpoox,gaagpooy,mmsPillR,0,Math.PI*2,true);
ctx.arc(mmsPillBX,mmsPillBY,mmsPillR,0,Math.PI*2,true);
ctx.moveTo((gaagpoox + mmsPillR*mmsPillNX),(gaagpooy + mmsPillR*mmsPillNY));
ctx.lineTo((mmsPillBX + mmsPillR*mmsPillNX),(mmsPillBY + mmsPillR*mmsPillNY));
ctx.lineTo((mmsPillBX - mmsPillR*mmsPillNX),(mmsPillBY - mmsPillR*mmsPillNY));
ctx.lineTo((gaagpoox - mmsPillR*mmsPillNX),(gaagpooy - mmsPillR*mmsPillNY));
ctx.closePath();
ctx.fill();
ctx.fillStyle = "#FFFFFF";
ctx.beginPath();
ctx.arc(gaagpoox,gaagpooy,mmsPillR2,0,Math.PI*2,true);
ctx.arc(mmsPillBX,mmsPillBY,mmsPillR2,0,Math.PI*2,true);
ctx.moveTo((gaagpoox + mmsPillR2*mmsPillNX),(gaagpooy + mmsPillR2*mmsPillNY));
ctx.lineTo((mmsPillBX + mmsPillR2*mmsPillNX),(mmsPillBY + mmsPillR2*mmsPillNY));
ctx.lineTo((mmsPillBX - mmsPillR2*mmsPillNX),(mmsPillBY - mmsPillR2*mmsPillNY));
ctx.lineTo((gaagpoox - mmsPillR2*mmsPillNX),(gaagpooy - mmsPillR2*mmsPillNY));
ctx.closePath();
ctx.fill();
if (gpooggq > 0){ stat6q = ((((mmsPillW + mmsPillR*2)/2)/gpooggq)*1.2); } else { stat6q = 1.85; }
}
mmsTextFontQ = mmsTextFont;if ((mmsTextFontQ.indexOf(" ") != -1)){ mmsTextFontQ = ('"' + mmsTextFontQ + '"'); }
ctx.font = (fontzsize + "pt " + mmsTextFontQ)
ctx.fillStyle = mmsTextCol
asssassssx = ctx.measureText(gaagpootext);
asssassss = asssassssx.width

if ((gaagpootype > 0) && (asdqnf == 1)){
weeweeweewee = (eval('line' + q1 + 'station' + q2 + 'text'))
if (gaagpoodir == 1){
ctx.textAlign = 'right';
ctx.textBaseline = 'top';
multiFillText(weeweeweewee, (gaagpoox - (((eval('stat' + gaagpootype + 'q')) * gpooggq) * 0.75)), ((gaagpooy - (((eval('stat' + gaagpootype + 'q')) * gpooggq) * 0.75)) - (gpooggq / 4)), (fontzsize + (fontzsize / 2)), cutOff, "top");

}
if (gaagpoodir == 2){
ctx.textAlign = 'center';
ctx.textBaseline = 'top';
multiFillText(weeweeweewee, (gaagpoox), ((gaagpooy - (((eval('stat' + gaagpootype + 'q')) * gpooggq) * 1)) - (gpooggq / 4)), (fontzsize + (fontzsize / 2)), cutOff, "top");

}
if (gaagpoodir == 3){
ctx.textAlign = 'left';
ctx.textBaseline = 'top';
multiFillText(weeweeweewee, (gaagpoox + (((eval('stat' + gaagpootype + 'q')) * gpooggq) * 0.75)), ((gaagpooy - (((eval('stat' + gaagpootype + 'q')) * gpooggq) * 0.75)) - (gpooggq / 4)), (fontzsize + (fontzsize / 2)), cutOff, "top");

}
if (gaagpoodir == 4){
ctx.textAlign = 'right';
ctx.textBaseline = 'top';
multiFillText(weeweeweewee, (gaagpoox - (((eval('stat' + gaagpootype + 'q')) * gpooggq) * 1.5)), (gaagpooy - (gpooggq / 4)), (fontzsize + (fontzsize / 2)), cutOff, "middle");

}
if (gaagpoodir == 5){
ctx.textAlign = 'left';
ctx.textBaseline = 'top';
multiFillText(weeweeweewee, (gaagpoox + (((eval('stat' + gaagpootype + 'q')) * gpooggq) * 1.5)), (gaagpooy - (gpooggq / 4)), (fontzsize + (fontzsize / 2)), cutOff, "middle");

}
if (gaagpoodir == 6){
ctx.textAlign = 'right';
ctx.textBaseline = 'top';
multiFillText(weeweeweewee, (gaagpoox - (((eval('stat' + gaagpootype + 'q')) * gpooggq) * 0.65)), (gaagpooy + (((eval('stat' + gaagpootype + 'q')) * gpooggq) * 0.65)), (fontzsize + (fontzsize / 2)), cutOff, "bottom");

}
if (gaagpoodir == 7){
ctx.textAlign = 'center';
ctx.textBaseline = 'top';
multiFillText(weeweeweewee, (gaagpoox), (gaagpooy + (((eval('stat' + gaagpootype + 'q')) * gpooggq) * 1)), (fontzsize + (fontzsize / 2)), cutOff, "bottom");

}
if (gaagpoodir == 8){
ctx.textAlign = 'left';
ctx.textBaseline = 'top';
multiFillText(weeweeweewee, (gaagpoox + (((eval('stat' + gaagpootype + 'q')) * gpooggq) * 0.65)), (gaagpooy + (((eval('stat' + gaagpootype + 'q')) * gpooggq) * 0.65)), (fontzsize + (fontzsize / 2)), cutOff, "bottom");

}

/* MMS-PATCH free texts render in their own per-route pass below (outside the station loop) */

}








q2++
}

/* MMS-PATCH free texts: one pass per route, outside the station loop so labels
   draw even when the route has no stations; uses the configured studio font */
if (asdqnf == 1){
mmsTxN = 0;
try { mmsTxN = eval("line" + q1 + "texts"); } catch (mmsTxE) { mmsTxN = 0; }
if (((typeof mmsTxN) == "number") && (mmsTxN > 0)){
mmsTxFontQ = mmsTextFont;
if (((typeof mmsTxFontQ) != "string") || (mmsTxFontQ == "")){ mmsTxFontQ = "Arial"; }
if ((mmsTxFontQ.indexOf(" ") != -1)){ mmsTxFontQ = ('"' + mmsTxFontQ + '"'); }
mmsTxI = 1;
while ((mmsTxI - 1) < mmsTxN){
mmsTxS = "";
try { mmsTxS = eval("line" + q1 + "text" + mmsTxI + "text"); } catch (mmsTxE2) { mmsTxS = ""; }
if (((typeof mmsTxS) == "string") && (mmsTxS != "")){
mmsTxX = eval("line" + q1 + "text" + mmsTxI + "x");
mmsTxY = eval("line" + q1 + "text" + mmsTxI + "y");
/* MMS-PATCH per-item text style (falls back to studio globals) */
mmsTxFS = fontzsize;
try { mmsTxFSv = eval("line" + q1 + "text" + mmsTxI + "size"); if (((typeof mmsTxFSv) == "number") && (mmsTxFSv > 0)){ mmsTxFS = mmsTxFSv; } } catch (mmsTxE5){}
mmsTxFC = mmsTextCol;
try { mmsTxFCv = eval("line" + q1 + "text" + mmsTxI + "col"); if (((typeof mmsTxFCv) == "string") && (mmsTxFCv != "")){ mmsTxFC = mmsTxFCv; } } catch (mmsTxE6){}
mmsTxBW = 0;
try { mmsTxBWv = eval("line" + q1 + "text" + mmsTxI + "bwid"); if (((typeof mmsTxBWv) == "number") && (mmsTxBWv > 0)){ mmsTxBW = mmsTxBWv; } } catch (mmsTxE7){}
mmsTxBC = "#000000";
try { mmsTxBCv = eval("line" + q1 + "text" + mmsTxI + "bcol"); if (((typeof mmsTxBCv) == "string") && (mmsTxBCv != "")){ mmsTxBC = mmsTxBCv; } } catch (mmsTxE8){}
ctx.font = (mmsTxFS + "pt " + mmsTxFontQ);
ctx.textAlign = "center";
ctx.textBaseline = "middle";
/* MMS-PATCH % splits free texts into centered lines (like station labels) */
mmsTxLines = ("" + mmsTxS).split("%");
mmsTxLH = (mmsTxFS + (mmsTxFS / 2));
mmsTxRot = 0;
try { mmsTxRotV = eval("line" + q1 + "text" + mmsTxI + "rot"); if (((typeof mmsTxRotV) == "number") && isFinite(mmsTxRotV)){ mmsTxRot = mmsTxRotV; } } catch (mmsTxE9){}
ctx.save();
ctx.translate(mmsTxX, mmsTxY);
if (mmsTxRot != 0){ ctx.rotate((mmsTxRot * Math.PI) / 180); }
mmsTxRn = mmsTxLines.length;
mmsTxLi = 0;
while (mmsTxLi < mmsTxRn){
mmsTxRy = ((mmsTxLi - ((mmsTxRn - 1) / 2)) * mmsTxLH);
if (mmsTxBW > 0){
ctx.lineWidth = mmsTxBW;
ctx.strokeStyle = mmsTxBC;
ctx.lineJoin = "round";
ctx.strokeText(mmsTxLines[mmsTxLi], 0, mmsTxRy);
}
ctx.fillStyle = mmsTxFC;
ctx.fillText(mmsTxLines[mmsTxLi], 0, mmsTxRy);
mmsTxLi++;
}
ctx.restore();
}
mmsTxI++;
}
}
}




q1++
}}




var cutOff = 800,
    DEBUG = false;

var multiFillText = function(text, x, y, lineHeight, fitWidth, verticala) {
    var draw = x !== null && y !== null;
    var amount = 0
	
try
  {
    sections = text.split("%");
  }
catch(err)
  {
  sections = text
  }	

	
	
	if (verticala == "top"){
    amount = ((sections.length) * lineHeight)
	}
	if (verticala == "middle"){
    amount = ((sections.length) * (lineHeight / 2))
	}
	
	
    var i, str, wordWidth, words, currentLine = 0,
        maxHeight = 0,
        maxWidth = 0;

    var printNextLine = function(str) {
        if (draw) {
            ctx.fillText(str, x, y + ((lineHeight * currentLine) - amount));
        }

        currentLine++;
        wordWidth = ctx.measureText(str).width;
        if (wordWidth > maxWidth) {
            maxWidth = wordWidth;
        }
    };

    for (i = 0; i < sections.length; i++) {
        words = sections[i].split(' ');
        index = 1;

        while (words.length > 0 && index <= words.length) {

            str = words.slice(0, index).join(' ');
            wordWidth = ctx.measureText(str).width;

            if (wordWidth > fitWidth) {
                if (index === 1) {
                    // Falls to this case if the first word in words[] is bigger than fitWidth
                    // so we print this word on its own line; index = 2 because slice is
                    str = words.slice(0, 1).join(' ');
                    words = words.splice(1);
                } else {
                    str = words.slice(0, index - 1).join(' ');
                    words = words.splice(index - 1);
                }

                printNextLine(str);

                index = 1;
            } else {
                index++;
            }
        }

        // The left over words on the last line
        if (index > 0) {
            printNextLine(words.join(' '));
        }


    }

    maxHeight = lineHeight * (currentLine);

    if (DEBUG) {
        ctx.strokeRect(x, y, maxWidth, maxHeight);
    }

    if (!draw) {
        return {
            height: maxHeight,
            width: maxWidth
        };
    }
};

var multiMeasureText = function(text, lineHeight, fitWidth) {
    return multiFillText(text, null,null, lineHeight, fitWidth);
}



function startxjumper(asdf, asdf2){
jumpnumm = ((eval ("line" + currentroute + "width")) * jumpnum)
asdfg = asdf
q2 = 1
while ((q2 - 1) < (eval ("line" + currentroute + "ver"))){
if (((eval ("line" + currentroute + "ver" + q2 + "x")) < (asdf + jumpnumm)) && ((eval ("line" + currentroute + "ver" + q2 + "x")) > (asdf - jumpnumm))){
if (((eval ("line" + currentroute + "ver" + q2 + "y2")) > (asdf2 - jumpnumm)) && ((eval ("line" + currentroute + "ver" + q2 + "y1")) < (asdf2 + jumpnumm))){
asdfg = (eval ("line" + currentroute + "ver" + q2 + "x"))
}
}
q2++
}

q2 = 1
while ((q2 - 1) < (eval ("line" + currentroute + "hor"))){
if (((eval ("line" + currentroute + "hor" + q2 + "x1")) < (asdf + jumpnumm)) && ((eval ("line" + currentroute + "hor" + q2 + "x1")) > (asdf - jumpnumm))){
if (((eval ("line" + currentroute + "hor" + q2 + "y")) > (asdf2 - jumpnumm)) && ((eval ("line" + currentroute + "hor" + q2 + "y")) < (asdf2 + jumpnumm))){
asdfg = (eval ("line" + currentroute + "hor" + q2 + "x1"))
}
}
if (((eval ("line" + currentroute + "hor" + q2 + "x2")) < (asdf + jumpnumm)) && ((eval ("line" + currentroute + "hor" + q2 + "x2")) > (asdf - jumpnumm))){
if (((eval ("line" + currentroute + "hor" + q2 + "y")) > (asdf2 - jumpnumm)) && ((eval ("line" + currentroute + "hor" + q2 + "y")) < (asdf2 + jumpnumm))){
asdfg = (eval ("line" + currentroute + "hor" + q2 + "x2"))
}
}
q2++
}

q2 = 1
while ((q2 - 1) < (eval ("line" + currentroute + "topleft"))){
asdfghjkl = (eval ("line" + currentroute + "topleft" + q2 + "width"))
asdf3 = (asdf2 - (eval ("line" + currentroute + "topleft" + q2 + "y")))
if (((eval ("line" + currentroute + "topleft" + q2 + "x")) < asdf) && (((eval ("line" + currentroute + "topleft" + q2 + "x")) + asdfghjkl) > asdf)){
if (((eval ("line" + currentroute + "topleft" + q2 + "y")) < asdf2) && (((eval ("line" + currentroute + "topleft" + q2 + "y")) + asdfghjkl) > asdf2)){
if ((((eval ("line" + currentroute + "topleft" + q2 + "x")) + asdf3) < (asdf + jumpnumm)) && (((eval ("line" + currentroute + "topleft" + q2 + "x")) + asdf3) > (asdf - jumpnumm))){
asdfg = ((eval ("line" + currentroute + "topleft" + q2 + "x")) + asdf3)
}
}
}


if (((eval ("line" + currentroute + "topleft" + q2 + "x")) < (asdf + jumpnumm)) && ((eval ("line" + currentroute + "topleft" + q2 + "x")) > (asdf - jumpnumm))){
if (((eval ("line" + currentroute + "topleft" + q2 + "y")) > (asdf2 - jumpnumm)) && ((eval ("line" + currentroute + "topleft" + q2 + "y")) < (asdf2 + jumpnumm))){
asdfg = (eval ("line" + currentroute + "topleft" + q2 + "x"))
}
}

if ((((eval ("line" + currentroute + "topleft" + q2 + "x")) + asdfghjkl) < (asdf + jumpnumm)) && (((eval ("line" + currentroute + "topleft" + q2 + "x")) + asdfghjkl) > (asdf - jumpnumm))){
if ((((eval ("line" + currentroute + "topleft" + q2 + "y")) + asdfghjkl) > (asdf2 - jumpnumm)) && (((eval ("line" + currentroute + "topleft" + q2 + "y")) + asdfghjkl) < (asdf2 + jumpnumm))){
asdfg = ((eval ("line" + currentroute + "topleft" + q2 + "x")) + asdfghjkl)
}
}
q2++
}

q2 = 1
while ((q2 - 1) < (eval ("line" + currentroute + "topright"))){
asdfghjkl = (eval ("line" + currentroute + "topright" + q2 + "width"))


asdf3 = (asdf2 - (eval ("line" + currentroute + "topright" + q2 + "y")))
if (((eval ("line" + currentroute + "topright" + q2 + "x")) > asdf) && (((eval ("line" + currentroute + "topright" + q2 + "x")) - asdfghjkl) < asdf)){
if (((eval ("line" + currentroute + "topright" + q2 + "y")) < asdf2) && (((eval ("line" + currentroute + "topright" + q2 + "y")) + asdfghjkl) > asdf2)){
if ((((eval ("line" + currentroute + "topright" + q2 + "x")) - asdf3) < (asdf + jumpnumm)) && (((eval ("line" + currentroute + "topright" + q2 + "x")) - asdf3) > (asdf - jumpnumm))){
asdfg = ((eval ("line" + currentroute + "topright" + q2 + "x")) - asdf3)
}
}
}




if (((eval ("line" + currentroute + "topright" + q2 + "x")) < (asdf + jumpnumm)) && ((eval ("line" + currentroute + "topright" + q2 + "x")) > (asdf - jumpnumm))){
if (((eval ("line" + currentroute + "topright" + q2 + "y")) > (asdf2 - jumpnumm)) && ((eval ("line" + currentroute + "topright" + q2 + "y")) < (asdf2 + jumpnumm))){
asdfg = (eval ("line" + currentroute + "topright" + q2 + "x"))
}
}
if ((((eval ("line" + currentroute + "topright" + q2 + "x")) - asdfghjkl) < (asdf + jumpnumm)) && (((eval ("line" + currentroute + "topright" + q2 + "x")) - asdfghjkl) > (asdf - jumpnumm))){
if ((((eval ("line" + currentroute + "topright" + q2 + "y")) + asdfghjkl) > (asdf2 - jumpnumm)) && (((eval ("line" + currentroute + "topright" + q2 + "y")) + asdfghjkl) < (asdf2 + jumpnumm))){
asdfg = ((eval ("line" + currentroute + "topright" + q2 + "x")) - asdfghjkl)
}
}
q2++
}

if (asdfg == asdf){
xjumped = 0
}else{
xjumped = 1
}
return(asdfg)
}

function startyjumper(asdf, asdf2){
jumpnumm = ((eval ("line" + currentroute + "width")) * jumpnum)
asdfg = asdf
q2 = 1
while ((q2 - 1) < (eval ("line" + currentroute + "hor"))){
if (((eval ("line" + currentroute + "hor" + q2 + "y")) < (asdf + jumpnumm)) && ((eval ("line" + currentroute + "hor" + q2 + "y")) > (asdf - jumpnumm))){
if (((eval ("line" + currentroute + "hor" + q2 + "x2")) > (asdf2 - jumpnumm)) && ((eval ("line" + currentroute + "hor" + q2 + "x1")) < (asdf2 + jumpnumm))){
asdfg = (eval ("line" + currentroute + "hor" + q2 + "y"))
}
}
q2++
}

q2 = 1
while ((q2 - 1) < (eval ("line" + currentroute + "ver"))){
if (((eval ("line" + currentroute + "ver" + q2 + "y1")) < (asdf + jumpnumm)) && ((eval ("line" + currentroute + "ver" + q2 + "y1")) > (asdf - jumpnumm))){
if (((eval ("line" + currentroute + "ver" + q2 + "x")) > (asdf2 - jumpnumm)) && ((eval ("line" + currentroute + "ver" + q2 + "x")) < (asdf2 + jumpnumm))){
asdfg = (eval ("line" + currentroute + "ver" + q2 + "y1"))
}
}
if (((eval ("line" + currentroute + "ver" + q2 + "y2")) < (asdf + jumpnumm)) && ((eval ("line" + currentroute + "ver" + q2 + "y2")) > (asdf - jumpnumm))){
if (((eval ("line" + currentroute + "ver" + q2 + "x")) > (asdf2 - jumpnumm)) && ((eval ("line" + currentroute + "ver" + q2 + "x")) < (asdf2 + jumpnumm))){
asdfg = (eval ("line" + currentroute + "ver" + q2 + "y2"))
}
}
q2++
}

q2 = 1
while ((q2 - 1) < (eval ("line" + currentroute + "topleft"))){
asdfghjkl = (eval ("line" + currentroute + "topleft" + q2 + "width"))
asdf3 = (asdf2 - (eval ("line" + currentroute + "topleft" + q2 + "x")))



if (((eval ("line" + currentroute + "topleft" + q2 + "x")) < (asdf2 + jumpnumm)) && ((eval ("line" + currentroute + "topleft" + q2 + "x")) > (asdf2 - jumpnumm))){
if (((eval ("line" + currentroute + "topleft" + q2 + "y")) > (asdf - jumpnumm)) && ((eval ("line" + currentroute + "topleft" + q2 + "y")) < (asdf + jumpnumm))){
asdfg = (eval ("line" + currentroute + "topleft" + q2 + "y"))
}
}

if ((((eval ("line" + currentroute + "topleft" + q2 + "x")) + asdfghjkl) < (asdf2 + jumpnumm)) && (((eval ("line" + currentroute + "topleft" + q2 + "x")) + asdfghjkl) > (asdf2 - jumpnumm))){
if ((((eval ("line" + currentroute + "topleft" + q2 + "y")) + asdfghjkl) > (asdf - jumpnumm)) && (((eval ("line" + currentroute + "topleft" + q2 + "y")) + asdfghjkl) < (asdf + jumpnumm))){
asdfg = ((eval ("line" + currentroute + "topleft" + q2 + "y")) + asdfghjkl)
}
}
q2++
}

q2 = 1
while ((q2 - 1) < (eval ("line" + currentroute + "topright"))){
asdfghjkl = (eval ("line" + currentroute + "topright" + q2 + "width"))


asdf3 = ((eval ("line" + currentroute + "topright" + q2 + "x")) - asdf2)





if (((eval ("line" + currentroute + "topright" + q2 + "x")) < (asdf2 + jumpnumm)) && ((eval ("line" + currentroute + "topright" + q2 + "x")) > (asdf2 - jumpnumm))){
if (((eval ("line" + currentroute + "topright" + q2 + "y")) > (asdf - jumpnumm)) && ((eval ("line" + currentroute + "topright" + q2 + "y")) < (asdf + jumpnumm))){
asdfg = (eval ("line" + currentroute + "topright" + q2 + "y"))
}
}
if ((((eval ("line" + currentroute + "topright" + q2 + "x")) - asdfghjkl) < (asdf2 + jumpnumm)) && (((eval ("line" + currentroute + "topright" + q2 + "x")) - asdfghjkl) > (asdf2 - jumpnumm))){
if ((((eval ("line" + currentroute + "topright" + q2 + "y")) + asdfghjkl) > (asdf - jumpnumm)) && (((eval ("line" + currentroute + "topright" + q2 + "y")) + asdfghjkl) < (asdf + jumpnumm))){
asdfg = ((eval ("line" + currentroute + "topright" + q2 + "y")) + asdfghjkl)
}
}
q2++
}


if (asdfg == asdf){
yjumped = 0
}else{
yjumped = 1
}

return(asdfg)
}


function undof(){
if (undo > 0){
eval(eval("undo" + undo))
undo--
drawmap(1)
}}

function redof(){
if (undo < redo){
undo++
eval(eval("redo" + undo))
drawmap(1)
}}

function thedel(){
undo++
redo = undo
window["undo" + undo] = ('line' + currentroute + 'stations = ' + (eval('line' + currentroute + 'stations')) + ';line' + currentroute + 'ver = ' + (eval('line' + currentroute + 'ver')) + ';line' + currentroute + 'hor = ' + (eval('line' + currentroute + 'hor')) + ';line' + currentroute + 'topleft = ' + (eval('line' + currentroute + 'topleft')) + ';line' + currentroute + 'topright = ' + (eval('line' + currentroute + 'topright')) + ';')
window["redo" + undo] = ('line' + currentroute + 'stations = 0;line' + currentroute + 'ver = 0;line' + currentroute + 'hor = 0;line' + currentroute + 'topleft = 0;line' + currentroute + 'topright = 0;')
eval(eval("redo" + undo))
drawmap(1)
}



function addrouteyay(qqwweerr){
var x=document.getElementById("aaqq");
var option=document.createElement("option");
option.text=qqwweerr
option.setAttribute('onclick', 'currentroute = ' + (numlines + 1) + '; routechange();');
option.setAttribute('id', 'option' + (numlines + 1));
option.setAttribute('selected', 'selected');
try
{
x.add(option,x.options[null]);
}
catch (e)
{
x.add(option,null);
}
numlines++
currentroute = numlines
window["line" + numlines + "stations"] = 0
window["line" + numlines + "texts"] = 0
window["line" + numlines + "ver"] = 0
window["line" + numlines + "hor"] = 0
window["line" + numlines + "topleft"] = 0
window["line" + numlines + "topright"] = 0
window["line" + numlines + "col"] = '#000000'
window["line" + numlines + "width"] = 4
routechange()
}

function routechange(){
document.getElementById('colbox').color.fromString(eval("line" + currentroute + "col"))
document.forms['myform'].widbox.value = (eval("line" + currentroute + "width"))
document.forms['myform'].nambox.value = document.getElementById('option' + currentroute).innerHTML
}

function setroutes(zzxxccvv){
undo = 0
redo = 0
while (numlines > 0){
var parent = document.getElementsByTagName('aaqq');
var elem = document.getElementById('option' + numlines);
var old = (elem.parentNode).removeChild(elem);
numlines--
}
while (numlines < zzxxccvv){
addrouteyay('ROUTE ' + (numlines + 1))
}}


function thebigsave(){
thedata = ""
thedata += ("setroutes\(" + numlines + "\)")
thedata += (";curvenum = " + curvenum)
thedata += (";jumpnum = " + jumpnum)
thedata += (";cowpatuuuuu = " + cowpatuuuuu)
thedata += (";fontzsize = " + fontzsize)
thedata += (";mmsTextCol = \"" + mmsTextCol + "\"")
thedata += (";mmsCanvasCol = \"" + mmsCanvasCol + "\"")
thedata += (";mmsTextFont = \"" + mmsTextFont + "\"")
/* MMS-PATCH nature persisted (same eval round-trip as the rest) */
thedata += (";rivercol = \"" + rivercol + "\"")
thedata += (";riverwidth = " + riverwidth)
thedata += (";rivercurve = " + rivercurve)
thedata += (";parkcol = \"" + parkcol + "\"")
thedata += (";parkradius = " + parkradius)
thedata += (";parkbwid = " + parkbwid)
thedata += (";parkbcol = \"" + parkbcol + "\"")
/* MMS-PATCH river segments persisted (same shapes as track segments) */
try { mmsRvVSV = riverver; } catch (mmsRvE8){ mmsRvVSV = 0; }
if (((typeof mmsRvVSV) != "number") || (!(mmsRvVSV >= 0))){ mmsRvVSV = 0; }
thedata += (";riverver = " + Math.floor(mmsRvVSV))
mmsRvISv = 1;
while ((mmsRvISv - 1) < mmsRvVSV){
thedata += (";riverver" + mmsRvISv + "x = " + eval("riverver" + mmsRvISv + "x"));
thedata += (";riverver" + mmsRvISv + "y1 = " + eval("riverver" + mmsRvISv + "y1"));
thedata += (";riverver" + mmsRvISv + "y2 = " + eval("riverver" + mmsRvISv + "y2"));
mmsRvISv++;
}
try { mmsRvHSV = riverhor; } catch (mmsRvE9){ mmsRvHSV = 0; }
if (((typeof mmsRvHSV) != "number") || (!(mmsRvHSV >= 0))){ mmsRvHSV = 0; }
thedata += (";riverhor = " + Math.floor(mmsRvHSV))
mmsRvISv = 1;
while ((mmsRvISv - 1) < mmsRvHSV){
thedata += (";riverhor" + mmsRvISv + "y = " + eval("riverhor" + mmsRvISv + "y"));
thedata += (";riverhor" + mmsRvISv + "x1 = " + eval("riverhor" + mmsRvISv + "x1"));
thedata += (";riverhor" + mmsRvISv + "x2 = " + eval("riverhor" + mmsRvISv + "x2"));
mmsRvISv++;
}
try { mmsRvTlSV = rivertopleft; } catch (mmsRvE10){ mmsRvTlSV = 0; }
if (((typeof mmsRvTlSV) != "number") || (!(mmsRvTlSV >= 0))){ mmsRvTlSV = 0; }
thedata += (";rivertopleft = " + Math.floor(mmsRvTlSV))
mmsRvISv = 1;
while ((mmsRvISv - 1) < mmsRvTlSV){
thedata += (";rivertopleft" + mmsRvISv + "x = " + eval("rivertopleft" + mmsRvISv + "x"));
thedata += (";rivertopleft" + mmsRvISv + "y = " + eval("rivertopleft" + mmsRvISv + "y"));
thedata += (";rivertopleft" + mmsRvISv + "width = " + eval("rivertopleft" + mmsRvISv + "width"));
mmsRvISv++;
}
try { mmsRvTrSV = rivertopright; } catch (mmsRvE11){ mmsRvTrSV = 0; }
if (((typeof mmsRvTrSV) != "number") || (!(mmsRvTrSV >= 0))){ mmsRvTrSV = 0; }
thedata += (";rivertopright = " + Math.floor(mmsRvTrSV))
mmsRvISv = 1;
while ((mmsRvISv - 1) < mmsRvTrSV){
thedata += (";rivertopright" + mmsRvISv + "x = " + eval("rivertopright" + mmsRvISv + "x"));
thedata += (";rivertopright" + mmsRvISv + "y = " + eval("rivertopright" + mmsRvISv + "y"));
thedata += (";rivertopright" + mmsRvISv + "width = " + eval("rivertopright" + mmsRvISv + "width"));
mmsRvISv++;
}
try { mmsPkNSv = parks; } catch (mmsPkE3){ mmsPkNSv = 0; }
if (((typeof mmsPkNSv) != "number") || (!(mmsPkNSv > 0))){ mmsPkNSv = 0; }
thedata += (";parks = " + mmsPkNSv)
mmsPkISv = 1;
while ((mmsPkISv - 1) < mmsPkNSv){
thedata += (";park" + mmsPkISv + "x = " + eval("park" + mmsPkISv + "x"));
thedata += (";park" + mmsPkISv + "y = " + eval("park" + mmsPkISv + "y"));
thedata += (";park" + mmsPkISv + "w = " + eval("park" + mmsPkISv + "w"));
thedata += (";park" + mmsPkISv + "h = " + eval("park" + mmsPkISv + "h"));
mmsPkISv++;
}
/* MMS-PATCH zones + sea persisted */
thedata += (";zonecol = \"" + zonecol + "\"")
thedata += (";zonewidth = " + zonewidth)
thedata += (";seacol = \"" + seacol + "\"")
try { mmsZnVSV = zonever; } catch (mmsZnE8){ mmsZnVSV = 0; }
if (((typeof mmsZnVSV) != "number") || (!(mmsZnVSV >= 0))){ mmsZnVSV = 0; }
thedata += (";zonever = " + Math.floor(mmsZnVSV))
mmsZnISv = 1;
while ((mmsZnISv - 1) < mmsZnVSV){
thedata += (";zonever" + mmsZnISv + "x = " + eval("zonever" + mmsZnISv + "x"));
thedata += (";zonever" + mmsZnISv + "y1 = " + eval("zonever" + mmsZnISv + "y1"));
thedata += (";zonever" + mmsZnISv + "y2 = " + eval("zonever" + mmsZnISv + "y2"));
mmsZnISv++;
}
try { mmsZnHSV = zonehor; } catch (mmsZnE9){ mmsZnHSV = 0; }
if (((typeof mmsZnHSV) != "number") || (!(mmsZnHSV >= 0))){ mmsZnHSV = 0; }
thedata += (";zonehor = " + Math.floor(mmsZnHSV))
mmsZnISv = 1;
while ((mmsZnISv - 1) < mmsZnHSV){
thedata += (";zonehor" + mmsZnISv + "y = " + eval("zonehor" + mmsZnISv + "y"));
thedata += (";zonehor" + mmsZnISv + "x1 = " + eval("zonehor" + mmsZnISv + "x1"));
thedata += (";zonehor" + mmsZnISv + "x2 = " + eval("zonehor" + mmsZnISv + "x2"));
mmsZnISv++;
}
try { mmsZnTlSV = zonetopleft; } catch (mmsZnE10){ mmsZnTlSV = 0; }
if (((typeof mmsZnTlSV) != "number") || (!(mmsZnTlSV >= 0))){ mmsZnTlSV = 0; }
thedata += (";zonetopleft = " + Math.floor(mmsZnTlSV))
mmsZnISv = 1;
while ((mmsZnISv - 1) < mmsZnTlSV){
thedata += (";zonetopleft" + mmsZnISv + "x = " + eval("zonetopleft" + mmsZnISv + "x"));
thedata += (";zonetopleft" + mmsZnISv + "y = " + eval("zonetopleft" + mmsZnISv + "y"));
thedata += (";zonetopleft" + mmsZnISv + "width = " + eval("zonetopleft" + mmsZnISv + "width"));
mmsZnISv++;
}
try { mmsZnTrSV = zonetopright; } catch (mmsZnE11){ mmsZnTrSV = 0; }
if (((typeof mmsZnTrSV) != "number") || (!(mmsZnTrSV >= 0))){ mmsZnTrSV = 0; }
thedata += (";zonetopright = " + Math.floor(mmsZnTrSV))
mmsZnISv = 1;
while ((mmsZnISv - 1) < mmsZnTrSV){
thedata += (";zonetopright" + mmsZnISv + "x = " + eval("zonetopright" + mmsZnISv + "x"));
thedata += (";zonetopright" + mmsZnISv + "y = " + eval("zonetopright" + mmsZnISv + "y"));
thedata += (";zonetopright" + mmsZnISv + "width = " + eval("zonetopright" + mmsZnISv + "width"));
mmsZnISv++;
}
try { mmsSeaNSv = seas; } catch (mmsSeaE3){ mmsSeaNSv = 0; }
if (((typeof mmsSeaNSv) != "number") || (!(mmsSeaNSv > 0))){ mmsSeaNSv = 0; }
thedata += (";seas = " + mmsSeaNSv)
mmsSeaISv = 1;
while ((mmsSeaISv - 1) < mmsSeaNSv){
thedata += (";sea" + mmsSeaISv + "x = " + eval("sea" + mmsSeaISv + "x"));
thedata += (";sea" + mmsSeaISv + "y = " + eval("sea" + mmsSeaISv + "y"));
thedata += (";sea" + mmsSeaISv + "w = " + eval("sea" + mmsSeaISv + "w"));
thedata += (";sea" + mmsSeaISv + "h = " + eval("sea" + mmsSeaISv + "h"));
mmsSeaISv++;
}



q1 = 1
while ((q1 - 1) < numlines ){
thedata += (";line" + q1 + "col = \"" + eval ("line" + q1 + "col") + "\"")
thedata += (";line" + q1 + "width = " + eval ("line" + q1 + "width"))

q2 = 1
thedata += (";line" + q1 + "ver = " + eval ("line" + q1 + "ver"))
while ((q2 - 1) < (eval ("line" + q1 + "ver"))){
thedata += (";line" + q1 + "ver" + q2 + "x = " + eval ("line" + q1 + "ver" + q2 + "x"))
thedata += (";line" + q1 + "ver" + q2 + "y1 = " + eval ("line" + q1 + "ver" + q2 + "y1"))
thedata += (";line" + q1 + "ver" + q2 + "y2 = " + eval ("line" + q1 + "ver" + q2 + "y2"))
q2++
}
q2 = 1
thedata += (";line" + q1 + "hor = " + eval ("line" + q1 + "hor"))
while ((q2 - 1) < (eval ("line" + q1 + "hor"))){
thedata += (";line" + q1 + "hor" + q2 + "x1 = " + eval ("line" + q1 + "hor" + q2 + "x1"))
thedata += (";line" + q1 + "hor" + q2 + "x2 = " + eval ("line" + q1 + "hor" + q2 + "x2"))
thedata += (";line" + q1 + "hor" + q2 + "y = " + eval ("line" + q1 + "hor" + q2 + "y"))
q2++
}
/*
q2 = 1
thedata += (";line" + q1 + "hor = " + eval ("line" + q1 + "hor"))
while ((q2 - 1) < (eval ("line" + q1 + "hor"))){
thedata += (";line" + q1 + "hor" + q2 + "x1 = " + eval ("line" + q1 + "hor" + q2 + "x1"))
thedata += (";line" + q1 + "hor" + q2 + "x2 = " + eval ("line" + q1 + "hor" + q2 + "x2"))
thedata += (";line" + q1 + "hor" + q2 + "y = " + eval ("line" + q1 + "hor" + q2 + "y"))
q2++
}
*/
q2 = 1
thedata += (";line" + q1 + "topleft = " + eval ("line" + q1 + "topleft"))
while ((q2 - 1) < (eval ("line" + q1 + "topleft"))){
thedata += (";line" + q1 + "topleft" + q2 + "x = " + eval ("line" + q1 + "topleft" + q2 + "x"))
thedata += (";line" + q1 + "topleft" + q2 + "y = " + eval ("line" + q1 + "topleft" + q2 + "y"))
thedata += (";line" + q1 + "topleft" + q2 + "width = " + eval ("line" + q1 + "topleft" + q2 + "width"))
q2++
}
q2 = 1
thedata += (";line" + q1 + "topright = " + eval ("line" + q1 + "topright"))
while ((q2 - 1) < (eval ("line" + q1 + "topright"))){
thedata += (";line" + q1 + "topright" + q2 + "x = " + eval ("line" + q1 + "topright" + q2 + "x"))
thedata += (";line" + q1 + "topright" + q2 + "y = " + eval ("line" + q1 + "topright" + q2 + "y"))
thedata += (";line" + q1 + "topright" + q2 + "width = " + eval ("line" + q1 + "topright" + q2 + "width"))
q2++
}

q2 = 1
thedata += (";line" + q1 + "stations = " + eval ("line" + q1 + "stations"))
while ((q2 - 1) < (eval ("line" + q1 + "stations"))){
thedata += (";line" + q1 + "station" + q2 + "x = " + eval ("line" + q1 + "station" + q2 + "x"))
thedata += (";line" + q1 + "station" + q2 + "y = " + eval ("line" + q1 + "station" + q2 + "y"))
thedata += (";line" + q1 + "station" + q2 + "type = " + eval ("line" + q1 + "station" + q2 + "type"))
thedata += (";line" + q1 + "station" + q2 + "dir = " + eval ("line" + q1 + "station" + q2 + "dir"))
thedata += (";line" + q1 + "station" + q2 + "text = \"" + eval ("line" + q1 + "station" + q2 + "text") + "\"")
/* MMS-PATCH pill width persisted alongside the station */
mmsPillWsv = 0;
try { mmsPillWsv = eval("line" + q1 + "station" + q2 + "w"); } catch (mmsPillE2) { mmsPillWsv = 0; }
if (((typeof mmsPillWsv) == "number") && (mmsPillWsv > 0)){ thedata += (";line" + q1 + "station" + q2 + "w = " + mmsPillWsv); }

/* MMS-PATCH free texts persisted (quotes escaped for the eval round-trip) */
mmsTxNSv = 0;
try { mmsTxNSv = eval("line" + q1 + "texts"); } catch (mmsTxE3) { mmsTxNSv = 0; }
if (((typeof mmsTxNSv) != "number") || (!(mmsTxNSv > 0))){ mmsTxNSv = 0; }
thedata += (";line" + q1 + "texts = " + mmsTxNSv);
mmsTxISv = 1;
while ((mmsTxISv - 1) < mmsTxNSv){
thedata += (";line" + q1 + "text" + mmsTxISv + "x = " + eval("line" + q1 + "text" + mmsTxISv + "x"));
thedata += (";line" + q1 + "text" + mmsTxISv + "y = " + eval("line" + q1 + "text" + mmsTxISv + "y"));
mmsTxESv = "";
try { mmsTxESv = eval("line" + q1 + "text" + mmsTxISv + "text"); } catch (mmsTxE4) { mmsTxESv = ""; }
mmsTxESv = ("" + mmsTxESv).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
thedata += (";line" + q1 + "text" + mmsTxISv + "text = \"" + mmsTxESv + "\"");
/* MMS-PATCH per-item text style (only when set; globals cover the rest) */
try { mmsTxSzSv = eval("line" + q1 + "text" + mmsTxISv + "size"); } catch (mmsTxE9) { mmsTxSzSv = 0; }
if (((typeof mmsTxSzSv) == "number") && (mmsTxSzSv > 0)){ thedata += (";line" + q1 + "text" + mmsTxISv + "size = " + mmsTxSzSv); }
try { mmsTxCoSv = eval("line" + q1 + "text" + mmsTxISv + "col"); } catch (mmsTxE10) { mmsTxCoSv = ""; }
if (((typeof mmsTxCoSv) == "string") && (mmsTxCoSv != "")){ thedata += (";line" + q1 + "text" + mmsTxISv + "col = \"" + mmsTxCoSv + "\""); }
try { mmsTxBwSv = eval("line" + q1 + "text" + mmsTxISv + "bwid"); } catch (mmsTxE11) { mmsTxBwSv = 0; }
if (((typeof mmsTxBwSv) == "number") && (mmsTxBwSv > 0)){
thedata += (";line" + q1 + "text" + mmsTxISv + "bwid = " + mmsTxBwSv);
try { mmsTxBcSv = eval("line" + q1 + "text" + mmsTxISv + "bcol"); } catch (mmsTxE12) { mmsTxBcSv = ""; }
if (((typeof mmsTxBcSv) == "string") && (mmsTxBcSv != "")){ thedata += (";line" + q1 + "text" + mmsTxISv + "bcol = \"" + mmsTxBcSv + "\""); }
}
try { mmsTxRtSv = eval("line" + q1 + "text" + mmsTxISv + "rot"); } catch (mmsTxE13) { mmsTxRtSv = 0; }
if (((typeof mmsTxRtSv) == "number") && (mmsTxRtSv != 0)){ thedata += (";line" + q1 + "text" + mmsTxISv + "rot = " + mmsTxRtSv); }
mmsTxISv++;
}

q2++
}






q1++
}




document.getElementById('saver').style.display = 'block'
document.frm2.txt2.value = thedata

        textBoxmoo.select();

}













function thebigsavey(){
thedata = ""
q1 = 1
while ((q1 - 1) < numlines ){
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "ver"))){
window["line" + q1 + "ver" + q2 + "y1"] = ((eval("line" + q1 + "ver" + q2 + "y1")) + 30)
window["line" + q1 + "ver" + q2 + "y2"] = ((eval("line" + q1 + "ver" + q2 + "y2")) + 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "hor"))){
window["line" + q1 + "hor" + q2 + "y"] = ((eval("line" + q1 + "hor" + q2 + "y")) + 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topleft"))){
window["line" + q1 + "topleft" + q2 + "y"] = ((eval("line" + q1 + "topleft" + q2 + "y")) + 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topright"))){
window["line" + q1 + "topright" + q2 + "y"] = ((eval("line" + q1 + "topright" + q2 + "y")) + 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "stations"))){
window["line" + q1 + "station" + q2 + "y"] = ((eval("line" + q1 + "station" + q2 + "y")) + 30)
q2++
}
q1++
}
drawmap(1)
}




function thebigsaveyy(){
thedata = ""
q1 = 1
while ((q1 - 1) < numlines ){
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "ver"))){
window["line" + q1 + "ver" + q2 + "y1"] = ((eval("line" + q1 + "ver" + q2 + "y1")) - 30)
window["line" + q1 + "ver" + q2 + "y2"] = ((eval("line" + q1 + "ver" + q2 + "y2")) - 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "hor"))){
window["line" + q1 + "hor" + q2 + "y"] = ((eval("line" + q1 + "hor" + q2 + "y")) - 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topleft"))){
window["line" + q1 + "topleft" + q2 + "y"] = ((eval("line" + q1 + "topleft" + q2 + "y")) - 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topright"))){
window["line" + q1 + "topright" + q2 + "y"] = ((eval("line" + q1 + "topright" + q2 + "y")) - 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "stations"))){
window["line" + q1 + "station" + q2 + "y"] = ((eval("line" + q1 + "station" + q2 + "y")) - 30)
q2++
}
q1++
}
drawmap(1)
}





function thebigsavex(){
thedata = ""
q1 = 1
while ((q1 - 1) < numlines ){
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "ver"))){
window["line" + q1 + "ver" + q2 + "x"] = ((eval("line" + q1 + "ver" + q2 + "x")) + 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "hor"))){
window["line" + q1 + "hor" + q2 + "x1"] = ((eval("line" + q1 + "hor" + q2 + "x1")) + 30)
window["line" + q1 + "hor" + q2 + "x2"] = ((eval("line" + q1 + "hor" + q2 + "x2")) + 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topleft"))){
window["line" + q1 + "topleft" + q2 + "x"] = ((eval("line" + q1 + "topleft" + q2 + "x")) + 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topright"))){
window["line" + q1 + "topright" + q2 + "x"] = ((eval("line" + q1 + "topright" + q2 + "x")) + 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "stations"))){
window["line" + q1 + "station" + q2 + "x"] = ((eval("line" + q1 + "station" + q2 + "x")) + 30)
q2++
}
q1++
}
drawmap(1)
}



function thebigsavexx(){
thedata = ""
q1 = 1
while ((q1 - 1) < numlines ){
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "ver"))){
window["line" + q1 + "ver" + q2 + "x"] = ((eval("line" + q1 + "ver" + q2 + "x")) - 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "hor"))){
window["line" + q1 + "hor" + q2 + "x1"] = ((eval("line" + q1 + "hor" + q2 + "x1")) - 30)
window["line" + q1 + "hor" + q2 + "x2"] = ((eval("line" + q1 + "hor" + q2 + "x2")) - 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topleft"))){
window["line" + q1 + "topleft" + q2 + "x"] = ((eval("line" + q1 + "topleft" + q2 + "x")) - 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "topright"))){
window["line" + q1 + "topright" + q2 + "x"] = ((eval("line" + q1 + "topright" + q2 + "x")) - 30)
q2++
}
q2 = 1
while ((q2 - 1) < (eval ("line" + q1 + "stations"))){
window["line" + q1 + "station" + q2 + "x"] = ((eval("line" + q1 + "station" + q2 + "x")) - 30)
q2++
}
q1++
}
drawmap(1)
}
















function fdjgnqaqag(){


if (confirm('Do you want the image to have a white background or a alpha transparent background?\n\nIf you want to add your own image as the background using anouther program you must have an alpha transparent background\n\nClick OK for a white background\nClick CANCLE for an alpha transparent background')){
cowpatuuuuu = 0
drawmap(1)
cowpatuuuuu = 0
}else{
cowpatuuuuu = 1
drawmap(1)
cowpatuuuuu = 0
}

setTimeout("fdsiofhuisdhfiosdfh()",32);


}



function fdsiofhuisdhfiosdfh(){
juhy = canvas.toDataURL();window.open(juhy, 'image', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=500,height=400');
setTimeout("drawmap(1)",64);
}






