function dge(id) { return document.getElementById(id); }
function dce(tg) { return document.createElement(tg); }
function dct(txt) { return document.createTextNode(txt); }
function goh(id) {
  if (isIE())
    return dge(id).offsetHeight;
  else
    return dge(id).offsetHeight - 2;
}
function gow(id) {
  if (isIE())
    return dge(id).offsetWidth;
  else
    return dge(id).offsetWidth - 2;
}
function isIE() { return (document.all) ? true : false; }
function findPos(obj) {
  var nobj = obj;
  var curleft = curtop = 0;
  if (nobj.offsetParent) {
    do {
      curleft += nobj.offsetLeft;
      curtop += nobj.offsetTop;
    } while (nobj = nobj.offsetParent);
  } else {
    curleft = obj.offsetLeft;
    curtop = obj.offsetTop;
  }
  return new Coordinate(curleft, curtop);
}

