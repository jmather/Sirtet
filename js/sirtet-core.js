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
