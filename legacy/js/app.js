/* Metro Map Studio — js/app.js
 * Extracted VERBATIM from the original single-file app (beno.uk/metromapcreator/).
 * NO logic changes except two compatibility patches:
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

function qwwe(){

curvenum = 2;jumpnum = 2.4;cowpatuuuuu = 0;fontzsize = 8;line1col = "#ff2a24";line1width = 4;line1ver = 0;line1hor = 2;line1hor1x1 = 256;line1hor1x2 = 642;line1hor1y = 453;line1hor2x1 = 642;line1hor2x2 = 659;line1hor2y = 453;line1hor = 2;line1hor1x1 = 256;line1hor1x2 = 642;line1hor1y = 453;line1hor2x1 = 642;line1hor2x2 = 659;line1hor2y = 453;line1topleft = 0;line1topright = 0;line1stations = 9;line1station1x = 256;line1station1y = 453;line1station1type = 1;line1station1dir = 2;line1station1text = "Redton";line1station2x = 335;line1station2y = 453;line1station2type = 1;line1station2dir = 2;line1station2text = "Lowham West";line1station3x = 407;line1station3y = 453;line1station3type = 0;line1station3dir = 2;line1station3text = "Station";line1station4x = 403;line1station4y = 453;line1station4type = 0;line1station4dir = 2;line1station4text = "station";line1station5x = 418;line1station5y = 453;line1station5type = 4;line1station5dir = 7;line1station5text = "Race Course%(race days only)";line1station6x = 497;line1station6y = 453;line1station6type = 1;line1station6dir = 2;line1station6text = "Lowham";line1station7x = 584;line1station7y = 453;line1station7type = 0;line1station7dir = 2;line1station7text = "Station";line1station8x = 587;line1station8y = 453;line1station8type = 0;line1station8dir = 2;line1station8text = "Station";line1station9x = 659;line1station9y = 453;line1station9type = 1;line1station9dir = 2;line1station9text = "Rockham East";line2col = "#00a0e2";line2width = 4;line2ver = 1;line2ver1x = 581;line2ver1y1 = 286;line2ver1y2 = 619;line2hor = 0;line2hor = 0;line2topleft = 1;line2topleft1x = 581;line2topleft1y = 619;line2topleft1width = 45;line2topright = 1;line2topright1x = 581;line2topright1y = 619;line2topright1width = 47;line2stations = 19;line2station1x = 581;line2station1y = 453;line2station1type = 0;line2station1dir = 8;line2station1text = "Rockham%Central";line2station2x = 581;line2station2y = 453;line2station2type = 0;line2station2dir = 8;line2station2text = "Station";line2station3x = 581;line2station3y = 453;line2station3type = 3;line2station3dir = 8;line2station3text = "Rockham%Central";line2station4x = 581;line2station4y = 597;line2station4type = 0;line2station4dir = 5;line2station4text = "station";line2station5x = 581;line2station5y = 524;line2station5type = 0;line2station5dir = 5;line2station5text = "Station";line2station6x = 581;line2station6y = 603;line2station6type = 0;line2station6dir = 5;line2station6text = "Station";line2station7x = 581;line2station7y = 524;line2station7type = 0;line2station7dir = 5;line2station7text = "station";line2station8x = 581;line2station8y = 607;line2station8type = 0;line2station8dir = 5;line2station8text = "Parkland South";line2station9x = 581;line2station9y = 530;line2station9type = 0;line2station9dir = 5;line2station9text = "station";line2station10x = 581;line2station10y = 601;line2station10type = 0;line2station10dir = 5;line2station10text = "Station";line2station11x = 581;line2station11y = 505;line2station11type = 0;line2station11dir = 5;line2station11text = "Station";line2station12x = 581;line2station12y = 619;line2station12type = 0;line2station12dir = 5;line2station12text = "Station";line2station13x = 581;line2station13y = 607;line2station13type = 0;line2station13dir = 4;line2station13text = "Station";line2station14x = 581;line2station14y = 607;line2station14type = 2;line2station14dir = 4;line2station14text = "Parkland South";line2station15x = 581;line2station15y = 530;line2station15type = 2;line2station15dir = 4;line2station15text = "Parkland North";line2station16x = 534;line2station16y = 666;line2station16type = 2;line2station16dir = 4;line2station16text = "New Cross Gate";line2station17x = 626;line2station17y = 664;line2station17type = 2;line2station17dir = 5;line2station17text = "New Cross";line2station18x = 581;line2station18y = 370;line2station18type = 2;line2station18dir = 5;line2station18text = "Silverton";line2station19x = 581;line2station19y = 286;line2station19type = 2;line2station19dir = 5;line2station19text = "Goldton"

}
function qwwee(){

setroutes(4);curvenum = 2;jumpnum = 2.4;cowpatuuuuu = 0;fontzsize = 8;line1col = "#a8621b";line1width = 4;line1ver = 1;line1ver1x = 831;line1ver1y1 = 436;line1ver1y2 = 495;line1hor = 4;line1hor1x1 = 197;line1hor1x2 = 701;line1hor1y = 446;line1hor2x1 = 739;line1hor2x2 = 803;line1hor2y = 408;line1hor3x1 = 732;line1hor3x2 = 793;line1hor3y = 533;line1hor4x1 = 846;line1hor4x2 = 899;line1hor4y = 365;line1hor = 4;line1hor1x1 = 197;line1hor1x2 = 701;line1hor1y = 446;line1hor2x1 = 739;line1hor2x2 = 803;line1hor2y = 408;line1hor3x1 = 732;line1hor3x2 = 793;line1hor3y = 533;line1hor4x1 = 846;line1hor4x2 = 899;line1hor4y = 365;line1topleft = 2;line1topleft1x = 803;line1topleft1y = 408;line1topleft1width = 28;line1topleft2x = 645;line1topleft2y = 446;line1topleft2width = 87;line1topright = 3;line1topright1x = 739;line1topright1y = 408;line1topright1width = 38;line1topright2x = 831;line1topright2y = 495;line1topright2width = 38;line1topright3x = 846;line1topright3y = 365;line1topright3width = 43;line1stations = 5;line1station1x = 471;line1station1y = 446;line1station1type = 3;line1station1dir = 8;line1station1text = "Small Poo";line1station2x = 287;line1station2y = 446;line1station2type = 1;line1station2dir = 2;line1station2text = "Splat";line1station3x = 899;line1station3y = 365;line1station3type = 1;line1station3dir = 2;line1station3text = "Weeeeeeeeeeeeeeeee";line1station4x = 764;line1station4y = 408;line1station4type = 1;line1station4dir = 2;line1station4text = "Pooeeeeee";line1station5x = 761;line1station5y = 533;line1station5type = 1;line1station5dir = 7;line1station5text = "Plop";line2col = "#8f0000";line2width = 4;line2ver = 1;line2ver1x = 471;line2ver1y1 = 345;line2ver1y2 = 591;line2hor = 0;line2hor = 0;line2topleft = 1;line2topleft1x = 389;line2topleft1y = 263;line2topleft1width = 82;line2topright = 0;line2stations = 2;line2station1x = 471;line2station1y = 367;line2station1type = 0;line2station1dir = 8;line2station1text = "Stupid Station";line2station2x = 455;line2station2y = 329;line2station2type = 1;line2station2dir = 3;line2station2text = "Stupid Station";line3col = "#827e00";line3width = 4;line3ver = 2;line3ver1x = 390;line3ver1y1 = 264;line3ver1y2 = 694;line3ver2x = 482;line3ver2y1 = 786;line3ver2y2 = 832;line3hor = 0;line3hor = 0;line3topleft = 1;line3topleft1x = 390;line3topleft1y = 694;line3topleft1width = 92;line3topright = 2;line3topright1x = 563;line3topright1y = 91;line3topright1width = 173;line3topright2x = 390;line3topright2y = 584;line3topright2width = 31;line3stations = 15;line3station1x = 390;line3station1y = 446;line3station1type = 3;line3station1dir = 6;line3station1text = "Weeham";line3station2x = 390;line3station2y = 264;line3station2type = 3;line3station2dir = 1;line3station2text = "Big Poo";line3station3x = 390;line3station3y = 536;line3station3type = 3;line3station3dir = 6;line3station3text = "Sickham";line3station4x = 359;line3station4y = 615;line3station4type = 1;line3station4dir = 4;line3station4text = "Branch Line";line3station5x = 390;line3station5y = 657;line3station5type = 0;line3station5dir = 4;line3station5text = "Station";line3station6x = 390;line3station6y = 647;line3station6type = 1;line3station6dir = 5;line3station6text = "Poopoo";line3station7x = 410;line3station7y = 714;line3station7type = 1;line3station7dir = 6;line3station7text = "blar";line3station8x = 458;line3station8y = 762;line3station8type = 1;line3station8dir = 6;line3station8text = "Piss";line3station9x = 482;line3station9y = 832;line3station9type = 0;line3station9dir = 6;line3station9text = "End of the line";line3station10x = 482;line3station10y = 832;line3station10type = 1;line3station10dir = 7;line3station10text = "End of the line";line3station11x = 390;line3station11y = 324;line3station11type = 1;line3station11dir = 4;line3station11text = "Pig Poo";line3station12x = 390;line3station12y = 383;line3station12type = 1;line3station12dir = 4;line3station12text = "Dog Poo";line3station13x = 433;line3station13y = 221;line3station13type = 1;line3station13dir = 1;line3station13text = "Poop";line3station14x = 521;line3station14y = 133;line3station14type = 1;line3station14dir = 1;line3station14text = "The Poo";line3station15x = 563;line3station15y = 91;line3station15type = 1;line3station15dir = 1;line3station15text = "Medium size Poo";line4col = "#cf882c";line4width = 4;line4ver = 2;line4ver1x = 199;line4ver1y1 = 246;line4ver1y2 = 446;line4ver2x = 621;line4ver2y1 = 233;line4ver2y2 = 508;line4hor = 5;line4hor1x1 = 267;line4hor1x2 = 566;line4hor1y = 178;line4hor2x1 = 443;line4hor2x2 = 540;line4hor2y = 589;line4hor3x1 = 305;line4hor3x2 = 365;line4hor3y = 511;line4hor4x1 = 269;line4hor4x2 = 305;line4hor4y = 511;line4hor5x1 = 264;line4hor5x2 = 287;line4hor5y = 511;line4hor = 5;line4hor1x1 = 267;line4hor1x2 = 566;line4hor1y = 178;line4hor2x1 = 443;line4hor2x2 = 540;line4hor2y = 589;line4hor3x1 = 305;line4hor3x2 = 365;line4hor3y = 511;line4hor4x1 = 269;line4hor4x2 = 305;line4hor4y = 511;line4hor5x1 = 264;line4hor5x2 = 287;line4hor5y = 511;line4topleft = 3;line4topleft1x = 566;line4topleft1y = 178;line4topleft1width = 55;line4topleft2x = 365;line4topleft2y = 511;line4topleft2width = 78;line4topleft3x = 199;line4topleft3y = 446;line4topleft3width = 65;line4topright = 2;line4topright1x = 267;line4topright1y = 178;line4topright1width = 68;line4topright2x = 621;line4topright2y = 508;line4topright2width = 81;line4stations = 22;line4station1x = 621;line4station1y = 446;line4station1type = 0;line4station1dir = 7;line4station1text = "Pooham";line4station2x = 621;line4station2y = 446;line4station2type = 0;line4station2dir = 7;line4station2text = "Pooham";line4station3x = 621;line4station3y = 446;line4station3type = 0;line4station3dir = 7;line4station3text = "Station";line4station4x = 621;line4station4y = 446;line4station4type = 0;line4station4dir = 7;line4station4text = "station";line4station5x = 621;line4station5y = 446;line4station5type = 0;line4station5dir = 4;line4station5text = "station";line4station6x = 621;line4station6y = 446;line4station6type = 0;line4station6dir = 7;line4station6text = "station";line4station7x = 621;line4station7y = 446;line4station7type = 0;line4station7dir = 6;line4station7text = "station";line4station8x = 621;line4station8y = 446;line4station8type = 3;line4station8dir = 6;line4station8text = "Pooham";line4station9x = 477;line4station9y = 178;line4station9type = 3;line4station9dir = 8;line4station9text = "Pooton";line4station10x = 199;line4station10y = 446;line4station10type = 0;line4station10dir = 8;line4station10text = "Weeton";line4station11x = 199;line4station11y = 446;line4station11type = 3;line4station11dir = 6;line4station11text = "Weeton";line4station12x = 389;line4station12y = 535;line4station12type = 0;line4station12dir = 6;line4station12text = "Station";line4station13x = 471;line4station13y = 589;line4station13type = 3;line4station13dir = 7;line4station13text = "Sickton";line4station14x = 199;line4station14y = 345;line4station14type = 1;line4station14dir = 4;line4station14text = "Turd";line4station15x = 199;line4station15y = 270;line4station15type = 1;line4station15dir = 4;line4station15text = "Fart";line4station16x = 235;line4station16y = 210;line4station16type = 1;line4station16dir = 1;line4station16text = "Smelly Poo";line4station17x = 315;line4station17y = 178;line4station17type = 1;line4station17dir = 2;line4station17text = "Toilet";line4station18x = 393;line4station18y = 178;line4station18type = 1;line4station18dir = 2;line4station18text = "Burp";line4station19x = 594;line4station19y = 206;line4station19type = 1;line4station19dir = 3;line4station19text = "Yo Poo";line4station20x = 621;line4station20y = 280;line4station20type = 1;line4station20dir = 5;line4station20text = "Wee and Poo";line4station21x = 621;line4station21y = 359;line4station21type = 1;line4station21dir = 5;line4station21text = "Sick and Poo";line4station22x = 581;line4station22y = 548;line4station22type = 1;line4station22dir = 8;line4station22text = "Crap"

}

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
stat5q = 3
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
qwwe()
drawmap(1)
routechange()
mousemoded = 1
}


function ev_mousemove (ev) {
var __r = canvas.getBoundingClientRect()
axmouse = Math.round(ev.clientX - __r.left)
aymouse = Math.round(ev.clientY - __r.top)

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
dfasgfghh = prompt('Enter a name for your station\n\n(Use the precent sign % for a new line)','station')
if ((dfasgfghh == null) || (dfasgfghh == "")){

dfasgfghh = "Station"
}
window['line' + currentroute + 'station' + (eval('line' + currentroute + 'stations')) + 'text'] = dfasgfghh
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
axmouse = Math.round(ev.clientX - __r.left)
aymouse = Math.round(ev.clientY - __r.top)


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
ctx.clearRect(0, 0, canvas.width, canvas.height);
}else{
ctx.fillStyle = "rgb(255,255,255)";  
ctx.fillRect (0, 0, canvas.width, canvas.height);  
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

ctx.font = (fontzsize + "pt Arial")
ctx.fillStyle = "#000000"
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

}






q2++
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






