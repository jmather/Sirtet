function Coordinate(x, y) {
  this.x = x;
  this.y = y;
}
var cp = Coordinate.prototype;

cp.rotate = function(degrees) {
  if (degrees == null)
    degrees = 90;
  var nx, ny;

  var pi = Math.PI;

  var rads = (degrees * (pi / 180));

  var sr = Math.floor(Math.sin(rads));
  var cr = Math.floor(Math.cos(rads));

  nx = (cr * this.x) - (sr * this.y);
  ny = (sr * this.x) + (cr * this.y);

  this.x = nx;
  this.y = ny;
}

function SirtetShapeBlock(btype)
{
  this.is_shown = false;
  this.obj = dce('div');
  this.obj.setAttribute('class', 'block '+btype);
  this.obj.className = 'block '+btype;
//  alert((block_width - 2)+'px x '+(block_height - 2)+'px');
  this.obj.style.width = (block_width - 2)+'px';
  this.obj.style.height = (block_height - 2)+'px';
  this.x = null;
  this.y = null;
}
var ssbp = SirtetShapeBlock.prototype;
ssbp.setLocation = function(x, y) {
  var rel_x = (x - 1) * block_width;
  var rel_y = y * block_width;
  var real_x = (rel_x) + playingFieldLeft;
  var real_y = (playingFieldHeight - rel_y) + playingFieldTop;
  this.obj.style.left = real_x;
  this.obj.style.top = real_y;
  this.x = x;
  this.y = y;
}
ssbp.setExactLocation = function(x, y) {
  var real_x = x;
  var real_y = y;
  this.obj.style.left = real_x;
  this.obj.style.top = real_y;
}
ssbp.show = function() {
  if (this.is_shown == true)
    this.hide();
  playingField.appendChild(this.obj);
  this.is_shown = true;
}
ssbp.hide = function() {
  if (this.obj.parentNode && this.is_shown == true)
    this.obj.parentNode.removeChild(this.obj);
  this.is_shown = false;
}
ssbp.updateLocation = function() { this.setLocation(this.x, this.y); }
ssbp.moveDown = function() {
  if (this.x != null && this.y != null)
  {
    this.y = this.y - 1;
    this.updateLocation()
  }
}
function SirtetShape(sh)
{
  this.is_shown = false;
  this.shape = sh;
  this.maps = new Array();
  for (var i in shapeMap[sh])
    this.maps[i] = new Array(shapeMap[sh][i][0], shapeMap[sh][i][1]);
  this.blocks = new Array();
  this.x = null;
  this.y = null;
  this.initBlocks();
}
var ssp = SirtetShape.prototype;

ssp.initBlocks = function() {
  for(var i in this.maps)
  {
    this.blocks[i] = new SirtetShapeBlock(this.shape);
  }
}
ssp.setExactLocation = function(x, y) {
  if (this.is_shown == false)
    this.show();

  for(var i in this.blocks)
  {
    this.blocks[i].setExactLocation(x + (this.maps[i][0] * block_width), y + ((this.maps[i][1] * -1) * block_height));
  }
}
ssp.setLocation = function(x, y, checkCollision) {
  if (this.is_shown == false)
    this.show();

  var moveMap = new Array();

  if (checkCollision == true)
  {
    for(var i in this.blocks)
    {
      moveMap[i] = new Coordinate(x + this.maps[i][0], y + this.maps[i][1]);
    }
  }

  if ((checkCollision == true && hasCollision(moveMap) == false) || checkCollision == null || checkCollision == false)
  {
    this.x = x;
    this.y = y;
    for(var i in this.blocks)
    {
      this.blocks[i].setLocation(this.x + this.maps[i][0], this.y + this.maps[i][1]);
    }
    return true;
  }
  return false;
}
ssp.show = function()
{
  for(var i in this.blocks)
  {
    this.blocks[i].show();
  }
  this.is_shown = true;
}
ssp.hide = function()
{
  for(var i in this.blocks)
  {
    this.blocks[i].hide();
  }
  this.is_shown = false;
}
ssp.relativeMove = function(Rx, Ry, checkCollision)
{
  var Nx = this.x + Rx;
  var Ny = this.y + Ry;

  return this.setLocation(Nx, Ny, checkCollision);
}
ssp.moveLeft = function()
{
  return this.relativeMove(-1, 0, true);
}
ssp.moveRight = function()
{
  return this.relativeMove(1, 0, true);
}
ssp.moveDown = function()
{
  return this.relativeMove(0, -1, true);
}
ssp.rotate = function(degrees, checkCollision)
{
  if (degrees == null)
    degrees = 90;

  var moveMap = new Array();
  var moveList = new Array();

  for (var i in this.blocks)
  {
    if (i == 0)
      continue;
    var tX, tY;
    tX = this.blocks[i].x - this.x;
    tY = this.blocks[i].y - this.y;
    var c = new Coordinate(tX, tY);
    c.rotate(degrees);
    moveMap[i] = c;
    moveList[i] = new Coordinate(c.x, c.y);
    c.x = c.x+this.x;
    c.y = c.y+this.y;
  }

  if ((checkCollision == true && hasCollision(moveMap) == false) || checkCollision == null || checkCollision == false)
  {
    for (var i in this.blocks)
    {
      if (i == 0)
        continue;
      this.blocks[i].setLocation(moveList[i].x + this.x, moveList[i].y + this.y);
      this.maps[i][0] = moveList[i].x;
      this.maps[i][1] = moveList[i].y;
    }
  }
}
ssp.getBlockMap = function()
{
  var blockMap = new Array();
  for(var i in this.blocks)
    blockMap[i] = new Coordinate(this.blocks[i].x , this.blocks[i].y);
  return blockMap;
}
ssp.remove = function()
{
  for (var i in this.blocks)
  {
    var o = this.blocks[i].obj;
    o.parentNode.removeChild(o);
  }
}
