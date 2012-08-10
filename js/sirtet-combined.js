function hasCollision(moveMap)
{
  for(var i in moveMap)
  {
    var c = moveMap[i];
    if (c.x < 1 || c.x > cols)
    {
//      alert(c.x+" is out of bounds");
      return true;
    }
    if (c.y < 1)
    {
//      alert(c.y+" is out of bounds");
      return true;
    }
    if (collisionMap[c.y][c.x] == true)
    {
//      alert(c.x+","+c.y+" has collided.");
      return true;
    }
  }
  return false;
}
function markCollisionMap(shape)
{
  var blockMap = shape.getBlockMap();
  for(var i in blockMap)
  {
//    alert("Marking ("+blockMap[i].x+","+blockMap[i].y+") as collision.");
    collisionMap[blockMap[i].y][blockMap[i].x] = true;
  }
}
function markDisplayLayer(shape)
{
  var blockMap = shape.getBlockMap();
  for(var i in shape.blocks)
    displayLayer[blockMap[i].y][blockMap[i].x] = shape.blocks[i];
}

function alertDisplayMap()
{
  var map = '';
  var tmap = '';
  for (var i = 1; i <= rows; i++)
  {
    map = '';
    for (var j = 1; j <= cols; j++)
    {
      if (displayLayer[i][j] == null)
        map = map + '-';
      else
        map = map + 'x';
    }
    tmap = map + '\r\n' + tmap;
  }
  alert(tmap);
}
var dropSpeed = 1000;
var gameStatus = false;
var gamePanel = null;
var rows = null;
var cols = null;
var block_width = null;
var block_height = null;

var displayLayer = new Array();
var collisionMap = new Array();
var gameTimer = null;

var playingField = null;
var playingFieldTop = null;
var playingFieldLeft = null;
var playingFieldHeight = null;
var playingFieldWidth = null;

var playerScore = 0;
var playerLevel = 1;
var playerLines = 0;

var nextBlockEnabled = false;
var nextBlock = null;
var nextBlockThisShape = false;

var gameTimerDelay = 1000;
var functDrop = null;
var functCheckLines = null;
var functScore = null;

function initGame(gP, r, c)
{
  gamePanel = dge(gP);
  gamePanel.setAttribute('id', 'game_panel');
  if (r == null)
    rows = 20;
  else
    rows = r;
  if (c == null)
    cols = 10;
  else
    cols = c;

  initGameBoard();
  document.onkeydown = handleKeys;
}

function initGameBoard()
{
  // next piece field
  var npp = dce('div');
  npp.setAttribute('id', 'next_piece_container');
  var nppt = dct('Next Piece');
  npp.appendChild(nppt);
  var npph = dce('div');
  npph.setAttribute('id', 'next_piece_display');
  var nppht = dct('None');
  npph.appendChild(nppht);
  npp.appendChild(npph);
  gamePanel.appendChild(npp);

  // Playing Field
  var pf = dce('div');
  pf.setAttribute('id', 'playing_field');
  gamePanel.appendChild(pf);
  playingField = pf;


  // Score / Level Board
  // Score Board
  var slc = dce('div');
  slc.setAttribute('id', 'score_level_container');
  var sbc = dce('div');
  sbc.setAttribute('id', 'score_board_container');
  var sbt = dct('Score:');
  sbc.appendChild(sbt);
  var sbd = dce('div');
  sbd.setAttribute('id', 'score_board_display');
  var sbdt = dct('0');
  sbd.appendChild(sbdt);
  sbc.appendChild(sbd);
  slc.appendChild(sbc);

  // Level
  var lc = dce('div');
  lc.setAttribute('id', 'level_container');
  var lct = dct('Level:');
  lc.appendChild(lct);
  var lcd = dce('div');
  lcd.setAttribute('id', 'level_display');
  var lcdt = dct('1');
  lcd.appendChild(lcdt);
  lc.appendChild(lcd);
  slc.appendChild(lc);

  // Lines
  var lic = dce('div');
  lic.setAttribute('id', 'lines_container');
  var lict = dct('Lines:');
  lic.appendChild(lict);
  var licd = dce('div');
  licd.setAttribute('id', 'line_display');
  licd.appendChild(dct('0'));
  lic.appendChild(lict);
  lic.appendChild(licd);
  slc.appendChild(lic);

  var cc = dce('div');
  cc.setAttribute('id', 'controls_container');
  cc.appendChild(dce('br'));
  cc.appendChild(dce('br'));
  cc.appendChild(dct('Controls:'));
  cc.appendChild(dce('br'));
  cc.appendChild(dct('Up - Rotate'));
  cc.appendChild(dce('br'));
  cc.appendChild(dct('Left/Right - Move'));
  cc.appendChild(dce('br'));
  cc.appendChild(dct('Down - Drop'));
  cc.appendChild(dce('br'));
  cc.appendChild(dct('Space - Floor'));
  cc.appendChild(dce('br'));
  cc.appendChild(dct('P - Pause'));
  cc.appendChild(dce('br'));
  cc.appendChild(dct('N - Show Next'));
  slc.appendChild(cc);
  

  gamePanel.appendChild(slc);


  // Control Panel
  var cp = dce('div');
  cp.setAttribute('id', 'control_panel');
  var seb = dce('input');
  seb.setAttribute('id', 'start_button');
  seb.setAttribute('type', 'button');
  seb.setAttribute('value', 'Start Game');
  seb.onclick = function() { startGame(); }
  cp.appendChild(seb);
  cp.appendChild(dct(' '));
  var pb = dce('input');
  pb.setAttribute('id', 'pause_button');
  pb.setAttribute('type', 'button');
  pb.setAttribute('value', 'Pause Game');
  pb.setAttribute('disabled', 'true');
  cp.appendChild(pb);
  gamePanel.appendChild(cp);

  var pfh = goh('playing_field');
  var pfw = gow('playing_field');

  block_height = pfh / rows;
  block_width = pfw / cols;

  dge('next_piece_container').style.width = ((block_width * 4) + 4)+'px';
  dge('next_piece_container').style.height = ((block_height * 5) + 4)+'px';
/*
  alert(pfw+','+pfh);
  alert(block_width+','+block_height);
*/
}

function resetLayers()
{
  var i = 0;
  var full_height = rows + 10;
  for (i = 0; i < full_height; i++)
  {
    displayLayer[i] = new Array();
    collisionMap[i] = new Array();

    var j = 0;
    var full_width = cols + 2;
    for (j = 0; j < full_width; j++)
    {
      displayLayer[i][j] = null;
      if (i == 0)
        collisionMap[i][j] = true;
      else
      {
        if (j == 0 || j == (rows + 1))
          collisionMap[i][j] = true;
      }
    }
  }
}
function cleanPlayingField()
{
  var opf = dge('playing_field');
  var pf = dce('div');
  pf.setAttribute('id', 'playing_field');
  gamePanel.replaceChild(pf, opf);
  playingField = pf;

  var pfoc = findPos(pf);

//  alert(pfoc.x+'x'+pfoc.y);
//  alert((pf.offsetLeft) + 'x' + (pf.offsetTop));

  playingFieldTop = pfoc.y + 1;
  playingFieldLeft = pfoc.x + 1;
  playingFieldWidth = gow('playing_field');
  playingFieldHeight = goh('playing_field');
  playerScore = 0;
  playerLevel = 1;
  playerLines = 0;
}
function resetGameTimer()
{
  if (gameTimer == false)
    return;
  var st = gameTimer;
  gameTimer = false;
  if (st != null)
    clearTimeout(st);
  gameTimer = setInterval('runGameTimer()', dropSpeed);
}
function runGameTimer()
{
  functDrop();
}
function updateScoreBoard()
{
  var sb = dge('score_board_display');
  var leb = dge('level_display');
  var lib = dge('line_display');
  sb.removeChild(sb.firstChild);
  sb.appendChild(dct(playerScore));
  leb.removeChild(leb.firstChild);
  leb.appendChild(dct(playerLevel));
  lib.removeChild(lib.firstChild);
  lib.appendChild(dct(playerLines));
}

function hidePlayingField()
{
  for(var i = 1; i <= rows; i++)
  {
    for (var j = 1; j <= cols; j++)
    {
      if (displayLayer[i][j] != null)
        displayLayer[i][j].hide();
    }
  }
}

function showPlayingField()
{
  for(var i = 1; i <= rows; i++)
  {
    for (var j = 1; j <= cols; j++)
    {
      if (displayLayer[i][j] != null)
        displayLayer[i][j].show();
    }
  }
}

function displayInNextPiece(obj)
{
  var cord = findPos(dge('next_piece_display'));
//  alert(cord.x+','+cord.y);

  var shapeMap = obj.maps;
  var t = 0;
  var l = 0;
  for(var i in shapeMap)
  {
    if (shapeMap[i][1] > t)
      t = shapeMap[i][1];
    if (shapeMap[i][0] < l)
      l = shapeMap[i][0];
  }

  if (dge('next_piece_display').firstChild != null)
  {
    dge('next_piece_display').removeChild(dge('next_piece_display').firstChild);
  }
  obj.setExactLocation(cord.x - (l * block_width), cord.y + (t * block_height));
}
function basicDropCode()
{
  if (activeShape == null)
  {
    if (nextBlock != null)
    {
      activeShape = nextBlock;
      activeShape.hide();
      nextBlock = generateRandomShape();
    } else {
      activeShape = generateRandomShape();
      nextBlock = generateRandomShape();
    }
    stageActiveShape();  
    if (nextBlockEnabled)
      displayInNextPiece(nextBlock);
    return false;
  }
  if (activeShape.moveDown() == false)
  {
    var bm = activeShape.getBlockMap();
    var gameover = false;
    for (var i in bm)
    {
      if (bm[i].y > rows)
        gameover = true;
    }
    if (gameover == false)
    {
      markCollisionMap(activeShape);
      markDisplayLayer(activeShape);
      basicCheckLines();
      if (nextBlock != null)
      {
        activeShape = nextBlock;
        nextBlock = generateRandomShape();
      } else {
        nextBlock = generateRandomShape();
        activeShape = generateRandomShape();
      }
      stageActiveShape();
      if (nextBlockEnabled)
        displayInNextPiece(nextBlock);
      return false;
    } else {
      clearTimeout(gameTimer);
      alert('Game Over');
      activeShape = null;
      return false;
    }
  }
  return true;
}

functDrop = basicDropCode;
functScore = function(lines) { return basicScore(lines); }

function generateRandomShape()
{
  var sA = new Array();
  for (var i in shapeMap)
    sA[sA.length] = i;

  var randomnumber=Math.floor(Math.random()*sA.length)
  
  return new SirtetShape(sA[randomnumber]);
  
}
function stageActiveShape()
{
  var shapeMap = activeShape.maps;
  var lowest = 0;
  var l = 0;
  var r = 0;
  for(var i in shapeMap)
  {
    if (shapeMap[i][1] < lowest)
      lowest = shapeMap[i][1];
    if (shapeMap[i][0] < l)
      l = shapeMap[i][0];
    if (shapeMap[i][0] > r)
      r = shapeMap[i][0];
  }
  var w = Math.floor((r + l) / 2)
  activeShape.setLocation(5 - w, 21 - lowest);
}

function basicCheckLines()
{
  var count = 0;
  var mrow = rows+1;
  var mcol = cols + 1;
  var foundRows = new Array();
  for (var i = 1; i < mrow; i++)
  {
    var val_row = true;
    for (var j = 1; j < mcol; j++)
    {
      if (displayLayer[i][j] == null)
        val_row = false;
    }
    if (val_row == true)
    {
      count++;
      for (var j = 1; j < mcol; j++)
      {
//        alert('Removing '+j+","+i);
        playingField.removeChild(displayLayer[i][j].obj);
        displayLayer[i][j] = null;
        collisionMap[i][j] = false;
      }
      dropRow(i);
      i--;
    }
  }
  //alertDisplayMap();
  functScore(count);  
}

function dropRow(row)
{
  var mcol = cols + 1;
  var mrow = rows + 4;
  for (var i = row; i < mrow; i++)
  {
    for (var j = 1; j < mcol; j++)
    {
      displayLayer[i][j] = displayLayer[(i+1)][j];
      if (displayLayer[i][j] != null)
        displayLayer[i][j].moveDown();
      collisionMap[i][j] = collisionMap[(i+1)][j];
    }
  }
}

function basicScore(lines)
{
  if (lines > 0)
  {
    playerLines = playerLines + lines;
    var moveScore = (playerLevel * Math.pow(5, lines));
    if (nextBlockThisShape == true)
      moveScore = moveScore * 0.75;
    if (nextBlockEnabled == false)
      nextBlockThisShape = false;
    playerScore = playerScore + moveScore;
    var pL = Math.floor(playerLines / 8) + 1;
    if (pL > playerLevel)
    {
      dropSpeed = (dropSpeed / 1.125);
      resetGameTimer();
      playerLevel = pL;
    }
    updateScoreBoard();
  }
}
function startGame()
{
  dge('start_button').blur();
  resetLayers();
  cleanPlayingField();
  functDrop();
  resetGameTimer();
  dge('pause_button').disabled = false;
  dge('pause_button').onclick = pauseGame;
}

function pauseGame()
{
  dge('pause_button').blur();
  clearTimeout(gameTimer);
  gameTimer = null;
  activeShape.hide();
  hidePlayingField();
  dge('pause_button').value = 'Unpause Game';
  dge('pause_button').onclick = unpauseGame;
}

function unpauseGame()
{
  dge('pause_button').blur();
  dge('pause_button').value = 'Pause Game';
  dge('pause_button').onclick = pauseGame;
  activeShape.show();
  showPlayingField();
  resetGameTimer();
}
var activeShape = null;

function handleKeys(e) {
    var evt = (e) ? e : window.event;       //IE reports window.event not arg
    var code = evt.keyCode;

    // Left - 37
    // Up - 38
    // Right - 39
    // Down - 40

    if (code == 80 && dge('pause_button').disabled == false)
      dge('pause_button').onclick();

    if (code == 78)
    {
      if (nextBlockEnabled == false)
      {
        if (nextBlock == null)
          nextBlock = generateRandomShape();
        displayInNextPiece(nextBlock);
        nextBlockEnabled = true;
        nextBlockThisShape = true;
      } else {
        nextBlock.hide();
        nextBlockEnabled = false;
      }
    }

    if (activeShape && gameTimer != null)
    {
      if (code == 37)
        activeShape.moveLeft();
      if (code == 38)
        activeShape.rotate(null, true);
      if (code == 39)
        activeShape.moveRight();
      if (code == 40)
      {
        functDrop();
        resetGameTimer();
      }
      if (code == 32)
      {
        while(functDrop())
        {
          // something
        }
      }
    }
}
var shapeMap = new Array();
shapeMap['square'] = new Array();
shapeMap['square'][0] = new Array(0, 0);
shapeMap['square'][1] = new Array(0, 1);
shapeMap['square'][2] = new Array(1, 1);
shapeMap['square'][3] = new Array(1, 0);
shapeMap['ell'] = new Array();
shapeMap['ell'][0] = new Array(0, 0);
shapeMap['ell'][1] = new Array(1, 1);
shapeMap['ell'][2] = new Array(0,1);
shapeMap['ell'][3] = new Array(0,-1);
shapeMap['ell-r'] = new Array();
shapeMap['ell-r'][0] = new Array(0, 0);
shapeMap['ell-r'][1] = new Array(-1, 1);
shapeMap['ell-r'][2] = new Array(0,1);
shapeMap['ell-r'][3] = new Array(0,-1);
shapeMap['tee'] = new Array();
shapeMap['tee'][0] = new Array(0,0);
shapeMap['tee'][1] = new Array(1,0);
shapeMap['tee'][2] = new Array(-1,0);
shapeMap['tee'][3] = new Array(0,1);
shapeMap['ess'] = new Array();
shapeMap['ess'][0] = new Array(0,0);
shapeMap['ess'][1] = new Array(1,0);
shapeMap['ess'][2] = new Array(0,-1);
shapeMap['ess'][3] = new Array(-1,-1);
shapeMap['ess-r'] = new Array();
shapeMap['ess-r'][0] = new Array(0,0);
shapeMap['ess-r'][1] = new Array(-1,0);
shapeMap['ess-r'][2] = new Array(0,-1);
shapeMap['ess-r'][3] = new Array(1,-1);
shapeMap['line'] = new Array();
shapeMap['line'][0] = new Array(0,0);
shapeMap['line'][1] = new Array(0,1);
shapeMap['line'][2] = new Array(0,-1);
shapeMap['line'][3] = new Array(0,-2);
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

