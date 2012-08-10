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
